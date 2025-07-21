use actix_web::{get, post, put, delete, web, HttpResponse, Responder};
use std::sync::Arc;
use chrono::Utc;
use serde_json::json;
use serde::{Deserialize, Serialize};

use crate::transaction_service::{TransactionService, CartLine};

use crate::{AppState, models::CartItem};
use crate::models::{Order, OrderStatus};
use tokio::time::{sleep, Duration};

use uuid::Uuid;

#[get("/products")]
async fn get_products(data: web::Data<Arc<AppState>>) -> impl Responder {
    let products = data.products.read();
    HttpResponse::Ok().json(&*products)
}

#[get("/cart")]
async fn get_cart(data: web::Data<Arc<AppState>>) -> impl Responder {
    let cart = data.shopping_cart.read();
    HttpResponse::Ok().json(&*cart)
}

#[get("/wallets")]
pub async fn get_wallets(data: web::Data<Arc<AppState>>) -> impl Responder {
    let wallets = data.wallets.read();
    HttpResponse::Ok().json(&*wallets)
}

#[derive(Debug, Deserialize)]
pub struct CheckoutRequest {
    pub buyer_wallet: String,
    pub items: Vec<CartItem>,
}

#[derive(Debug, Serialize)]
pub struct QuoteResponse {
    pub order_id: String,
    pub to: String,
    pub data: String,
    pub price_wei: String,
    pub chain_id: u64,
}

#[post("/checkout")]
pub async fn checkout(
    tx_service: web::Data<Arc<TransactionService>>,
    data: web::Data<Arc<AppState>>,
    body: web::Json<CheckoutRequest>,
) -> impl Responder {
    // 1. Validate cart is not empty
    if body.items.is_empty() {
        return HttpResponse::BadRequest().body("Cart is empty");
    }

    // 2. Validate every product ID exists in our catalogue
    {
        let products = data.products.read();
        let missing = body
            .items
            .iter()
            .find(|i| !products.iter().any(|p| p.id == i.product_id));

        if missing.is_some() {
            return HttpResponse::UnprocessableEntity().body("Unknown product in cart");
        }
    }

    let cart_lines: Vec<CartLine> = body
        .items
        .iter()
        .map(|i| CartLine {
            product_id: i.product_id.clone(),
            quantity: i.quantity,
        })
        .collect();

    match tx_service.quote_total_wei(&cart_lines).await {
        Ok(price_wei) => {
            let order_id = Uuid::new_v4().to_string();
            // persist order in Map
            {
                let mut orders = data.orders.write();
                orders.insert(order_id.clone(), Order {
                    order_id: order_id.clone(),
                    cart: body.items.clone(),
                    price_wei: price_wei.to_string(),
                    tx_hash: None,
                    status: OrderStatus::AwaitingPayment,
                });
            }

            let resp = QuoteResponse {
                order_id: order_id,
                to: "0x188cF0e4020dF6A2B404390D549183FDfDFf70C6".into(),
                data: "0x".into(),
                price_wei: price_wei.to_string(),
                chain_id: 1319,
            };
            HttpResponse::Ok().json(resp)
        }
        Err(e) => {
            // Fallback: compute price using in-memory product list so dev env works without antctl
            log::warn!("antctl pricing failed: {e:?}. Falling back to local catalogue");
            let products = data.products.read();
            let mut total_eth = 0.0_f64;
            for line in &body.items {
                if let Some(p) = products.iter().find(|p| p.id == line.product_id) {
                    total_eth += p.price * line.quantity as f64;
                }
            }
            let price_wei = (total_eth * 1e18).round() as u128;

            let order_id = Uuid::new_v4().to_string();
            {
                let mut orders = data.orders.write();
                orders.insert(order_id.clone(), Order {
                    order_id: order_id.clone(),
                    cart: body.items.clone(),
                    price_wei: price_wei.to_string(),
                    tx_hash: None,
                    status: OrderStatus::AwaitingPayment,
                });
            }
            let resp = QuoteResponse {
                order_id,
                to: "0x188cF0e4020dF6A2B404390D549183FDfDFf70C6".into(),
                data: "0x".into(),
                price_wei: price_wei.to_string(),
                chain_id: 1319,
            };
            HttpResponse::Ok().json(resp)
        }
    }
}

#[post("/cart")]
async fn add_to_cart(data: web::Data<Arc<AppState>>, item: web::Json<CartItem>) -> impl Responder {
    let mut cart = data.shopping_cart.write();
    
    // Check if product exists
    let products = data.products.read();
    if !products.iter().any(|p| p.id == item.product_id) {
        return HttpResponse::NotFound().body("Product not found");
    }

    if let Some(existing_item) = cart.items.iter_mut().find(|i| i.product_id == item.product_id) {
        existing_item.quantity += item.quantity;
    } else {
        cart.items.push(item.into_inner());
    }
    cart.last_updated = Utc::now();
    HttpResponse::Ok().json(&*cart)
}

#[put("/cart/{product_id}")]
async fn update_cart_item(data: web::Data<Arc<AppState>>, path: web::Path<String>, new_item: web::Json<CartItem>) -> impl Responder {
    let product_id = path.into_inner();
    let mut cart = data.shopping_cart.write();
    
    if let Some(item) = cart.items.iter_mut().find(|i| i.product_id == product_id) {
        item.quantity = new_item.quantity;
        cart.last_updated = Utc::now();
        HttpResponse::Ok().json(&*cart)
    } else {
        HttpResponse::NotFound().body("Item not found in cart")
    }
}

#[delete("/cart/{product_id}")]
async fn remove_from_cart(data: web::Data<Arc<AppState>>, path: web::Path<String>) -> impl Responder {
    let product_id = path.into_inner();
    let mut cart = data.shopping_cart.write();

    if let Some(index) = cart.items.iter().position(|i| i.product_id == product_id) {
        cart.items.remove(index);
        cart.last_updated = Utc::now();
        HttpResponse::Ok().json(&*cart)
    } else {
        HttpResponse::NotFound().body("Item not found in cart")
    }
} 

#[get("/health")]
async fn health() -> impl Responder {
    HttpResponse::Ok().json(json!({"status":"ok"}))
} 

#[derive(Debug, Deserialize)]
pub struct ConfirmRequest {
    pub order_id: String,
    pub tx_hash: String,
}

#[post("/checkout/confirm")]
pub async fn confirm_checkout(
    data: web::Data<Arc<AppState>>,
    body: web::Json<ConfirmRequest>,
) -> impl Responder {
    let mut orders = data.orders.write();
    if let Some(order) = orders.get_mut(&body.order_id) {
        order.tx_hash = Some(body.tx_hash.clone());
        order.status = OrderStatus::PendingConfirm;
        let state_arc = data.get_ref().clone();
        spawn_watcher(state_arc, order.order_id.clone(), order.tx_hash.clone().unwrap());
        HttpResponse::Ok().body("pending_confirm")
    } else {
        HttpResponse::NotFound().body("order not found")
    }
}

fn spawn_watcher(state: Arc<AppState>, order_id: String, tx_hash: String) {
    tokio::spawn(async move {
        let mut attempts = 0;
        loop {
            attempts += 1;
            // TODO: call RPC eth_getTransactionReceipt. For demo we simulate success after 3 attempts
            if attempts >= 3 {
                let mut orders = state.orders.write();
                if let Some(order) = orders.get_mut(&order_id) {
                    order.status = OrderStatus::Confirmed;
                }
                break;
            }
            sleep(Duration::from_secs(8)).await;
        }
    });
} 