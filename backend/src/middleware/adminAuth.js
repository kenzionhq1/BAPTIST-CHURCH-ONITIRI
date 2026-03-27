const { env } = require("../config/env");

function adminAuth(req, res, next) {
  if (!env.ADMIN_TOKEN) return next();

  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : header;

  if (token && token === env.ADMIN_TOKEN) return next();

  return res.status(401).json({
    ok: false,
    error: "Unauthorized",
  });
}

module.exports = { adminAuth };

