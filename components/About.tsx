import Image from "next/image";
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

          <div className="bg-card border border-border rounded-2xl overflow-hidden sticky top-24">
            <div className="relative w-full aspect-[4/3]">
              <Image
                src="/rupesh.jpg.png"
                alt="Rupesh Panda"
                fill
                className="object-cover object-top"
                sizes="300px"
              />
            </div>
            <div className="p-8">
            <div className="mb-6 pb-6 border-b border-border">
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
      </div>
    </section>
  );
}
