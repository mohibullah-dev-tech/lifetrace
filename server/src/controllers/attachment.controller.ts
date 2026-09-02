import { Request, Response } from "express";

import { createAttachment } from "../services/attachment.service.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

export const uploadAttachment = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ApiError(
      401,
      "Authentication required"
    );
  }

  if (!req.file) {
    throw new ApiError(
      400,
      "File is required"
    );
  }

  const { memoryId } = req.params;

  if (!memoryId || Array.isArray(memoryId)) {
    throw new ApiError(
      400,
      "Memory ID is required"
    );
  }

  const attachment =
    await createAttachment(
      req.userId,
      memoryId,
      req.file
    );

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        attachment,
        "Attachment uploaded successfully"
      )
    );
};
