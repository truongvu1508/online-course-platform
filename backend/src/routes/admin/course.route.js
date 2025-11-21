import express from "express";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  updateCourse,
} from "../../controllers/admin/course.controller.js";
import { compressImage, upload } from "../../middleware/upload.middleware.js";

const router = express.Router();

// Course routes
router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", upload.single("thumbnail"), compressImage, createCourse);
router.put("/:id", upload.single("thumbnail"), compressImage, updateCourse);

router.delete("/:id", deleteCourse);

export default router;
