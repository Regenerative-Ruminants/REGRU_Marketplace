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
use color_eyre::eyre::{Result};

const REGRU_PRODUCTS_DERIVIATION_INDEX: &'static str = "REGRU_PRODUCTS_DERIVIATION_INDEX";

#[derive(Parser)]
#[command(name = "myapp", version = "1.0", about = "A sample CLI app")]
struct Cli {
    #[command(subcommand)]
    command: Commands,

    #[arg(short, long, help = "Use local network")]
    local: bool,
}

#[derive(Subcommand)]
enum Commands {
    Import {
        #[command(subcommand)]
        command: ImportCommands,
    },
    Get {
        #[command(subcommand)]
        command: GetCommands,
    },
}

#[derive(Subcommand)]
enum GetCommands {
    /// Imports products from a CSV file
    Product {
        #[arg(short, long, help = "Product pointer address")]
        pointer_address: String,
    },
}

#[derive(Subcommand)]
enum ImportCommands {
    /// Imports products from a CSV file
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
    let wallet = Wallet::new_from_private_key(network.clone(), private_key).unwrap();
    let payment_option = PaymentOption::Wallet(wallet);

    let vault_key = derive_vault_key(private_key).expect("Failed to derive vault key");
    let derived = vault_key.derive_child(REGRU_PRODUCTS_DERIVIATION_INDEX.as_bytes());

    let bytes = Bytes::from(product_list);
    let chunk = Chunk::new(bytes);

    let (price, addr) = client
        .chunk_put(&chunk, payment_option.clone())
        .await
        .unwrap();
    println!("Chunk uploaded for {price} testnet ANT to: {addr}");

    let target = PointerTarget::ChunkAddress(addr);
    let pointer_address = PointerAddress::new(derived.public_key());
    let pointer_exists = client
        .pointer_check_existance(&pointer_address)
        .await
        .unwrap();

    if pointer_exists {
        client
            .pointer_update(&derived, target.clone())
            .await
            .unwrap();
        println!("Pointer update successful");
    } else {
        let (price, addr) = client
            .pointer_create(&derived, target.clone(), payment_option.clone())
            .await
            .unwrap();
        println!("Pointer uploaded for {price} testnet ANT to: {addr}");
    }

    Ok(pointer_address)
}

async fn write_product_to_autonomi(
    client: &Client,
    product: &Product,
    private_key: &str,
) -> Result<(Uuid, PointerAddress), Box<dyn Error>> {
    println!("{:?}", product);

    let network = client.evm_network();
    let wallet = Wallet::new_from_private_key(network.clone(), private_key).unwrap();
    let payment_option = PaymentOption::Wallet(wallet);

    let vault_key = derive_vault_key(private_key).expect("Failed to derive vault key");
    let derived = vault_key.derive_child(REGRU_PRODUCTS_DERIVIATION_INDEX.as_bytes());
    let product_pointer_key = derived.derive_child(product.uuid.as_bytes());

    let json = serde_json::to_string(product)?;
    let bytes = Bytes::from(json);
    let chunk = Chunk::new(bytes);

    let (price, addr) = client
        .chunk_put(&chunk, payment_option.clone())
        .await
        .unwrap();
    println!("Chunk uploaded for {price} testnet ANT to: {addr}");

    let target = PointerTarget::ChunkAddress(addr);
    let pointer_address = PointerAddress::new(product_pointer_key.public_key());
    let pointer_exists = client
        .pointer_check_existance(&pointer_address)
        .await
        .unwrap();

    if pointer_exists {
        client
            .pointer_update(&product_pointer_key, target.clone())
            .await
            .unwrap();
        println!("Pointer update successful");
    } else {
        let (price, addr) = client
            .pointer_create(&product_pointer_key, target.clone(), payment_option.clone())
            .await
            .unwrap();
        println!("Pointer uploaded for {price} testnet ANT to: {addr}");
    }

    Ok((product.uuid, pointer_address))
}

async fn get_client(use_local_network: bool) -> Result<Client, Box<dyn Error>> {
    if use_local_network {
        return Client::init_local().await.map_err(|e| e.into());
    };
    Client::init().await.map_err(|e| e.into())
}

#[tokio::main]
async fn main() {
    let cli = Cli::parse();
    let client = get_client(cli.local).await.unwrap();

    match cli.command {
        Commands::Import { command } => match command {
            ImportCommands::Products { json } => {
                println!(
                    "Importing products from JSON: {:?}",
                    json
                );
                println!("---------------");
                let products = read_json(&json).unwrap();
                let mut results: Vec<(Uuid, PointerAddress)> = vec![];
                
                let wallet = std::env::var("SECRET_KEY").expect("Expected a SECRET_KEY in the environment");

                for product in &products {
                    let result = write_product_to_autonomi(&client, product, &wallet)
                        .await
                        .unwrap();
                    println!("---------------");
                    results.push(result);
                }

                let mut table = Table::new();
                table.set_header(vec!["Product UUID", "Autonomi Address"]);

                for (uuid, addr) in &results {
                    table.add_row(Row::from(vec![Cell::new(uuid), Cell::new(addr)]));
                }

                println!("{table}");

                let product_pointers = results
                    .iter()
                    .map(|result| result.1.clone())
                    .collect::<Vec<PointerAddress>>();

                let serialized = product_pointers
                    .iter()
                    .map(|addr| addr.to_string())
                    .collect::<Vec<String>>()
                    .join("\n");

                let products_ptr = write_product_list_to_autonomi(&client, serialized, &wallet)
                    .await
                    .unwrap();
                println!("Products: {products_ptr:#?}");
            }
        },
        Commands::Get { command } => match command {
            GetCommands::Product { pointer_address } => {
                let addr = PointerAddress::from_hex(pointer_address.as_str()).unwrap();
                let client = Client::init_local().await.unwrap();
                let pointer = client.pointer_get(&addr).await.unwrap();
                let xorname = pointer.target().xorname();

                let chunk_address = ChunkAddress::new(xorname);
                let chunk = client.chunk_get(&chunk_address).await.unwrap();
                let bytes = chunk.value();
                let result = String::from_utf8(bytes.to_vec()).unwrap();
                println!("{}", result);
            }
        },
    }
}
