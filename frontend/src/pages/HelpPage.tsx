import Hero from "../components/Hero";
import SectionHeader from "../components/common/SectionHeader";
import { Phone, Mail, HeartHandshake } from "lucide-react";

const HelpPage = () => {
  return (
    <div className="space-y-16">
      <Hero
        title="Counseling"
        highlight="Care & Support"
        subtitle="Pastoral care, prayer support, and a listening ear whenever you need it."
        image="/kkk.jpeg"
        gradient="indigo"
      />

      <section className="section-shell">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card text-left">
            <SectionHeader
              eyebrow="Get Support"
              title="Speak with our pastor"
              subtitle="Reach out for counseling, prayer, or to share a testimony. We keep your details confidential."
              alignment="left"
            />
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/70 p-4">
                <Phone className="h-5 w-5 text-brand-blue" />
                <div>
                  <p className="text-sm font-semibold text-brand-navy">Call directly</p>
                  <a href="tel:+2348023457416" className="text-sm text-brand-indigo hover:underline">
                    +234 802 345 7416
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/70 p-4">
                <Mail className="h-5 w-5 text-brand-blue" />
                <div>
                  <p className="text-sm font-semibold text-brand-navy">Email the care team</p>
                  <a
                    href="mailto:bconitirimedia@gmail.com"
                    className="text-sm text-brand-indigo hover:underline"
                  >
                    bconitirimedia@gmail.com
                  </a>
                </div>
              </div>
              <p className="text-sm text-slate-600">
                Prefer an in-person conversation? Meet us after service or schedule a session through the contact
                form. We respond within 24 hours.
              </p>
            </div>
          </div>

          <div className="card flex flex-col gap-4 text-left">
            <div className="flex items-center gap-3 rounded-2xl bg-brand-blue/10 p-4 text-brand-navy">
              <HeartHandshake className="h-6 w-6 text-brand-blue" />
              <div>
                <p className="text-sm font-semibold">We listen first.</p>
                <p className="text-sm text-slate-600">
                  Every story matters—our team offers prayer, counsel, and practical next steps.
                </p>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-700">
              <li>• Marriage & family counseling</li>
              <li>• Career and academic guidance</li>
              <li>• Emotional and spiritual support</li>
              <li>• Prayer for healing and deliverance</li>
            </ul>
            <a href="/contact" className="btn-primary w-fit">
              Use contact form
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpPage;
