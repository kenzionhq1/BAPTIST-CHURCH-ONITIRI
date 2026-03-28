import { useEffect, useMemo, useState } from "react";
import SectionHeader from "../components/common/SectionHeader";
import Hero from "../components/Hero";
import clsx from "clsx";
import {
  appendAutoplayToEmbedUrl,
  toEmbedVideoUrl,
  toPublicVideoUrl
} from "../utils/adminContent";
import { fetchPublicSermons, type FeaturedSermon, type PublicSermon } from "../utils/backend";

const SermonsPage = () => {
  const [allSermons, setAllSermons] = useState<PublicSermon[]>([]);
  const [featuredSermon, setFeaturedSermon] = useState<FeaturedSermon>({
    title: "",
    date: "",
    speaker: "",
    embed: ""
  });
  const featuredEmbed = useMemo(() => toEmbedVideoUrl(featuredSermon.embed || ""), [featuredSermon.embed]);
  const categories = useMemo(() => ["all", ...new Set(allSermons.map((s) => s.category))], [allSermons]);
  const [filter, setFilter] = useState("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = filter === "all" ? allSermons : allSermons.filter((s) => s.category === filter);

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
    <div className="space-y-16">
      <Hero
        title="Sermons"
        highlight="Experience the Word"
        subtitle="Experience the power of God's word. Catch the latest message or browse the archive."
        image="/sermon-hero.jpeg"
      />

      <section className="section-shell">
        <SectionHeader
          eyebrow={
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
              <span className="font-semibold text-brand-blue">LIVE NOW</span>
            </div>
          }
          title="Live Sermon"
          subtitle={`${featuredSermon.title} — ${featuredSermon.date} | ${featuredSermon.speaker}`}
          action={
            <a
              href={toPublicVideoUrl(featuredSermon.embed)}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              Watch on Facebook
            </a>
          }
        />
        <div
          className="group cursor-pointer"
          onClick={() => window.open(toPublicVideoUrl(featuredSermon.embed), "_blank")}
        >
          <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-slate-200 group-hover:scale-[1.02] transition-all duration-200">
            {featuredEmbed ? (
              <iframe
                src={featuredEmbed}
                className="h-[380px] w-full md:h-[460px]"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                title={featuredSermon.title}
              />
            ) : (
              <div className="flex h-[380px] w-full items-center justify-center bg-slate-100 px-4 text-center text-sm text-slate-600 md:h-[460px]">
                No live sermon video has been configured yet.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <SectionHeader
          eyebrow="Archive"
          title="Past Sermons"
          subtitle="Filter by theme and catch up on any service you missed."
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={clsx(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                filter === category
                  ? "bg-brand-blue text-white shadow"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-brand-blue"
              )}
            >
              {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((sermon) => (
            <div key={sermon.id} className="card h-full text-left">
              <div className="overflow-hidden rounded-xl">
                <img
                  src={sermon.image}
                  alt={sermon.title}
                  className="h-44 w-full object-cover transition duration-300 hover:scale-105"
                  loading="lazy"
                  onError={(event) => {
                    const target = event.currentTarget;
                    if (target.dataset.fallbackApplied) {
                      return;
                    }
                    target.dataset.fallbackApplied = "true";
                    target.src = "/sermon-hero.jpeg";
                  }}
                />
              </div>
              <div className="mt-3 space-y-1">
                <h3 className="text-lg font-semibold text-brand-navy">{sermon.title}</h3>
                <p className="text-sm text-slate-600">
                  {sermon.date} | {sermon.speaker}
                </p>
                <button
                  disabled={!sermon.link}
                  onClick={() => openModal(sermon.id)}
                  className={clsx(
                    "mt-2 inline-flex w-full justify-center",
                    sermon.link ? "btn-primary" : "btn-ghost cursor-not-allowed opacity-60"
                  )}
                >
                  {sermon.link ? "Watch" : "Link missing"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {activeSermon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur">
          <div className="glass relative w-full max-w-5xl rounded-3xl border border-slate-200 p-6 shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700 hover:text-brand-blue"
            >
              Close
            </button>
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-slate-200">
                {activeSermon.link ? (
                  <iframe
                    key={activeSermon.id}
                    src={appendAutoplayToEmbedUrl(toEmbedVideoUrl(activeSermon.link))}
                    className="h-[320px] w-full md:h-[420px]"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                    title={activeSermon.title}
                  />
                ) : (
                  <div className="flex h-[320px] w-full items-center justify-center bg-slate-100 px-6 text-center text-sm text-slate-600 md:h-[420px]">
                    This sermon does not have a playback link yet.
                  </div>
                )}
              </div>
              <div className="space-y-4 text-left">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-blue">Now watching</p>
                  <h3 className="text-2xl font-bold text-brand-navy">{activeSermon.title}</h3>
                  <p className="text-sm text-slate-600">
                    {activeSermon.date} • {activeSermon.speaker}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={toPublicVideoUrl(activeSermon.link)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost"
                  >
                    Open in new tab
                  </a>
                  <button onClick={closeModal} className="btn-primary">
                    Continue browsing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SermonsPage;
