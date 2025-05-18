// packages/backend/src/db/index.ts
import { Pool, QueryResult, QueryResultRow } from "pg";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // You can add SSL configuration here if you were connecting to a remote DB
  // For local Docker, it's usually not needed.
  // ssl: {
  //   rejectUnauthorized: false // Example for self-signed certs, not for production
  // }
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL database!");
});

pool.on("error", (err: Error) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export const query = async <T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> => {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", {
      text: text.substring(0, 100),
      duration,
      rows: res.rowCount,
    });
    return res;
  } catch (error) {
    console.error("Error executing query", {
      text: text.substring(0, 100),
      error,
    });
    throw error;
  }
};

export const getClient = async () => {
  const client = await pool.connect();
  const query = async <T extends QueryResultRow = any>(
    text: string,
    params?: any[]
  ) => {
    // Original query method can be used here or a new one for transactions
    return client.query<T>(text, params);
  };
  const release = () => {
    client.release();
  };
  return { client, query, release };
};

// Optional: Test connection on startup (can be removed later)
// (async () => {
//   try {
//     const client = await pool.connect();
//     console.log('Successfully connected to PostgreSQL via pool.');
//     client.release();
//   } catch (e) {
//     console.error('Failed to connect to PostgreSQL:', e);
//   }
// })();

export default pool;
