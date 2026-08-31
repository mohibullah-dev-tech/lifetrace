import { Router } from "express";

import {
  getCurrentUserController,
  updateCurrentUserController,
} from "../controllers/user.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validate.middleware.js";

import {
  updateUserSchema,
} from "../validations/user.validation.js";

const router = Router();

router.get(
  "/me",
  authenticate,
  getCurrentUserController
);

router.patch(
  "/me",
  authenticate,
  validate(updateUserSchema),
  updateCurrentUserController
);

export default router;