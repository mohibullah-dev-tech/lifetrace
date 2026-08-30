import { Router } from "express";

import {
  createMemoryController,
  getMemoriesController,
  getMemoryByIdController,
  updateMemoryController,
  deleteMemoryController,
} from "../controllers/memory.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validate.middleware.js";

import {
  createMemorySchema,
  getMemoriesQuerySchema,
  updateMemorySchema,
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

router.delete(
  "/:id",
  authenticate,
  deleteMemoryController
);

export default router;
