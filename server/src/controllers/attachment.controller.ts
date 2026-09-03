import {
  Request,
  Response,
} from "express";

import {
  createAttachment,
  getMemoryAttachments,
  deleteAttachment,
} from "../services/attachment.service.js";

import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

// ==========================================
// UPLOAD ATTACHMENT
// ==========================================

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

  if (!memoryId) {
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

// ==========================================
// GET MEMORY ATTACHMENTS
// ==========================================

export const getMemoryAttachmentsUser =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (!req.userId) {
      throw new ApiError(
        401,
        "Authentication required"
      );
    }

    const { memoryId } = req.params;

    if (!memoryId) {
      throw new ApiError(
        400,
        "Memory ID is required"
      );
    }

    const attachments =
      await getMemoryAttachments(
        req.userId,
        memoryId
      );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          attachments,
          "Attachments fetched successfully"
        )
      );
  };

// ==========================================
// DELETE ATTACHMENT
// ==========================================

export const deleteAttachmentUser =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (!req.userId) {
      throw new ApiError(
        401,
        "Authentication required"
      );
    }

    const { attachmentId } =
      req.params;

    if (!attachmentId) {
      throw new ApiError(
        400,
        "Attachment ID is required"
      );
    }

    await deleteAttachment(
      req.userId,
      attachmentId
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Attachment deleted successfully"
        )
      );
  };