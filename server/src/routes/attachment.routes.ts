import { Router } from "express";

import {
  uploadAttachment,
  getMemoryAttachmentsUser,
  deleteAttachmentUser,
} from "../controllers/attachment.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

import {
  upload,
} from "../middleware/upload.middleware.js";

const router = Router();

// ==========================================
// Upload Attachment
// ==========================================

router.post(
  "/memories/:memoryId",
  authenticate,
  upload.single("file"),
  uploadAttachment
);

// ==========================================
// Get Memory Attachments
// ==========================================

router.get(
  "/memories/:memoryId",
  authenticate,
  getMemoryAttachmentsUser
);

// ==========================================
// Delete Attachment
// ==========================================

router.delete(
  "/:attachmentId",
  authenticate,
  deleteAttachmentUser
);

export default router;