import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CloudUpload,
  History,
  Link2,
  Lock,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Tag,
  Trash2,
  Undo2
} from "lucide-react";
import Hero from "../components/Hero";
import SectionHeader from "../components/common/SectionHeader";
import {
  addAdminItem,
  clearAdminItems,
  deleteManagedContent,
  fileToDataUrl,
  getAdminHistory,
  getEventsForAdmin,
  getFeaturedSermon,
  getAdminItems,
  getResourcesForAdmin,
  getSermonsForAdmin,
  removeAdminItem,
  restoreAdminHistoryEntry,
  saveFeaturedSermon,
  undoLastAdminChange,
  upsertEventItem,
  upsertSermonItem,
  type AdminCategory,
  type AdminHistoryEntry,
  type AdminItem
} from "../utils/adminContent";

type UploadForm = {
  title: string;
  date: string;
  category: AdminCategory | "";
  link: string;
  coverImageLink: string;
  speaker: string;
  eventTime: string;
  summary: string;
  eventPlacement: "upcoming" | "past";
  file?: File | null;
  galleryLinksText: string;
  galleryFiles: File[];
  existingGalleryImages: string[];
};

type StatusMessage = {
  tone: "success" | "error";
  message: string;
} | null;

type EventRecord = ReturnType<typeof getEventsForAdmin>[number];
type SermonRecord = ReturnType<typeof getSermonsForAdmin>[number];
type ResourceRecord = ReturnType<typeof getResourcesForAdmin>[number];

const categoryLabels: Record<AdminCategory, string> = {
  sermon: "Sermon",
  event: "Event",
  resource: "Resource"
};

