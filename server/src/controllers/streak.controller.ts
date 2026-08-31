import { Request, Response } from "express";

import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

import {
  getStreak,
} from "../services/streak.service.js";

export const getStreakController = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ApiError(
      401,
      "Authentication required"
    );
  }

  const streak = await getStreak(
    req.userId
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        streak,
        "Streak fetched successfully"
      )
    );
};