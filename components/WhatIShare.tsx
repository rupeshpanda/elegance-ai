import { FileText, Terminal, Users } from "lucide-react";
import { SectionLabel } from "./SectionLabel";

const ICONS = [FileText, Terminal, Users];

type WhatIShareData = {
  eyebrow: string;
  headline: string;
  sub: string;
  items: { num: string; title: string; desc: string; link: string; cta: string }[];
};

export default function WhatIShare({ data }: { data: WhatIShareData }) {
  return (
    <section className="px-6 py-12 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-8 md:mb-14">
          <SectionLabel text="WHAT I DO" />
          <h2 className="font-serif text-5xl md:text-6xl text-navy leading-tight mb-5 whitespace-pre-line">
            {data.headline}
          </h2>
          <p className="text-base text-muted leading-relaxed">{data.sub}</p>
        </div>

        <div className="grid md:grid-cols-3">
          {data.items.map((item, idx) => {
            const Icon = ICONS[idx] ?? FileText;
            const isLast = idx === data.items.length - 1;
            return (
              <div
                key={item.num}
                className={[
                  "flex flex-col gap-5 py-8 md:py-0",
                  idx > 0 ? "md:pl-8" : "",
                  !isLast ? "md:pr-8" : "",
                  !isLast ? "border-b md:border-b-0 md:border-r border-border" : "",
                ].filter(Boolean).join(" ")}
              >
                <div className="flex items-start gap-4">
                  <Icon
                    size={22}
                    style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }}
                    strokeWidth={1.5}
                  />
                  <span
                    className="text-xs font-semibold tracking-widest font-sans"
                    style={{ color: "var(--muted)" }}
                  >
                    {item.num}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-navy mb-3">{item.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                </div>
                <a
                  href={item.link}
                  className="mt-auto text-sm font-medium self-start pb-0.5"
                  style={{ color: "var(--accent)", borderBottom: "1px solid var(--accent-light)", textDecoration: "none" }}
                >
                  {item.cta} →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
