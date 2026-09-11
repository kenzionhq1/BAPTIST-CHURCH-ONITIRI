import { Link } from "react-router-dom";
import { Tv, Heart, MapPin, Calendar } from "lucide-react";

const MobileActionBar = () => {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-30 md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around rounded-full border border-white/20 bg-[#09172A]/90 p-2 shadow-2xl backdrop-blur-xl text-white">
        <a
          href="/#service-times"
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-semibold text-slate-300 transition active:scale-95 hover:text-white"
        >
          <Calendar className="h-4 w-4 text-amber-400" />
          <span>Worship</span>
        </a>

        <Link
          to="/sermons"
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-semibold text-slate-300 transition active:scale-95 hover:text-white"
        >
          <Tv className="h-4 w-4 text-sky-400" />
          <span>Sermons</span>
        </Link>

        <Link
          to="/giving"
          className="flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-xs font-extrabold text-slate-950 shadow-md transition active:scale-95"
        >
          <Heart className="h-3.5 w-3.5 fill-current" />
          <span>Give</span>
        </Link>

        <a
          href="https://www.google.com/maps/place/14+Lawani+St,+Onike,+Lagos+101245,+Lagos"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-semibold text-slate-300 transition active:scale-95 hover:text-white"
        >
          <MapPin className="h-4 w-4 text-emerald-400" />
          <span>Map</span>
        </a>
      </div>
    </div>
  );
};

export default MobileActionBar;
