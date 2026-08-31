import { Router } from "express";

import {
  getInsightsController,
} from "../controllers/insights.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/",
  authenticate,
  getInsightsController
);

export default router;