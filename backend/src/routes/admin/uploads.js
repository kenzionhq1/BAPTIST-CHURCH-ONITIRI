const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");

const { env } = require("../../config/env");
const { badRequest, ok } = require("../../utils/http");

const router = express.Router();

const hasCloudinary =
  env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET;

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
} else {
  fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });
}

function safeFilename(originalname) {
  const base = path.basename(originalname || "file").replace(/[^\w.\-]+/g, "_");
  const stamp = Date.now();
  const rand = Math.random().toString(16).slice(2, 10);
  return `${stamp}-${rand}-${base}`;
}

const storage = hasCloudinary
  ? multer.memoryStorage()
  : multer.diskStorage({
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

function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: env.CLOUDINARY_FOLDER,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      },
    );
    stream.end(file.buffer);
  });
}

router.post("/uploads", upload.any(), async (req, res, next) => {
  try {
    const files = Array.isArray(req.files) ? req.files : [];
    if (files.length === 0) return badRequest(res, "No files uploaded");

    if (hasCloudinary) {
      const uploaded = [];
      for (const file of files) {
        // eslint-disable-next-line no-await-in-loop
        const result = await uploadToCloudinary(file);
        uploaded.push({
          fileName: file.originalname,
          storedName: result.public_id,
          mimeType: file.mimetype,
          size: file.size,
          fileUrl: result.secure_url || result.url,
        });
      }

      if (uploaded.length === 1) return ok(res, uploaded[0]);
      return ok(res, { files: uploaded });
    }

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
