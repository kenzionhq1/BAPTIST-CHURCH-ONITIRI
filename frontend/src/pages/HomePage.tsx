import Hero from "../components/Hero";
import SectionHeader from "../components/common/SectionHeader";
import { serviceTimes } from "../utils/data";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { toEmbedVideoUrl } from "../utils/adminContent";
import { fetchPublicEvents, fetchPublicSermons, type FeaturedSermon, type PublicEvent } from "../utils/backend";
import { Calendar, Clock, MapPin, Tv, Heart, ArrowRight, Play, Sparkles } from "lucide-react";

const HomePage = () => {
  const [allEvents, setAllEvents] = useState<PublicEvent[]>([]);
  const [featuredSermon, setFeaturedSermon] = useState<FeaturedSermon>({
    title: "",
    date: "",
    speaker: "",
    embed: ""
  });
  const liveEmbed = useMemo(() => toEmbedVideoUrl(featuredSermon.embed || ""), [featuredSermon.embed]);
  const upcoming = allEvents.find((event) => event.placement === "upcoming") || allEvents?.[0];

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const [events, sermons] = await Promise.all([fetchPublicEvents(), fetchPublicSermons()]);
        if (!isMounted) return;
        setAllEvents(events);
        if (sermons.featured) {
          setFeaturedSermon(sermons.featured);
        }
      } catch (error) {
        console.error("Failed to load home data", error);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <Hero
        title="Loving God. Building People."
        highlight="Impacting Our Community."
        subtitle="Welcome to Baptist Church Onitiri, Yaba. A vibrant family of faith where everyone can belong, grow, and serve."
        cta={
          <>
            <Link to="/about" className="btn-amber font-bold text-sm">
              Explore Our Church <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/sermons" className="btn-ghost border-white/30 text-white hover:bg-white/10">
              <Tv className="h-4 w-4 text-sky-400" /> Watch Sermons
            </Link>
          </>
        }
      />

      {/* Worship Expressions Section */}
      <section id="service-times" className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 px-3.5 py-1 text-xs font-bold text-brand-blue uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Gather Together
          </span>
          <h2 className="text-3xl font-extrabold sm:text-4xl text-brand-navy mt-3">
            Worship With Us
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Every gathering is intentionally designed to encounter God’s presence and grow in community.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {serviceTimes.map((service) => (
            <div
              key={service.title}
              className="card-figma flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-brand-navy/5 px-3 py-1 text-xs font-bold text-brand-navy">
                    {service.accent === "sun" ? "Sunday Worship" : "Midweek Service"}
                  </span>
                  <Clock className="h-4 w-4 text-slate-400 group-hover:text-brand-blue transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-brand-navy group-hover:text-brand-blue transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm font-semibold text-slate-700">{service.time}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-amber-500" />
                <span>{service.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Stream / Featured Sermon Hub */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl bg-[#09172A] p-6 sm:p-10 shadow-2xl text-white">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            
            {/* Video Container Frame */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950 aspect-video shadow-lg">
              {liveEmbed ? (
                <iframe
                  src={liveEmbed}
                  className="h-full w-full border-0"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                  title={featuredSermon.title || "Church Service Stream"}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-slate-400">
                  <Play className="h-12 w-12 text-amber-400/80 mb-2" />
                  <p className="text-sm font-semibold text-slate-200">No live stream active right now</p>
                  <p className="text-xs text-slate-400 mt-1">Catch our recorded messages in the sermon archive</p>
                </div>
              )}
            </div>

            {/* Stream Info Copy */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-400 border border-red-500/30">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> Live & Featured Sermon
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {featuredSermon.title || "The Living Word"}
                </h3>
                <p className="text-sm text-slate-300">
                  {featuredSermon.date || "Sunday Service"} • {featuredSermon.speaker || "Pastor In Charge"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link to="/sermons" className="btn-amber text-xs font-bold justify-center py-3">
                  <Tv className="h-4 w-4" /> Browse Sermon Library
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Upcoming Event Feature */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Community</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy">Upcoming Church Events</h2>
          </div>
          <Link to="/events" className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1">
            View All Events <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {upcoming ? (
          <div className="card-figma grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-center p-6 sm:p-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700">
                <Calendar className="h-3.5 w-3.5" /> Featured Event
              </div>
              <h3 className="text-2xl font-bold text-brand-navy">{upcoming.name}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{upcoming.summary}</p>
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-blue">
                <Clock className="h-4 w-4" /> {upcoming.date} · {upcoming.time}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/events" className="btn-primary text-xs py-2.5">
                  Event Details
                </Link>
                <a
                  href="https://www.google.com/maps/place/14+Lawani+St,+Onike,+Lagos+101245,+Lagos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-xs py-2.5"
                >
                  <MapPin className="h-3.5 w-3.5 text-amber-500" /> Get Directions
                </a>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-slate-100">
              <img
                src={upcoming.cover}
                alt={upcoming.name}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(event) => {
                  const target = event.currentTarget;
                  if (target.dataset.fallbackApplied) return;
                  target.dataset.fallbackApplied = "true";
                  target.src = "/event.jpg";
                }}
              />
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No upcoming events scheduled right now. Check back soon!
          </div>
        )}
      </section>

      {/* Giving & Generosity Banner */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-navy via-slate-900 to-brand-navy p-8 sm:p-12 text-white shadow-xl">
          <div className="relative z-10 grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div className="space-y-4 text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300">
                <Heart className="h-3.5 w-3.5 fill-current" /> Generosity & Stewardship
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Fueling the Mission of Faith & Community
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Your faithful giving enables local outreach, benevolence, youth discipleship, and facility care across Yaba and Lagos.
              </p>
              <Link to="/giving" className="btn-amber text-sm font-bold w-fit mt-2">
                Give Online Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["Tithes & Offering", "Building Fund", "Benevolence", "Missions & Evangelism"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/15 bg-white/10 p-4 text-xs font-bold text-white backdrop-blur-md text-center"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
