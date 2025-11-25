import express from "express";
import {
  getPublicCourseBestSellers,
  getPublicCourseBySlug,
  getPublicCourseNewest,
  getPublicCourses,
  getPublicCoursesRating,
  getPublicCourseReviews,
} from "../../controllers/public/course.controller.js";

const router = express.Router();

// public course routes - browse courses without login
router.get("/", getPublicCourses);
router.get("/best-sellers", getPublicCourseBestSellers);
router.get("/newest", getPublicCourseNewest);
router.get("/rating", getPublicCoursesRating);

router.get("/:slug", getPublicCourseBySlug);
router.get("/reviews/:courseId", getPublicCourseReviews);

export default router;
