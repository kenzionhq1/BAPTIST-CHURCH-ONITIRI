import SectionHeader from "../components/common/SectionHeader";

const terms = [
  {
    title: "Acceptance of Terms",
    body:
      "By using this site you agree to comply with these terms. If you disagree, please discontinue use."
  },
  {
    title: "Use of Content",
    body:
      "Sermons, articles, and media are for personal and ministry use. Do not sell or misrepresent our content."
  },
  {
    title: "Event Registrations & Donations",
    body:
      "Submitting forms or donations implies consent to process your information for that purpose. Refunds are handled on a case-by-case basis."
  },
  {
    title: "External Links",
    body:
      "We may link to third-party sites. We are not responsible for their content or practices."
  },
  {
    title: "Limitation of Liability",
    body:
      "The site is provided “as is.” We are not liable for any indirect or consequential damages arising from its use."
  },
  {
    title: "Changes",
    body: "We may update these terms at any time. Continued use after changes constitutes acceptance."
  }
];

const TermsPage = () => {
  return (
    <section className="section-shell">
      <div className="card mx-auto max-w-5xl text-left">
        <SectionHeader
          eyebrow="Legal"
          title="Terms & Conditions"
          subtitle="Clear guidelines for using our website and content."
          alignment="left"
        />
        <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700">
          {terms.map((item) => (
            <div key={item.title} className="space-y-2">
              <h3 className="text-lg font-semibold text-brand-navy">{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TermsPage;
