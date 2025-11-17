import express from "express";
import { upload } from "../../middleware/upload.middleware.js";
import {
  deleteFromCloudinary,
  uploadMultipleFiles,
  uploadSingleFile,
} from "../../controllers/file.controller.js";

const router = express.Router();

// public file routes
router.post("/single", upload.single("image"), uploadSingleFile);
router.post("/multiple", upload.array("images", 5), uploadMultipleFiles);
router.delete("/", deleteFromCloudinary);

export default router;
