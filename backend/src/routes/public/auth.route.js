import express from "express";
import {
  handleLogin,
  handleRegister,
  handleResendVerificationCode,
  handleVerifyEmail,
} from "../../controllers/public/auth.controller.js";

const router = express.Router();

// public auth routes
router.post("/login", handleLogin);
router.post("/register", handleRegister);
router.post("/verify-email", handleVerifyEmail);
router.post("/resend-verification", handleResendVerificationCode);

export default router;
