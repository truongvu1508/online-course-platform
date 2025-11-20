import express from "express";
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
  getOrderStatistics,
} from "../../controllers/admin/order.controller.js";

const router = express.Router();

// Order routes for admin
router.get("/", getAllOrders);
router.get("/statistics", getOrderStatistics);
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);
router.put("/:id/payment-status", updatePaymentStatus);
router.delete("/:id", deleteOrder);

export default router;
