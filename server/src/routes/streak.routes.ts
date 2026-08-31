import { Router } from "express";

import {
  getStreakController,
} from "../controllers/streak.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/",
  authenticate,
  getStreakController
);

export default router;