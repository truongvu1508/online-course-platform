import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../../controllers/student/cart.controller.js";

const router = express.Router();

// Cart routes - private (require authentication)
router.get("/", getCart);
router.post("/add", addToCart);
router.delete("/remove/:courseId", removeFromCart);
router.delete("/clear", clearCart);

export default router;
