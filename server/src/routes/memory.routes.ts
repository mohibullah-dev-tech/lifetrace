import { Router } from "express";

import {
  createMemoryController,
  getMemoriesController,
} from "../controllers/memory.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validate.middleware.js";

import {
  createMemorySchema,
  getMemoriesQuerySchema,
} from "../validations/memory.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createMemorySchema),
  createMemoryController
);

router.get(
  "/",
  authenticate,
  validate(getMemoriesQuerySchema, "query"),
  getMemoriesController
);

export default router;