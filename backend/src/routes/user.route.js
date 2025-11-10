import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import { compressImage, upload } from "../middleware/upload.middleware.js";

const userRoutes = express.Router();

// User routes
userRoutes.get("/", getUsers);
userRoutes.get("/:id", getUserById);
userRoutes.post("/", upload.single("avatar"), compressImage, createUser);
userRoutes.put("/:id", upload.single("avatar"), updateUser);
userRoutes.delete("/:id", deleteUser);

export default userRoutes;
