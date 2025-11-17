import express from "express";
import {
  createLecture,
  deleteLecture,
  getLectures,
  getLectureById,
  updateLecture,
} from "../../controllers/lecture.controller.js";

const router = express.Router();

router.get("/", getLectures);
router.get("/:id", getLectureById);
router.post("/", createLecture);
router.put("/:id", updateLecture);
router.delete("/:id", deleteLecture);

export default router;
