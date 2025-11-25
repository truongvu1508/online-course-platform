import express from "express";
import orderRoutes from "./order.route.js";
import enrollmentRoutes from "./enrollment.route.js";
import reviewRoutes from "./review.route.js";

const router = express.Router();

// student routes - private
router.use("/orders", orderRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/reviews", reviewRoutes);

export default router;
