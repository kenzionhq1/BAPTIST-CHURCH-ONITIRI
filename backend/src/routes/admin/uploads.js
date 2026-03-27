const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const { env } = require("../../config/env");
const { badRequest, ok } = require("../../utils/http");

const router = express.Router();

function ensureUploadDir() {
  fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });
}

ensureUploadDir();

function safeFilename(originalname) {
  const base = path.basename(originalname || "file").replace(/[^\w.\-]+/g, "_");
  const stamp = Date.now();
  const rand = Math.random().toString(16).slice(2, 10);
  return `${stamp}-${rand}-${base}`;
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, env.UPLOAD_DIR);
  },
  filename(req, file, cb) {
    cb(null, safeFilename(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

function getBaseUrl(req) {
  if (env.BASE_URL) return env.BASE_URL.replace(/\/$/, "");
  return `${req.protocol}://${req.get("host")}`;
}

router.post("/uploads", upload.any(), async (req, res, next) => {
  try {
    const files = Array.isArray(req.files) ? req.files : [];
    if (files.length === 0) return badRequest(res, "No files uploaded");

    const baseUrl = getBaseUrl(req);
    const uploaded = files.map((f) => ({
      fileName: f.originalname,
      storedName: f.filename,
      mimeType: f.mimetype,
      size: f.size,
      fileUrl: `${baseUrl}/uploads/${encodeURIComponent(f.filename)}`,
    }));

    if (uploaded.length === 1) return ok(res, uploaded[0]);
    return ok(res, { files: uploaded });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
