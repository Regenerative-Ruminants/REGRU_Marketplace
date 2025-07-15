mod api;
mod models;

use actix_cors::Cors;
use actix_web::{web, App, HttpServer, middleware};
use std::sync::Arc;
use parking_lot::RwLock;
use chrono::Utc;

use crate::models::{ApiProduct, ShoppingCart, Wallet};

// In-memory "database"
pub struct AppState {
    products: RwLock<Vec<ApiProduct>>,
    shopping_cart: RwLock<ShoppingCart>,
    wallets: RwLock<Vec<Wallet>>,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", "actix_web=info,info");
    env_logger::init();

    // Initialize with the correct, full list of sample products
    let sample_products = vec![
        ApiProduct {
            id: "d290f1ee-6c54-4b01-90e6-d701748f08b1".to_string(),
            name: "Beef Burgers".to_string(),
            description: "4 x 1/4lb Beef Burgers".to_string(),
            image_url: "/images/products/66db3b08-bd3c-4ec1-98a8-34141da4d6b1.png".to_string(),
            price: 12.99,
            tags: vec!["beef".to_string(), "burgers".to_string()],
            category: "Meat".to_string(),
        },
        ApiProduct {
            id: "d290f1ee-6c54-4b01-90e6-d701748f0875".to_string(),
            name: "Mince (500g)".to_string(),
            description: "500g grass-fed beef mince".to_string(),
            image_url: "/images/products/9923792b-3cdf-4166-954c-f5d96a27c575.png".to_string(),
            price: 8.50,
            tags: vec!["beef".to_string(), "mince".to_string()],
            category: "Meat".to_string(),
        },
        ApiProduct { 
            id: "prod_new_001".to_string(), name: "The Fauna".to_string(),
            description: "A beautifully handcrafted item...".to_string(),
            image_url: "/images/products/The-Fauna.png".to_string(), 
            price: 75.00, 
            tags: vec!["Handmade".to_string(), "Unique".to_string(), "Artisan".to_string()],
            category: "Crafts".to_string(),
        },
        ApiProduct { 
            id: "prod_new_002".to_string(), name: "Beautiful Washed BFL Curls".to_string(), 
            description: "Premium, clean Bluefaced Leicester curls...".to_string(),
            image_url: "/images/products/Big-bags-of-beautiful-washed-BFL-curls.png".to_string(), 
            price: 25.50, 
            tags: vec!["BFL".to_string(), "Spinning".to_string(), "Felting".to_string(), "Natural Fiber".to_string()],
            category: "Crafts".to_string(),
        },
        ApiProduct { 
            id: "prod_new_003".to_string(), name: "Whole Beef Shank".to_string(), 
            description: "A hearty and flavorful cut...".to_string(),
            image_url: "/images/products/Whole-beef-shank.png".to_string(), 
            price: 18.75, 
            tags: vec!["Grass-fed".to_string(), "Slow-cook".to_string(), "Osso Buco".to_string()],
            category: "Meat".to_string(),
        },
        ApiProduct { 
            id: "prod_new_004".to_string(), name: "Raw Milk".to_string(), 
            description: "Fresh, unpasteurized raw milk...".to_string(),
            image_url: "/images/products/Raw-Milk.png".to_string(), 
            price: 3.20, 
            tags: vec!["Raw".to_string(), "Unpasteurized".to_string(), "Grass-fed".to_string()],
            category: "Dairy".to_string(),
        },
        ApiProduct { 
            id: "prod_new_005".to_string(), name: "Grass-Fed Chateaubriand Steak".to_string(), 
            description: "The most tender and luxurious cut of beef...".to_string(),
            image_url: "/images/products/Grass-Fed-Beef-Chateaubriand-Sharing-Steak.png".to_string(), 
            price: 45.00, 
            tags: vec!["Center-cut".to_string(), "Tenderloin".to_string(), "Sharing Steak".to_string()],
            category: "Meat".to_string(),
        },
        ApiProduct { 
            id: "prod_new_006".to_string(), name: "Raw Organic A2 Grass-Fed Milk".to_string(), 
            description: "Premium organic raw milk from A2 cows...".to_string(),
            image_url: "/images/products/Raw-Organic-A2-Grass-Fed-milk.png".to_string(), 
            price: 4.50, 
            tags: vec!["A2 Milk".to_string(), "Organic".to_string(), "Raw".to_string(), "Grass-fed".to_string()],
            category: "Dairy".to_string(),
        },
        ApiProduct { 
            id: "prod_new_007".to_string(), name: "Stevie Bag in Black".to_string(), 
            description: "A stylish and durable handcrafted bag...".to_string(),
            image_url: "/images/products/Stevie-Bag-in-Black.png".to_string(), 
            price: 120.00, 
            tags: vec!["Handmade".to_string(), "Leather".to_string(), "Fashion".to_string()],
            category: "Crafts".to_string(),
        },
        ApiProduct { 
            id: "prod_new_008".to_string(), name: "Jacob Felted Fleece".to_string(), 
            description: "A beautiful and unique felted fleece...".to_string(),
            image_url: "/images/products/Jacob-Felted-Fleece.png".to_string(), 
            price: 35.00, 
            tags: vec!["Felted Fleece".to_string(), "Jacob Sheep".to_string(), "Natural".to_string(), "Crafting".to_string()],
            category: "Crafts".to_string(),
        }
    ];

    let app_state = Arc::new(AppState {
        products: RwLock::new(sample_products),
        shopping_cart: RwLock::new(ShoppingCart {
            items: vec![],
            last_updated: Utc::now(),
        }),
        wallets: RwLock::new(vec![]),
    });

    log::info!("Starting server at http://127.0.0.1:8000");

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:1420")
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
            .allow_any_header()
            .max_age(3600);

        App::new()
            .app_data(web::Data::new(app_state.clone()))
            .wrap(cors)
            .wrap(middleware::Logger::default())
            .service(
                web::scope("/api")
                    .service(api::get_products)
                    .service(api::get_cart)
                    .service(api::add_to_cart)
                    .service(api::update_cart_item)
                    .service(api::remove_from_cart)
                    .service(api::get_wallets)
            )
            .service(actix_files::Files::new("/", "./dist").index_file("index.html"))

    })
    .bind("127.0.0.1:8000")?
    .run()
    .await
}