const AdminPage = () => {
  const [form, setForm] = useState<UploadForm>({
    title: "",
    date: "",
    category: "",
    link: "",
    coverImageLink: "",
    speaker: "",
    eventTime: "",
    summary: "",
    eventPlacement: "upcoming",
    file: null,
    galleryLinksText: "",
    galleryFiles: [],
    existingGalleryImages: []
  });
  const [items, setItems] = useState<AdminItem[]>([]);
  const [historyEntries, setHistoryEntries] = useState<AdminHistoryEntry[]>([]);
  const [status, setStatus] = useState<StatusMessage>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadStage, setUploadStage] = useState("");
  const [galleryConverting, setGalleryConverting] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [summaryCollapsed, setSummaryCollapsed] = useState(false);
  const [eventEditingId, setEventEditingId] = useState<string | null>(null);
  const [sermonEditingId, setSermonEditingId] = useState<string | null>(null);
  const [liveSermon, setLiveSermon] = useState(() => getFeaturedSermon());

  const eventRecords = useMemo(() => getEventsForAdmin(), [items]);
  const sermonRecords = useMemo(() => getSermonsForAdmin(), [items]);
  const resourceRecords = useMemo(() => getResourcesForAdmin(), [items]);
  const upcomingEventRecords = useMemo(
    () => eventRecords.filter((event) => event.placement === "upcoming"),
    [eventRecords]
  );
  const authStorageKey = "bco_admin_auth_v1";
  const adminPasscode =
    import.meta.env.VITE_ADMIN_PASSCODE || (import.meta.env.DEV ? "admin" : "");
  const sessionDurationMs = 12 * 60 * 60 * 1000;

  const refreshItems = () => {
    setItems(getAdminItems());
    setHistoryEntries(getAdminHistory());
  };

  useEffect(() => {
    setItems(getAdminItems());
    setHistoryEntries(getAdminHistory());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const raw = window.localStorage.getItem(authStorageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { token?: string; expiresAt?: number };
        if (parsed?.expiresAt && parsed.expiresAt > Date.now() && parsed.token) {
          setIsAuthorized(true);
        } else {
          window.localStorage.removeItem(authStorageKey);
        }
      } catch {
        window.localStorage.removeItem(authStorageKey);
      }
    }

    setAuthReady(true);
  }, [authStorageKey]);

  const handleChange = (key: keyof UploadForm, value: UploadForm[keyof UploadForm]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAuthSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError("");

    if (!adminPasscode) {
      setAuthError("Missing VITE_ADMIN_PASSCODE. Set it in your .env file.");
      return;
    }

    if (passcode.trim() !== adminPasscode) {
      setAuthError("Incorrect passcode. Please try again.");
      return;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        authStorageKey,
        JSON.stringify({ token: adminPasscode, expiresAt: Date.now() + sessionDurationMs })
      );
    }

    setIsAuthorized(true);
    setPasscode("");
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(authStorageKey);
    }
    setIsAuthorized(false);
  };

  const appendGalleryLinks = (links: string[]) => {
    if (links.length === 0) {
      return;
    }

    setForm((prev) => {
      const existing = prev.galleryLinksText.trim();
      const combined = [existing, ...links].filter((entry) => entry && entry.length > 0).join("\n");
      return {
        ...prev,
        galleryLinksText: combined,
        galleryFiles: []
      };
    });
  };

  const handleGalleryUploads = async (files: File[]) => {
    if (!files.length) {
      handleChange("galleryFiles", []);
      return;
    }

    setGalleryConverting(true);
    try {
      const dataUrls = await Promise.all(files.map((file) => fileToDataUrl(file)));
      appendGalleryLinks(dataUrls);
      setStatus({
        tone: "success",
        message: `${dataUrls.length} gallery image${dataUrls.length === 1 ? "" : "s"} added as link entries.`
      });
      setTimeout(() => setStatus(null), 4000);
    } catch {
      setStatus({ tone: "error", message: "Could not convert gallery uploads. Please try again." });
      setTimeout(() => setStatus(null), 4000);
    } finally {
      setGalleryConverting(false);
    }
  };

  const removeExistingGalleryImage = (src: string) => {
    setForm((prev) => ({
      ...prev,
      existingGalleryImages: prev.existingGalleryImages.filter((entry) => entry !== src)
    }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      date: "",
      category: "",
      link: "",
      coverImageLink: "",
      speaker: "",
      eventTime: "",
      summary: "",
      eventPlacement: "upcoming",
      file: null,
      galleryLinksText: "",
      galleryFiles: [],
      existingGalleryImages: []
    });
    setEventEditingId(null);
    setSermonEditingId(null);
    setUploadProgress(null);
    setUploadStage("");
    setGalleryConverting(false);
  };

  const isSermon = form.category === "sermon";
  const isEvent = form.category === "event";
  const isResource = form.category === "resource";

  const fileAccept = useMemo(() => {
    if (form.category === "resource") {
      return ".pdf,.jpg,.jpeg,.png";
    }

    return ".jpg,.jpeg,.png,.webp";
  }, [form.category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.category) {
      setStatus({ tone: "error", message: "Choose a category before submitting." });
      return;
    }
    const category = form.category as AdminCategory;

    if (isSermon && !form.link.trim()) {
      setStatus({ tone: "error", message: "Sermon uploads need a video link." });
      return;
    }

    if (isSermon && !form.speaker.trim()) {
      setStatus({ tone: "error", message: "Speaker name is required for sermons." });
      return;
    }

    if (isEvent && !form.eventTime.trim()) {
      setStatus({ tone: "error", message: "Event time is required for events." });
      return;
    }

    if (isEvent && !form.summary.trim()) {
      setStatus({ tone: "error", message: "Event summary is required for events." });
      return;
    }

    if (isEvent && !form.file && !form.coverImageLink.trim() && !eventEditingId) {
      setStatus({ tone: "error", message: "Event cover image is required (upload or image link)." });
      return;
    }

    if (isResource && !form.file && !form.link.trim()) {
      setStatus({ tone: "error", message: "Resource uploads need a file or a link." });
      return;
    }

    setSubmitting(true);
    setUploadStage("Preparing upload...");
    setUploadProgress(0);

    try {
      const filesToRead = [form.file, ...(isEvent ? form.galleryFiles : [])].filter(
        Boolean
      ) as File[];
      const totalBytes = filesToRead.reduce((sum, file) => sum + file.size, 0);
      const fileProgress = new Map<File, number>();

      const updateOverallProgress = () => {
        if (!totalBytes) {
          setUploadProgress((prev) => (prev === null ? 25 : prev));
          return;
        }
        const loaded = Array.from(fileProgress.values()).reduce((sum, value) => sum + value, 0);
        const percent = Math.min(85, Math.round((loaded / totalBytes) * 85));
        setUploadProgress(percent);
      };

      const readFile = async (file: File) => {
        setUploadStage("Processing files...");
        const result = await fileToDataUrl(file, ({ loaded }) => {
          fileProgress.set(file, loaded);
          updateOverallProgress();
        });
        fileProgress.set(file, file.size);
        updateOverallProgress();
        return result;
      };

      const fileDataUrl = form.file ? await readFile(form.file) : "";
      const newGalleryLinks = form.galleryLinksText
        .split(/\r?\n|,/)
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
      const uploadedGalleryImages = isEvent
        ? await Promise.all(form.galleryFiles.map((file) => readFile(file)))
        : [];
      const combinedEventGallery = Array.from(
        new Set(
          [
            ...form.existingGalleryImages,
            ...newGalleryLinks,
            ...uploadedGalleryImages
          ].filter((entry) => entry.trim().length > 0)
        )
      );
      const galleryLinks = isEvent
        ? combinedEventGallery.filter((entry) => !entry.startsWith("data:"))
        : [];
      const galleryFileDataUrls = isEvent
        ? combinedEventGallery.filter((entry) => entry.startsWith("data:"))
        : [];

      setUploadStage("Saving changes...");
      setUploadProgress((prev) => Math.max(prev ?? 0, 90));

      const payload = {
        title: form.title.trim(),
        date: form.date,
        category,
        link: form.link.trim(),
        coverImageLink: form.coverImageLink.trim(),
        fileName: form.file?.name || "",
        fileDataUrl,
        galleryLinks,
        galleryFileDataUrls,
        speaker: form.speaker.trim(),
        eventTime: form.eventTime.trim(),
        summary: form.summary.trim(),
        eventPlacement: form.eventPlacement,
        entityId: isEvent
          ? eventEditingId || undefined
          : isSermon
            ? sermonEditingId || undefined
            : undefined
      };

      if (isEvent) {
        upsertEventItem(payload, eventEditingId || undefined);
      } else if (isSermon) {
        upsertSermonItem(payload, sermonEditingId || undefined);
      } else {
        addAdminItem(payload);
      }

      refreshItems();
      resetForm();
      setStatus({ tone: "success", message: "Changes saved successfully." });
      setTimeout(() => setStatus(null), 4000);
      setUploadProgress(100);
      setUploadStage("Done");
      setTimeout(() => {
        setUploadProgress(null);
        setUploadStage("");
      }, 800);
    } catch {
      setStatus({ tone: "error", message: "Upload failed. Please try again." });
      setUploadStage("Upload failed");
      setTimeout(() => {
        setUploadProgress(null);
        setUploadStage("");
      }, 1200);
    } finally {
      setSubmitting(false);
    }
  };

  const loadEventIntoForm = (event: EventRecord) => {
    const existingGalleryImages = event.gallery.filter((entry) => entry !== event.cover);

    setEventEditingId(event.id);
    setSermonEditingId(null);
    setForm((prev) => ({
      ...prev,
      title: event.name,
      date: event.dateInput,
      category: "event",
      link: event.link || "",
      coverImageLink: event.coverImageLink || (event.cover.startsWith("data:") ? "" : event.cover),
      eventTime: event.time,
      summary: event.summary,
      eventPlacement: event.placement,
      file: null,
      galleryLinksText: "",
      galleryFiles: [],
      existingGalleryImages
    }));
    setStatus({
      tone: "success",
      message: "Event loaded. You can remove existing images, add new links/uploads, then update."
    });
    setTimeout(() => setStatus(null), 5000);
  };

  const loadSermonIntoForm = (sermon: SermonRecord) => {
    setSermonEditingId(sermon.entityId);
    setEventEditingId(null);
    setForm((prev) => ({
      ...prev,
      title: sermon.title,
      date: sermon.dateInput,
      category: "sermon",
      link: sermon.link,
      coverImageLink: sermon.image.startsWith("data:") ? "" : sermon.image,
      speaker: sermon.speaker,
      eventTime: "",
      summary: "",
      eventPlacement: "upcoming",
      file: null,
      galleryLinksText: "",
      galleryFiles: [],
      existingGalleryImages: []
    }));
    setStatus({
      tone: "success",
      message: "Sermon loaded. Update details and click Save Changes."
    });
    setTimeout(() => setStatus(null), 5000);
  };

  const handleManagedDelete = (
    category: AdminCategory,
    entityId: string,
    label: string
  ) => {
    const deleted = deleteManagedContent(category, entityId);

    if (!deleted) {
      setStatus({ tone: "error", message: "Nothing to delete for this record." });
      setTimeout(() => setStatus(null), 4000);
      return;
    }

    refreshItems();
    if (
      (category === "sermon" && sermonEditingId === entityId) ||
      (category === "event" && eventEditingId === entityId)
    ) {
      resetForm();
    }

    setStatus({ tone: "success", message: `${label} deleted successfully.` });
    setTimeout(() => setStatus(null), 4000);
  };

  const handleUndoLastChange = () => {
    const restored = undoLastAdminChange();

    if (!restored) {
      setStatus({ tone: "error", message: "No change history available yet." });
      return;
    }

    refreshItems();
    resetForm();
    setLiveSermon(getFeaturedSermon());
    setStatus({ tone: "success", message: "Last change undone successfully." });
    setTimeout(() => setStatus(null), 4000);
  };

  const handleRestoreHistoryEntry = (entryId: string) => {
    const restored = restoreAdminHistoryEntry(entryId);

    if (!restored) {
      setStatus({ tone: "error", message: "Could not restore this history entry." });
      return;
    }

    refreshItems();
    resetForm();
    setLiveSermon(getFeaturedSermon());
    setStatus({ tone: "success", message: "History snapshot restored." });
    setTimeout(() => setStatus(null), 4000);
  };

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="glass flex items-center gap-3 rounded-2xl border border-brand-blue/20 px-6 py-4 text-brand-navy">
          <ShieldCheck className="h-5 w-5 text-brand-blue" />
          <span className="text-sm font-semibold">Loading admin console…</span>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="glass w-full max-w-md space-y-4 rounded-3xl border border-brand-blue/20 p-6 text-left shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-blue/10">
              <Lock className="h-5 w-5 text-brand-blue" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-indigo">Admin Access</p>
              <h2 className="text-2xl font-semibold text-brand-navy">Enter your passcode</h2>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            This area is protected. Session lasts 12 hours after sign in.
          </p>
          {!adminPasscode && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Missing <span className="font-semibold">VITE_ADMIN_PASSCODE</span>. Add it to your
              frontend <span className="font-semibold">.env</span> file to unlock admin access.
            </div>
          )}
          <form onSubmit={handleAuthSubmit} className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">
              Passcode
              <input
                type="password"
                value={passcode}
                onChange={(event) => setPasscode(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                placeholder="Enter passcode"
              />
            </label>
            {authError && <p className="text-sm font-semibold text-red-600">{authError}</p>}
            <button type="submit" className="btn-primary w-full" disabled={!adminPasscode}>
              Unlock Admin
            </button>
          </form>
          <p className="text-xs text-slate-500">
            Set <span className="font-semibold">VITE_ADMIN_PASSCODE</span> in your frontend env to
            change this password.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <Hero
        title="Admin"
        highlight="Content Upload"
        subtitle="Upload sermons, events, resources, and control live service settings."
        image="/tt.jpg"
        gradient="blue"
      />

      <section className="section-shell">
        <div className="flex justify-end">
          <button type="button" onClick={handleLogout} className="btn-ghost">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
        <SectionHeader
          eyebrow="Operations"
          title="Upload to website"
          subtitle="Create sermon, event, and resource entries. Saved items appear on the website right away."
        />

        <form
          onSubmit={handleSubmit}
          className="card grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start text-left"
        >
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-700">
              Title
              <input
                required
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                placeholder="e.g. Sunday Service Recap"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Date
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Category
              <div className="mt-2 grid grid-cols-2 gap-2">
                {["sermon", "event", "resource"].map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => {
                      handleChange("category", cat as UploadForm["category"]);
                      if (cat !== "event") {
                        setEventEditingId(null);
                      }
                      if (cat !== "sermon") {
                        setSermonEditingId(null);
                      }
                    }}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold capitalize transition ${
                      form.category === cat
                        ? "border-brand-blue bg-brand-blue/10 text-brand-navy"
                        : "border-slate-200 text-slate-700 hover:border-brand-blue"
                    }`}
                  >
                    <Tag className="h-4 w-4" />
                    {cat}
                  </button>
                ))}
              </div>
            </label>
            <label className="text-sm font-semibold text-slate-700">
              {isSermon
                ? "Video link *"
                : isResource
                  ? "Resource link (optional if file uploaded)"
                  : "Optional link"}
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <Link2 className="h-4 w-4 text-brand-indigo" />
                <input
                  required={isSermon}
                  value={form.link}
                  onChange={(e) => handleChange("link", e.target.value)}
                  className="w-full text-sm focus:outline-none"
                  placeholder="https://facebook.com/..."
                />
              </div>
            </label>
            {isSermon && (
              <label className="text-sm font-semibold text-slate-700">
                Speaker *
                <input
                  required={isSermon}
                  value={form.speaker}
                  onChange={(e) => handleChange("speaker", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                  placeholder="Speaker name"
                />
              </label>
            )}
            {(isEvent || isSermon) && (
              <label className="text-sm font-semibold text-slate-700">
                {isEvent ? "Event cover image link (optional)" : "Sermon thumbnail link (optional)"}
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <Link2 className="h-4 w-4 text-brand-indigo" />
                  <input
                    value={form.coverImageLink}
                    onChange={(e) => handleChange("coverImageLink", e.target.value)}
                    className="w-full text-sm focus:outline-none"
                    placeholder="https://example.com/cover-image.jpg"
                  />
                </div>
                <p className="mt-1 text-xs font-normal text-slate-500">
                  If filled, this URL is used as the {isEvent ? "event cover" : "sermon thumbnail"}.
                </p>
              </label>
            )}
            {isEvent && (
              <>
                <label className="text-sm font-semibold text-slate-700">
                  Event section *
                  <select
                    required={isEvent}
                    value={form.eventPlacement || "upcoming"}
                    onChange={(e) => handleChange("eventPlacement", e.target.value as UploadForm["eventPlacement"])}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                  </select>
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Event time *
                  <input
                    required={isEvent}
                    value={form.eventTime}
                    onChange={(e) => handleChange("eventTime", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                    placeholder="e.g. 5:00 PM"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Summary *
                  <textarea
                    required={isEvent}
                    rows={3}
                    value={form.summary}
                    onChange={(e) => handleChange("summary", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                    placeholder="Brief event summary"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Gallery image links (optional)
                  <textarea
                    rows={4}
                    value={form.galleryLinksText}
                    onChange={(e) => handleChange("galleryLinksText", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                    placeholder="One link per line or comma-separated links"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Gallery image uploads (optional)
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    multiple
                    onChange={(e) => handleGalleryUploads(Array.from(e.target.files || []))}
                    className="mt-2 w-full rounded-xl border border-dashed border-brand-blue/60 bg-white px-3 py-6 text-sm focus:border-brand-blue focus:outline-none"
                  />
                  <p className="mt-1 text-xs font-normal text-slate-500">
                    Uploads are converted into link entries automatically.
                  </p>
                  {galleryConverting && (
                    <p className="mt-2 text-xs font-semibold text-brand-blue">Converting uploads...</p>
                  )}
                </label>
                {eventEditingId && form.existingGalleryImages.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-3">
                    <p className="text-sm font-semibold text-brand-navy">
                      Current gallery images ({form.existingGalleryImages.length})
                    </p>
                    <p className="mt-1 text-xs font-normal text-slate-500">
                      Remove any image you no longer want on this event card.
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {form.existingGalleryImages.map((image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                        >
                          <img
                            src={image}
                            alt="Event gallery"
                            className="h-28 w-full object-cover"
                            loading="lazy"
                            onError={(event) => {
                              const target = event.currentTarget;
                              if (target.dataset.fallbackApplied) {
                                return;
                              }
                              target.dataset.fallbackApplied = "true";
                              target.src = "/event.jpg";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingGalleryImage(image)}
                            className="w-full border-t border-slate-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                          >
                            Remove image
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            <label className="text-sm font-semibold text-slate-700">
              {isEvent
                ? `Upload cover image ${eventEditingId ? "(optional while editing)" : "*"}`
                : isSermon
                  ? "Upload sermon thumbnail (optional)"
                  : "Upload file"}
              <input
                type="file"
                accept={fileAccept}
                required={isEvent && !eventEditingId}
                onChange={(e) => handleChange("file", e.target.files?.[0] || null)}
                className="mt-2 w-full rounded-xl border border-dashed border-brand-blue/60 bg-white px-3 py-6 text-sm focus:border-brand-blue focus:outline-none"
              />
              <p className="mt-1 text-xs font-normal text-slate-500">
                Sermon/Event accepts images. Resource accepts PDF or images.
                {isEvent || isSermon ? " You can also use image link above." : ""}
              </p>
            </label>
          </div>

          <div className="glass rounded-2xl border border-brand-blue/20 p-4 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <CloudUpload className="h-5 w-5 text-brand-blue" />
                <div>
                  <p className="text-sm font-semibold text-brand-navy">Upload summary</p>
                  <p className="text-xs text-slate-600">Review before submitting</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSummaryCollapsed((prev) => !prev)}
                className="btn-ghost px-3 py-1 text-xs"
              >
                {summaryCollapsed ? (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Expand
                  </>
                ) : (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Collapse
                  </>
                )}
              </button>
            </div>

            {!summaryCollapsed ? (
              <>
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <p>
                    <span className="font-semibold text-brand-indigo">Title:</span> {form.title || "—"}
                  </p>
                  <p>
                    <span className="font-semibold text-brand-indigo">Date:</span> {form.date || "—"}
                  </p>
                  <p>
                    <span className="font-semibold text-brand-indigo">Category:</span>{" "}
                    {form.category || "—"}
                  </p>
                  {form.category === "sermon" && (
                    <>
                      <p>
                        <span className="font-semibold text-brand-indigo">Speaker:</span>{" "}
                        {form.speaker || "—"}
                      </p>
                      <p className="line-clamp-2">
                        <span className="font-semibold text-brand-indigo">Thumbnail link:</span>{" "}
                        {form.coverImageLink || "—"}
                      </p>
                    </>
                  )}
                  {form.category === "event" && (
                    <>
                      <p>
                        <span className="font-semibold text-brand-indigo">Section:</span>{" "}
                        {form.eventPlacement === "past" ? "Past" : "Upcoming"}
                      </p>
                      <p>
                        <span className="font-semibold text-brand-indigo">Event time:</span>{" "}
                        {form.eventTime || "—"}
                      </p>
                      <p className="line-clamp-2">
                        <span className="font-semibold text-brand-indigo">Cover image link:</span>{" "}
                        {form.coverImageLink || "—"}
                      </p>
                      <p>
                        <span className="font-semibold text-brand-indigo">Summary:</span>{" "}
                        {form.summary || "—"}
                      </p>
                      <p>
                        <span className="font-semibold text-brand-indigo">Current gallery images:</span>{" "}
                        {form.existingGalleryImages.length}
                      </p>
                      <p>
                        <span className="font-semibold text-brand-indigo">New gallery links:</span>{" "}
                        {form.galleryLinksText
                          ? form.galleryLinksText
                              .split(/\r?\n|,/)
                              .map((entry) => entry.trim())
                              .filter((entry) => entry.length > 0).length
                          : 0}
                      </p>
                      <p>
                        <span className="font-semibold text-brand-indigo">New gallery uploads:</span>{" "}
                        {form.galleryFiles.length}
                      </p>
                      <p>
                        <span className="font-semibold text-brand-indigo">Total after save:</span>{" "}
                        {form.existingGalleryImages.length +
                          (form.galleryLinksText
                            ? form.galleryLinksText
                                .split(/\r?\n|,/)
                                .map((entry) => entry.trim())
                                .filter((entry) => entry.length > 0).length
                            : 0) +
                          form.galleryFiles.length}
                      </p>
                    </>
                  )}
                  <p className="line-clamp-2">
                    <span className="font-semibold text-brand-indigo">Link:</span> {form.link || "—"}
                  </p>
                  <p>
                    <span className="font-semibold text-brand-indigo">File:</span>{" "}
                    {form.file?.name || "—"}
                  </p>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  This saves to local admin storage. If anything goes wrong, use Undo Last Change.
                </p>
              </>
            ) : (
              <p className="mt-3 text-xs text-slate-500">
                Summary collapsed. Click Expand to review details.
              </p>
            )}

            {uploadProgress !== null && (
              <div className="mt-4 rounded-xl border border-brand-blue/20 bg-white/80 p-3">
                <div className="flex items-center justify-between text-xs font-semibold text-brand-navy">
                  <span>{uploadStage || "Uploading..."}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-brand-blue transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2">
              <button type="submit" className="btn-primary w-full justify-center" disabled={submitting}>
                {submitting
                  ? "Saving changes..."
                  : eventEditingId || sermonEditingId
                    ? "Save Changes"
                    : "Save New Entry"}
              </button>
              {status && (
                <div
                  className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                    status.tone === "success"
                      ? "border border-green-200 bg-green-50 text-green-800"
                      : "border border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  {status.message}
                </div>
              )}
            </div>
          </div>
        </form>

        <div className="card mt-6 space-y-4 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionHeader
              eyebrow="Saved content"
              title="Recent uploads"
              subtitle="These are the entries currently powering your site pages."
              alignment="left"
            />
            <div className="flex gap-2">
              <button type="button" onClick={refreshItems} className="btn-ghost">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAdminItems();
                  refreshItems();
                }}
                className="btn-ghost text-red-700 hover:border-red-300 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </button>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-4 text-sm text-slate-600">
              No uploads yet. Add your first sermon, event, or resource above.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white/70 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-brand-navy">{item.title}</p>
                    <p className="text-xs text-slate-600">
                      {categoryLabels[item.category]} • {item.date}
                    </p>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-brand-blue hover:underline"
                      >
                        Open link
                      </a>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      removeAdminItem(item.id);
                      refreshItems();
                    }}
                    className="btn-ghost w-fit text-red-700 hover:border-red-300 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card mt-6 space-y-4 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionHeader
              eyebrow="History"
              title="Change History"
              subtitle="Undo recent changes or restore an earlier snapshot."
              alignment="left"
            />
            <button
              type="button"
              onClick={handleUndoLastChange}
              className="btn-ghost disabled:cursor-not-allowed disabled:opacity-60"
              disabled={historyEntries.length === 0}
            >
              <Undo2 className="h-4 w-4" />
              Undo Last Change
            </button>
          </div>

          {historyEntries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-4 text-sm text-slate-600">
              No history yet. Once you make changes, snapshots will appear here.
            </div>
          ) : (
            <div className="space-y-3">
              {historyEntries.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
                      <History className="h-4 w-4 text-brand-blue" />
                      {entry.label}
                    </p>
                    <p className="text-xs text-slate-600">
                      {new Date(entry.createdAt).toLocaleString()} • {entry.items.length} saved items
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRestoreHistoryEntry(entry.id)}
                    className="btn-ghost w-fit"
                  >
                    Restore This Version
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card mt-6 space-y-4 text-left">
          <SectionHeader
            eyebrow="Live control"
            title="Update Live Sermon"
            subtitle="This controls the live sermon section on Home and Sermons pages."
            alignment="left"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Title
              <input
                value={liveSermon.title}
                onChange={(e) => setLiveSermon((prev) => ({ ...prev, title: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Date
              <input
                value={liveSermon.date}
                onChange={(e) => setLiveSermon((prev) => ({ ...prev, date: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Speaker
              <input
                value={liveSermon.speaker}
                onChange={(e) => setLiveSermon((prev) => ({ ...prev, speaker: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Video link / embed URL
              <input
                value={liveSermon.embed}
                onChange={(e) => setLiveSermon((prev) => ({ ...prev, embed: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                placeholder="Facebook or YouTube link"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                if (!liveSermon.embed.trim()) {
                  setStatus({ tone: "error", message: "Live sermon needs a video link." });
                  return;
                }

                saveFeaturedSermon(liveSermon);
                refreshItems();
                setStatus({ tone: "success", message: "Live sermon updated." });
                setTimeout(() => setStatus(null), 4000);
              }}
            >
              Save Live Sermon
            </button>
          </div>
        </div>

        <div className="card mt-6 space-y-4 text-left">
          <SectionHeader
            eyebrow="Sermon manager"
            title="Edit Existing Sermons"
            subtitle="Edit old sermons and new uploads from one place."
            alignment="left"
          />
          {sermonRecords.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {sermonRecords.map((sermon) => (
                <div key={sermon.entityId} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <p className="text-sm font-semibold text-brand-navy">{sermon.title}</p>
                  <p className="text-xs text-slate-600">
                    {sermon.date} • {sermon.speaker}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-blue">
                    {sermon.source === "default" ? "Old sermon" : "Admin sermon"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => loadSermonIntoForm(sermon)}
                    >
                      {sermon.source === "default" ? "Edit Old Sermon" : "Edit Sermon"}
                    </button>
                    <button
                      type="button"
                      className="btn-ghost text-red-700 hover:border-red-300 hover:text-red-800"
                      onClick={() =>
                        handleManagedDelete(
                          "sermon",
                          sermon.entityId,
                          sermon.source === "default" ? "Old sermon" : "Sermon"
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">No sermons available right now.</p>
          )}
        </div>

        <div className="card mt-6 space-y-4 text-left">
          <SectionHeader
            eyebrow="Resource manager"
            title="Delete Resources"
            subtitle="Remove old or admin-added resources from the website."
            alignment="left"
          />
          {resourceRecords.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {resourceRecords.map((resource: ResourceRecord) => (
                <div key={resource.entityId} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <p className="text-sm font-semibold text-brand-navy">{resource.title}</p>
                  <p className="text-xs text-slate-600">{resource.date}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-blue">
                    {resource.source === "default" ? "Old resource" : "Admin resource"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a href={resource.file} target="_blank" rel="noreferrer" className="btn-ghost">
                      Preview
                    </a>
                    <button
                      type="button"
                      className="btn-ghost text-red-700 hover:border-red-300 hover:text-red-800"
                      onClick={() =>
                        handleManagedDelete(
                          "resource",
                          resource.entityId,
                          resource.source === "default" ? "Old resource" : "Resource"
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">No resources available right now.</p>
          )}
        </div>

        <div className="card mt-6 space-y-4 text-left">
          <SectionHeader
            eyebrow="Event manager"
            title="Edit Existing Event Cards"
            subtitle="Choose an event to edit details and manage that event's gallery photos."
            alignment="left"
          />
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/60 p-4">
            <p className="text-sm font-semibold text-brand-navy">Edit Upcoming Events</p>
            {upcomingEventRecords.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {upcomingEventRecords.map((event) => (
                  <div key={event.id} className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-sm font-semibold text-brand-navy">{event.name}</p>
                    <p className="text-xs text-slate-600">
                      {event.date} • {event.time}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-blue">
                      {event.gallery.length} photo{event.gallery.length === 1 ? "" : "s"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => loadEventIntoForm(event)}
                      >
                        Edit Upcoming Event
                      </button>
                      <button
                        type="button"
                        className="btn-ghost text-red-700 hover:border-red-300 hover:text-red-800"
                        onClick={() => handleManagedDelete("event", event.id, "Event")}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600">
                No upcoming events available right now. Edit any card below and set Event section to
                Upcoming.
              </p>
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {eventRecords.map((event) => (
              <div key={event.id} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                <p className="text-sm font-semibold text-brand-navy">{event.name}</p>
                <p className="text-xs text-slate-600">
                  {event.date} • {event.placement === "past" ? "Past" : "Upcoming"}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-blue">
                  {event.gallery.length} photo{event.gallery.length === 1 ? "" : "s"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => loadEventIntoForm(event)}
                  >
                    {event.placement === "upcoming" ? "Edit Upcoming Event" : "Edit Past Event"}
                  </button>
                  <button
                    type="button"
                    className="btn-ghost text-red-700 hover:border-red-300 hover:text-red-800"
                    onClick={() => handleManagedDelete("event", event.id, "Event")}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
