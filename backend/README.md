# Baptist Church Onitiri Admin Backend (Node + Express + MongoDB)

This backend replaces the frontend `localStorage` logic for admin items (sermons, events, resources), featured sermon settings, hiding default entries, uploads, and 30‑day history snapshots.

## Setup

1. Copy `.env.example` → `.env` and update values.
2. Install deps: `npm install`
3. Run: `npm start`

Health check: `GET /health`

## Auth (placeholder)

Admin routes use a basic token check:
- If `ADMIN_TOKEN` is **empty**, admin routes are **not protected** (dev mode).
- If `ADMIN_TOKEN` is set, send `Authorization: Bearer <ADMIN_TOKEN>`.

## Default/Seed data merging

This backend supports “default items + admin overrides”:
- Default items are loaded from `src/defaults/defaultData.json` (sample file).
- To use your real frontend seeds, set `DEFAULT_DATA_FILE` to a JSON file with:

```json
{ "items": [ { "category": "sermon|event|resource", "entityId": "seed-id", "...": "..." } ], "featuredSermon": { "...": "..." } }
```

Rules:
- Overrides are stored in MongoDB as `AdminItem` documents with the same `category + entityId`.
- “Deleting” a default item hides it by writing to `HiddenEntity` (does not remove the seed).

## Uploads

`POST /admin/uploads` (multipart/form-data)
- Accepts one or many files (`file` / `files` / any field names).
- Stores to local disk (`UPLOAD_DIR`, default `uploads/`)
- Returns a public URL (served from `/uploads/*`).

## History snapshots (30 days)

On every item create/update/delete (and featured sermon update), the backend stores a full snapshot in `AdminHistorySnapshot` and deletes snapshots older than 30 days.

## Endpoints

### Admin

- `GET /admin/items` → merged admin view (all categories + featuredSermon + hiddenEntities)
- `GET /admin/items?category=sermon|event|resource` → merged items for one category
- `POST /admin/items` → create custom item, or upsert default override if `entityId` is provided
- `PUT /admin/items/:id` → update by Mongo `_id`, or override a default by using `:id = entityId` and sending `category`
- `DELETE /admin/items/:id`
  - If `:id` is a Mongo `_id` and the item is custom → soft delete
  - If `:id` is a Mongo `_id` and the item has `entityId` → hide that default
  - If `:id` is an `entityId` → hide default (requires `?category=...`)

- `GET /admin/featured-sermon`
- `PUT /admin/featured-sermon`

- `GET /admin/history`
- `POST /admin/history/undo` → restores to the previous snapshot (2nd most recent)
- `POST /admin/history/restore/:id` → restores to a specific snapshot

### Public

- `GET /public/sermons` → sermons list; `meta.featuredSermon` included
- `GET /public/events?placement=upcoming|past`
- `GET /public/resources`

## Validation rules

- Sermon: requires `link` + `speaker`
- Event: requires `eventTime` + `summary` + cover (`coverImageLink` or `fileUrl`)
- Resource: requires `fileUrl` or `link`

Event gallery rule:
- On edit, if `galleryLinks`/`galleryFileUrls` are omitted, the previous gallery is kept.

Cover rule:
- Clients should use `coverImageLink` if present, otherwise fall back to `fileUrl` (responses also include `cover`).

## Sample responses

### `GET /admin/items`
```json
{
  "ok": true,
  "data": {
    "itemsByCategory": { "sermon": [], "event": [], "resource": [] },
    "featuredSermon": null,
    "hiddenEntities": []
  }
}
```

### `POST /admin/uploads`
```json
{
  "ok": true,
  "data": {
    "fileName": "flyer.png",
    "storedName": "1711490000000-ab12cd34-flyer.png",
    "mimeType": "image/png",
    "size": 12345,
    "fileUrl": "http://localhost:4000/uploads/1711490000000-ab12cd34-flyer.png"
  }
}
```

