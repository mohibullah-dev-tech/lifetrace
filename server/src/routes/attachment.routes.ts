import { Router } from "express";

import {
  uploadAttachment,
} from "../controllers/attachment.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

import {
  upload,
} from "../middleware/upload.middleware.js";

const router = Router();

router.post(
  "/memories/:memoryId",
  authenticate,
  upload.single("file"),
  uploadAttachment
);

export default router;