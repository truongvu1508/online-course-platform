import express from "express";
import {
  createChapter,
  deleteChapter,
  getChapterById,
  getChapters,
  updateChapter,
} from "../../controllers/admin/chapter.controller.js";

const router = express.Router();

router.get("/", getChapters);
router.get("/:id", getChapterById);
router.post("/", createChapter);
router.put("/:id", updateChapter);
router.delete("/:id", deleteChapter);

export default router;
