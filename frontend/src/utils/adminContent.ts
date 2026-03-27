import { events, featuredSermon as defaultFeaturedSermon, resources, sermons } from "./data";

export type AdminCategory = "sermon" | "event" | "resource";
export type EventPlacement = "upcoming" | "past";

export type AdminItem = {
  id: string;
  title: string;
  date: string;
  category: AdminCategory;
  link: string;
  coverImageLink?: string;
  fileName: string;
  fileDataUrl: string;
  galleryLinks?: string[];
  galleryFileDataUrls?: string[];
  speaker: string;
  eventTime: string;
  summary: string;
  eventPlacement?: EventPlacement;
  entityId?: string;
  createdAt: number;
};

export type FeaturedSermonConfig = {
  title: string;
  date: string;
  speaker: string;
  embed: string;
};

export type AdminHistoryEntry = {
  id: string;
  label: string;
  createdAt: number;
  items: AdminItem[];
  featuredSermon: FeaturedSermonConfig;
  hiddenEntities?: HiddenEntities;
};

export type ManagedEvent = {
  id: string;
  name: string;
  date: string;
  time: string;
  summary: string;
  cover: string;
  gallery: string[];
  link?: string;
  coverImageLink?: string;
  placement: EventPlacement;
  source: "default" | "admin";
  adminItemId?: string;
};

export type ManagedSermon = {
  id: number;
  title: string;
  date: string;
  speaker: string;
  category: string;
  image: string;
  link: string;
  source: "default" | "admin";
  entityId: string;
  adminItemId?: string;
};

export type ManagedResource = {
  title: string;
  date: string;
  file: string;
  source: "default" | "admin";
  entityId: string;
  adminItemId?: string;
};

export type HiddenEntities = Record<AdminCategory, string[]>;

type AdminInput = Omit<AdminItem, "id" | "createdAt">;

const STORAGE_KEY = "bco_admin_content_v2";
const LEGACY_STORAGE_KEY = "bco_admin_content_v1";
const FEATURED_STORAGE_KEY = "bco_featured_sermon_v1";
const HISTORY_STORAGE_KEY = "bco_admin_history_v1";
const HIDDEN_STORAGE_KEY = "bco_hidden_entities_v1";
const HISTORY_LIMIT = 30;
const DEFAULT_SERMON_SPEAKER = "Rev'd Dr. A.A. Ajuwon";

const isBrowser = typeof window !== "undefined";

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const parseDateValue = (value: string): number => {
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

const toDisplayDate = (value: string): string => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = parseDateValue(value);
    if (!parsed) {
      return value;
    }

    return new Date(parsed).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }

  return value;
};

export const toDateInputValue = (value: string): string => {
  if (!value) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parsed = parseDateValue(value);
  if (!parsed) {
    return "";
  }

  return new Date(parsed).toISOString().slice(0, 10);
};

const getYoutubeEmbed = (url: string): string | null => {
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  const short = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (short?.[1]) {
    return `https://www.youtube.com/embed/${short[1]}`;
  }

  const full = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (full?.[1]) {
    return `https://www.youtube.com/embed/${full[1]}`;
  }

  const embed = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/);
  if (embed?.[1]) {
    return trimmed;
  }

  return null;
};

