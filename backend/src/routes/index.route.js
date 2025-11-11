import express from "express";
import userRoutes from "../routes/user.route.js";
import authRoutes from "../routes/auth.route.js";
import { checkValidJWT } from "../middleware/jwt.middleware.js";
import fileRouters from "./file.route.js";
import categoryRoutes from "./category.route.js";
import courseRoutes from "./course.route.js";

const routes = (app) => {
  const router = express.Router();

  router.get("/", (req, res) => {
    res.json({ message: "API is running" });
  });

  // routes
  router.use("/users", userRoutes);
  router.use("/auth", authRoutes);
  router.use("/file", fileRouters);
  router.use("/categories", categoryRoutes);
  router.use("/courses", courseRoutes);

  app.use("/api", checkValidJWT, router);
};

export default routes;
