import { Router } from "express";

import {
  loginUser,
  registerUser,
  refreshToken,
  logoutUser,
  
} from "../controllers/auth.controller.js";
import {
  authenticate,
} from "../middleware/auth.middleware.js";

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
router.post(
  "/logout",
  authenticate,
  logoutUser
);
export default router;