const express = require("express");
const cors = require("cors");
const path = require("path");

const { env } = require("./config/env");
const { adminAuth } = require("./middleware/adminAuth");

const adminRoutes = require("./routes/admin");
const publicRoutes = require("./routes/public");

function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(","),
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (req, res) => res.json({ ok: true }));

  app.use("/uploads", express.static(path.resolve(env.UPLOAD_DIR)));

  app.use("/admin", adminAuth, adminRoutes);
  app.use("/public", publicRoutes);

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const status = Number(err.statusCode || err.status || 500);
    const message = status >= 500 ? "Internal Server Error" : err.message;
    if (status >= 500) console.error(err);
    res.status(status).json({ ok: false, error: message });
  });

  return app;
}

module.exports = { createApp };
