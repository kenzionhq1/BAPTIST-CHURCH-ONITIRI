import SectionHeader from "../components/common/SectionHeader";

const sections = [
  {
    title: "Introduction",
    body:
      "We value your privacy. This notice explains how we collect, use, and protect your personal information when you interact with our website and online services."
  },
  {
    title: "Information We Collect",
    list: [
      "Contact information (name, email, phone) when you reach out to us.",
      "Voluntary submissions such as donations, event registrations, or prayer requests.",
      "Analytics data like browser type and general location to improve the experience."
    ]
  },
  {
    title: "How We Use Your Information",
    list: [
      "Respond to inquiries and prayer requests.",
      "Send newsletters, event notifications, and updates you opt into.",
      "Improve site performance, accessibility, and security."
    ]
  },
  {
    title: "Cookies & Tracking",
    body:
      "We use cookies to enhance browsing and measure engagement. You can accept or reject cookies via the preference banner."
  },
  {
    title: "Third-Party Services",
    body:
      "Embedded media (e.g., Facebook, YouTube) may use their own tracking tools. Review their privacy policies for details."
  },
  {
    title: "Data Security",
    body:
      "We apply reasonable safeguards, but no online transmission is 100% secure. Please avoid sending sensitive information."
  },
  {
    title: "Your Consent",
    body:
      "By using our site, you agree to this policy. If you disagree, please discontinue use."
  },
  {
    title: "Updates",
    body: "We may update this policy periodically. The “last updated” date will reflect changes."
  }
];

const PrivacyPage = () => {
  return (
    <section className="section-shell">
      <div className="card mx-auto max-w-5xl text-left">
        <SectionHeader
          eyebrow="Policy"
          title="Privacy Policy"
          subtitle="Last updated: April 2025"
          alignment="left"
        />

        <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700">
          {sections.map((section) => (
            <div key={section.title} className="space-y-2">
              <h3 className="text-lg font-semibold text-brand-navy">{section.title}</h3>
              {section.body && <p>{section.body}</p>}
              {section.list && (
                <ul className="list-disc space-y-1 pl-5">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <p className="text-sm text-slate-600">
            Questions? Email{" "}
            <a href="mailto:info@bconitiri.org" className="font-semibold text-brand-blue">
              info@bconitiri.org
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPage;
