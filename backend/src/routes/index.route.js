import express from "express";

const routes = (app) => {
  const router = express.Router();

  router.get("/", (req, res) => {
    res.json({ message: "API is running" });
  });

  app.use("/api", router);
};

export default routes;
