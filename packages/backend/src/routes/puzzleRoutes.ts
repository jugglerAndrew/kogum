// /workspaces/kogum/packages/backend/src/routes/puzzleRoutes.ts

import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import {
  getRandomPuzzle,
  getDailyPuzzle,
  getTutorialPuzzle,
  startPuzzleForUser,
  completePuzzleForUser,
  getLeaderboard,
  getOverallLeaderboard,
  getPersonalBests,
} from "../controllers/puzzleController";

const router = Router();

router.get("/random", getRandomPuzzle);
router.get("/daily", getDailyPuzzle);
router.get("/tutorial", getTutorialPuzzle);
router.post("/start", requireAuth, startPuzzleForUser);
router.post("/complete", requireAuth, completePuzzleForUser);
router.get("/leaderboard", getLeaderboard);
router.get("/leaderboard/overall", getOverallLeaderboard);
router.get("/personal-bests", requireAuth, getPersonalBests);

export default router;
