// packages/backend/src/server.ts
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors"; // For Cross-Origin Resource Sharing
import { config } from "./config"; // Your config file
import authRoutes from "./routes/authRoutes";
import puzzleRoutes from "./routes/puzzleRoutes";
// import pool from './db'; // Import db pool if you want to test connection on start

dotenv.config(); // Ensure .env is loaded

const app = express();
const PORT = config.port;

// Middleware
app.use(cors()); // Enable CORS for all routes (configure specific origins for production)
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Test DB connection (optional, can remove)
// (async () => {
//   try {
//     const client = await pool.connect();
//     console.log('Successfully connected to PostgreSQL from server.ts');
//     client.release();
//   } catch (e) {
//     console.error('Failed to connect to PostgreSQL from server.ts:', e);
//   }
// })();

// Routes
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP", message: "Kogum backend is healthy!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/puzzles", puzzleRoutes);

// Basic Error Handling Middleware (optional, can be more sophisticated)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error:", err.stack || err);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Kogum backend server is running on http://localhost:${PORT}`);
});
