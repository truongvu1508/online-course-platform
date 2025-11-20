import express from "express";
import orderRoutes from "./order.route.js";

const router = express.Router();

// student routes - private
router.use("/orders", orderRoutes);

export default router;
