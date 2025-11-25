import express from "express";
import {
  createReview,
  updateReview,
  deleteReview,
} from "../../controllers/student/review.controller.js";

const router = express.Router();

router.post("/", createReview);
router.put("/:Id", updateReview);
router.delete("/:Id", deleteReview);

export default router;
