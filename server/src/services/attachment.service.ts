import mongoose from "mongoose";

import Attachment from "../models/attachment.model.js";
import { ApiError } from "../utils/api-error.js";
import {
  uploadBufferToCloudinary,
} from "./upload.service.js";

export const createAttachment = async (
  userId: string,
  memoryId: string,
  file: Express.Multer.File
) => {
  if (
    !mongoose.Types.ObjectId.isValid(memoryId)
  ) {
    throw new ApiError(
      400,
      "Invalid memory ID"
    );
  }

  if (!file) {
    throw new ApiError(
      400,
      "File is required"
    );
  }

  let resourceType:
    | "image"
    | "video"
    | "raw";

  let attachmentType:
    | "image"
    | "video"
    | "audio"
    | "document";

  if (file.mimetype.startsWith("image/")) {
    resourceType = "image";
    attachmentType = "image";
  } else if (
    file.mimetype.startsWith("video/")
  ) {
    resourceType = "video";
    attachmentType = "video";
  } else if (
    file.mimetype.startsWith("audio/")
  ) {
    resourceType = "raw";
    attachmentType = "audio";
  } else {
    resourceType = "raw";
    attachmentType = "document";
  }

  const result =
    await uploadBufferToCloudinary(
      file.buffer,
      {
        folder: `lifetrace/${userId}/memories/${memoryId}`,
        resourceType,
      }
    );

  const attachment =
    await Attachment.create({
      userId,
      memoryId,
      type: attachmentType,
      url: result.secure_url,
      publicId: result.public_id,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
    });

  return attachment;
};