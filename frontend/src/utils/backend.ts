import { apiRequest } from "./api";

export type AdminCategory = "sermon" | "event" | "resource";
export type EventPlacement = "upcoming" | "past";

export type FeaturedSermon = {
  title: string;
  date: string;
  speaker: string;
  embed: string;
};

export type BackendItem = {
  id: string;
  category: AdminCategory;
  title: string;
  date: string;
  link: string;
  coverImageLink: string;
  fileName: string;
  fileUrl: string;
  galleryLinks: string[];
  galleryFileUrls: string[];
  speaker: string;
  eventTime: string;
  summary: string;
  eventPlacement: EventPlacement;
  entityId: string;
  order?: number;
  isDefault?: boolean;
  cover?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminView = {
  itemsByCategory: {
    sermon: BackendItem[];
    event: BackendItem[];
    resource: BackendItem[];
  };
  featuredSermon?: FeaturedSermon | null;
  hiddenEntities?: Array<{ category: AdminCategory; entityId: string }>;
};

export type AdminHistoryEntry = {
  id: string;
  label: string;
  createdAt: string;
};

export type PublicEvent = {
  id: string;
  name: string;
  date: string;
  time: string;
  summary: string;
  cover: string;
  gallery: string[];
  placement: EventPlacement;
  link: string;
  coverImageLink: string;
  source: "default" | "admin";
};

export type PublicSermon = {
  id: string;
  title: string;
  date: string;
  speaker: string;
  category: string;
  image: string;
  link: string;
  source: "default" | "admin";
};

export type PublicResource = {
  id: string;
  title: string;
  date: string;
  file: string;
  source: "default" | "admin";
};

const isObjectId = (value: string) => /^[a-f\d]{24}$/i.test(value);
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? "http://localhost:4000" : "https://baptist-church-onitiri.onrender.com");

const normalizeAssetUrl = (value: string) => {
  if (!value) return "";
  if (value.startsWith("data:") || value.startsWith("blob:")) return value;

  if (value.startsWith("http://") || value.startsWith("https://")) {
    if (API_BASE && value.includes("/uploads/")) {
      try {
        const parsed = new URL(value);
        const api = new URL(API_BASE);
        if (parsed.host !== api.host) {
          return `${API_BASE.replace(/\/$/, "")}${parsed.pathname}`;
        }
      } catch {
        return value;
      }
    }
    return value;
  }

  if (value.startsWith("/uploads/") && API_BASE) {
    return `${API_BASE.replace(/\/$/, "")}${value}`;
  }
  if (value.startsWith("uploads/") && API_BASE) {
    return `${API_BASE.replace(/\/$/, "")}/${value}`;
  }

  return value;
};

const inferPlacement = (date: string): EventPlacement => {
  const parsed = new Date(date).getTime();
  if (Number.isNaN(parsed)) {
    return "upcoming";
  }
  return parsed < Date.now() ? "past" : "upcoming";
};

const buildGallery = (item: BackendItem) => {
  const merged = [
    item.cover || "",
    item.coverImageLink || "",
    item.fileUrl || "",
    ...(item.galleryFileUrls || []),
    ...(item.galleryLinks || [])
  ].filter((entry) => typeof entry === "string" && entry.trim().length > 0);

  return Array.from(new Set(merged.map((entry) => normalizeAssetUrl(entry))));
};

const buildCover = (item: BackendItem) =>
  normalizeAssetUrl(item.cover || item.coverImageLink || item.fileUrl || "/event.jpg");

const buildSermonImage = (item: BackendItem) =>
  normalizeAssetUrl(item.coverImageLink || item.fileUrl || item.cover || "/sermon-hero.jpeg");

const getSource = (item: BackendItem): "default" | "admin" => (isObjectId(item.id) ? "admin" : "default");

