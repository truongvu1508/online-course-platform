import express from "express";
import authRoutes from "./auth.route.js";

const router = express.Router();

// student routes - private
router.use("/auth", authRoutes);

export default router;
