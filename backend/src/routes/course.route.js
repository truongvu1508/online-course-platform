import express from "express";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  updateCourse,
} from "../controllers/course.controller.js";
import { compressImage, upload } from "../middleware/upload.middleware.js";

const courseRoutes = express.Router();

// Course routes
courseRoutes.get("/", getCourses);
courseRoutes.get("/:id", getCourseById);

courseRoutes.post("/", upload.single("thumbnail"), compressImage, createCourse);

courseRoutes.put(
  "/:id",
  upload.single("thumbnail"),
  compressImage,
  updateCourse
);

courseRoutes.delete("/:id", deleteCourse);

export default courseRoutes;
