import express from "express";
import {
  createChapter,
  deleteChapter,
  getChapters,
  getChapterById,
  updateChapter,
} from "../../controllers/chapter.controller.js";

const router = express.Router();

router.get("/", getChapters);
router.get("/:id", getChapterById);
router.post("/", createChapter);
router.put("/:id", updateChapter);
router.delete("/:id", deleteChapter);

export default router;
