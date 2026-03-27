import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Sermons", to: "/sermons" },
  { label: "Events", to: "/events" },
  { label: "Resources", to: "/resources" },
  { label: "Giving", to: "/giving" },
  { label: "Contact", to: "/contact" },
  { label: "Counseling", to: "/help" }
];

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-brand-navy/70 backdrop-blur-xl shadow-md transition-colors">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-5 md:px-8">
        <Link to="/" className="flex items-center gap-2 sm:gap-3">
          <img
            src="/Unknown-removebg-preview.png"
            alt="Baptist Church Onitiri logo"
            className="h-16 w-20 object-contain drop-shadow-sm md:h-20 md:w-24"
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
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold uppercase tracking-[0.08em] text-white">
              Baptist Church
            </span>
            <span className="text-base font-bold text-white">Onitiri</span>
          </div>
        </Link>

        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={open}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white shadow-sm transition hover:border-white hover:bg-white/20 sm:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <nav className="hidden sm:flex sm:items-center sm:justify-end sm:gap-3 [text-shadow:0_1px_6px_rgba(0,0,0,0.35)]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  isActive
                    ? "bg-white/20 text-white shadow"
                    : "text-white hover:text-white"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/giving" className="btn-primary">
            Give
          </Link>
        </nav>
      </div>

      <div
        className={clsx(
          "sm:hidden transition-all duration-200 ease-out",
          open ? "max-h-[460px] opacity-100 pointer-events-auto" : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="mx-4 mb-3 flex flex-col rounded-2xl border border-slate-200 bg-white/95 shadow-lg backdrop-blur-xl">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                clsx(
                  "px-4 py-3 text-sm font-semibold transition hover:bg-brand-blue/10",
                  isActive ? "text-brand-navy" : "text-slate-700"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="border-t border-slate-100 px-4 py-3">
            <Link
              to="/giving"
              onClick={() => setOpen(false)}
              className="btn-primary w-full justify-center"
            >
              Support the mission
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
