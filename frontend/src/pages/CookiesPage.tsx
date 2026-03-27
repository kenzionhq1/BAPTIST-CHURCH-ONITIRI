import SectionHeader from "../components/common/SectionHeader";

const points = [
  {
    title: "What Are Cookies?",
    body: "Small text files stored on your device to remember preferences and understand site usage."
  },
  {
    title: "How We Use Them",
    list: [
      "Essential cookies to keep the site secure and functioning.",
      "Analytics to improve content and measure engagement.",
      "Preference cookies to remember your choices (e.g., banner dismissal)."
    ]
  },
  {
    title: "Your Choices",
    list: [
      "Use the cookie banner to accept or reject non-essential cookies.",
      "Adjust your browser settings to block cookies.",
      "Clearing cookies may impact certain experiences."
    ]
  }
];

const CookiesPage = () => {
  return (
    <section className="section-shell">
      <div className="card mx-auto max-w-4xl text-left">
        <SectionHeader
          eyebrow="Privacy"
          title="Cookie Preferences"
          subtitle="Manage how we use cookies to personalize and improve your experience."
          alignment="left"
        />
        <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700">
          {points.map((item) => (
            <div key={item.title} className="space-y-2">
              <h3 className="text-lg font-semibold text-brand-navy">{item.title}</h3>
              {item.body && <p>{item.body}</p>}
              {item.list && (
                <ul className="list-disc space-y-1 pl-5">
                  {item.list.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <p className="text-xs text-slate-500">
            You can revisit this page anytime from the footer links to review or change your preferences.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CookiesPage;
