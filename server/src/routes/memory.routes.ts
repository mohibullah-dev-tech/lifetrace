import { Router } from "express";

import {
  createMemoryController,
  getMemoriesController,
  getMemoryByIdController,
  updateMemoryController,
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

router.patch(
  "/:id",
  authenticate,
  validate(updateMemorySchema),
  updateMemoryController
);

router.get(
  "/:id",
  authenticate,
  getMemoryByIdController
);

export default router;