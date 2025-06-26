use actix_web::{get, App, HttpServer, Responder, HttpResponse};
use dotenv::dotenv;
use std::env;

// Import from our shared core library
use autonomi_core::wallets::get_wallets;

#[get("/health")]
async fn health_check() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({ "status": "UP" }))
}

#[get("/api/wallets")]
async fn get_wallets_route() -> impl Responder {
    match get_wallets() {
        Ok(wallets) => HttpResponse::Ok().json(wallets),
        Err(e) => {
            log::error!("Failed to get available wallets: {:?}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to retrieve wallets",
                "details": e.to_string()
            }))
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load environment variables from .env file
    dotenv().ok();

    // Initialize logger
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let app_host = env::var("APP_HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let app_port_str = env::var("APP_PORT").unwrap_or_else(|_| "8000".to_string());
    
    let app_port = match app_port_str.parse::<u16>() {
        Ok(port) => port,
        Err(_) => {
            log::error!("Invalid APP_PORT value: {}. Defaulting to 8000.", app_port_str);
            8000
        }
    };

    log::info!("Starting server at http://{}:{}", app_host, app_port);

    HttpServer::new(move || {
        App::new()
            .wrap(actix_web::middleware::Logger::default()) // Basic request logging
            .service(health_check)
            .service(get_wallets_route)
            // We will add more services (routes) here later
            // .configure(crate::handlers::config) // Example for modular routing
    })
    .bind((app_host, app_port))?
    .run()
    .await
} 