import express from "express";
import { getAccount } from "../../controllers/auth.controller.js";

const router = express.Router();

// protected auth routes
router.get("/account", getAccount); // get current user info

export default router;
