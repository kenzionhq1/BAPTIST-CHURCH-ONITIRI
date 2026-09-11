import { useState } from "react";
import Hero from "../components/Hero";
import { givingOptions } from "../utils/data";
import { Copy, Check, Heart, ShieldCheck, CreditCard, Building, Mail, Phone } from "lucide-react";

const GivingPage = () => {
  const [selected, setSelected] = useState<string>("tithe");
  const [copied, setCopied] = useState(false);
  const accountNumber = "0003868556";

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const currentOption = givingOptions.find((o) => o.id === selected) || givingOptions[0];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      <Hero
        title="Generosity & Giving"
        highlight="Fueling Kingdom Work"
        subtitle="Every gift supports gospel outreach, community welfare, and local ministry expressions."
        image="/ss.jpg"
      />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Heart className="h-3.5 w-3.5 fill-current text-amber-500" /> Faithful Stewardship
          </span>
          <h2 className="text-3xl font-extrabold sm:text-4xl text-brand-navy">
            Choose Your Giving Stream
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Select a designated ministry account below to direct your contribution.
          </p>
        </div>

        {/* Giving Category Selector Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {givingOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={`card-figma text-left flex flex-col justify-between transition-all duration-200 ${
                selected === option.id
                  ? "ring-2 ring-brand-blue bg-blue-50/40 border-brand-blue"
                  : "hover:border-slate-300"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-brand-navy">{option.title}</h3>
                  <span className="rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-[10px] font-bold text-brand-blue uppercase">
                    {option.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{option.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Bank Account Details Card with Copy Feedback */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-[#09172A] p-6 sm:p-8 text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Bank Transfer Details</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <ShieldCheck className="h-3.5 w-3.5" /> Official Account
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Account Name</p>
                <p className="text-xl font-bold text-white mt-0.5">Baptist Church Onitiri, Yaba</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Bank Name</p>
                  <p className="text-base font-bold text-sky-400 mt-0.5">Union Bank PLC</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Purpose</p>
                  <p className="text-base font-bold text-amber-400 mt-0.5">{currentOption.title}</p>
                </div>
              </div>

              {/* Copy Account Box */}
              <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-4 flex items-center justify-between backdrop-blur-md">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Account Number</p>
                  <p className="text-2xl font-mono font-extrabold text-white tracking-widest mt-0.5">
                    {accountNumber}
                  </p>
                </div>
                <button
                  onClick={handleCopy}
                  className="btn-amber text-xs py-2.5 px-4 font-bold flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-slate-950" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy Number
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Transfer Notification Note */}
          <div className="card-figma flex flex-col justify-between p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-blue">
                Confirmation & Inquiries
              </span>
              <h3 className="text-xl font-bold text-brand-navy">Notify Finance Team</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                After completing your bank transfer, you can send a receipt or notification to our finance team for proper accounting and acknowledgment.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <a
                href="https://wa.me/2348034763402"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 hover:bg-slate-100 transition group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-navy">WhatsApp Finance Desk</p>
                  <p className="text-xs text-slate-500">+234 803 476 3402</p>
                </div>
              </a>

              <a
                href="mailto:info@bconitiri.org"
                className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 hover:bg-slate-100 transition group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue text-white font-bold">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-navy">Email Confirmation</p>
                  <p className="text-xs text-slate-500">info@bconitiri.org</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GivingPage;
