import { Router } from "express";

import {
  loginUser,
  registerUser,
  refreshToken,
} from "../controllers/auth.controller.js";

import { validate } from "../middleware/validate.middleware.js";

import {
  loginSchema,
  registerSchema,
} from "../validations/auth.validation.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  registerUser
);

router.post(
  "/login",
  validate(loginSchema),
  loginUser
);

router.post(
  "/refresh",
  refreshToken
);
export default router;