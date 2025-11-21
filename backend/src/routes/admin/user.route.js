import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../../controllers/admin/user.controller.js";
import { compressImage, upload } from "../../middleware/upload.middleware.js";

const router = express.Router();

// User routes
router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", upload.single("avatar"), compressImage, createUser);
router.put("/:id", upload.single("avatar"), updateUser);
router.delete("/:id", deleteUser);

export default router;
