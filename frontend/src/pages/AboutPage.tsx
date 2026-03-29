import SectionHeader from "../components/common/SectionHeader";
import Hero from "../components/Hero";

const AboutPage = () => {
  return (
    <div className="space-y-16">
      <Hero
        title="About"
        highlight="Baptist Church Onitiri, Yaba"
        subtitle="You are important to God; you are why we exist. We change lives and raise transformational leaders for Christ."
        image="/bb.jpg"
        gradient="indigo"
        cta={
          <a
            href="https://www.google.com/maps/place/14+Lawani+St,+Onike,+Lagos+101245,+Lagos"
            className="btn-primary"
          >
            Visit Us
          </a>
        }
      />

      <section className="section-shell">
        <SectionHeader
          eyebrow="Welcome"
          title="Welcome to Baptist Church Onitiri, Yaba"
          subtitle="We glorify God, spread His love, and uplift our community through worship, discipleship, and service."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card text-left">
            <h3 className="text-xl font-semibold text-brand-navy">Our Vision</h3>
            <p className="mt-2 text-slate-600">To change lives and raise transformational leaders for Christ.</p>
          </div>
          <div className="card text-left">
            <h3 className="text-xl font-semibold text-brand-navy">Our Mission</h3>
            <p className="mt-2 text-slate-600">
              To glorify God, spread His love, and uplift the community through worship, discipleship, and service.
            </p>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <SectionHeader
          eyebrow="Team"
          title="Meet Our Deacons"
          subtitle="Leaders who steward our vision and care for our people."
        />
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-center text-sm text-slate-600">
          <p className="font-semibold text-brand-navy">Deacon profiles coming soon</p>
          <p className="mt-2 text-slate-600">We're preparing information about our leadership team. Check back soon!</p>
        </div>
      </section>

      <section className="section-shell">
        <SectionHeader
          eyebrow="Leadership"
          title="Meet Our Pastors"
          subtitle="Shepherds equipping the saints for the work of ministry."
        />
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-center text-sm text-slate-600">
          <p className="font-semibold text-brand-navy">Pastoral profiles coming soon</p>
          <p className="mt-2 text-slate-600">We're preparing detailed information about our pastoral team. Thank you for your patience!</p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
