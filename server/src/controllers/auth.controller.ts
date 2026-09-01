import { Request, Response } from "express";
import {
  getCurrentUser,
  login,
  register,
  refreshAccessToken,
} from "../services/auth.service.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
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

export const getMe = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ApiError(401, "Authentication required");
  }

  const user = await getCurrentUser(req.userId);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        "User profile fetched successfully"
      )
    );
};
export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(
      400,
      "Refresh token is required"
    );
  }

  const result = await refreshAccessToken(
    refreshToken
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        "Access token refreshed successfully"
      )
    );
};