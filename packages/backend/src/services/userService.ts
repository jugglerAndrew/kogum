// packages/backend/src/services/userService.ts
import bcrypt from "bcrypt";
import { query } from "../db"; // Your database query function
import { config } from "../config";

export interface NewUser {
  user_name: string;
  user_email: string;
  password_hash: string; // Store the hash, not the plain password
  user_register_date?: Date; // Optional, as DB has default
}

export interface User extends NewUser {
  user_id: number;
}

export const createUser = async (userData: {
  user_name: string;
  user_email: string;
  plainPassword: string;
}): Promise<User> => {
  const { user_name, user_email, plainPassword } = userData;

  // Hash the password
  const passwordHash = await bcrypt.hash(
    plainPassword,
    config.bcryptSaltRounds
  );

  const sql = `
    INSERT INTO users (user_name, user_email, user_password, user_register_date)
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
    RETURNING user_id, user_name, user_email, user_password, user_register_date;
  `;
  // Note: user_password in DB will store the hash

  try {
    const result = await query<User>(sql, [
      user_name,
      user_email,
      passwordHash,
    ]);
    if (result.rows.length > 0) {
      // Don't return password_hash from this function usually, but for now, let's match User interface
      return result.rows[0];
    }
    throw new Error("User creation failed, no rows returned.");
  } catch (error: any) {
    // Basic error handling for unique constraint violation (e.g., user_name or user_email already exists)
    if (error.code === "23505") {
      // PostgreSQL unique violation error code
      if (
        error.constraint === "users_user_name_key" ||
        error.message.includes("user_name")
      ) {
        // Adjust if you add a unique constraint name
        throw new Error("Username already exists.");
      }
      if (
        error.constraint === "users_user_email_key" ||
        error.message.includes("user_email")
      ) {
        // Assumes users_user_email_key constraint from your schema
        throw new Error("Email already registered.");
      }
    }
    console.error("Error creating user in DB:", error);
    throw new Error("Error creating user.");
  }
};

// We'll add findUserByUsername and other functions here later for login
export const findUserByUsername = async (
  user_name: string
): Promise<User | null> => {
  const sql = `SELECT user_id, user_name, user_email, user_password, user_register_date FROM users WHERE user_name = $1;`;
  try {
    const result = await query<User>(sql, [user_name]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error finding user by user_name:", error);
    throw new Error("Error accessing database.");
  }
};
