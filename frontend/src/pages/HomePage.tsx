import Hero from "../components/Hero";
import SectionHeader from "../components/common/SectionHeader";
import { serviceTimes } from "../utils/data";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { getFeaturedSermon, getMergedEvents, toEmbedVideoUrl } from "../utils/adminContent";

const HomePage = () => {
  const allEvents = useMemo(() => getMergedEvents(), []);
  const featuredSermon = useMemo(() => getFeaturedSermon(), []);
  const liveEmbed = useMemo(() => toEmbedVideoUrl(featuredSermon.embed), [featuredSermon.embed]);
  const upcoming = allEvents.find((event) => event.placement === "upcoming") || allEvents?.[0];

  return (
    <div className="space-y-16">
      <Hero
        title="Welcome to"
        highlight="Baptist Church Onitiri, Yaba"
        subtitle="Join us in worship and fellowship as we love God, build people, and impact our community."
        image="/HERO.jpg"
        cta={
          <>
            <Link to="/about" className="btn-primary">
              Learn More
            </Link>
            <Link to="/sermons" className="btn-ghost">
              Watch Sermons
            </Link>
          </>
        }
      />

      <section className="section-shell">
        <SectionHeader
          eyebrow="Gather"
          title="Worship With Us"
          subtitle="Join any of our weekly expressions. Every gathering is intentionally crafted to help you encounter God and find community."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {serviceTimes.map((service) => (
            <div key={service.title} className="card text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-brand-navy">{service.title}</h3>
                <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">
                  {service.accent === "sun" ? "Sunday" : "Midweek"}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{service.time}</p>
              <p className="text-sm font-medium text-brand-indigo">{service.location}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <SectionHeader
          eyebrow="Live"
          title="Live Sermon"
          subtitle="Join the current live stream or catch the latest message."
          action={
            <Link to="/sermons" className="btn-primary">
              Go to Live
            </Link>
          }
        />
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-slate-200">
            {liveEmbed ? (
              <iframe
                src={liveEmbed}
                className="h-[360px] w-full md:h-[420px]"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                title={featuredSermon.title}
              />
            ) : (
              <div className="flex h-[360px] w-full items-center justify-center bg-slate-100 px-4 text-center text-sm text-slate-600 md:h-[420px]">
                No live sermon has been configured yet.
              </div>
            )}
          </div>
          <div className="card h-full justify-between text-left">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue/80">
                Live Sermon
              </p>
              <h3 className="text-2xl font-bold text-brand-navy">{featuredSermon.title}</h3>
              <p className="text-sm text-slate-600">
                {featuredSermon.date} | {featuredSermon.speaker}
              </p>
            </div>
            <Link to="/sermons" className="btn-primary w-fit">
              Watch More
            </Link>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <SectionHeader
          eyebrow="Community"
          title="Upcoming Event"
          subtitle="Stay plugged in with what's next and invite someone to join you."
        />
        {upcoming ? (
          <div className="card grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div className="space-y-3 text-left">
              <h3 className="text-2xl font-semibold text-brand-navy">{upcoming.name}</h3>
              <p className="text-sm text-slate-600">{upcoming.summary}</p>
              <p className="text-sm font-medium text-brand-indigo">
                {upcoming.date} · {upcoming.time}
              </p>
              <div className="flex gap-2">
                <Link to="/events" className="btn-primary">
                  See All Events
                </Link>
                <a
                  href="https://www.google.com/maps/place/14+Lawani+St,+Onike,+Lagos+101245,+Lagos"
                  className="btn-ghost"
                >
                  Get Directions
                </a>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={upcoming.cover}
                alt={upcoming.name}
                className="h-full w-full object-cover"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <p className="absolute bottom-3 left-3 text-sm font-semibold text-white">
                Join us onsite — bring a friend!
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-600">
            No upcoming event available right now.
          </div>
        )}
      </section>

      <section className="section-shell">
        <div className="card grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div className="space-y-4 text-left">
            <SectionHeader
              eyebrow="Partner"
              title="Giving that fuels the mission"
              subtitle="Your generosity enables outreach, benevolence, discipleship and city impact."
              alignment="left"
            />
            <Link to="/giving" className="btn-primary w-fit">
              Support Now
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Outreach", "Missions", "Welfare", "Operations"].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm font-semibold text-brand-navy shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
