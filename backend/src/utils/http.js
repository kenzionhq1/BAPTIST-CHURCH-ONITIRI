function ok(res, data, meta) {
  return res.status(200).json({
    ok: true,
    data,
    meta: meta || undefined,
  });
}

function badRequest(res, message, details) {
  return res.status(400).json({
    ok: false,
    error: message || "Bad Request",
    details: details || undefined,
  });
}

function notFound(res, message) {
  return res.status(404).json({
    ok: false,
    error: message || "Not Found",
  });
}

module.exports = { ok, badRequest, notFound };

