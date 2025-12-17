import express from "express";
import {
  getStats,
  getRevenueChart,
  getStudentChart,
} from "../../controllers/admin/dashboard.controller.js";

const router = express.Router();

router.get("/stats", getStats);
router.get("/revenue-chart", getRevenueChart);
router.get("/student-chart", getStudentChart);

export default router;
