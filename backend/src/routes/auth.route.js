import express from "express";
import {
  getAccount,
  handleLogin,
  handleRegister,
  handleResendVerificationCode,
  handleVerifyEmail,
} from "../controllers/auth.controller.js";

const authRouters = express.Router();

// Auth routes
authRouters.post("/login", handleLogin);
authRouters.post("/register", handleRegister);
authRouters.post("/verify-email", handleVerifyEmail);
authRouters.post("/resend-verification", handleResendVerificationCode);
authRouters.get("/account", getAccount);

export default authRouters;
