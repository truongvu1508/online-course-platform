import express from "express";
import {
  createChapter,
  deleteChapter,
  getChapters,
  getChapterById,
  updateChapter,
} from "../controllers/chapter.controller.js";

const chapterRoutes = express.Router();

chapterRoutes.get("/", getChapters);
chapterRoutes.get("/:id", getChapterById);
chapterRoutes.post("/", createChapter);
chapterRoutes.put("/:id", updateChapter);
chapterRoutes.delete("/:id", deleteChapter);

export default chapterRoutes;
