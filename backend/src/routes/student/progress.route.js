import express from "express";
import { UpdateCourseProgress } from "../../controllers/student/progress.controller.js";

const router = express.Router();

router.post("/", UpdateCourseProgress);
export default router;
