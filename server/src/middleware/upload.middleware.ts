import multer from "multer";
import path from "path";
import { ApiError } from "../utils/api-error.js";

const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/mp4",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream" // পোস্টম্যানের ডিফল্ট বাইনারি টাইপ
];

// সাপোর্ট করবে এমন ফাইল এক্সটেনশনসমূহ
const allowedExtensions = /jpeg|jpg|png|webp|gif|mp4|webm|mov|mp3|wav|ogg|pdf|doc|docx/;

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  callback
) => {
  console.log("========== FILE DEBUG ==========");
  console.log("Name:", file.originalname);
  console.log("MIME:", file.mimetype);
  console.log("================================");

  // ১. ফাইল এক্সটেনশন চেক
  const extName = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );

  // ২. MIME টাইপ চেক
  const mimeType = allowedMimeTypes.includes(file.mimetype.toLowerCase());

  // এক্সটেনশন অথবা MIME টাইপ যেকোনো একটি মিললেই এলাউ করবে
  if (extName || mimeType) {
    return callback(null, true);
  }

  callback(
    new ApiError(
      400,
      `Unsupported file type. MIME: ${file.mimetype}, File: ${file.originalname}`
    )
  );
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter,
});