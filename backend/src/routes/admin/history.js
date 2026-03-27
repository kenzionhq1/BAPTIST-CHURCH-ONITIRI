const express = require("express");

const { AdminHistorySnapshot } = require("../../models");
const { restoreSnapshotById } = require("../../services/historyService");
const { ok, badRequest } = require("../../utils/http");

const router = express.Router();

router.get("/history", async (req, res, next) => {
  try {
    const limit = Math.min(Number.parseInt(String(req.query.limit || "50"), 10) || 50, 200);
    const snapshots = await AdminHistorySnapshot.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("label createdAt")
      .lean();

    return ok(
      res,
      snapshots.map((s) => ({ id: String(s._id), label: s.label || "", createdAt: s.createdAt })),
    );
  } catch (err) {
    return next(err);
  }
});

router.post("/history/undo", async (req, res, next) => {
  try {
    const snapshots = await AdminHistorySnapshot.find({})
      .sort({ createdAt: -1 })
      .limit(2)
      .select("_id label createdAt")
      .lean();

    if (snapshots.length < 2) {
      return badRequest(res, "Nothing to undo (need at least 2 snapshots)");
    }

    const target = snapshots[1];
    await restoreSnapshotById(target._id);
    return ok(res, { restoredTo: { id: String(target._id), label: target.label || "", createdAt: target.createdAt } });
  } catch (err) {
    return next(err);
  }
});

router.post("/history/restore/:id", async (req, res, next) => {
  try {
    const snapshotId = (req.params.id || "").toString().trim();
    const snapshot = await restoreSnapshotById(snapshotId);

    return ok(res, {
      restoredTo: { id: String(snapshot._id), label: snapshot.label || "", createdAt: snapshot.createdAt },
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
