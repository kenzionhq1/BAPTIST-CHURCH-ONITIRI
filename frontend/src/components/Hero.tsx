import { ReactNode } from "react";
import clsx from "clsx";

type HeroProps = {
  title: string;
  highlight?: string;
  subtitle?: string;
  cta?: ReactNode;
  image?: string;
  gradient?: "blue" | "indigo";
};

const Hero = ({ title, highlight, subtitle, cta, image, gradient = "blue" }: HeroProps) => {
  return (
    <section className="relative overflow-hidden">
      <div
        className={clsx(
          "section-shell glass relative isolate overflow-hidden rounded-3xl border border-white/60 shadow-2xl",
          "bg-gradient-to-br",
          gradient === "blue"
            ? "from-white via-slate-50 to-brand-blue/10"
            : "from-white via-slate-50 to-brand-indigo/15"
        )}
      >
        {image && (
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20 blur-sm"
            loading="lazy"
            onError={(event) => {
              const target = event.currentTarget;
              if (target.dataset.fallbackApplied) {
                return;
              }
              target.dataset.fallbackApplied = "true";
              target.src = "/HERO.jpg";
            }}
          />
        )}
        <div className="relative z-10 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="flex flex-col gap-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-blue/80">
              Baptist Church Onitiri, Yaba
            </p>
            <h1 className="text-4xl font-bold leading-tight text-brand-navy md:text-5xl">
              {title}{" "}
              {highlight && <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-sky to-brand-gold">{highlight}</span>}
            </h1>
            {subtitle && <p className="max-w-2xl text-lg text-slate-600">{subtitle}</p>}
            {cta && <div className="flex flex-wrap gap-3">{cta}</div>}
          </div>
          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-gradient-to-br from-brand-blue/20 via-brand-gold/10 to-transparent blur-3xl" />
            <div className="glass relative mx-auto flex h-full min-h-[220px] max-w-md flex-col items-start justify-center gap-3 rounded-2xl bg-white/70 p-6">
              <p className="text-sm font-semibold text-brand-blue">This week at Onitiri</p>
              <p className="text-2xl font-bold text-brand-navy">Sunday Worship • 8:00 AM</p>
              <p className="text-sm text-slate-600">Join us onsite or online for vibrant worship and the word.</p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-navy">
                  Lagos, Nigeria
                </span>
                <span className="rounded-full bg-brand-gold/20 px-3 py-1 text-xs font-semibold text-brand-navy">
                  Family friendly
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
