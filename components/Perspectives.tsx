"use client";
import { SectionLabel } from "./SectionLabel";

type Section = { eyebrow: string; headline: string; sub: string };
type Article = { slug: string; tag: string; title: string; excerpt: string; date: string; url: string };

function readTime(excerpt: string) {
  const words = excerpt.split(/\s+/).length;
  return Math.max(3, Math.ceil(words / 40));
}

export default function Perspectives({ section, articles }: { section: Section; articles: Article[] }) {
  return (
    <section id="perspectives" className="px-6 py-12 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-14 gap-6">
          <div>
            <SectionLabel text="PERSPECTIVES" />
            <h2 className="font-serif text-5xl md:text-6xl text-navy leading-tight whitespace-pre-line">
              {section.headline}
            </h2>
          </div>
          <p className="text-sm text-muted max-w-xs leading-relaxed md:text-right">
            {section.sub}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
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
                transition: "box-shadow 0.15s ease, border-color 0.15s ease",
                background: "var(--card)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 4px 16px rgba(0,0,0,0.07)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "var(--border)";
              }}
            >
              {/* Tag badge */}
              <span className="tag-badge self-start mb-3">{article.tag}</span>

              {/* Date + read time */}
              <span
                style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}
              >
                {article.date}&nbsp;&nbsp;·&nbsp;&nbsp;{readTime(article.excerpt)} min read
              </span>

              {/* Title */}
              <h3
                className="font-serif text-navy group-hover:text-indigo transition-colors"
                style={{ fontSize: "1.05rem", fontWeight: 500, marginBottom: 8, lineHeight: 1.4 }}
              >
                {article.title}
              </h3>

              {/* Excerpt */}
              <p
                style={{
                  fontSize: 13,
                  color: "var(--muted)",
                  lineHeight: 1.55,
                  margin: 0,
                  flex: 1,
                }}
              >
                {article.excerpt.split(". ")[0]}.
              </p>

              {/* Read link */}
              <span
                style={{
                  fontSize: 12,
                  color: "var(--accent)",
                  marginTop: 16,
                  display: "block",
                }}
              >
                Read →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
