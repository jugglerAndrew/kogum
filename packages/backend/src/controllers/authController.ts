// packages/backend/src/controllers/authController.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createUser, findUserByUsername } from "../services/userService";
import { config } from "../config";
import { v4 as uuidv4 } from "uuid";
import { sendMail } from "../utils/mailer";

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

  // Generate verification token and expiry (24 hours from now)
  const verification_token = uuidv4();
  const verification_token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const { getClient } = await import("../db");
  const { client, query, release } = await getClient();
  try {
    await client.query("BEGIN");
    // Hash the password
    const passwordHash = await bcrypt.hash(password, config.bcryptSaltRounds);
    const sql = `
      INSERT INTO users (user_name, user_email, user_password, user_register_date, verification_token, verification_token_expires)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5)
      RETURNING user_id, user_name, user_email, user_register_date, verified, verification_token, verification_token_expires;
    `;
    const result = await query(sql, [
      user_name,
      user_email,
      passwordHash,
      verification_token,
      verification_token_expires,
    ]);
    if (result.rows.length === 0) {
      throw new Error("User creation failed, no rows returned.");
    }
    const newUser = result.rows[0];

    // Send verification email
    const verificationUrl = `https://yourdomain.com/verify?token=${verification_token}`;
    await sendMail({
      to: user_email,
      subject: "Kogum - Please verify your email address",
      html: `<p>Welcome to Kogum!</p>
        <p>Please verify your email by clicking the link below:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This link will expire in 24 hours.</p>`,
    });

    await client.query("COMMIT");
    res.status(201).json({
      message: "User registered successfully! Verification email sent.",
      user_id: newUser.user_id,
    });
  } catch (error: any) {
    await client.query("ROLLBACK");
    if (
      error.message === "Username already exists." ||
      error.message === "Email already registered."
    ) {
      res.status(409).json({ message: error.message }); // 409 Conflict
      release();
      return;
    }
    console.error("Registration error:", error);
    res.status(500).json({ message: "Failed to register user." });
  } finally {
    release();
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

    if (!user.verified) {
      res.status(403).json({
        message:
          "Your account is not verified. Please check your email for a verification link.",
      });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.user_password); // Assuming user_password holds the hash from DB
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

export const verifyEmail: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { token } = req.query;
  if (!token || typeof token !== "string") {
    res.status(400).json({ message: "Verification token is required." });
    return;
  }

  try {
    // Find user by token
    const sql = `SELECT user_id, verified, verification_token_expires FROM users WHERE verification_token = $1`;
    const { query } = await import("../db");
    const result = await query(sql, [token]);
    if (result.rows.length === 0) {
      res
        .status(400)
        .json({ message: "Verification link is invalid or already used." });
      return;
    }
    const user = result.rows[0];
    if (user.verified) {
      res.status(200).json({ message: "Account already verified." });
      return;
    }
    if (
      !user.verification_token_expires ||
      new Date(user.verification_token_expires) < new Date()
    ) {
      res.status(400).json({ message: "Verification link has expired." });
      return;
    }
    // Mark as verified and clear token fields
    const updateSql = `UPDATE users SET verified = TRUE, verification_token = NULL, verification_token_expires = NULL WHERE user_id = $1`;
    await query(updateSql, [user.user_id]);
    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Failed to verify email." });
  }
};
