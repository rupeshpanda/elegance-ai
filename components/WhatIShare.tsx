import { whatIShare } from "@/lib/content";

export default function WhatIShare() {
  return (
    <section className="py-20 md:py-28 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-16">
          <p className="text-xs font-semibold tracking-widest text-indigo uppercase mb-4">
            {whatIShare.eyebrow}
          </p>
          <h2 className="font-serif text-5xl md:text-6xl text-navy leading-tight mb-5 whitespace-pre-line">
            {whatIShare.headline}
          </h2>
          <p className="text-base text-muted leading-relaxed">{whatIShare.sub}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-border">
          {whatIShare.items.map((item) => (
            <div key={item.num} className="bg-bg p-8 md:p-10 flex flex-col gap-5">
              <span className="text-xs font-semibold text-indigo tracking-widest font-sans">
                {item.num}
              </span>
              <div>
                <h3 className="font-serif text-2xl text-navy mb-3">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
              <a
                href={item.link}
                className="mt-auto text-sm font-medium text-navy border-b border-navy/30 self-start hover:border-navy transition-colors pb-0.5"
              >
                {item.cta} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
