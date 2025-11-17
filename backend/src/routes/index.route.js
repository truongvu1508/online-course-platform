import { checkValidJWT } from "../middleware/jwt.middleware.js";
import publicRoutes from "./public/index.route.js";
import adminRoutes from "./admin/index.route.js";
import studentRoutes from "./student/index.route.js";
import sharedRoutes from "./shared/index.route.js";
import {
  checkAdminRole,
  checkStudentRole,
} from "../middleware/role.middleware.js";

const routes = (app) => {
  app.get("/api", (req, res) => {
    res.json({
      success: true,
      message: "API is running",
      timestamp: new Date().toISOString(),
    });
  });

  // public routes - khong can xac thuc
  app.use("/api/public", publicRoutes);

  // private routes admin - can xac thuc
  app.use("/api/admin", checkValidJWT, checkAdminRole, adminRoutes);

  // private routes student - can xac thuc
  app.use("/api/student", checkValidJWT, checkStudentRole, studentRoutes);

  // shared routes for role admin, student
  app.use("/api", checkValidJWT, sharedRoutes);

  // 404 handler
  app.use("*", (req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
  });
};

export default routes;
