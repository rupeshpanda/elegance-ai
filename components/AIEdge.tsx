import { SectionLabel } from "./SectionLabel";

type AIEdgeData = {
  eyebrow: string;
  headline: readonly string[];
  italicLine: string;
  desc: string;
  features: readonly string[];
  stats: { n: string; l: string }[];
  quote: { text: string; cite: string };
};

export default function AIEdge({ data }: { data: AIEdgeData }) {
  return (
    <section id="edge" className="py-8 md:py-10 px-6 bg-navy">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-6 md:mb-12">
          <SectionLabel text="FREE COMMUNITY" />
          <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-6 mt-2">
            {data.headline.map((line, i) => (
              <span
                key={i}
                className={`block ${
                  line === data.italicLine ? "italic text-indigo" : "text-white"
                }`}
              >
                {line}
              </span>
            ))}
          </h2>
          <p className="text-base text-white/60 leading-relaxed mb-8">{data.desc}</p>
          <a
            href="https://lu.ma/1fxx84io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo text-white text-sm font-medium rounded-full hover:bg-indigo-dark transition-colors"
          >
            Join for free →
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          <ul className="flex flex-col gap-4">
            {data.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-indigo flex-shrink-0" />
                <span className="text-sm text-white/70 leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>

          <div>
            <div className="grid grid-cols-2 gap-6 mb-10 pb-10 border-b border-white/10">
              {data.stats.map((stat) => (
                <div key={stat.l}>
                  <div className="font-serif text-3xl text-white mb-1">{stat.n}</div>
                  <div className="text-xs text-white/50 uppercase tracking-wider">{stat.l}</div>
                </div>
              ))}
            </div>

            <figure>
              <blockquote className="text-base text-white/80 leading-relaxed font-serif italic mb-3">
                &ldquo;{data.quote.text}&rdquo;
              </blockquote>
              <figcaption className="text-xs text-white/40 uppercase tracking-wider">
                &mdash; {data.quote.cite}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
