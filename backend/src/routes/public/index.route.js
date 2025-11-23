import express from "express";
import authRoutes from "./auth.route.js";
import courseRoutes from "./course.route.js";
import categoryRoutes from "./category.route.js";
import fileRoutes from "./file.route.js";
import paymentRoutes from "./payment.route.js";

const router = express.Router();

// public routes - cho phep truy cap ma khong can login
router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/categories", categoryRoutes);
router.use("/file", fileRoutes);
router.use("/payment", paymentRoutes);

export default router;
