import express from "express";
import {
  cancelOrder,
  createOrder,
  getOrderById,
  getOrders,
} from "../../controllers/student/order.controller.js";

const router = express.Router();

// order routes - private (require authentication)
router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id/cancel", cancelOrder);

export default router;
