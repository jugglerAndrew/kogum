// packages/backend/src/controllers/authController.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createUser, findUserByUsername } from "../services/userService";
import { config } from "../config";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required." });
  }

  try {
    const newUser = await createUser({
      username,
      email,
      plainPassword: password,
    });
    // Avoid sending sensitive info like password hash back, even if it's just created.
    // For now, we'll send a success message. Consider what info is useful for client.
    res.status(201).json({
      message: "User registered successfully!",
      userId: newUser.user_id,
    });
  } catch (error: any) {
    if (
      error.message === "Username already exists." ||
      error.message === "Email already registered."
    ) {
      return res.status(409).json({ message: error.message }); // 409 Conflict
    }
    console.error("Registration error:", error);
    // Pass to a generic error handler or return a generic message
    // next(error); // If you have a centralized error handling middleware
    return res.status(500).json({ message: "Failed to register user." });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." }); // Unauthorized
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password_hash); // user.password_hash is the hash from DB
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid username or password." }); // Unauthorized
    }

    // User authenticated, create JWT
    const tokenPayload = {
      userId: user.user_id,
      username: user.username,
    };

    const token = jwt.sign(tokenPayload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    // For simplicity, just sending the token.
    // In a real app, you might also send back some user info (excluding password).
    res.status(200).json({
      message: "Login successful!",
      token: token,
      user: {
        // Send some non-sensitive user info
        userId: user.user_id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    // next(error);
    return res.status(500).json({ message: "Login failed." });
  }
};
