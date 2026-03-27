import { useState } from "react";
import SectionHeader from "../components/common/SectionHeader";
import Hero from "../components/Hero";
import { givingOptions } from "../utils/data";

const GivingPage = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-16">
        <Hero
          title="Giving"
          highlight="Fuel the Mission"
          subtitle="Your generosity helps us spread the word of God and serve the community."
          image="/ss.jpg"
          gradient="indigo"
        />

      <section className="section-shell">
        <SectionHeader
          eyebrow="Partner"
          title="Support Our Ministry"
          subtitle="Choose a giving stream and see account details instantly."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {givingOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={`card text-left ${
                selected === option.id ? "ring-2 ring-brand-blue" : "ring-0"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-brand-navy">{option.title}</h3>
                <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">
                  {option.badge}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{option.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card text-left">
            <h3 className="text-lg font-semibold text-brand-navy">Account Details</h3>
            <p className="text-sm text-slate-600">Baptist Church Onitiri, Yaba</p>
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-brand-indigo">Bank:</span> Union Bank
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-brand-indigo">Account Number:</span> 0003868556
            </p>
          </div>

          <div className="card flex flex-col gap-4 text-left">
            <div>
              <p className="text-sm font-semibold text-brand-blue">Selected</p>
              <p className="text-lg font-bold text-brand-navy">
                {selected ? selected.toUpperCase() : "Choose an option"}
              </p>
            </div>
            <p className="text-sm text-slate-600">
              Please give via bank transfer or in person. Online payment isn’t enabled yet.
            </p>
            <div className="rounded-xl border border-brand-blue/20 bg-brand-blue/5 px-3 py-3 text-sm text-brand-navy">
              After transferring, you can notify the finance team at{" "}
              <a className="font-semibold underline" href="mailto:info@bconitiri.org">
                info@bconitiri.org
              </a>{" "}
              or via WhatsApp:{" "}
              <a className="font-semibold underline" href="tel:+2348034763402">
                +234 803 476 3402
              </a>
              .
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GivingPage;
