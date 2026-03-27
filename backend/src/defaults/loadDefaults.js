const fs = require("fs");
const path = require("path");

const { env } = require("../config/env");

let cached = null;

function safeParseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function resolveDefaultsPath() {
  if (env.DEFAULT_DATA_FILE) {
    return path.isAbsolute(env.DEFAULT_DATA_FILE)
      ? env.DEFAULT_DATA_FILE
      : path.resolve(process.cwd(), env.DEFAULT_DATA_FILE);
  }
  return path.resolve(__dirname, "defaultData.json");
}

function loadDefaults() {
  const defaultsPath = resolveDefaultsPath();

  if (!fs.existsSync(defaultsPath)) {
    return { items: [], featuredSermon: null };
  }

  const raw = fs.readFileSync(defaultsPath, "utf8");
  const parsed = safeParseJson(raw);

  if (!parsed || typeof parsed !== "object") {
    return { items: [], featuredSermon: null };
  }

  return {
    items: Array.isArray(parsed.items) ? parsed.items : [],
    featuredSermon: parsed.featuredSermon && typeof parsed.featuredSermon === "object" ? parsed.featuredSermon : null,
  };
}

function getDefaultData() {
  if (!cached) cached = loadDefaults();
  return cached;
}

module.exports = { getDefaultData };

