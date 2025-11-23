import express from "express";
import {
  handleVNPayCallback,
  getPaymentResultByOrderNumber,
  verifyPaymentStatus,
} from "../../controllers/student/payment.controller.js";

const router = express.Router();

router.get("/vnpay-callback", handleVNPayCallback);
router.get("/result/:orderNumber", getPaymentResultByOrderNumber);
router.post("/verify", verifyPaymentStatus);

export default router;
