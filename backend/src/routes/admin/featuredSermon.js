const express = require("express");

const { supabase } = require("../../config/supabase");
const { createSnapshot } = require("../../services/historyService");
const { getFeaturedSermonMerged } = require("../../services/mergeService");
const { ok, badRequest } = require("../../utils/http");

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
      updated_at: new Date().toISOString(),
    };

    if (!supabase) return badRequest(res, "Supabase is not configured");

    const { data: existing } = await supabase.from("featured_sermons").select("id").limit(1);

    let doc = null;
    if (existing && existing.length > 0) {
      const { data, error } = await supabase
        .from("featured_sermons")
        .update(update)
        .eq("id", existing[0].id)
        .select("*")
        .single();
      if (!error) doc = data;
    } else {
      const { data, error } = await supabase
        .from("featured_sermons")
        .insert([update])
        .select("*")
        .single();
      if (!error) doc = data;
    }

    const snapshot = await createSnapshot("featured-sermon:update");
    return ok(res, doc, { snapshotId: String(snapshot ? snapshot.id : "") });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
