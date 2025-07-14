use actix_web::{get, App, HttpServer, Responder, HttpResponse, middleware, web};
use actix_cors::Cors;
use actix_files as fs;
use dotenv::dotenv;
// use dotenv::from_path;
use std::env;

#[macro_use]
extern crate log;

// Import from our shared core library
use autonomi_core::wallets::get_wallets;

#[get("/health")]
async fn health_check() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({ "status": "UP" }))
}

#[get("/api/wallets")]
async fn get_wallets_handler() -> impl Responder {
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

#[tokio::main]
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
        let cors = Cors::default()
            .allowed_origin("http://localhost:1420")
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec!["authorization", "accept"])
            .allowed_header("content-type")
            .max_age(3600);

        App::new()
            .wrap(cors)
            .wrap(middleware::Logger::default())
            .service(health_check)
            .service(get_wallets_handler)
            .service(
                fs::Files::new("/", "./dist")
                    .index_file("index.html")
                    .use_last_modified(true),
            )
            // We will add more services (routes) here later
            // .configure(crate::handlers::config) // Example for modular routing
    })
    .bind((app_host, app_port))?
    .run()
    .await
} 