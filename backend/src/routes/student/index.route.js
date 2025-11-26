import express from "express";
import cartRoutes from "./cart.route.js";
import orderRoutes from "./order.route.js";
import enrollmentRoutes from "./enrollment.route.js";
import reviewRoutes from "./review.route.js";
import progressRotes from "./progress.route.js";

const router = express.Router();

// student routes - private
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/reviews", reviewRoutes);
router.use("/progress", progressRotes);

export default router;
