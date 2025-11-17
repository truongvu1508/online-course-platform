import express from "express";
import userRoutes from "./user.route.js";
import courseRoutes from "./course.route.js";
import categoryRoutes from "./category.route.js";
import chapterRoutes from "./chapter.route.js";
import lectureRoutes from "./lecture.route.js";
import authRoutes from "../shared/auth.route.js";

const router = express.Router();

// admin routes - private
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/categories", categoryRoutes);
router.use("/chapters", chapterRoutes);
router.use("/lectures", lectureRoutes);

export default router;
