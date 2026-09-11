const express = require("express");

const { supabase } = require("../../config/supabase");
const { createSnapshot } = require("../../services/historyService");
const { cleanupCloudinaryUrls } = require("../../utils/cloudinary");
const { getAdminView, getMergedItemsByCategory } = require("../../services/mergeService");
const { validateAdminItem, isNonEmptyString } = require("../../utils/validation");
const { ok, badRequest } = require("../../utils/http");

const router = express.Router();

const VALID_CATEGORIES = ["sermon", "event", "resource"];

function toDbFields(payload) {
  const fields = {};
  if (payload.category !== undefined) fields.category = payload.category;
  if (payload.entityId !== undefined) fields.entity_id = payload.entityId;
  if (payload.title !== undefined) fields.title = payload.title;
  if (payload.date !== undefined) fields.date = payload.date;
  if (payload.link !== undefined) fields.link = payload.link;
  if (payload.coverImageLink !== undefined) fields.cover_image_link = payload.coverImageLink;
  if (payload.fileName !== undefined) fields.file_name = payload.fileName;
  if (payload.fileUrl !== undefined) fields.file_url = payload.fileUrl;
  if (payload.galleryLinks !== undefined) fields.gallery_links = payload.galleryLinks;
  if (payload.galleryFileUrls !== undefined) fields.gallery_file_urls = payload.galleryFileUrls;
  if (payload.speaker !== undefined) fields.speaker = payload.speaker;
  if (payload.eventTime !== undefined) fields.event_time = payload.eventTime;
  if (payload.summary !== undefined) fields.summary = payload.summary;
  if (payload.eventPlacement !== undefined) fields.event_placement = payload.eventPlacement;
  if (payload.order !== undefined) fields.order_num = payload.order;
  if (payload.isDeleted !== undefined) fields.is_deleted = payload.isDeleted;
  fields.updated_at = new Date().toISOString();
  return fields;
}

function toItemResponse(item) {
  if (!item) return null;
  return {
    id: String(item.id),
    category: item.category || "",
    title: item.title || "",
    date: item.date || "",
    link: item.link || "",
    coverImageLink: item.cover_image_link || "",
    fileName: item.file_name || "",
    fileUrl: item.file_url || "",
    galleryLinks: Array.isArray(item.gallery_links) ? item.gallery_links : [],
    galleryFileUrls: Array.isArray(item.gallery_file_urls) ? item.gallery_file_urls : [],
    speaker: item.speaker || "",
    eventTime: item.event_time || "",
    summary: item.summary || "",
    eventPlacement: item.event_placement || "",
    entityId: item.entity_id || "",
    order: typeof item.order_num === "number" ? item.order_num : 0,
    isDefault: Boolean(item.entity_id),
    cover: item.cover_image_link || item.file_url || "",
    createdAt: item.created_at || null,
    updatedAt: item.updated_at || null,
  };
}

async function assignOrderForNewItem(category, position) {
  if (!supabase) return 0;
  const { data } = await supabase
    .from("admin_items")
    .select("order_num")
    .eq("category", category)
    .eq("is_deleted", false);

  if (!data || data.length === 0) return 0;

  const orders = data.map((item) => item.order_num || 0);
  const maxOrder = Math.max(...orders);
  const minOrder = Math.min(...orders);

  return position === "top" ? maxOrder + 1 : minOrder - 1;
}

function collectCloudinaryUrls(item) {
  if (!item) return [];
  return [
    item.cover_image_link || item.coverImageLink,
    item.file_url || item.fileUrl,
    ...(item.gallery_links || item.galleryLinks || []),
    ...(item.gallery_file_urls || item.galleryFileUrls || []),
  ].filter((entry) => typeof entry === "string" && entry.trim().length > 0);
}

async function unhideDefault(category, entityId) {
  if (!supabase || !category || !entityId) return;
  await supabase.from("hidden_entities").delete().eq("category", category).eq("entity_id", entityId);
}

router.get("/items", async (req, res, next) => {
  try {
    const category = (req.query.category || "").toString().trim();
    if (category) {
      if (!VALID_CATEGORIES.includes(category)) {
        return badRequest(res, "Invalid category", { category });
      }
      const items = await getMergedItemsByCategory(category);
      return ok(res, { category, items });
    }

    const view = await getAdminView();
    return ok(res, view);
  } catch (err) {
    return next(err);
  }
});

