// packages/backend/src/middleware/requireAuth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing or invalid auth token." });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as {
      user_id: number;
      user_name: string;
    };
    (req as any).user = {
      user_id: decoded.user_id,
      user_name: decoded.user_name,
    };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired auth token." });
  }
};

// Helper type for authenticated requests
export interface AuthenticatedRequest extends Request {
  user?: {
    user_id: number;
    user_name: string;
  };
}