const getFacebookPluginUrl = (url: string): string | null => {
  const trimmed = url.trim();
  if (!trimmed.includes("facebook.com")) {
    return null;
  }

  if (trimmed.includes("/plugins/video.php")) {
    return trimmed;
  }

  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
    trimmed
  )}&show_text=false&autoplay=false`;
};

export const toEmbedVideoUrl = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed) {
    return "";
  }

  return getYoutubeEmbed(trimmed) || getFacebookPluginUrl(trimmed) || trimmed;
};

export const toPublicVideoUrl = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed) {
    return "";
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.pathname.includes("/plugins/video.php")) {
      const href = parsed.searchParams.get("href");
      return href ? decodeURIComponent(href) : trimmed;
    }
  } catch {
    return trimmed;
  }

  return trimmed;
};

export const appendAutoplayToEmbedUrl = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed) {
    return "";
  }

  const queryConnector = trimmed.includes("?") ? "&" : "?";

  if (trimmed.includes("youtube.com/embed/")) {
    return `${trimmed}${queryConnector}autoplay=1`;
  }

  if (trimmed.includes("facebook.com/plugins/video.php")) {
    return `${trimmed}${queryConnector}autoplay=true`;
  }

  return `${trimmed}${queryConnector}autoplay=1`;
};

const migrateLegacyItems = (): AdminItem[] => {
  if (!isBrowser) {
    return [];
  }

  const legacy = safeParse<AdminItem[]>(window.localStorage.getItem(LEGACY_STORAGE_KEY), []);
  return Array.isArray(legacy) ? legacy : [];
};

export const getAdminItems = (): AdminItem[] => {
  if (!isBrowser) {
    return [];
  }

  const current = safeParse<AdminItem[]>(window.localStorage.getItem(STORAGE_KEY), []);
  const normalized = Array.isArray(current) ? current : [];

  if (normalized.length > 0) {
    return normalized.sort((a, b) => b.createdAt - a.createdAt);
  }

  const legacy = migrateLegacyItems();
  if (legacy.length > 0) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
    return legacy.sort((a, b) => b.createdAt - a.createdAt);
  }

  return [];
};

export const saveAdminItems = (items: AdminItem[]) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const normalizeHiddenEntities = (value: Partial<HiddenEntities> | null | undefined): HiddenEntities => ({
  sermon: Array.isArray(value?.sermon) ? value.sermon.filter((entry) => typeof entry === "string") : [],
  event: Array.isArray(value?.event) ? value.event.filter((entry) => typeof entry === "string") : [],
  resource: Array.isArray(value?.resource) ? value.resource.filter((entry) => typeof entry === "string") : []
});

const saveHiddenEntities = (value: HiddenEntities) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(HIDDEN_STORAGE_KEY, JSON.stringify(value));
};

export const getHiddenEntities = (): HiddenEntities => {
  if (!isBrowser) {
    return normalizeHiddenEntities(null);
  }

  const parsed = safeParse<Partial<HiddenEntities>>(
    window.localStorage.getItem(HIDDEN_STORAGE_KEY),
    normalizeHiddenEntities(null)
  );
  return normalizeHiddenEntities(parsed);
};

const isEntityHidden = (hidden: HiddenEntities, category: AdminCategory, entityId: string): boolean =>
  hidden[category].includes(entityId);

const saveAdminHistory = (entries: AdminHistoryEntry[]) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entries));
};

export const getAdminHistory = (): AdminHistoryEntry[] => {
  if (!isBrowser) {
    return [];
  }

  const parsed = safeParse<AdminHistoryEntry[]>(window.localStorage.getItem(HISTORY_STORAGE_KEY), []);
  return Array.isArray(parsed) ? parsed : [];
};

const pushAdminHistory = (label: string) => {
  if (!isBrowser) {
    return;
  }

  const snapshot: AdminHistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    createdAt: Date.now(),
    items: getAdminItems(),
    featuredSermon: getFeaturedSermon(),
    hiddenEntities: getHiddenEntities()
  };

  const next = [snapshot, ...getAdminHistory()].slice(0, HISTORY_LIMIT);
  saveAdminHistory(next);
};

export const restoreAdminHistoryEntry = (id: string): boolean => {
  if (!isBrowser) {
    return false;
  }

  const entries = getAdminHistory();
  const target = entries.find((entry) => entry.id === id);
  if (!target) {
    return false;
  }

  saveAdminItems(target.items);
  window.localStorage.setItem(FEATURED_STORAGE_KEY, JSON.stringify(target.featuredSermon));
  saveHiddenEntities(normalizeHiddenEntities(target.hiddenEntities));
  saveAdminHistory(entries.filter((entry) => entry.id !== id));
  return true;
};

export const undoLastAdminChange = (): boolean => {
  const latest = getAdminHistory()[0];
  return latest ? restoreAdminHistoryEntry(latest.id) : false;
};

export const addAdminItem = (payload: AdminInput): AdminItem => {
  pushAdminHistory(`Saved ${payload.category}: ${payload.title || "Untitled"}`);

  const next: AdminItem = {
    ...payload,
    coverImageLink: payload.coverImageLink?.trim() || "",
    galleryLinks: (payload.galleryLinks || []).filter((entry) => entry.trim().length > 0),
    galleryFileDataUrls: (payload.galleryFileDataUrls || []).filter((entry) => entry.trim().length > 0),
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now()
  };

  const existing = getAdminItems();
  saveAdminItems([next, ...existing]);
  return next;
};

export const upsertEventItem = (payload: AdminInput, entityId?: string): AdminItem => {
  const existing = getAdminItems();
  const derivedAdminId = entityId?.startsWith("admin-") ? entityId.replace("admin-", "") : null;
  const matchIndex = existing.findIndex(
    (item) =>
      item.category === "event" &&
      ((entityId ? item.entityId === entityId || item.id === entityId : false) ||
        (derivedAdminId ? item.id === derivedAdminId : false))
  );

  const previous = matchIndex >= 0 ? existing[matchIndex] : null;
  pushAdminHistory(
    previous
      ? `Updated event: ${payload.title || previous.title || "Untitled Event"}`
      : `Saved event: ${payload.title || "Untitled Event"}`
  );
  const normalizedGalleryLinks = (payload.galleryLinks || []).filter((entry) => entry.trim().length > 0);
  const normalizedGalleryFileDataUrls = (payload.galleryFileDataUrls || []).filter(
    (entry) => entry.trim().length > 0
  );
  const next: AdminItem = {
    ...payload,
    coverImageLink: payload.coverImageLink?.trim() || previous?.coverImageLink || "",
    galleryLinks: normalizedGalleryLinks,
    galleryFileDataUrls: normalizedGalleryFileDataUrls,
    id: previous?.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    entityId,
    createdAt: previous?.createdAt || Date.now()
  };

  if (!next.fileDataUrl && previous?.fileDataUrl) {
    next.fileDataUrl = previous.fileDataUrl;
    next.fileName = previous.fileName;
  }

  const updated = [...existing];
  if (matchIndex >= 0) {
    updated[matchIndex] = next;
  } else {
    updated.unshift(next);
  }

  saveAdminItems(updated);
  return next;
};

export const upsertSermonItem = (payload: AdminInput, entityId?: string): AdminItem => {
  const existing = getAdminItems();
  const derivedAdminId = entityId?.startsWith("admin-sermon-")
    ? entityId.replace("admin-sermon-", "")
    : entityId?.startsWith("admin-")
      ? entityId.replace("admin-", "")
      : null;
  const matchIndex = existing.findIndex(
    (item) =>
      item.category === "sermon" &&
      ((entityId ? item.entityId === entityId || item.id === entityId : false) ||
        (derivedAdminId ? item.id === derivedAdminId : false))
  );

  const previous = matchIndex >= 0 ? existing[matchIndex] : null;
  pushAdminHistory(
    previous
      ? `Updated sermon: ${payload.title || previous.title || "Untitled Sermon"}`
      : `Saved sermon: ${payload.title || "Untitled Sermon"}`
  );

  const next: AdminItem = {
    ...payload,
    coverImageLink: payload.coverImageLink?.trim() || previous?.coverImageLink || "",
    galleryLinks: [],
    galleryFileDataUrls: [],
    id: previous?.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    entityId,
    createdAt: previous?.createdAt || Date.now()
  };

  if (!next.fileDataUrl && previous?.fileDataUrl) {
    next.fileDataUrl = previous.fileDataUrl;
    next.fileName = previous.fileName;
  }

  const updated = [...existing];
  if (matchIndex >= 0) {
    updated[matchIndex] = next;
  } else {
    updated.unshift(next);
  }

  saveAdminItems(updated);
  return next;
};

export const deleteManagedContent = (category: AdminCategory, entityId: string): boolean => {
  const existing = getAdminItems();
  const next = existing.filter((item) => {
    if (item.category !== category) {
      return true;
    }

    const possibleEntityIds = [
      item.entityId,
      item.id,
      `admin-${item.id}`,
      `admin-sermon-${item.id}`,
      `admin-resource-${item.id}`
    ].filter(Boolean) as string[];

    return !possibleEntityIds.includes(entityId);
  });

  const removedAdminCount = existing.length - next.length;
  const hidden = getHiddenEntities();
  const shouldHideDefault = !entityId.startsWith("admin-");
  const alreadyHidden = isEntityHidden(hidden, category, entityId);

  if (removedAdminCount === 0 && (!shouldHideDefault || alreadyHidden)) {
    return false;
  }

  pushAdminHistory(`Deleted ${category}: ${entityId}`);

  if (removedAdminCount > 0) {
    saveAdminItems(next);
  }

  if (shouldHideDefault && !alreadyHidden) {
    const updatedHidden = normalizeHiddenEntities(hidden);
    updatedHidden[category] = [...updatedHidden[category], entityId];
    saveHiddenEntities(updatedHidden);
  }

  return true;
};

export const removeAdminItem = (id: string) => {
  const target = getAdminItems().find((item) => item.id === id);
  if (target) {
    pushAdminHistory(`Deleted ${target.category}: ${target.title || "Untitled"}`);
  }

  const next = getAdminItems().filter((item) => item.id !== id);
  saveAdminItems(next);
};

export const clearAdminItems = () => {
  if (getAdminItems().length > 0) {
    pushAdminHistory("Cleared all admin items");
  }

  saveAdminItems([]);
};

export const fileToDataUrl = (
  file: File,
  onProgress?: (value: { loaded: number; total: number }) => void
): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.onprogress = (event) => {
      if (!onProgress || !event.lengthComputable) {
        return;
      }
      onProgress({ loaded: event.loaded, total: event.total });
    };
    reader.readAsDataURL(file);
  });

const inferPlacement = (date: string): EventPlacement => {
  const when = parseDateValue(date);
  if (!when) {
    return "upcoming";
  }

  return when < Date.now() ? "past" : "upcoming";
};

const sortEvents = (a: ManagedEvent, b: ManagedEvent): number => {
  if (a.placement !== b.placement) {
    return a.placement === "upcoming" ? -1 : 1;
  }

  const timeA = parseDateValue(a.date);
  const timeB = parseDateValue(b.date);
  return timeB - timeA;
};

const sortSermons = (a: ManagedSermon, b: ManagedSermon): number => {
  const timeA = parseDateValue(a.date);
  const timeB = parseDateValue(b.date);
  return timeB - timeA;
};

export const getMergedSermons = (): ManagedSermon[] => {
  const hidden = getHiddenEntities();
  const sermonMap = new Map<string, ManagedSermon>();

  sermons.forEach((sermon, index) => {
    const sermonId = typeof sermon.id === "number" ? sermon.id : index + 1;
    const entityId = `sermon-${sermonId}`;
    if (isEntityHidden(hidden, "sermon", entityId)) {
      return;
    }
    sermonMap.set(entityId, {
      id: sermonId,
      title: sermon.title || `Sermon ${sermonId}`,
      date: toDisplayDate(sermon.date || ""),
      speaker: sermon.speaker || DEFAULT_SERMON_SPEAKER,
      category: sermon.category || "faith",
      image: sermon.image || "/sermon-hero.jpeg",
      link: sermon.link || "",
      source: "default",
      entityId
    });
  });

  getAdminItems()
    .filter((item) => item.category === "sermon")
    .sort((a, b) => a.createdAt - b.createdAt)
    .forEach((item, index) => {
      const entityId = item.entityId || `admin-sermon-${item.id}`;
      if (isEntityHidden(hidden, "sermon", entityId)) {
        return;
      }
      const current = sermonMap.get(entityId);
      const stableAdminId = Number.parseInt(item.id, 10);
      sermonMap.set(entityId, {
        id: current?.id || (Number.isFinite(stableAdminId) ? stableAdminId : 100000 + index),
        title: item.title || current?.title || "Untitled Sermon",
        date: toDisplayDate(item.date || current?.date || ""),
        speaker: item.speaker || current?.speaker || DEFAULT_SERMON_SPEAKER,
        category: current?.category || "faith",
        image: item.coverImageLink || item.fileDataUrl || current?.image || "/sermon-hero.jpeg",
        link: item.link || current?.link || "",
        source: "admin",
        entityId,
        adminItemId: item.id
      });
    });

  return Array.from(sermonMap.values()).sort(sortSermons);
};

export const getSermonsForAdmin = () =>
  getMergedSermons().map((sermon) => ({
    ...sermon,
    dateInput: toDateInputValue(sermon.date)
  }));

export const getMergedEvents = (): ManagedEvent[] => {
  const hidden = getHiddenEntities();
  const eventMap = new Map<string, ManagedEvent>();

  events.forEach((event) => {
    if (isEntityHidden(hidden, "event", event.id)) {
      return;
    }

    eventMap.set(event.id, {
      ...event,
      link: "",
      coverImageLink: event.cover?.startsWith("http") ? event.cover : "",
      placement: inferPlacement(event.date),
      source: "default"
    });
  });

  getAdminItems()
    .filter((item) => item.category === "event")
    .sort((a, b) => a.createdAt - b.createdAt)
    .forEach((item) => {
      const eventId = item.entityId || `admin-${item.id}`;
      if (isEntityHidden(hidden, "event", eventId)) {
        return;
      }
      const current = eventMap.get(eventId);
      const legacyCoverLink = item.link.trim().match(/\.(jpg|jpeg|png|webp|gif|avif|svg)(\?.*)?$/i)
        ? item.link.trim()
        : "";
      const cover = item.coverImageLink || item.fileDataUrl || legacyCoverLink || current?.cover || "/event.jpg";
      const coverImageLink =
        item.coverImageLink?.trim() || current?.coverImageLink || (current?.cover?.startsWith("http") ? current.cover : "");
      const hasGalleryOverride =
        item.galleryLinks !== undefined || item.galleryFileDataUrls !== undefined;
      const inheritedGallery = hasGalleryOverride ? [] : current?.gallery || [];
      const galleryFromFiles = item.galleryFileDataUrls || [];
      const galleryFromLinks = item.galleryLinks || [];
      const nextGallery = Array.from(
        new Set(
          [cover, ...inheritedGallery, ...galleryFromFiles, ...galleryFromLinks].filter(
            (entry) => entry.trim().length > 0
          )
        )
      );

      eventMap.set(eventId, {
        id: eventId,
        name: item.title || current?.name || "Untitled Event",
        date: toDisplayDate(item.date || current?.date || ""),
        time: item.eventTime || current?.time || "Time to be announced",
        summary: item.summary || current?.summary || "More details coming soon.",
        cover,
        gallery: nextGallery,
        link: item.link || current?.link || "",
        coverImageLink,
        placement: item.eventPlacement || current?.placement || inferPlacement(item.date),
        source: "admin",
        adminItemId: item.id
      });
    });

  return Array.from(eventMap.values()).sort(sortEvents);
};

export const getEventsForAdmin = () =>
  getMergedEvents().map((event) => ({
    ...event,
    dateInput: toDateInputValue(event.date)
  }));

const sortResources = (a: ManagedResource, b: ManagedResource): number => {
  const timeA = parseDateValue(a.date);
  const timeB = parseDateValue(b.date);
  return timeB - timeA;
};

export const getMergedResources = (): ManagedResource[] => {
  const hidden = getHiddenEntities();
  const resourceMap = new Map<string, ManagedResource>();

  resources.forEach((resource, index) => {
    const entityId = `resource-${index + 1}`;
    if (isEntityHidden(hidden, "resource", entityId)) {
      return;
    }

    resourceMap.set(entityId, {
      title: resource.title,
      date: toDisplayDate(resource.date),
      file: resource.file,
      source: "default",
      entityId
    });
  });

  getAdminItems()
    .filter((item) => item.category === "resource")
    .sort((a, b) => a.createdAt - b.createdAt)
    .forEach((item) => {
      const entityId = item.entityId || `admin-resource-${item.id}`;
      if (isEntityHidden(hidden, "resource", entityId)) {
        return;
      }

      const current = resourceMap.get(entityId);
      resourceMap.set(entityId, {
        title: item.title || current?.title || "Untitled Resource",
        date: toDisplayDate(item.date || current?.date || ""),
        file: item.fileDataUrl || item.link || current?.file || "/mistake.pdf",
        source: "admin",
        entityId,
        adminItemId: item.id
      });
    });

  return Array.from(resourceMap.values()).sort(sortResources);
};

export const getResourcesForAdmin = () =>
  getMergedResources().map((resource) => ({
    ...resource,
    dateInput: toDateInputValue(resource.date)
  }));

export const getFeaturedSermon = (): FeaturedSermonConfig => {
  if (!isBrowser) {
    return defaultFeaturedSermon;
  }

  const stored = safeParse<FeaturedSermonConfig | null>(
    window.localStorage.getItem(FEATURED_STORAGE_KEY),
    null
  );

  if (!stored || !stored.embed) {
    return defaultFeaturedSermon;
  }

  return {
    title: stored.title || defaultFeaturedSermon.title,
    date: stored.date || defaultFeaturedSermon.date,
    speaker: stored.speaker || defaultFeaturedSermon.speaker,
    embed: stored.embed
  };
};

export const saveFeaturedSermon = (payload: FeaturedSermonConfig) => {
  if (!isBrowser) {
    return;
  }

  const current = getFeaturedSermon();
  const changed =
    current.title !== payload.title ||
    current.date !== payload.date ||
    current.speaker !== payload.speaker ||
    current.embed !== payload.embed;

  if (changed) {
    pushAdminHistory(`Updated live sermon: ${payload.title || "Untitled"}`);
  }

  window.localStorage.setItem(FEATURED_STORAGE_KEY, JSON.stringify(payload));
};
