const express = require("express");

const { getMergedItemsByCategory, getFeaturedSermonMerged } = require("../services/mergeService");
const { ok, badRequest } = require("../utils/http");

const router = express.Router();

router.get("/sermons", async (req, res, next) => {
  try {
    const [items, featuredSermon] = await Promise.all([
      getMergedItemsByCategory("sermon"),
      getFeaturedSermonMerged(),
    ]);
    return ok(res, items, { featuredSermon });
  } catch (err) {
    return next(err);
  }
});

router.get("/events", async (req, res, next) => {
  try {
    const placement = (req.query.placement || "").toString().trim();
    const items = await getMergedItemsByCategory("event");
    if (placement && !["upcoming", "past"].includes(placement)) {
      return badRequest(res, "Invalid placement (use upcoming|past)");
    }
    const filtered = placement ? items.filter((i) => i.eventPlacement === placement) : items;
    return ok(res, filtered);
  } catch (err) {
    return next(err);
  }
});

router.get("/resources", async (req, res, next) => {
  try {
    const items = await getMergedItemsByCategory("resource");
    return ok(res, items);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
