// /workspaces/kogum/packages/backend/src/routes/debugRoutes.ts
import { Router } from "express";
import { getSvgEntityCombinations } from "../controllers/debugController";

const router = Router();

// Only expose this in development
router.get("/combinations", getSvgEntityCombinations);

export default router;
