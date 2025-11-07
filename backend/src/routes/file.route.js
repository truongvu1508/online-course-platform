import express from "express";

import { upload } from "../middleware/upload.middleware.js";
import {
  deleteFromCloudinary,
  uploadMultipleFiles,
  uploadSingleFile,
} from "../controllers/file.controller.js";

const fileRouters = express.Router();

// File routes
fileRouters.post("/single", upload.single("image"), uploadSingleFile);
fileRouters.post("/multiple", upload.array("images", 5), uploadMultipleFiles);
fileRouters.delete("/", deleteFromCloudinary);

export default fileRouters;
