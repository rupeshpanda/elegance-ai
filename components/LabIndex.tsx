"use client";

import Link from "next/link";

const LABS = [
  {
    slug: "gita-finetuning",
    title: "Bhagavad Gita Fine-tuning Demo",
    desc:
      "Side-by-side comparison of base GPT-2 vs a domain fine-tuned model. Shows exactly what fine-tuning changes — and when RAG is the better call.",
    tags: ["AI/ML", "LLMs", "Open Source"],
    status: "live",
  },
];

export default function LabIndex() {
  return (
    <main style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "80vh" }}>
      {/* ── Breadcrumb ── */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "12px 24px",
          fontSize: "0.82rem",
          color: "var(--muted)",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>
          Home
        </Link>
        <span>/</span>
        <span style={{ color: "var(--ink)" }}>Lab</span>
      </div>

      {/* ── Header ── */}
      <section
        style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px 48px" }}
      >
        <div
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: 16,
          }}
        >
          Lab
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            color: "var(--navy)",
            lineHeight: 1.2,
            marginBottom: 16,
          }}
        >
          Working demos and experiments
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--muted)", lineHeight: 1.7, maxWidth: 560 }}>
          Hands-on builds showing AI concepts in practice — not slides, not theory.
          Each lab is open source with a live demo, GitHub repo, and honest writeup.
        </p>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* ── Lab cards ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {LABS.map(({ slug, title, desc, tags, status }) => (
            <Link
              key={slug}
              href={`/lab/${slug}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "24px 24px",
                  background: "var(--card)",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {/* Status dot */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      padding: "2px 8px",
                      borderRadius: 20,
                      background: status === "live" ? "#dcfce7" : "#fef9c3",
                      color: status === "live" ? "#15803d" : "#92400e",
                    }}
                  >
                    {status}
                  </span>
                </div>

                <h2
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.15rem",
                    color: "var(--navy)",
                    lineHeight: 1.3,
                    margin: 0,
                  }}
                >
                  {title}
                </h2>

                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--muted)",
                    lineHeight: 1.65,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {desc}
                </p>

                {/* Tags */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        padding: "2px 8px",
                        borderRadius: 20,
                        border: "1px solid #C8922A",
                        color: "#C8922A",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--accent)",
                    fontWeight: 600,
                    marginTop: 4,
                  }}
                >
                  View lab →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
