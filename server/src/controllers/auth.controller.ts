import { Request, Response } from "express";
import {
  login,
  register,
} from "../services/auth.service.js";
import { ApiResponse } from "../utils/api-response.js";
import type {
  LoginInput,
  RegisterInput,
} from "../validations/auth.validation.js";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await register(
    req.body as RegisterInput
  );

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        result,
        "Account created successfully"
      )
    );
};

export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await login(
    req.body as LoginInput
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        "Login successful"
      )
    );
};