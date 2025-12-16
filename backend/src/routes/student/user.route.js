import express from "express";
import {
  getProfile,
  updateProfile,
} from "../../controllers/student/user.controller.js";
import { upload } from "../../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", getProfile);
router.put("/", upload.single("avatar"), updateProfile);

export default router;
