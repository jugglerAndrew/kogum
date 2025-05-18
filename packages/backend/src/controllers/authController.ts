// packages/backend/src/controllers/authController.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createUser, findUserByUsername } from "../services/userService";
import { config } from "../config";

export const register: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user_name, user_email, password } = req.body;

  if (!user_name || !user_email || !password) {
    res
      .status(400)
      .json({ message: "Username, email, and password are required." });
    return;
  }

  try {
    const newUser = await createUser({
      user_name,
      user_email,
      plainPassword: password,
    });
    // Avoid sending sensitive info like password hash back, even if it's just created.
    // For now, we'll send a success message. Consider what info is useful for client.
    res.status(201).json({
      message: "User registered successfully!",
      user_id: newUser.user_id,
    });
  } catch (error: any) {
    if (
      error.message === "Username already exists." ||
      error.message === "Email already registered."
    ) {
      res.status(409).json({ message: error.message }); // 409 Conflict
    }
    console.error("Registration error:", error);
    // Pass to a generic error handler or return a generic message
    // next(error); // If you have a centralized error handling middleware
    res.status(500).json({ message: "Failed to register user." });
  }
};

export const login: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user_name, password } = req.body;

  if (!user_name || !password) {
    res.status(400).json({ message: "Username and password are required." });
    return;
  }

  try {
    const user = await findUserByUsername(user_name);
    if (!user) {
      res.status(401).json({ message: "Invalid username or password." }); // Unauthorized
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password_hash); // user.password_hash is the hash from DB
    if (!isPasswordMatch) {
      res.status(401).json({ message: "Invalid username or password." }); // Unauthorized
      return;
    }

    // User authenticated, create JWT
    const tokenPayload: object = {
      user_id: user.user_id,
      user_name: user.user_name,
    };
    const secretKey: Secret = config.jwt.secret;
    const signOptions: SignOptions = {
      expiresIn: 3600, //TODO
    };

    const token = jwt.sign(tokenPayload, secretKey, signOptions);

    // For simplicity, just sending the token.
    // In a real app, you might also send back some user info (excluding password).
    res.status(200).json({
      message: "Login successful!",
      token: token,
      user: {
        // Send some non-sensitive user info
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    // next(error);
    res.status(500).json({ message: "Login failed." });
  }
};
