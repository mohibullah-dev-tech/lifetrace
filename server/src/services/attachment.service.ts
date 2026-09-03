import mongoose from "mongoose";

import Attachment from "../models/attachment.model.js";
import Memory from "../models/memory.model.js";
import cloudinary from "../config/cloudinary.js";
import {
  uploadBufferToCloudinary,
} from "./upload.service.js";
import { ApiError } from "../utils/api-error.js";

// ==========================================
// CREATE / UPLOAD ATTACHMENT
// ==========================================

export const createAttachment = async (
  userId: string,
  memoryId: string,
  file: Express.Multer.File
) => {
  // ----------------------------------------
  // Validate memory ID
  // ----------------------------------------

  if (
    !mongoose.Types.ObjectId.isValid(memoryId)
  ) {
    throw new ApiError(
      400,
      "Invalid memory ID"
    );
  }

  // ----------------------------------------
  // Validate file
  // ----------------------------------------

  if (!file) {
    throw new ApiError(
      400,
      "File is required"
    );
  }

  // ----------------------------------------
  // Ownership check
  // ----------------------------------------

  const memory = await Memory.findOne({
    _id: memoryId,
    userId,
  });

  if (!memory) {
    throw new ApiError(
      404,
      "Memory not found"
    );
  }

  // ----------------------------------------
  // Determine resource type
  // ----------------------------------------

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

  // ----------------------------------------
  // Upload to Cloudinary
  // ----------------------------------------

  const result =
    await uploadBufferToCloudinary(
      file.buffer,
      {
        folder: `lifetrace/${userId}/memories/${memoryId}`,
        resourceType,
      }
    );

  // ----------------------------------------
  // Save attachment metadata
  // ----------------------------------------

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

// ==========================================
// GET MEMORY ATTACHMENTS
// ==========================================

export const getMemoryAttachments = async (
  userId: string,
  memoryId: string
) => {
  // ----------------------------------------
  // Validate memory ID
  // ----------------------------------------

  if (
    !mongoose.Types.ObjectId.isValid(memoryId)
  ) {
    throw new ApiError(
      400,
      "Invalid memory ID"
    );
  }

  // ----------------------------------------
  // Ownership check
  // ----------------------------------------

  const memory = await Memory.findOne({
    _id: memoryId,
    userId,
  });

  if (!memory) {
    throw new ApiError(
      404,
      "Memory not found"
    );
  }

  // ----------------------------------------
  // Fetch attachments
  // ----------------------------------------

  const attachments =
    await Attachment.find({
      userId,
      memoryId,
    }).sort({
      createdAt: -1,
    });

  return attachments;
};

// ==========================================
// DELETE ATTACHMENT
// ==========================================

export const deleteAttachment = async (
  userId: string,
  attachmentId: string
) => {
  // ----------------------------------------
  // Validate attachment ID
  // ----------------------------------------

  if (
    !mongoose.Types.ObjectId.isValid(
      attachmentId
    )
  ) {
    throw new ApiError(
      400,
      "Invalid attachment ID"
    );
  }

  // ----------------------------------------
  // Find attachment owned by user
  // ----------------------------------------

  const attachment =
    await Attachment.findOne({
      _id: attachmentId,
      userId,
    });

  if (!attachment) {
    throw new ApiError(
      404,
      "Attachment not found"
    );
  }

  // ----------------------------------------
  // Determine Cloudinary resource type
  // ----------------------------------------

  const resourceType =
    attachment.type === "image"
      ? "image"
      : attachment.type === "video"
      ? "video"
      : "raw";

  // ----------------------------------------
  // Delete from Cloudinary
  // ----------------------------------------

  if (attachment.publicId) {
    try {
      await cloudinary.uploader.destroy(
        attachment.publicId,
        {
          resource_type: resourceType,
          invalidate: true,
        }
      );
    } catch (error) {
      console.error(
        "Cloudinary deletion failed:",
        error
      );

      throw new ApiError(
        500,
        "Failed to delete file from storage"
      );
    }
  }

  // ----------------------------------------
  // Delete database record
  // ----------------------------------------

  await attachment.deleteOne();

  return null;
};