router.post("/items", async (req, res, next) => {
  try {
    if (!supabase) return badRequest(res, "Supabase client is not configured");

    const body = req.body || {};
    const category = (body.category || "").toString().trim();
    if (!VALID_CATEGORIES.includes(category)) {
      return badRequest(res, "Invalid category", { category });
    }

    const entityId = (body.entityId || "").toString().trim();
    const position = (body.position || "bottom").toString().trim();

    let doc;
    if (entityId) {
      const { data: existingList } = await supabase
        .from("admin_items")
        .select("*")
        .eq("category", category)
        .eq("entity_id", entityId)
        .limit(1);

      const existing = existingList && existingList[0];
      const payload = {
        category,
        entityId,
        title: body.title || existing?.title || "",
        date: body.date || existing?.date || "",
        link: body.link || existing?.link || "",
        coverImageLink: body.coverImageLink !== undefined ? body.coverImageLink : existing?.cover_image_link || "",
        fileName: body.fileName !== undefined ? body.fileName : existing?.file_name || "",
        fileUrl: body.fileUrl !== undefined ? body.fileUrl : existing?.file_url || "",
        galleryLinks: body.galleryLinks || existing?.gallery_links || [],
        galleryFileUrls: body.galleryFileUrls || existing?.gallery_file_urls || [],
        speaker: body.speaker || existing?.speaker || "",
        eventTime: body.eventTime || existing?.event_time || "",
        summary: body.summary || existing?.summary || "",
        eventPlacement: body.eventPlacement || existing?.event_placement || "",
        order: body.order !== undefined ? body.order : existing?.order_num || 0,
      };

      const errors = validateAdminItem(category, payload);
      if (errors.length > 0) return badRequest(res, "Validation failed", { errors });

      const dbFields = toDbFields(payload);

      if (existing) {
        const { data } = await supabase.from("admin_items").update(dbFields).eq("id", existing.id).select("*").single();
        doc = data;
      } else {
        const { data } = await supabase.from("admin_items").insert([dbFields]).select("*").single();
        doc = data;
      }

      await unhideDefault(category, entityId);
    } else {
      const assignedOrder = body.order !== undefined ? body.order : await assignOrderForNewItem(category, position);
      const payload = {
        category,
        entityId: "",
        title: body.title || "",
        date: body.date || "",
        link: body.link || "",
        coverImageLink: body.coverImageLink || "",
        fileName: body.fileName || "",
        fileUrl: body.fileUrl || "",
        galleryLinks: body.galleryLinks || [],
        galleryFileUrls: body.galleryFileUrls || [],
        speaker: body.speaker || "",
        eventTime: body.eventTime || "",
        summary: body.summary || "",
        eventPlacement: body.eventPlacement || "",
        order: assignedOrder,
      };

      const errors = validateAdminItem(category, payload);
      if (errors.length > 0) return badRequest(res, "Validation failed", { errors });

      const dbFields = toDbFields(payload);
      const { data, error } = await supabase.from("admin_items").insert([dbFields]).select("*").single();
      if (error) throw new Error(error.message);
      doc = data;
    }

    const snapshot = await createSnapshot(`create:${category}`);
    return res.status(201).json({
      ok: true,
      data: toItemResponse(doc),
      meta: { snapshotId: String(snapshot ? snapshot.id : "") },
    });
  } catch (err) {
    return next(err);
  }
});

