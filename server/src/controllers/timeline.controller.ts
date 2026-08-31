import { Request, Response } from "express";

import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

import {
  getTimeline,
} from "../services/timeline.service.js";

export const getTimelineController = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ApiError(
      401,
      "Authentication required"
    );
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const timeline = await getTimeline(
    req.userId,
    page,
    limit
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        timeline,
        "Timeline fetched successfully"
      )
    );
};