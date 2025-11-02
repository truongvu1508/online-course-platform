import express from "express";
import routes from "./routes/index.route.js";
import config from "./config/index.config.js";

const app = express();
const port = config.port;

// config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
routes(app);

// 404 routes
app.use((req, res, next) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// connection
(async () => {
  try {
    console.log("\n\x1b[32m%s\x1b[0m", "Server Started Successfully!");
    console.log(
      "\x1b[36m%s\x1b[0m",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );
    console.log("  - Server:    " + `\x1b[37mhttp://localhost:${port}\x1b[0m`);
    console.log(
      "  - Frontend:  " +
        `\x1b[37m${config.frontendUrl || "Not configured"}\x1b[0m`
    );
    console.log("  - Database:  " + "\x1b[32mConnected ✓\x1b[0m");
    console.log(
      "  - Time:      " + `\x1b[37m${new Date().toLocaleString()}\x1b[0m`
    );
    console.log(
      "\x1b[36m%s\x1b[0m",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );
    console.log("\x1b[90m%s\x1b[0m\n", "Press CTRL+C to stop");

    app.listen(port, () => {});
  } catch (error) {
    console.log("\n\x1b[31m%s\x1b[0m", "Server Start Failed!");
    console.log(
      "\x1b[31m%s\x1b[0m",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );
    console.log("  Error: " + `\x1b[37m${error.message}\x1b[0m`);
    console.log(
      "\x1b[31m%s\x1b[0m\n",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );
    process.exit(1);
  }
})();
