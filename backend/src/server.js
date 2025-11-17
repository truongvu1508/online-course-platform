import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.route.js";
import cors from "cors";
import connection from "./config/database.config.js";
import passport from "passport";
import {
  configPassportJWT,
  configPassportLocal,
} from "./middleware/passport.middleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config cors
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// init passport
app.use(passport.initialize());

// config passport strategies
configPassportLocal();
configPassportJWT();

// routes
routes(app);

// connection
(async () => {
  try {
    // connect to database
    await connection();

    console.log("\n\x1b[32m%s\x1b[0m", "Server Started Successfully!");
    console.log(
      "\x1b[36m%s\x1b[0m",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );
    console.log("  - Server:    " + `\x1b[37mhttp://localhost:${port}\x1b[0m`);
    console.log(
      "  - Frontend:  " +
        `\x1b[37m${process.env.FRONTEND_URL || "Not configured"}\x1b[0m`
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
