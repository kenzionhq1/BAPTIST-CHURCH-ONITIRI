import { useEffect, useMemo, useState } from "react";
import Hero from "../components/Hero";
import clsx from "clsx";
import {
  appendAutoplayToEmbedUrl,
  toEmbedVideoUrl,
  toPublicVideoUrl
} from "../utils/adminContent";
import { fetchPublicSermons, type FeaturedSermon, type PublicSermon } from "../utils/backend";
import { Play, X, Search, Filter, ExternalLink, Calendar, User, Tv } from "lucide-react";

const SermonsPage = () => {
  const [allSermons, setAllSermons] = useState<PublicSermon[]>([]);
  const [featuredSermon, setFeaturedSermon] = useState<FeaturedSermon>({
    title: "",
    date: "",
    speaker: "",
    embed: ""
  });
  const previewCount = 6;
  const featuredEmbed = useMemo(() => toEmbedVideoUrl(featuredSermon.embed || ""), [featuredSermon.embed]);
  const categories = useMemo(() => ["all", ...new Set(allSermons.map((s) => s.category))], [allSermons]);
  
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAllSermons, setShowAllSermons] = useState(false);

  const filtered = useMemo(() => {
    return allSermons.filter((s) => {
      const matchesCategory = filter === "all" || s.category === filter;
      const matchesSearch =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.speaker.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allSermons, filter, searchQuery]);

  const visibleSermons = showAllSermons ? filtered : filtered.slice(0, previewCount);

  const openModal = (id: string) => setActiveId(id);
  const closeModal = () => setActiveId(null);

  const activeSermon = activeId
    ? allSermons.find((s) => s.id === activeId) || filtered.find((s) => s.id === activeId)
    : null;

  useEffect(() => {
    let isMounted = true;
    fetchPublicSermons()
      .then((result) => {
        if (!isMounted) return;
        setAllSermons(result.items);
        if (result.featured) {
          setFeaturedSermon(result.featured);
        }
      })
      .catch((error) => console.error("Failed to load sermons", error));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      <Hero
        title="Sermon Archive"
        highlight="Inspired by God's Word"
        subtitle="Listen to life-transforming messages from our pastoral team. Grow in faith, wisdom, and spiritual depth."
        image="/HERO.jpg"
      />

      {/* Featured / Live Sermon Highlight */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl bg-[#09172A] p-6 sm:p-8 shadow-2xl text-white">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">Featured Sermon / Stream</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950 aspect-video shadow-lg">
              {featuredEmbed ? (
                <iframe
                  src={featuredEmbed}
                  className="h-full w-full border-0"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                  title={featuredSermon.title || "Featured Sermon"}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-slate-400">
                  <Tv className="h-10 w-10 text-amber-400 mb-2" />
                  <p className="text-sm font-semibold text-slate-200">Featured message stream unavailable</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {featuredSermon.title || "Sunday Message"}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-amber-400" /> {featuredSermon.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><User className="h-3.5 w-3.5 text-sky-400" /> {featuredSermon.speaker}</span>
              </div>
              <div className="pt-2">
                <a
                  href={toPublicVideoUrl(featuredSermon.embed)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-amber text-xs font-bold py-3 inline-flex items-center gap-2"
                >
                  Watch on Facebook <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sermon Catalog & Search */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">Catalog</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy">Explore All Messages</h2>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or speaker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs font-medium text-slate-900 shadow-sm focus:border-brand-blue focus:outline-none"
            />
          </div>
        </div>

        {/* Horizontal Mobile Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setFilter(category);
                setShowAllSermons(false);
              }}
              className={clsx(
                "whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all duration-150 active:scale-95",
                filter === category
                  ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              {category === "all" ? "All Categories" : category.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Sermons Grid Cards */}
        {visibleSermons.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleSermons.map((sermon) => (
              <div
                key={sermon.id}
                className="card-figma flex flex-col justify-between group overflow-hidden"
              >
                <div>
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-900">
                    <img
                      src={sermon.image}
                      alt={sermon.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(event) => {
                        const target = event.currentTarget;
                        if (target.dataset.fallbackApplied) return;
                        target.dataset.fallbackApplied = "true";
                        target.src = "/HERO.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-lg">
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <span className="inline-block rounded-md bg-brand-navy/5 px-2.5 py-0.5 text-[10px] font-bold text-brand-blue uppercase">
                      {sermon.category || "Sermon"}
                    </span>
                    <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-blue transition-colors line-clamp-2">
                      {sermon.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {sermon.date} • {sermon.speaker}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    disabled={!sermon.link}
                    onClick={() => openModal(sermon.id)}
                    className={clsx(
                      "w-full btn-primary text-xs py-2.5 font-bold justify-center",
                      !sermon.link && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Play className="h-3.5 w-3.5 fill-current" /> {sermon.link ? "Watch Video" : "Link Unavailable"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
            No sermons found matching your filter criteria.
          </div>
        )}

        {filtered.length > previewCount && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllSermons((prev) => !prev)}
              className="btn-navy text-xs font-bold py-3 px-8"
            >
              {showAllSermons ? "Show Fewer Sermons" : `View All ${filtered.length} Sermons`}
            </button>
          </div>
        )}
      </section>

      {/* Video Player Modal */}
      {activeSermon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={closeModal} />
          
          <div className="relative z-10 w-full max-w-4xl rounded-3xl bg-slate-900 border border-white/10 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Sermon Player</span>
                <h3 className="text-xl font-bold text-white leading-tight">{activeSermon.title}</h3>
                <p className="text-xs text-slate-400">{activeSermon.date} • {activeSermon.speaker}</p>
              </div>
              <button
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
              {activeSermon.link ? (
                <iframe
                  key={activeSermon.id}
                  src={appendAutoplayToEmbedUrl(toEmbedVideoUrl(activeSermon.link))}
                  className="h-full w-full border-0"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                  title={activeSermon.title}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400 text-sm">
                  Playback link missing for this sermon.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <a
                href={toPublicVideoUrl(activeSermon.link)}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost text-xs border-white/20 text-white hover:bg-white/10"
              >
                Open Original Link <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button onClick={closeModal} className="btn-amber text-xs font-bold">
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SermonsPage;
