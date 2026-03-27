import SectionHeader from "../components/common/SectionHeader";
import Hero from "../components/Hero";

const gallery = [
  { title: "Sunday School Director", name: "Mr. Wale Assagba" },
  { title: "Youth President", name: "Sis. Tobi Osopale" },
  { title: "Prayer Squad Lead", name: "Team Lead" },
  { title: "BSF President", name: "Campus Lead" }
];

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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.map((item) => (
            <div key={item.title} className="card text-left">
              <h4 className="text-lg font-semibold text-brand-navy">{item.title}</h4>
              <p className="text-sm text-slate-600">{item.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <SectionHeader
          eyebrow="Leadership"
          title="Meet Our Pastors"
          subtitle="Shepherds equipping the saints for the work of ministry."
        />
        <div className="card max-w-3xl text-left">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-brand-navy">Rev. &amp; Pastor (Mrs.)</h3>
            <p className="text-sm text-slate-600">Church Pastor and Pastormiss</p>
            <p className="text-sm text-slate-600">
              Passionate about teaching the Word, discipling believers, and empowering leaders to serve the city.
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-blue">Photos currently hidden</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
