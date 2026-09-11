import { Link, NavLink, useLocation } from "react-router-dom";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { Menu, X, MapPin, Heart, Tv, Calendar, PhoneCall } from "lucide-react";

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
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#09172A]/90 backdrop-blur-xl shadow-md transition-all">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 p-1 backdrop-blur-md transition group-hover:scale-105">
              <img
                src="/Unknown-removebg-preview.png"
                alt="Baptist Church Onitiri logo"
                className="h-10 w-10 object-contain drop-shadow"
                loading="eager"
                onError={(event) => {
                  const target = event.currentTarget;
                  if (target.dataset.fallbackApplied) return;
                  target.dataset.fallbackApplied = "true";
                  target.src = "/HERO.jpg";
                }}
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-400">
                Baptist Church
              </span>
              <span className="text-base font-extrabold text-white tracking-tight">Onitiri, Yaba</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-150",
                    isActive
                      ? "bg-white/20 text-white shadow-inner"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/giving" className="ml-2 btn-amber text-xs py-2 px-5 min-h-[38px]">
              <Heart className="h-3.5 w-3.5 fill-current" /> Give
            </Link>
          </nav>

          {/* Mobile Menu Trigger Button */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all active:scale-95 md:hidden border border-white/15"
          >
            {open ? <X className="h-5 w-5 text-amber-400" /> : <Menu className="h-5 w-5 text-white" />}
          </button>
        </div>
      </header>

      {/* Figma-Style Mobile Fullscreen Sheet Modal */}
      <div
        className={clsx(
          "fixed inset-0 z-50 transition-all duration-300 md:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />

        {/* Slide-over Drawer Sheet */}
        <div
          className={clsx(
            "absolute inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-[#09172A] p-6 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out border-l border-white/10",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div>
            {/* Mobile Sheet Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <img
                  src="/Unknown-removebg-preview.png"
                  alt="Church logo"
                  className="h-9 w-9 object-contain"
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-400">
                    Baptist Church
                  </span>
                  <span className="text-sm font-bold text-white">Onitiri</span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition active:scale-90"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="mt-5 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150",
                      isActive
                        ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    )
                  }
                >
                  <span>{item.label}</span>
                  <span className="text-xs opacity-40">→</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Quick Action Buttons & Details at Bottom of Mobile Sheet */}
          <div className="space-y-3 pt-6 border-t border-white/10">
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/sermons"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-white/10 py-2.5 text-xs font-semibold text-white transition hover:bg-white/15"
              >
                <Tv className="h-3.5 w-3.5 text-sky-400" /> Watch Live
              </Link>
              <a
                href="https://www.google.com/maps/place/14+Lawani+St,+Onike,+Lagos+101245,+Lagos"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-white/10 py-2.5 text-xs font-semibold text-white transition hover:bg-white/15"
              >
                <MapPin className="h-3.5 w-3.5 text-amber-400" /> Location
              </a>
            </div>

            <Link to="/giving" className="btn-amber w-full justify-center text-sm font-bold shadow-lg">
              <Heart className="h-4 w-4 fill-current" /> Give & Support
            </Link>

            <p className="text-center text-[11px] text-slate-400 pt-1">
              14 Lawani Street, Onike, Yaba, Lagos
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
