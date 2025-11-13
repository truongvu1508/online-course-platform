import express from "express";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  getCourseBestSellers,
  getCourseNewest,
  updateCourse,
} from "../controllers/course.controller.js";
import { compressImage, upload } from "../middleware/upload.middleware.js";

const courseRoutes = express.Router();

// Course routes

courseRoutes.get("/best-sellers", getCourseBestSellers);
courseRoutes.get("/newest", getCourseNewest);

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
