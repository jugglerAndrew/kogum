// /workspaces/kogum/packages/backend/src/routes/puzzleRoutes.ts

import { Router } from "express";
import {
  getRandomPuzzle,
  getDailyPuzzle,
  getTutorialPuzzle,
} from "../controllers/puzzleController";
// import { requireAuth } from '../middleware/authMiddleware'; // If needed later

const router = Router();

router.get("/random", getRandomPuzzle);
router.get("/daily", getDailyPuzzle);
router.get("/tutorial", getTutorialPuzzle);

export default router;
