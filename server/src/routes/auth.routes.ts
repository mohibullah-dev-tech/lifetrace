import { Router } from "express";

import {
  loginUser,
  registerUser,
  refreshToken,
  logoutUser,
  changePasswordUser,
  
} from "../controllers/auth.controller.js";
import {
  authenticate,
} from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validate.middleware.js";

import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
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
router.post(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  changePasswordUser
);
export default router;