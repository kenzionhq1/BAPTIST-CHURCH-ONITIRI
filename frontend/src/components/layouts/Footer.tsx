import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, Phone, Youtube, MapPin } from "lucide-react";

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
    <footer className="bg-[#09172A] text-slate-200 relative overflow-hidden border-t border-white/10 pt-12 pb-24 md:pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 items-start">
          
          {/* Church Info */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 p-1 backdrop-blur-md">
                <img
                  src="/Unknown-removebg-preview.png"
                  alt="Baptist Church Onitiri logo"
                  className="h-10 w-10 object-contain drop-shadow"
                  loading="lazy"
                  onError={(event) => {
                    const target = event.currentTarget;
                    if (target.dataset.fallbackApplied) return;
                    target.dataset.fallbackApplied = "true";
                    target.src = "/HERO.jpg";
                  }}
                />
              </div>
              <div className="leading-tight">
                <p className="text-[10px] uppercase font-bold tracking-[0.14em] text-amber-400">Baptist Church</p>
                <p className="text-base font-extrabold text-white">Onitiri, Yaba</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Loving God, building people, and impacting our community across Yaba and Lagos.
            </p>
            <div className="space-y-1.5 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-sky-400" />
                <a href="mailto:info@bconitiri.org" className="hover:text-amber-400 transition">info@bconitiri.org</a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                <a href="tel:+2348034763402" className="hover:text-amber-400 transition">+234 803 476 3402</a>
              </p>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              {quickLinks.slice(0, 4).map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-slate-300 hover:text-white transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ministries & Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              Ministries
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              {quickLinks.slice(4).map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-slate-300 hover:text-white transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials & Location */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Connect & Gather
            </h4>
            <a
              href="https://www.google.com/maps/place/14+Lawani+St,+Onike,+Lagos+101245,+Lagos"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-start gap-2 text-xs text-slate-300 hover:text-amber-400 transition"
            >
              <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>14 Lawani Street, Onike, Yaba, Lagos</span>
            </a>

            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://facebook.com/bconitiri"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-amber-400 hover:text-slate-950 transition"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com/@bconitiri"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-amber-400 hover:text-slate-950 transition"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/bconitiri"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-amber-400 hover:text-slate-950 transition"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Baptist Church Onitiri, Yaba. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-slate-200">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-200">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-slate-200">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
