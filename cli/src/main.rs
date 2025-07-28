use alloy_primitives::U256;
use autonomi::client::payment::PaymentOption;
use autonomi::pointer::PointerTarget;
use autonomi::vault::derive_vault_key;
use autonomi::{Bytes, Chunk, ChunkAddress, Client, PointerAddress, Wallet};
use clap::{Parser, Subcommand};
use comfy_table::{Cell, Row, Table};
use serde::{Deserialize, Serialize};
use std::error::Error;
use std::fs::File;
use std::path::PathBuf;
use uuid::Uuid;

const REGRU_PRODUCTS_DERIVIATION_INDEX: &str = "REGRU_PRODUCTS_DERIVIATION_INDEX";

#[derive(Parser)]
#[command(name = "regru", version = "0.1.0", about = "REGRU internal CLI")]
struct Cli {
    #[command(subcommand)]
    command: Commands,

    /// Use local Autonomi dev-net instead of public network
    #[arg(short, long)]
    local: bool,
}

#[derive(Subcommand)]
enum Commands {
    /// Upload catalogue or individual items
    Import {
        #[command(subcommand)]
        command: ImportCommands,
    },
    /// Retrieve stored data for verification
    Get {
        #[command(subcommand)]
        command: GetCommands,
    },
}

#[derive(Subcommand)]
enum GetCommands {
    /// Fetch a product JSON via its pointer address
    Product {
        #[arg(short, long)]
        pointer_address: String,
    },
}

#[derive(Subcommand)]
enum ImportCommands {
    /// Import products from a JSON file
    Products {
        #[arg(short, long, help = "Path to the JSON file e.g. products.json")]
        json: PathBuf,
    },
}

#[derive(Serialize, Deserialize, Debug)]
struct Price {
    currency: String,
    amount: U256,
}

#[derive(Serialize, Deserialize, Debug)]
struct Product {
    uuid: Uuid,
    name: String,
    description: String,
    price: Price,
    image_address: String,
    tags: Vec<String>,
}

fn read_json(file_path: &PathBuf) -> Result<Vec<Product>, Box<dyn Error>> {
    let file = File::open(file_path)?;
    let products: Vec<Product> = serde_json::from_reader(file)?;
    Ok(products)
}

async fn write_product_list_to_autonomi(
    client: &Client,
    product_list: String,
    private_key: &str,
) -> Result<PointerAddress, Box<dyn Error>> {
    let network = client.evm_network();
    let wallet = Wallet::new_from_private_key(network.clone(), private_key)?;
    let payment_option = PaymentOption::Wallet(wallet);

    let vault_key = derive_vault_key(private_key)?;
    let derived = vault_key.derive_child(REGRU_PRODUCTS_DERIVIATION_INDEX.as_bytes());

    let bytes = Bytes::from(product_list);
    let chunk = Chunk::new(bytes);

    let (price, addr) = client.chunk_put(&chunk, payment_option.clone()).await?;
    println!("Chunk uploaded for {price} testnet ANT to: {addr}");

    let target = PointerTarget::ChunkAddress(addr);
    let pointer_address = PointerAddress::new(derived.public_key());
    let pointer_exists = client.pointer_check_existance(&pointer_address).await?;

    if pointer_exists {
        client.pointer_update(&derived, target.clone()).await?;
        println!("Pointer update successful");
    } else {
        let (price, addr) = client
            .pointer_create(&derived, target.clone(), payment_option)
            .await?;
        println!("Pointer uploaded for {price} testnet ANT to: {addr}");
    }

    Ok(pointer_address)
}

async fn write_product_to_autonomi(
    client: &Client,
    product: &Product,
    private_key: &str,
) -> Result<(Uuid, PointerAddress), Box<dyn Error>> {
    let network = client.evm_network();
    let wallet = Wallet::new_from_private_key(network.clone(), private_key)?;
    let payment_option = PaymentOption::Wallet(wallet);

    let vault_key = derive_vault_key(private_key)?;
    let derived = vault_key.derive_child(REGRU_PRODUCTS_DERIVIATION_INDEX.as_bytes());
    let product_pointer_key = derived.derive_child(product.uuid.as_bytes());

    let json = serde_json::to_string(product)?;
    let chunk = Chunk::new(Bytes::from(json));

    let (price, addr) = client.chunk_put(&chunk, payment_option.clone()).await?;
    println!("Chunk uploaded for {price} testnet ANT to: {addr}");

    let target = PointerTarget::ChunkAddress(addr);
    let pointer_address = PointerAddress::new(product_pointer_key.public_key());
    let pointer_exists = client.pointer_check_existance(&pointer_address).await?;

    if pointer_exists {
        client.pointer_update(&product_pointer_key, target.clone()).await?;
        println!("Pointer update successful");
    } else {
        let (price, addr) = client
            .pointer_create(&product_pointer_key, target.clone(), payment_option)
            .await?;
        println!("Pointer uploaded for {price} testnet ANT to: {addr}");
    }

    Ok((product.uuid, pointer_address))
}

async fn get_client(use_local_network: bool) -> Result<Client, Box<dyn Error>> {
    if use_local_network {
        return Ok(Client::init_local().await?);
    }
    Ok(Client::init().await?)
}

#[tokio::main]
async fn main() {
    color_eyre::install().expect("error handler");

    let cli = Cli::parse();
    let client = get_client(cli.local).await.expect("client init failed");

    match cli.command {
        Commands::Import { command } => match command {
            ImportCommands::Products { json } => {
                println!("Importing products from JSON: {:?}", json);
                println!("---------------");
                let products = read_json(&json).expect("failed to read json");
                let mut results = Vec::new();

                let wallet = std::env::var("SECRET_KEY").expect("Need SECRET_KEY env var");

                for product in &products {
                    let result = write_product_to_autonomi(&client, product, &wallet)
                        .await
                        .expect("upload failed");
                    println!("---------------");
                    results.push(result);
                }

                let mut table = Table::new();
                table.set_header(vec!["Product UUID", "Autonomi Address"]);
                for (uuid, addr) in &results {
                    table.add_row(Row::from(vec![Cell::new(uuid), Cell::new(addr)]));
                }
                println!("{table}");

                let serialized = results
                    .iter()
                    .map(|r| r.1.to_string())
                    .collect::<Vec<_>>()
                    .join("\n");

                let products_ptr = write_product_list_to_autonomi(&client, serialized, &wallet)
                    .await
                    .expect("products list upload failed");
                println!("Products pointer: {products_ptr}");
            }
        },
        Commands::Get { command } => match command {
            GetCommands::Product { pointer_address } => {
                let addr = PointerAddress::from_hex(pointer_address.as_str()).expect("bad addr");
                let pointer = client.pointer_get(&addr).await.expect("pointer get failed");
                let chunk_address = ChunkAddress::new(pointer.target().xorname());
                let chunk = client.chunk_get(&chunk_address).await.expect("chunk get failed");
                let result = String::from_utf8(chunk.value().to_vec()).expect("utf8");
                println!("{result}");
            }
        },
    }
} 