import Image from "next/image";
import { SectionLabel } from "./SectionLabel";

type AboutData = {
  eyebrow: string;
  headline: string;
  paragraphs: readonly string[];
  facts: { key: string; val: string }[];
};

function renderParagraph(text: string) {
  const parts = text.split(/(\*\*[^*]+?\*\*|\*[^*]+?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="text-ink font-semibold">{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    return <span key={i}>{part}</span>;
  });
}

export default function About({ data }: { data: AboutData }) {
  return (
    <section id="about" className="px-6 py-8 md:py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-5 md:mb-10">
          <SectionLabel text="ABOUT" />
          <h2 className="font-serif text-6xl md:text-7xl text-navy leading-tight whitespace-pre-line">
            {data.headline}
          </h2>
        </div>

        {/* Credential card FIRST, then prose */}
        <div className="grid md:grid-cols-[300px_1fr] gap-12 md:gap-20 items-start">
          {/* Credential card */}
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
              <dl className="flex flex-col gap-5">
                {data.facts.map((fact) => (
                  <div key={fact.key}>
                    <dt className="mb-1.5">
                      <span className="tag-badge">{fact.key}</span>
                    </dt>
                    <dd className="text-sm text-ink leading-snug">{fact.val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Prose */}
          <div className="flex flex-col gap-6">
            {data.paragraphs.map((para, i) => (
              <p key={i} className="text-base text-muted leading-relaxed">
                {renderParagraph(para)}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
