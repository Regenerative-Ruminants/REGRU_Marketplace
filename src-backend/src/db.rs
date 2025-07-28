use chrono::Utc;
use rusqlite::{params, Connection, Result};

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct OrderDetails {
    pub order_id: String,
    pub email: String,
    pub name: String,
    pub address: String,
    pub created_at: String,
}

pub fn init_db(path: &str) -> Result<()> {
    let conn = Connection::open(path)?;
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS order_details (
            order_id   TEXT PRIMARY KEY,
            email      TEXT NOT NULL,
            name       TEXT NOT NULL,
            address    TEXT NOT NULL,
            created_at TEXT NOT NULL
        );",
    )?;
    Ok(())
}

pub fn upsert_details(path: &str, order_id: &str, email: &str, name: &str, address: &str) -> Result<()> {
    let conn = Connection::open(path)?;
    let now = Utc::now().to_rfc3339();
    conn.execute(
        "INSERT INTO order_details(order_id,email,name,address,created_at)
         VALUES (?1,?2,?3,?4,?5)
         ON CONFLICT(order_id) DO UPDATE SET email=excluded.email,name=excluded.name,address=excluded.address;",
        params![order_id, email, name, address, now],
    )?;
    Ok(())
}

pub fn get_details(path: &str, order_id: &str) -> Result<Option<OrderDetails>> {
    let conn = Connection::open(path)?;
    let mut stmt = conn.prepare("SELECT order_id,email,name,address,created_at FROM order_details WHERE order_id=?1")?;
    let mut rows = stmt.query(params![order_id])?;
    if let Some(row) = rows.next()? {
        Ok(Some(OrderDetails {
            order_id: row.get(0)?,
            email: row.get(1)?,
            name: row.get(2)?,
            address: row.get(3)?,
            created_at: row.get(4)?,
        }))
    } else {
        Ok(None)
    }
} 