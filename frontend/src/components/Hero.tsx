import { ReactNode } from "react";
import clsx from "clsx";
import { Clock, MapPin, Calendar, ArrowRight, PlayCircle } from "lucide-react";

type HeroProps = {
  title: string;
  highlight?: string;
  subtitle?: string;
  cta?: ReactNode;
  image?: string;
};

const Hero = ({ title, highlight, subtitle, cta, image = "/HERO.jpg" }: HeroProps) => {
  return (
    <section className="relative isolate overflow-hidden bg-brand-navy">
      {/* Background Image with Dark Vignette Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src={image}
          alt="Baptist Church Onitiri Worship"
          className="h-full w-full object-cover object-center opacity-30 scale-105 filter contrast-105"
          loading="eager"
          onError={(event) => {
            const target = event.currentTarget;
            if (target.dataset.fallbackApplied) return;
            target.dataset.fallbackApplied = "true";
            target.src = "/HERO.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/80 to-brand-navy/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          
          {/* Main Hero Copy */}
          <div className="flex flex-col items-start gap-5 text-left">
            
            {/* Live / Location Pill Chip */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Onike, Yaba • Lagos, Nigeria
              </span>
            </div>

            <h1 className="text-3xl font-extrabold leading-[1.15] text-white sm:text-5xl lg:text-6xl tracking-tight">
              {title}{" "}
              {highlight && (
                <span className="block text-amber-400 mt-1 font-black">
                  {highlight}
                </span>
              )}
            </h1>

            {subtitle && (
              <p className="max-w-xl text-base text-slate-300 sm:text-lg leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* CTAs */}
            {cta && (
              <div className="mt-2 flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {cta}
              </div>
            )}
          </div>

          {/* Floating Figma-Grade Next Service Card Widget */}
          <div className="relative w-full">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-brand-blue/30 to-amber-500/20 blur-2xl opacity-60" />
            <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-amber-400">
                  <Calendar className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Next Gathering</span>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                  Onsite & Online
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white tracking-tight">Sunday Worship Service</h3>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Clock className="h-4 w-4 text-sky-400" />
                  <span>8:00 AM & 10:00 AM (West Africa Time)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <MapPin className="h-4 w-4 text-amber-400" />
                  <span>14 Lawani Street, Onike, Yaba, Lagos</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="https://www.google.com/maps/place/14+Lawani+St,+Onike,+Lagos+101245,+Lagos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-amber text-xs py-3 w-full sm:w-auto justify-center font-bold"
                >
                  <MapPin className="h-4 w-4" /> Get Directions
                </a>
                <a
                  href="#service-times"
                  className="btn-ghost text-xs py-3 w-full sm:w-auto justify-center border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  View Schedule
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
