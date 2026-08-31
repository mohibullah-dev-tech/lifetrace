import { Request, Response } from "express";

import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

import {
  getDashboard,
} from "../services/dashboard.service.js";

export const getDashboardController = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ApiError(
      401,
      "Authentication required"
    );
  }

  const dashboard = await getDashboard(
    req.userId
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        dashboard,
        "Dashboard fetched successfully"
      )
    );
};