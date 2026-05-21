import { about } from "@/lib/content";

function renderParagraph(text: string) {
  const parts = text.split(/(\*\*[^*]+?\*\*|\*[^*]+?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-ink font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function About() {
  return (
    <section id="about" className="py-20 md:py-28 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="text-xs font-semibold tracking-widest text-indigo uppercase mb-4">
            {about.eyebrow}
          </p>
          <h2 className="font-serif text-5xl md:text-6xl text-navy leading-tight whitespace-pre-line">
            {about.headline}
          </h2>
        </div>

        <div className="grid md:grid-cols-[1fr_300px] gap-12 md:gap-20 items-start">
          <div className="flex flex-col gap-6">
            {about.paragraphs.map((para, i) => (
              <p key={i} className="text-base text-muted leading-relaxed">
                {renderParagraph(para)}
              </p>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 sticky top-24">
            <div className="mb-6 pb-6 border-b border-border">
              <div className="w-12 h-12 bg-indigo/10 rounded-full flex items-center justify-center mb-4">
                <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
                  <polygon points="20,2 38,20 20,38 2,20" fill="#4338CA" />
                  <polygon points="20,8 32,20 20,32 8,20" fill="#EEF2FF" />
                  <polygon points="20,14 26,20 20,26 14,20" fill="#4338CA" />
                </svg>
              </div>
              <div className="text-sm font-semibold text-ink">Rupesh Panda</div>
              <div className="text-xs text-muted mt-0.5">Enterprise AI Practitioner</div>
            </div>
            <dl className="flex flex-col gap-4">
              {about.facts.map((fact) => (
                <div key={fact.key}>
                  <dt className="text-xs font-semibold text-muted uppercase tracking-wider mb-0.5">
                    {fact.key}
                  </dt>
                  <dd className="text-sm text-ink leading-snug">{fact.val}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
