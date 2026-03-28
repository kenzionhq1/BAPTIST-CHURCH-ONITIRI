const { connectDb } = require("../src/config/db");
const { env } = require("../src/config/env");
const { AdminItem } = require("../src/models");

function getBaseUrl() {
  const arg = process.argv.find((value) => value.startsWith("--base="));
  if (arg) {
    return arg.replace("--base=", "").replace(/\/$/, "");
  }
  if (env.BASE_URL) {
    return env.BASE_URL.replace(/\/$/, "");
  }
  return "http://localhost:4000";
}

function normalizeUploadUrl(value, baseUrl) {
  if (!value || typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) return trimmed;

  if (trimmed.startsWith("/uploads/")) {
    return `${baseUrl}${trimmed}`;
  }
  if (trimmed.startsWith("uploads/")) {
    return `${baseUrl}/${trimmed}`;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.pathname.startsWith("/uploads/")) {
        return `${baseUrl}${parsed.pathname}`;
      }
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}

function normalizeArray(values, baseUrl) {
  if (!Array.isArray(values)) return [];
  return values
    .map((entry) => normalizeUploadUrl(entry, baseUrl))
    .filter((entry) => typeof entry === "string" && entry.trim().length > 0);
}

async function run() {
  const baseUrl = getBaseUrl();
  console.log(`Normalizing uploads using base URL: ${baseUrl}`);

  await connectDb();
  const items = await AdminItem.find({}).lean();

  let updated = 0;

  for (const item of items) {
    const patch = {};
    const coverImageLink = normalizeUploadUrl(item.coverImageLink, baseUrl);
    const fileUrl = normalizeUploadUrl(item.fileUrl, baseUrl);
    const galleryLinks = normalizeArray(item.galleryLinks, baseUrl);
    const galleryFileUrls = normalizeArray(item.galleryFileUrls, baseUrl);

    if (coverImageLink && coverImageLink !== (item.coverImageLink || "")) {
      patch.coverImageLink = coverImageLink;
    }
    if (fileUrl && fileUrl !== (item.fileUrl || "")) {
      patch.fileUrl = fileUrl;
    }
    if (Array.isArray(item.galleryLinks) && JSON.stringify(galleryLinks) !== JSON.stringify(item.galleryLinks)) {
      patch.galleryLinks = galleryLinks;
    }
    if (Array.isArray(item.galleryFileUrls) && JSON.stringify(galleryFileUrls) !== JSON.stringify(item.galleryFileUrls)) {
      patch.galleryFileUrls = galleryFileUrls;
    }

    if (Object.keys(patch).length > 0) {
      await AdminItem.updateOne({ _id: item._id }, { $set: patch });
      updated += 1;
    }
  }

  console.log(`Done. Updated ${updated} item(s).`);
  process.exit(0);
}

run().catch((err) => {
  console.error("Upload normalization failed:", err);
  process.exit(1);
});
