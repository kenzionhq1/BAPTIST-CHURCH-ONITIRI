import { Link, NavLink } from "react-router-dom";
import { Facebook, Instagram, Mail, Phone, Youtube, Home, Video, Calendar, Heart } from "lucide-react";

const quickLinks = [
  { label: "About", to: "/about" },
  { label: "Sermons", to: "/sermons" },
  { label: "Events", to: "/events" },
  { label: "Resources", to: "/resources" },
  { label: "Giving", to: "/giving" },
  { label: "Contact", to: "/contact" },
  { label: "Counseling", to: "/help" }
];

const Footer = () => {
  return (
    <footer className="mt-16 bg-gradient-to-b from-brand-navy via-[#0A234F] to-[#081a3d] text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-25" style={{backgroundImage:"radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 30%), radial-gradient(circle at 80% 10%, rgba(250,204,21,0.18), transparent 25%)"}} />
      <div className="section-shell gap-10 relative">
        <div className="hidden md:grid gap-10 md:grid-cols-3 items-start">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/Unknown-removebg-preview.png"
                alt="Baptist Church Onitiri, Yaba logo"
                className="h-16 w-20 object-contain drop-shadow-sm md:h-18 md:w-22"
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
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-brand-gold">Baptist Church</p>
                <p className="text-lg font-semibold">Onitiri, Yaba</p>
              </div>
            </div>
            <p className="text-sm text-slate-200/80">
              Serving God. Loving People. Changing Lives.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200/80">
              <Mail className="h-4 w-4" />
              <a className="hover:text-brand-gold" href="mailto:info@bconitiri.org">
                info@bconitiri.org
              </a>
              <Phone className="h-4 w-4" />
              <a className="hover:text-brand-gold" href="tel:+2348034763402">
                +234 803 476 3402
              </a>
            </div>
            <a
              className="text-sm text-brand-gold hover:underline"
              target="_blank"
              rel="noreferrer"
              href="https://www.google.com/maps/place/14+Lawani+St,+Onike,+Lagos+101245,+Lagos"
            >
              14 Lawani St, Onike, Lagos 101245, Lagos
            </a>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Quick Links
            </h4>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {quickLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-lg px-2 py-2 text-sm text-slate-100/90 transition hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Connect
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com/bconitiri"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white/10 p-2 text-white transition hover:bg-brand-gold hover:text-brand-navy"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/@bconitiri"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white/10 p-2 text-white transition hover:bg-brand-gold hover:text-brand-navy"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/bconitiri"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white/10 p-2 text-white transition hover:bg-brand-gold hover:text-brand-navy"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-slate-200/80">
              <Link to="/privacy-policy" className="hover:text-brand-gold">
                Privacy Policy
              </Link>
              <span aria-hidden="true">•</span>
              <Link to="/terms" className="hover:text-brand-gold">
                Terms
              </Link>
              <span aria-hidden="true">•</span>
              <Link to="/cookies" className="hover:text-brand-gold">
                Cookies
              </Link>
            </div>
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Baptist Church Onitiri, Yaba. All rights reserved.
            </p>
          </div>
        </div>

        {/* Mobile compact footer */}
        <div className="md:hidden flex flex-col gap-4 text-sm text-slate-100 pb-20">
          <div className="flex items-center gap-3">
            <img
              src="/Unknown-removebg-preview.png"
              alt="Baptist Church Onitiri, Yaba logo"
              className="h-16 w-20 object-contain drop-shadow-sm"
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
            <div className="leading-tight">
              <p className="text-xs uppercase tracking-[0.12em] text-brand-gold">Baptist Church</p>
              <p className="text-base font-semibold">Onitiri, Yaba</p>
            </div>
          </div>
          <a
            className="text-sm text-brand-gold hover:underline"
            target="_blank"
            rel="noreferrer"
            href="https://www.google.com/maps/place/14+Lawani+St,+Onike,+Lagos+101245,+Lagos"
          >
            14 Lawani St, Onike, Lagos 101245, Lagos
          </a>
          <div className="flex flex-wrap gap-3 text-xs text-slate-200/90">
            <Link to="/privacy-policy" className="hover:text-brand-gold">
              Privacy
            </Link>
            <span aria-hidden="true">•</span>
            <Link to="/terms" className="hover:text-brand-gold">
              Terms
            </Link>
            <span aria-hidden="true">•</span>
            <Link to="/cookies" className="hover:text-brand-gold">
              Cookies
            </Link>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Baptist Church Onitiri, Yaba. All rights reserved.
          </p>
        </div>
      </div>

      {/* Mobile sticky bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-brand-navy/95 backdrop-blur-md border-t border-white/20">
        <nav className="grid grid-cols-5 gap-2 p-3 h-16 items-center text-white">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs group ${isActive ? "text-brand-gold" : ""}`
            }
          >
            <Home className="w-6 h-6 opacity-80 group-hover:opacity-100" />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/sermons"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs group ${isActive ? "text-brand-gold" : ""}`
            }
          >
            <Video className="w-6 h-6 opacity-80 group-hover:opacity-100" />
            <span>Sermons</span>
          </NavLink>
          <NavLink
            to="/events"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs group ${isActive ? "text-brand-gold" : ""}`
            }
          >
            <Calendar className="w-6 h-6 opacity-80 group-hover:opacity-100" />
            <span>Events</span>
          </NavLink>
          <NavLink
            to="/giving"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs group ${isActive ? "text-brand-gold" : ""}`
            }
          >
            <Heart className="w-6 h-6 opacity-80 group-hover:opacity-100" />
            <span>Give</span>
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs group ${isActive ? "text-brand-gold" : ""}`
            }
          >
            <Phone className="w-6 h-6 opacity-80 group-hover:opacity-100" />
            <span>Contact</span>
          </NavLink>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
