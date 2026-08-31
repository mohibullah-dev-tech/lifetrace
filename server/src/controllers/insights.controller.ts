import { Request, Response } from "express";

import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

import {
  getInsights,
} from "../services/insights.service.js";

export const getInsightsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ApiError(
      401,
      "Authentication required"
    );
  }

  const insights = await getInsights(
    req.userId
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        insights,
        "Insights fetched successfully"
      )
    );
};