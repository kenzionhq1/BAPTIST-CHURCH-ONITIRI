const express = require("express");

const { supabase } = require("../../config/supabase");
const { restoreSnapshotById } = require("../../services/historyService");
const { ok, badRequest } = require("../../utils/http");

const router = express.Router();

router.get("/history", async (req, res, next) => {
  try {
    const limit = Math.min(Number.parseInt(String(req.query.limit || "50"), 10) || 50, 200);

    if (!supabase) return ok(res, []);

    const { data: snapshots, error } = await supabase
      .from("admin_history_snapshots")
      .select("id, snapshot_data, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !snapshots) return ok(res, []);

    return ok(
      res,
      snapshots.map((s) => ({
        id: String(s.id),
        label: (s.snapshot_data && s.snapshot_data.label) || "",
        createdAt: s.created_at,
      })),
    );
  } catch (err) {
    return next(err);
  }
});

router.post("/history/undo", async (req, res, next) => {
  try {
    if (!supabase) return badRequest(res, "Supabase not configured");

    const { data: snapshots, error } = await supabase
      .from("admin_history_snapshots")
      .select("id, snapshot_data, created_at")
      .order("created_at", { ascending: false })
      .limit(2);

    if (error || !snapshots || snapshots.length < 2) {
      return badRequest(res, "Nothing to undo (need at least 2 snapshots)");
    }

    const target = snapshots[1];
    await restoreSnapshotById(target.id);
    return ok(res, {
      restoredTo: {
        id: String(target.id),
        label: (target.snapshot_data && target.snapshot_data.label) || "",
        createdAt: target.created_at,
      },
    });
  } catch (err) {
    return next(err);
  }
});

router.post("/history/restore/:id", async (req, res, next) => {
  try {
    const snapshotId = (req.params.id || "").toString().trim();
    const snapshot = await restoreSnapshotById(snapshotId);

    return ok(res, {
      restoredTo: {
        id: String(snapshot.id),
        label: (snapshot.snapshot_data && snapshot.snapshot_data.label) || "",
        createdAt: snapshot.created_at,
      },
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
