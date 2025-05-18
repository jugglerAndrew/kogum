// packages/backend/src/config/index.ts
import dotenv from "dotenv";

dotenv.config(); // Load .env file into process.env

export const config = {
  port: process.env.PORT || 8080,
  databaseUrl: process.env.DATABASE_URL,
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10),
  jwt: {
    secret: process.env.JWT_SECRET || "fallback_secret_key", // Fallback, but .env is better
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  },
};

if (!config.databaseUrl) {
  console.error("FATAL ERROR: DATABASE_URL is not defined.");
  process.exit(1);
}
if (
  config.jwt.secret === "fallback_secret_key" ||
  config.jwt.secret === "YOUR_REALLY_SECRET_KEY_CHANGE_ME"
) {
  console.warn(
    "WARNING: JWT_SECRET is using a default or placeholder value. Please set a strong secret in your .env file for production."
  );
}
