const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: process.env.ENV_FILE || path.join(process.cwd(), ".env") });

function toInt(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const isProd = (process.env.NODE_ENV || "development") === "production";

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: toInt(process.env.PORT, 4000),
  MONGODB_URI:
    (!isProd && process.env.MONGODB_URI_LOCAL) ||
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/baptist_church_onitiri_admin",
  ADMIN_TOKEN: process.env.ADMIN_TOKEN || "",
  BASE_URL: process.env.BASE_URL || "",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  DEFAULT_DATA_FILE: process.env.DEFAULT_DATA_FILE || "",
  UPLOAD_DIR:
    process.env.UPLOAD_DIR ||
    (isProd ? "/var/data/uploads" : path.join(process.cwd(), "uploads")),
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER || "baptist-church-onitiri",
};

module.exports = { env };
