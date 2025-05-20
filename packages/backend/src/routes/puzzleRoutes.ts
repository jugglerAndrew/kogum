// /workspaces/kogum/packages/backend/src/routes/puzzleRoutes.ts

import { Router } from "express";
import { getRandomPuzzle } from "../controllers/puzzleController";
// import { requireAuth } from '../middleware/authMiddleware'; // If needed later

const router = Router();

router.get("/random", getRandomPuzzle);

export default router;
