import { Router } from "express";

import {
  getTimelineController,
} from "../controllers/timeline.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

import {
  validate,
} from "../middleware/validate.middleware.js";

import {
  timelineQuerySchema,
} from "../validations/timeline.validation.js";

const router = Router();

router.get(
  "/",
  authenticate,
  validate(
    timelineQuerySchema,
    "query"
  ),
  getTimelineController
);

export default router;