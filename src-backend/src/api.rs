use actix_web::{get, post, put, delete, web, HttpResponse, Responder};
use std::sync::Arc;
use chrono::Utc;

use crate::{AppState, models::CartItem};

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