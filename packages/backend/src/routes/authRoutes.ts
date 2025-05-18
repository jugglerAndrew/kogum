// packages/backend/src/routes/authRoutes.ts
import { Router } from "express";
import * as authController from "../controllers/authController";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
// router.post('/logout', authController.logout); // We'll handle logout client-side first

export default router;
