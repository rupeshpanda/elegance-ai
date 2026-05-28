"use client";
import { SectionLabel } from "./SectionLabel";
import { TopicThumb } from "./TopicThumb";
import { useScrollReveal } from "../hooks/useScrollReveal";

type Section = { eyebrow: string; headline: string; sub: string };
type Article = { slug: string; tag: string; title: string; excerpt: string; date: string; url: string };

function readTime(excerpt: string) {
  const words = excerpt.split(/\s+/).length;
  return Math.max(3, Math.ceil(words / 40));
}

export default function Perspectives({ section, articles }: { section: Section; articles: Article[] }) {
  const header = useScrollReveal();
  const grid = useScrollReveal();

  return (
    <section id="perspectives" className="px-6 py-8 md:py-10">
      <div className="max-w-6xl mx-auto">
        <div
          ref={header.ref}
          className={`flex flex-col md:flex-row md:items-end justify-between mb-5 md:mb-10 gap-6 reveal${header.visible ? " visible" : ""}`}
        >
          <div>
            <SectionLabel text="PERSPECTIVES" />
            <h2 className="font-serif text-6xl md:text-7xl text-navy leading-tight whitespace-pre-line">
              {section.headline}
            </h2>
          </div>
          <p className="text-sm text-muted max-w-xs leading-relaxed md:text-right">
            {section.sub}
          </p>
        </div>

        <div
          ref={grid.ref}
          className={`grid md:grid-cols-2 gap-5 reveal${grid.visible ? " visible" : ""}`}
        >
          {articles.map((article) => (
            <a
              key={article.slug}
              href={article.url}
              className="group flex flex-col"
              style={{
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: 24,
                textDecoration: "none",
                color: "inherit",
                transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                background: "var(--card)",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                el.style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
                el.style.borderColor = "var(--border)";
              }}
            >
              <TopicThumb topic={article.tag + " " + article.title} />

              <span className="tag-badge self-start mb-3">{article.tag}</span>

              <span style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
                {article.date}&nbsp;&nbsp;·&nbsp;&nbsp;{readTime(article.excerpt)} min read
              </span>

              <h3
                className="font-serif text-navy group-hover:text-indigo transition-colors"
                style={{ fontSize: "1.05rem", fontWeight: 500, marginBottom: 8, lineHeight: 1.4 }}
              >
                {article.title}
              </h3>

              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55, margin: 0, flex: 1 }}>
                {article.excerpt.split(". ")[0]}.
              </p>

              <span style={{ fontSize: 12, color: "var(--accent)", marginTop: 16, display: "block" }}>
                Read →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
