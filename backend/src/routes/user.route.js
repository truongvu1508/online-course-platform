import express from "express";
import { createUser } from "../controllers/user.controller.js";

const userRoutes = express.Router();

// User routes
userRoutes.post("/", createUser);

export default userRoutes;
