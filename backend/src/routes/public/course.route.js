import express from "express";
import {
  getCourseBestSellers,
  getCourseById,
  getCourseNewest,
  getCourses,
} from "../../controllers/course.controller.js";

const router = express.Router();

// public course routes - browse courses without login
router.get("/", getCourses);
router.get("/best-sellers", getCourseBestSellers);
router.get("/newest", getCourseNewest);
router.get("/:id", getCourseById);

export default router;
