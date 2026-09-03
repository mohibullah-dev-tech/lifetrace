import multer from "multer";
import path from "path";

import { ApiError } from "../utils/api-error.js";

// ==========================================
// Allowed MIME Types
// ==========================================

const allowedMimeTypes = [
  // Images
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
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

  // Postman / generic binary
  "application/octet-stream",
];

// ==========================================
// Allowed File Extensions
// ==========================================

const allowedExtensions =
  /\.(jpeg|jpg|png|webp|gif|mp4|webm|mov|mp3|wav|ogg|pdf|doc|docx)$/i;

// ==========================================
// Memory Storage
// ==========================================

const storage = multer.memoryStorage();

// ==========================================
// File Filter
// ==========================================

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  callback
) => {
  console.log(
    "========== FILE DEBUG =========="
  );

  console.log(
    "Name:",
    file.originalname
  );

  console.log(
    "MIME:",
    file.mimetype
  );

  console.log(
    "Field:",
    file.fieldname
  );

  console.log(
    "================================"
  );

  // ------------------------------------------
  // 1. Check file extension
  // ------------------------------------------

  const extName =
    allowedExtensions.test(
      file.originalname
    );

  // ------------------------------------------
  // 2. Check MIME type
  // ------------------------------------------

  const mimeType =
    allowedMimeTypes.includes(
      file.mimetype.toLowerCase()
    );

  // ------------------------------------------
  // 3. Allow if either matches
  // ------------------------------------------

  if (extName || mimeType) {
    return callback(null, true);
  }

  // ------------------------------------------
  // 4. Reject unsupported file
  // ------------------------------------------

  return callback(
    new ApiError(
      400,
      `Unsupported file type. MIME: ${file.mimetype}, File: ${file.originalname}`
    )
  );
};

// ==========================================
// Multer Upload Configuration
// ==========================================

export const upload = multer({
  storage,

  limits: {
    // Maximum file size: 50 MB
    fileSize: 50 * 1024 * 1024,

    // Maximum number of files
    files: 1,

    // Maximum number of multipart fields
    fields: 10,
  },

  fileFilter,
});