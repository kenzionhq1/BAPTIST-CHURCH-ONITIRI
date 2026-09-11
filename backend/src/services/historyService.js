const { supabase } = require("../config/supabase");

async function cleanupOldSnapshots() {
  if (!supabase) return;
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  await supabase.from("admin_history_snapshots").delete().lt("created_at", cutoff);
}

async function createSnapshot(label) {
  if (!supabase) return { id: "offline" };

  try {
    const [itemsRes, featuredRes, hiddenRes] = await Promise.all([
      supabase.from("admin_items").select("*"),
      supabase.from("featured_sermons").select("*"),
      supabase.from("hidden_entities").select("*"),
    ]);

    const snapshotData = {
      label: label || "",
      items: itemsRes.data || [],
      featuredSermon: (featuredRes.data && featuredRes.data[0]) || null,
      hiddenEntities: hiddenRes.data || [],
    };

    const { data, error } = await supabase
      .from("admin_history_snapshots")
      .insert([{ snapshot_data: snapshotData }])
      .select("id")
      .single();

    if (error) {
      console.error("Error creating snapshot in Supabase:", error.message);
      return { id: "error" };
    }

    await cleanupOldSnapshots();
    return data;
  } catch (err) {
    console.error("Error creating history snapshot:", err.message);
    return { id: "error" };
  }
}

async function restoreSnapshotById(snapshotId) {
  if (!supabase) throw new Error("Supabase is not configured");

  const { data: snapshot, error } = await supabase
    .from("admin_history_snapshots")
    .select("*")
    .eq("id", snapshotId)
    .single();

  if (error || !snapshot) {
    const err = new Error("Snapshot not found");
    err.statusCode = 404;
    throw err;
  }

  const snapshotData = snapshot.snapshot_data || {};
  const items = Array.isArray(snapshotData.items) ? snapshotData.items : [];
  const hiddenEntities = Array.isArray(snapshotData.hiddenEntities) ? snapshotData.hiddenEntities : [];
  const featuredSermon = snapshotData.featuredSermon;

  await Promise.all([
    supabase.from("admin_items").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
    supabase.from("hidden_entities").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
    supabase.from("featured_sermons").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
  ]);

  if (items.length > 0) await supabase.from("admin_items").insert(items);
  if (hiddenEntities.length > 0) await supabase.from("hidden_entities").insert(hiddenEntities);
  if (featuredSermon) await supabase.from("featured_sermons").insert([featuredSermon]);

  return snapshot;
}

module.exports = {
  createSnapshot,
  restoreSnapshotById,
};
