import multer from "multer";
import { ApiError } from "../utils/api-error.js";

const allowedMimeTypes = [
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",

  // Videos
  "video/mp4",
  "video/webm",
  "video/quicktime",

  // Audio
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/mp4",

  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  callback
) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    callback(
      new ApiError(
        400,
        "Unsupported file type"
      )
    );

    return;
  }

  callback(null, true);
};

export const upload = multer({
  storage,
  limits: {
    // 50 MB maximum per file
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter,
});