
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === "true"
    ? { rejectUnauthorized: false }
    : false
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL database.");
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL error:", error);
});

export default pool;
