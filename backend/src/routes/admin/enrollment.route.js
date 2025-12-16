import express from "express";
import { getEnrollmentCourse } from "../../controllers/admin/enrollment.controller.js";

const router = express.Router();

router.get("/course/:id", getEnrollmentCourse);

export default router;
