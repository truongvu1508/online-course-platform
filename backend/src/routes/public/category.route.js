import express from "express";
import {
  getCategoryById,
  getCategories,
} from "../../controllers/category.controller.js";

const router = express.Router();

// public category routes
router.get("/", getCategories);
router.get("/:id", getCategoryById);

export default router;
