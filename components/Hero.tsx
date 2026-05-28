"use client";
import { useEffect, useState } from "react";
import { HeroNetwork } from "./HeroNetwork";
import { HeroInferenceCard } from "./HeroInferenceCard";

type HeroData = {
  headline: readonly string[];
  sub: string;
  cta1: { label: string; href: string };
  cta2: { label: string; href: string };
  stats: { value: string; label: string }[];
};

export default function Hero({ data }: { data: HeroData }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 60);
    return () => clearTimeout(t);
  }, []);

  const textStyle = {
    opacity: entered ? 1 : 0,
    transform: entered ? "none" : "translateY(20px)",
    transition: "opacity 0.7s ease, transform 0.7s ease",
  };
  const cardStyle = {
    opacity: entered ? 1 : 0,
    transform: entered ? "none" : "translateY(20px)",
    transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
  };

  return (
    <section className="px-6 py-10 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="hero-grid">
          {/* Left: network animation + text */}
          <div style={{ position: "relative" }}>
            <HeroNetwork />
            <div style={{ position: "relative", zIndex: 1, ...textStyle }}>
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-5">
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                <span style={{ fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted)" }}>
                  Frisco, TX &nbsp;·&nbsp; Pro bono &nbsp;·&nbsp; Est. 2025
                </span>
              </div>

              <h1 className="font-serif text-5xl md:text-7xl lg:text-[5rem] text-navy leading-[1.08] mb-7 max-w-2xl">
                {data.headline.map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>

              <p className="text-lg text-muted leading-relaxed mb-8 max-w-md">
                {data.sub}
              </p>

              <div className="flex flex-wrap items-center gap-5">
                <a
                  href={data.cta1.href}
                  className="px-6 py-3 bg-navy text-white text-sm font-medium rounded-full hover:bg-ink transition-colors"
                >
                  {data.cta1.label}
                </a>
                <a
                  href={data.cta2.href}
                  style={{ fontSize: 14, color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, transition: "color 0.15s ease" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)"; }}
                >
                  {data.cta2.label}
                </a>
              </div>
            </div>
          </div>

          {/* Right: animated inference card */}
          <div className="hero-inference-col" style={cardStyle}>
            <HeroInferenceCard />
          </div>
        </div>

        {/* Stats row */}
        <div className="border-t border-border pt-8 mt-12">
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 md:grid-cols-4 md:gap-0">
            {data.stats.map((stat, i) => (
              <div
                key={stat.label}
                className={i < data.stats.length - 1 ? "md:pr-10 md:border-r md:border-border" : ""}
              >
                <div className="font-serif text-navy" style={{ fontSize: 28, fontWeight: 500, lineHeight: 1, marginBottom: 5 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
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
