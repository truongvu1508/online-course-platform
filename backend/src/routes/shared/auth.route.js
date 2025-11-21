import express from "express";
import { getAccount } from "../../controllers/shared/auth.controller.js";

const router = express.Router();

// protected auth routes
router.get("/account", getAccount);

export default router;
