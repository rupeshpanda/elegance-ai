import { aiEdge } from "@/lib/content";

export default function AIEdge() {
  return (
    <section id="edge" className="py-20 md:py-28 px-6 bg-navy">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-semibold tracking-widest text-indigo uppercase mb-4">
            {aiEdge.eyebrow}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
            {aiEdge.headline.map((line, i) => (
              <span
                key={i}
                className={`block ${
                  line === aiEdge.italicLine
                    ? "italic text-indigo"
                    : "text-white"
                }`}
              >
                {line}
              </span>
            ))}
          </h2>
          <p className="text-base text-white/60 leading-relaxed">{aiEdge.desc}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          <ul className="flex flex-col gap-4">
            {aiEdge.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-indigo flex-shrink-0" />
                <span className="text-sm text-white/70 leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>

          <div>
            <div className="grid grid-cols-2 gap-6 mb-10 pb-10 border-b border-white/10">
              {aiEdge.stats.map((stat) => (
                <div key={stat.l}>
                  <div className="font-serif text-3xl text-white mb-1">{stat.n}</div>
                  <div className="text-xs text-white/50 uppercase tracking-wider">{stat.l}</div>
                </div>
              ))}
            </div>

            <figure>
              <blockquote className="text-base text-white/80 leading-relaxed font-serif italic mb-3">
                &ldquo;{aiEdge.quote.text}&rdquo;
              </blockquote>
              <figcaption className="text-xs text-white/40 uppercase tracking-wider">
                &mdash; {aiEdge.quote.cite}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
