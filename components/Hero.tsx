import { hero } from "@/lib/content";

export default function Hero() {
  return (
    <section className="pt-32 pb-20 md:pt-44 md:pb-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-indigo uppercase mb-6">
            {hero.eyebrow}
          </p>

          <h1 className="font-serif text-5xl md:text-6xl lg:text-[4.5rem] text-navy leading-[1.08] mb-8">
            {hero.headline.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="text-lg text-muted leading-relaxed mb-10 max-w-2xl">
            {hero.sub}
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <a
              href={hero.cta1.href}
              className="px-6 py-3 bg-indigo text-white text-sm font-medium rounded-full hover:bg-indigo-dark transition-colors"
            >
              {hero.cta1.label}
            </a>
            <a
              href={hero.cta2.href}
              className="px-6 py-3 border border-border text-sm font-medium text-navy rounded-full hover:border-navy transition-colors"
            >
              {hero.cta2.label}
            </a>
          </div>

          <p className="text-sm text-muted mb-20">
            <span className="text-ink font-medium">{hero.byline.name}</span>
            {" · "}
            {hero.byline.role}
          </p>
        </div>

        <div className="border-t border-border pt-10 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-4xl md:text-5xl text-navy mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <figure className="border-l-2 border-indigo pl-6 py-1 max-w-2xl">
          <blockquote className="text-base md:text-lg text-ink leading-relaxed mb-3 font-serif italic">
            &ldquo;{hero.quote.text}&rdquo;
          </blockquote>
          <figcaption className="text-xs text-muted uppercase tracking-wider">
            &mdash; {hero.quote.cite}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