export const toPublicEvent = (item: BackendItem): PublicEvent => ({
  id: item.id,
  name: item.title || "Untitled Event",
  date: item.date || "",
  time: item.eventTime || "",
  summary: item.summary || "",
  cover: buildCover(item),
  gallery: buildGallery(item),
  placement: item.eventPlacement || inferPlacement(item.date),
  link: item.link || "",
  coverImageLink: item.coverImageLink || "",
  source: getSource(item)
});

export const toPublicSermon = (item: BackendItem): PublicSermon => ({
  id: item.id,
  title: item.title || "Untitled Sermon",
  date: item.date || "",
  speaker: item.speaker || "",
  category: item.category || "faith",
  image: buildSermonImage(item),
  link: item.link || "",
  source: getSource(item)
});

export const toPublicResource = (item: BackendItem): PublicResource => ({
  id: item.id,
  title: item.title || "Untitled Resource",
  date: item.date || "",
  file: normalizeAssetUrl(item.fileUrl || "") || item.link || "",
  source: getSource(item)
});

export const fetchPublicSermons = async () => {
  const response = await apiRequest<BackendItem[]>("/public/sermons");
  const items = response.data.map(toPublicSermon);
  const featured = (response.meta?.featuredSermon || null) as FeaturedSermon | null;
  return { items, featured };
};

export const fetchPublicEvents = async () => {
  const response = await apiRequest<BackendItem[]>("/public/events");
  return response.data.map(toPublicEvent);
};

export const fetchPublicResources = async () => {
  const response = await apiRequest<BackendItem[]>("/public/resources");
  return response.data.map(toPublicResource);
};

export const fetchAdminView = async () => {
  const response = await apiRequest<AdminView>("/admin/items", { method: "GET" }, { admin: true });
  return response.data;
};

export const fetchAdminHistory = async () => {
  const response = await apiRequest<AdminHistoryEntry[]>("/admin/history?limit=50", { method: "GET" }, { admin: true });
  return response.data;
};

export const undoAdminHistory = async () => {
  await apiRequest("/admin/history/undo", { method: "POST" }, { admin: true });
};

export const restoreAdminHistory = async (id: string) => {
  await apiRequest(`/admin/history/restore/${id}`, { method: "POST" }, { admin: true });
};

export const saveFeaturedSermon = async (payload: FeaturedSermon) => {
  const response = await apiRequest<FeaturedSermon>(
    "/admin/featured-sermon",
    {
      method: "PUT",
      body: payload
    },
    { admin: true }
  );
  return response.data;
};

export const uploadFiles = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const response = await apiRequest<{ fileUrl: string; fileName: string; files?: Array<{ fileUrl: string; fileName: string }> }>(
    "/admin/uploads",
    {
      method: "POST",
      body: formData
    },
    { admin: true }
  );

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files;
  }

  return [{ fileUrl: response.data.fileUrl, fileName: response.data.fileName }];
};

export const createAdminItem = async (payload: Partial<BackendItem> & { category: AdminCategory }) => {
  const response = await apiRequest<BackendItem>(
    "/admin/items",
    {
      method: "POST",
      body: payload
    },
    { admin: true }
  );
  return response.data;
};

export const updateAdminItem = async (
  id: string,
  payload: Partial<BackendItem> & { category?: AdminCategory }
) => {
  const response = await apiRequest<BackendItem>(
    `/admin/items/${id}`,
    {
      method: "PUT",
      body: payload
    },
    { admin: true }
  );
  return response.data;
};

export const deleteAdminItem = async (id: string, category: AdminCategory) => {
  const query = isObjectId(id) ? "" : `?category=${category}`;
  await apiRequest(`/admin/items/${id}${query}`, { method: "DELETE" }, { admin: true });
};

export const clearAdminItems = async (items: BackendItem[]) => {
  const adminItems = items.filter((item) => isObjectId(item.id));
  for (const item of adminItems) {
    await deleteAdminItem(item.id, item.category);
  }
};

export const isAdminObjectId = isObjectId;
