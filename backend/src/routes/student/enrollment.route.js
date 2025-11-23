import express from "express";
import {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
} from "../../controllers/student/enrollment.controller.js";

const router = express.Router();

router.post("/", createEnrollment);
router.get("/", getEnrollments);
router.get("/:id", getEnrollmentById);

export default router;
