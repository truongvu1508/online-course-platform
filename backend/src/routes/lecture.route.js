import express from "express";
import {
  createLecture,
  deleteLecture,
  getLectures,
  getLectureById,
  updateLecture,
} from "../controllers/lecture.controller.js";

const chapterRoutes = express.Router();

chapterRoutes.get("/", getLectures);
chapterRoutes.get("/:id", getLectureById);
chapterRoutes.post("/", createLecture);
chapterRoutes.put("/:id", updateLecture);
chapterRoutes.delete("/:id", deleteLecture);

export default chapterRoutes;
