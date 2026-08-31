import { Request, Response } from "express";

import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

import {
  getCurrentUser,
  updateCurrentUser,
} from "../services/user.service.js";

export const getCurrentUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ApiError(
      401,
      "Authentication required"
    );
  }

  const user = await getCurrentUser(
    req.userId
  );

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

export const updateCurrentUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ApiError(
      401,
      "Authentication required"
    );
  }

  const user = await updateCurrentUser(
    req.userId,
    req.body
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        "User profile updated successfully"
      )
    );
};