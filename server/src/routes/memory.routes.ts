import { Router } from "express";
import { createMemoryController } from "../controllers/memory.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createMemorySchema } from "../validations/memory.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createMemorySchema),
  createMemoryController
);

export default router;