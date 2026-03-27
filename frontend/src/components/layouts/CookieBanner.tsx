import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleChoice = (value: "true" | "false") => {
    localStorage.setItem("cookiesAccepted", value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-4">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl md:flex md:items-center md:justify-between md:gap-4">
        <div className="text-sm text-slate-700">
          We use cookies to improve your experience. By using our site, you agree to our{" "}
          <Link to="/cookies" className="font-semibold text-brand-blue underline">
            cookie preference
          </Link>
          .
        </div>
        <div className="mt-3 flex gap-2 md:mt-0">
          <button onClick={() => handleChoice("false")} className="btn-ghost px-4 py-2">
            Reject
          </button>
          <button onClick={() => handleChoice("true")} className="btn-primary px-4 py-2">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
