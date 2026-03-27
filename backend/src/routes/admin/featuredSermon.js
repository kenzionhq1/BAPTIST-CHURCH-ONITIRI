const express = require("express");

const FeaturedSermon = require("../../models/FeaturedSermon");
const { createSnapshot } = require("../../services/historyService");
const { getFeaturedSermonMerged } = require("../../services/mergeService");
const { ok } = require("../../utils/http");

const router = express.Router();

router.get("/featured-sermon", async (req, res, next) => {
  try {
    const featuredSermon = await getFeaturedSermonMerged();
    return ok(res, featuredSermon);
  } catch (err) {
    return next(err);
  }
});

router.put("/featured-sermon", async (req, res, next) => {
  try {
    const body = req.body || {};

    const update = {
      title: (body.title || "").toString(),
      date: (body.date || "").toString(),
      speaker: (body.speaker || "").toString(),
      embed: (body.embed || "").toString(),
    };

    const doc = await FeaturedSermon.findOneAndUpdate({}, update, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    const snapshot = await createSnapshot("featured-sermon:update");
    return ok(res, doc ? doc.toObject({ depopulate: true }) : null, { snapshotId: String(snapshot._id) });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
