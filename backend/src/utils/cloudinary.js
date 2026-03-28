const { v2: cloudinary } = require("cloudinary");
const { env } = require("../config/env");

const hasCloudinary =
  env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET;

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

const cloudHost = "res.cloudinary.com";
const folderPrefix = env.CLOUDINARY_FOLDER
  ? `${env.CLOUDINARY_FOLDER.replace(/^\/+|\/+$/g, "")}/`
  : "";

function parseCloudinaryUrl(value) {
  if (!value || typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (!url.host.includes(cloudHost)) return null;
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 3) return null;
    const cloudName = parts[0];
    const resourceType = parts[1];
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1 || uploadIndex === parts.length - 1) return null;
    let publicParts = parts.slice(uploadIndex + 1);
    if (publicParts[0] && /^v\d+$/.test(publicParts[0])) {
      publicParts = publicParts.slice(1);
    }
    if (publicParts.length === 0) return null;
    const file = publicParts.join("/");
    const publicId = file.replace(/\.[^/.]+$/, "");
    if (!publicId) return null;
    return { cloudName, resourceType, publicId };
  } catch {
    return null;
  }
}

function shouldDeletePublicId(publicId) {
  if (!folderPrefix) return true;
  return publicId === folderPrefix.slice(0, -1) || publicId.startsWith(folderPrefix);
}

async function destroyCloudinaryAsset(info) {
  if (!hasCloudinary || !info) return;
  if (!shouldDeletePublicId(info.publicId)) return;
  const resourceType = ["image", "video", "raw"].includes(info.resourceType)
    ? info.resourceType
    : "image";
  try {
    await cloudinary.uploader.destroy(info.publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
  } catch {
    if (resourceType !== "video") {
      try {
        await cloudinary.uploader.destroy(info.publicId, {
          resource_type: "video",
          invalidate: true,
        });
      } catch {
        try {
          await cloudinary.uploader.destroy(info.publicId, {
            resource_type: "raw",
            invalidate: true,
          });
        } catch {
          // ignore cleanup errors
        }
      }
    }
  }
}

async function cleanupCloudinaryUrls(urls) {
  if (!hasCloudinary || !Array.isArray(urls)) return;
  const unique = Array.from(new Set(urls.filter(Boolean)));
  for (const url of unique) {
    const info = parseCloudinaryUrl(url);
    if (!info) continue;
    // eslint-disable-next-line no-await-in-loop
    await destroyCloudinaryAsset(info);
  }
}

module.exports = {
  hasCloudinary,
  cleanupCloudinaryUrls,
  parseCloudinaryUrl,
};