router.put("/items/:id", async (req, res, next) => {
  try {
    if (!supabase) return badRequest(res, "Supabase client is not configured");

    const body = req.body || {};
    const id = (req.params.id || "").toString().trim();

    let existing = null;
    if (id.includes("-")) {
      const { data } = await supabase.from("admin_items").select("*").eq("id", id).single();
      if (data) existing = data;
    }

    if (existing) {
      const category = existing.category;
      const entityId = existing.entity_id || "";

      const payload = {
        category,
        entityId,
        title: body.title !== undefined ? body.title : existing.title,
        date: body.date !== undefined ? body.date : existing.date,
        link: body.link !== undefined ? body.link : existing.link,
        coverImageLink: body.coverImageLink !== undefined ? body.coverImageLink : existing.cover_image_link,
        fileName: body.fileName !== undefined ? body.fileName : existing.file_name,
        fileUrl: body.fileUrl !== undefined ? body.fileUrl : existing.file_url,
        galleryLinks: body.galleryLinks !== undefined ? body.galleryLinks : existing.gallery_links,
        galleryFileUrls: body.galleryFileUrls !== undefined ? body.galleryFileUrls : existing.gallery_file_urls,
        speaker: body.speaker !== undefined ? body.speaker : existing.speaker,
        eventTime: body.eventTime !== undefined ? body.eventTime : existing.event_time,
        summary: body.summary !== undefined ? body.summary : existing.summary,
        eventPlacement: body.eventPlacement !== undefined ? body.eventPlacement : existing.event_placement,
        order: body.order !== undefined ? body.order : existing.order_num,
      };

      const errors = validateAdminItem(category, payload);
      if (errors.length > 0) return badRequest(res, "Validation failed", { errors });

      const dbFields = toDbFields(payload);
      const { data: updated } = await supabase.from("admin_items").update(dbFields).eq("id", existing.id).select("*").single();

      if (entityId) await unhideDefault(category, entityId);

      const snapshot = await createSnapshot(`update:${category}`);
      return ok(res, toItemResponse(updated), {
        snapshotId: String(snapshot ? snapshot.id : ""),
      });
    }

    // Treat :id as entityId for default override upsert
    const entityId = id;
    const category = (body.category || req.query.category || "").toString().trim();
    if (!VALID_CATEGORIES.includes(category)) {
      return badRequest(res, "Invalid category", { category });
    }

    const { data: existingOverrideList } = await supabase
      .from("admin_items")
      .select("*")
      .eq("category", category)
      .eq("entity_id", entityId)
      .limit(1);

    const existingOverride = existingOverrideList && existingOverrideList[0];

    const payload = {
      category,
      entityId,
      title: body.title !== undefined ? body.title : existingOverride?.title || "",
      date: body.date !== undefined ? body.date : existingOverride?.date || "",
      link: body.link !== undefined ? body.link : existingOverride?.link || "",
      coverImageLink: body.coverImageLink !== undefined ? body.coverImageLink : existingOverride?.cover_image_link || "",
      fileName: body.fileName !== undefined ? body.fileName : existingOverride?.file_name || "",
      fileUrl: body.fileUrl !== undefined ? body.fileUrl : existingOverride?.file_url || "",
      galleryLinks: body.galleryLinks !== undefined ? body.galleryLinks : existingOverride?.gallery_links || [],
      galleryFileUrls: body.galleryFileUrls !== undefined ? body.galleryFileUrls : existingOverride?.gallery_file_urls || [],
      speaker: body.speaker !== undefined ? body.speaker : existingOverride?.speaker || "",
      eventTime: body.eventTime !== undefined ? body.eventTime : existingOverride?.event_time || "",
      summary: body.summary !== undefined ? body.summary : existingOverride?.summary || "",
      eventPlacement: body.eventPlacement !== undefined ? body.eventPlacement : existingOverride?.event_placement || "",
      order: body.order !== undefined ? body.order : existingOverride?.order_num || 0,
    };

    const errors = validateAdminItem(category, payload);
    if (errors.length > 0) return badRequest(res, "Validation failed", { errors });

    const dbFields = toDbFields(payload);
    let updated;
    if (existingOverride) {
      const { data } = await supabase.from("admin_items").update(dbFields).eq("id", existingOverride.id).select("*").single();
      updated = data;
    } else {
      const { data } = await supabase.from("admin_items").insert([dbFields]).select("*").single();
      updated = data;
    }

    await unhideDefault(category, entityId);

    const snapshot = await createSnapshot(`update:${category}`);
    return ok(res, toItemResponse(updated), {
      snapshotId: String(snapshot ? snapshot.id : ""),
    });
  } catch (err) {
    return next(err);
  }
});

router.delete("/items/:id", async (req, res, next) => {
  try {
    if (!supabase) return badRequest(res, "Supabase client is not configured");

    const id = (req.params.id || "").toString().trim();
    const categoryFromReq = (req.query.category || req.body?.category || "").toString().trim();

    let existing = null;
    if (id.includes("-")) {
      const { data } = await supabase.from("admin_items").select("*").eq("id", id).single();
      if (data) existing = data;
    }

    if (existing) {
      const category = existing.category;

      await cleanupCloudinaryUrls(collectCloudinaryUrls(existing));

      if (isNonEmptyString(existing.entity_id)) {
        await supabase.from("hidden_entities").upsert([
          { category, entity_id: existing.entity_id }
        ]);

        const snapshot = await createSnapshot(`hide-default:${category}`);
        return ok(res, { hidden: { category, entityId: existing.entity_id } }, { snapshotId: String(snapshot ? snapshot.id : "") });
      }

      const { data: updated } = await supabase
        .from("admin_items")
        .update({ is_deleted: true, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select("*")
        .single();

      const snapshot = await createSnapshot(`delete:${category}`);
      return ok(
        res,
        { deletedId: String(existing.id), item: toItemResponse(updated) },
        { snapshotId: String(snapshot ? snapshot.id : ""), },
      );
    }

    // Treat :id as entityId for default hide
    const entityId = id;
    const category = categoryFromReq;
    if (!VALID_CATEGORIES.includes(category)) {
      return badRequest(res, "Invalid category (required when hiding default by entityId)", { category });
    }

    await supabase.from("hidden_entities").upsert([
      { category, entity_id: entityId }
    ]);

    const snapshot = await createSnapshot(`hide-default:${category}`);
    return ok(res, { hidden: { category, entityId } }, { snapshotId: String(snapshot ? snapshot.id : "") });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
