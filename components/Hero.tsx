"use client";
import Image from "next/image";

type HeroData = {
  headline: readonly string[];
  sub: string;
  cta1: { label: string; href: string };
  cta2: { label: string; href: string };
  stats: { value: string; label: string }[];
};

export default function Hero({ data }: { data: HeroData }) {
  return (
    <section className="px-6 py-10 md:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Two-column grid: text left, photo right */}
        <div className="grid md:grid-cols-[3fr_2fr] gap-16 items-center mb-16">
          {/* Left - text */}
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-5">
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                Frisco, TX &nbsp;·&nbsp; Pro bono &nbsp;·&nbsp; Est. 2025
              </span>
            </div>

            <h1 className="font-serif text-6xl md:text-7xl lg:text-[5rem] text-heading leading-[1.08] mb-7">
              {data.headline.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h1>

            <p className="text-lg text-muted leading-relaxed mb-8 max-w-xl">
              {data.sub}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-5 mb-0">
              <a
                href={data.cta1.href}
                className="px-6 py-3 bg-navy text-white text-sm font-medium rounded-full hover:bg-ink transition-colors"
              >
                {data.cta1.label}
              </a>
              <a
                href={data.cta2.href}
                style={{
                  fontSize: 14,
                  color: "var(--muted)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)";
                }}
              >
                {data.cta2.label}
              </a>
            </div>
          </div>

          {/* Right - photo */}
          <div className="order-first md:order-last">
            <div className="relative w-full" style={{ borderRadius: 12, overflow: "hidden", maxHeight: 420 }}>
              <Image
                src="/rupesh.jpg.png"
                alt="Rupesh Panda"
                width={480}
                height={420}
                className="w-full object-cover object-top"
                style={{ display: "block", borderRadius: 12 }}
                priority
              />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="border-t border-border pt-10">
          <div className="flex flex-wrap gap-10 md:gap-0">
            {data.stats.map((stat, i) => (
              <div
                key={stat.label}
                className="flex-1 min-w-[120px]"
                style={{
                  paddingRight: i < data.stats.length - 1 ? "40px" : 0,
                  borderRight:
                    i < data.stats.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                }}
              >
                <div
                  className="font-serif text-navy"
                  style={{ fontSize: 28, fontWeight: 500, lineHeight: 1, marginBottom: 5 }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
