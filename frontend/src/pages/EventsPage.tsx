import { useEffect, useMemo, useState } from "react";
import SectionHeader from "../components/common/SectionHeader";
import Hero from "../components/Hero";
import { fetchPublicEvents, type PublicEvent } from "../utils/backend";

const EventsPage = () => {
  const [allEvents, setAllEvents] = useState<PublicEvent[]>([]);
  const previewCount = 3;
  const upcomingEvents = useMemo(
    () => allEvents.filter((event) => event.placement === "upcoming"),
    [allEvents]
  );
  const pastEvents = useMemo(
    () => allEvents.filter((event) => event.placement === "past"),
    [allEvents]
  );
  const featuredEvent = upcomingEvents[0] || allEvents[0] || null;
  const otherUpcomingEvents = useMemo(
    () => upcomingEvents.filter((event) => event.id !== featuredEvent?.id),
    [upcomingEvents, featuredEvent?.id]
  );
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllPast, setShowAllPast] = useState(false);
  const visibleUpcomingEvents = showAllUpcoming
    ? otherUpcomingEvents
    : otherUpcomingEvents.slice(0, previewCount);
  const visiblePastEvents = showAllPast ? pastEvents : pastEvents.slice(0, previewCount);
  const galleryByEvent = useMemo(
    () =>
      allEvents
        .map((event) => {
          const images = Array.from(new Set([event.cover, ...event.gallery].filter((entry) => entry.trim().length > 0)));
          return {
            id: event.id,
            name: event.name,
            date: event.date,
            time: event.time,
            images
          };
        })
        .filter((event) => event.images.length > 0),
    [allEvents]
  );
  const [countdowns, setCountdowns] = useState<Record<string, string>>({});
  const [activeGalleryImage, setActiveGalleryImage] = useState<{
    src: string;
    alt: string;
    eventName: string;
  } | null>(null);
  const [openGalleryEvents, setOpenGalleryEvents] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchPublicEvents()
      .then((events) => {
        if (isMounted) setAllEvents(events);
      })
      .catch((error) => console.error("Failed to load events", error));
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = upcomingEvents.reduce<Record<string, string>>((acc, event) => {
        const diff = new Date(event.date).getTime() - Date.now();
        if (diff <= 0) {
          acc[event.id] = "Event started!";
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          acc[event.id] = `${days}d ${hours}h ${minutes}m`;
        }
        return acc;
      }, {});
      setCountdowns(next);
    }, 1000);
    return () => clearInterval(interval);
  }, [upcomingEvents]);

  return (
    <div className="space-y-16">
      <Hero
        title="Events"
        highlight="Stay Connected"
        subtitle="Stay connected and join us for life-changing experiences."
        image="/event.jpg"
        gradient="indigo"
      />

      <section className="section-shell">
        <SectionHeader
          eyebrow="Next Up"
          title="Countdown to our next gathering"
          subtitle="Invite someone and plan to arrive early."
          alignment="left"
        />
        {featuredEvent && (
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-xl">
            <img
              src={featuredEvent.cover}
              alt={featuredEvent.name}
              className="h-72 w-full object-cover md:h-96"
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center gap-3 px-6 py-8 text-white md:px-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Upcoming</p>
              <h3 className="text-2xl font-bold md:text-3xl">{featuredEvent.name}</h3>
              <p className="text-sm text-slate-100">
                {featuredEvent.date} · {featuredEvent.time}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                  {countdowns[featuredEvent.id] || "Loading..."}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="section-shell">
        <SectionHeader
          eyebrow="Upcoming"
          title="Upcoming Events"
          subtitle="Invite a friend and be part of what God is doing."
        />
        {otherUpcomingEvents.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {visibleUpcomingEvents.map((event) => (
              <div key={event.id} className="card overflow-hidden p-0 text-left">
                <div className="relative h-40 w-full">
                  <img
                    src={event.cover}
                    alt={event.name}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                </div>
                <div className="space-y-2 p-4">
                  <h3 className="text-xl font-semibold text-brand-navy">{event.name}</h3>
                  <p className="text-sm text-slate-600">{event.summary}</p>
                  <p className="text-sm font-medium text-brand-indigo">
                    {event.date} · {event.time}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-blue">
                    {countdowns[event.id] || "Coming soon"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-600">
            No extra upcoming events right now.
          </div>
        )}
        {otherUpcomingEvents.length > previewCount && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllUpcoming((prev) => !prev)}
              className="btn-ghost"
            >
              {showAllUpcoming ? "Show Less" : "See More Events"}
            </button>
          </div>
        )}
      </section>

      <section className="section-shell">
        <SectionHeader
          eyebrow="Past"
          title="Past Events"
          subtitle="Browse previous gatherings and highlights."
        />
        {pastEvents.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {visiblePastEvents.map((event) => (
              <div key={event.id} className="card text-left">
                <h3 className="text-xl font-semibold text-brand-navy">{event.name}</h3>
                <p className="text-sm text-slate-600">{event.summary}</p>
                <p className="text-sm font-medium text-brand-indigo">
                  {event.date} · {event.time}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-600">
            No past events yet.
          </div>
        )}
        {pastEvents.length > previewCount && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllPast((prev) => !prev)}
              className="btn-ghost"
            >
              {showAllPast ? "Show Less" : "See More Past Events"}
            </button>
          </div>
        )}
      </section>

      <section className="section-shell">
        <SectionHeader
          eyebrow="Highlights"
          title="Gallery"
          subtitle="Photos are organized by event so each one can be managed from Admin."
        />
        {galleryByEvent.length > 0 ? (
          <div className="space-y-6">
            {galleryByEvent.map((eventGallery) => (
              <div
                key={eventGallery.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white/80 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-5 py-4">
                  <div>
                    <h3 className="text-lg font-semibold text-brand-navy">{eventGallery.name}</h3>
                    <p className="text-sm text-slate-600">
                      {eventGallery.date} · {eventGallery.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-blue">
                      {eventGallery.images.length} photos
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenGalleryEvents((prev) =>
                          prev.includes(eventGallery.id)
                            ? prev.filter((id) => id !== eventGallery.id)
                            : [...prev, eventGallery.id]
                        )
                      }
                      className="btn-ghost px-3 py-1 text-xs"
                      aria-expanded={openGalleryEvents.includes(eventGallery.id)}
                      aria-controls={`event-gallery-${eventGallery.id}`}
                    >
                      {openGalleryEvents.includes(eventGallery.id) ? "Hide Photos" : "Show Photos"}
                    </button>
                  </div>
                </div>

                {openGalleryEvents.includes(eventGallery.id) && (
                  <div
                    id={`event-gallery-${eventGallery.id}`}
                    className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4"
                  >
                    {eventGallery.images.map((image, index) => (
                      <button
                        key={`${eventGallery.id}-${index}`}
                        type="button"
                        onClick={() =>
                          setActiveGalleryImage({
                            src: image,
                            alt: `${eventGallery.name} gallery image ${index + 1}`,
                            eventName: eventGallery.name
                          })
                        }
                        className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                      >
                        <img
                          src={image}
                          alt={`${eventGallery.name} gallery image ${index + 1}`}
                          className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-navy opacity-0 transition group-hover:opacity-100">
                          View full image
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-600">
            No gallery images available yet. Add some from Admin.
          </div>
        )}
      </section>

      {activeGalleryImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm"
          onClick={() => setActiveGalleryImage(null)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/20 bg-black/80 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveGalleryImage(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-800 hover:bg-white"
            >
              Close
            </button>
            <div className="absolute left-4 top-4 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
              {activeGalleryImage.eventName}
            </div>
            <img
              src={activeGalleryImage.src}
              alt={activeGalleryImage.alt}
              className="max-h-[85vh] w-full object-contain"
              onError={(event) => {
                const target = event.currentTarget;
                if (target.dataset.fallbackApplied) {
                  return;
                }
                target.dataset.fallbackApplied = "true";
                target.src = "/event.jpg";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
