import { useState } from "react";
import { Mail, MapPin, Phone, Users, MessageCircle } from "lucide-react";
import Hero from "../components/Hero";
import SectionHeader from "../components/common/SectionHeader";

type FormState = {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
};

const contactChannels = [
  {
    label: "Visit Us",
    value: "14 Lawani St, Onike, Lagos",
    icon: MapPin,
    action: "https://www.google.com/maps/place/14+Lawani+St,+Onike,+Lagos+101245,+Lagos"
  },
  {
    label: "Call the Office",
    value: "+234 803 476 3402",
    icon: Phone,
    action: "tel:+2348034763402"
  },
  {
    label: "Email",
    value: "info@bconitiri.org",
    icon: Mail,
    action: "mailto:info@bconitiri.org"
  },
  {
    label: "Counseling",
    value: "Pastoral care & prayer support",
    icon: Users,
    action: "/help"
  }
];

const ContactPage = () => {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    topic: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: "", email: "", phone: "", topic: "", message: "" });
  };

  return (
    <div className="space-y-16">
      <Hero
        title="Contact"
        highlight="Baptist Church Onitiri, Yaba"
        subtitle="We’re here to guide you on your spiritual journey—reach out anytime."
        image="/jj.webp"
        gradient="blue"
      />

      <section className="section-shell">
        <SectionHeader
          eyebrow="Connect"
          title="Talk With Us"
          subtitle="Reach the team quickly via phone, email, counseling, or stop by our campus."
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {contactChannels.map((item) => (
            <a
              key={item.label}
              href={item.action}
              className="card text-left no-underline"
              target={item.action.startsWith("http") ? "_blank" : undefined}
              rel={item.action.startsWith("http") ? "noreferrer" : undefined}
            >
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-brand-blue/10 p-3 text-brand-blue">
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-blue">
                {item.label}
              </p>
              <p className="text-sm font-medium text-brand-navy">{item.value}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="card text-left">
            <SectionHeader
              eyebrow="Message"
              title="Send us a note"
              subtitle="Share a prayer request, testimony, or ask a question. We typically respond within 24 hours."
              alignment="left"
            />
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700">
                  Full name
                  <input
                    required
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                    placeholder="Your name"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Email
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700">
                  Phone (optional)
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                    placeholder="+234..."
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Topic
                  <select
                    value={form.topic}
                    onChange={(e) => handleChange("topic", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                    required
                  >
                    <option value="">Select</option>
                    <option value="visit">Plan a visit</option>
                    <option value="counseling">Counseling</option>
                    <option value="prayer">Prayer request</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </div>

              <label className="text-sm font-semibold text-slate-700">
                Message
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                  placeholder="How can we support you?"
                />
              </label>

              <button type="submit" className="btn-primary">
                <MessageCircle className="h-4 w-4" />
                Send message
              </button>

              {submitted && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm font-semibold text-green-800">
                  Thank you! Your message has been received. We will reply soon.
                </div>
              )}
            </form>
          </div>

          <div className="card space-y-4 text-left">
            <SectionHeader
              eyebrow="Visit"
              title="Find us"
              subtitle="We are central to the UNILAG community with easy access from the mainland."
              alignment="left"
            />
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <iframe
                title="Map to Baptist Church Onitiri, Yaba"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.875740732221!2d3.382229874583345!3d6.514779993449254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8d5466fd6d2f%3A0x6f3a1d9e6b4d7d9f!2s14%20Lawani%20St%2C%20Onike%2C%20Lagos%20101245%2C%20Lagos%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1708965432101!5m2!1sen!2sus"
                className="h-72 w-full"
                loading="lazy"
                allowFullScreen
              />
            </div>
            <div className="glass rounded-2xl border border-brand-blue/20 p-4">
              <p className="text-sm font-semibold text-brand-indigo">Service Times</p>
              <p className="text-sm text-slate-600">Sundays 8:00 AM - 12:30 PM · Wednesdays 6:00 PM</p>
              <a
                href="https://www.google.com/maps/place/14+Lawani+St,+Onike,+Lagos+101245,+Lagos"
                className="btn-ghost mt-3"
              >
                Open in Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
