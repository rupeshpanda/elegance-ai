"use client";

import Link from "next/link";

const STREAMLIT_URL = "https://gita-finetune-demo-sfe5jxbmrsrwmskjger88w.streamlit.app";
const GITHUB_URL = "https://github.com/rupeshpanda/gita-finetune-demo";
const HF_URL = "https://huggingface.co/rupeshpanda/gita-text-generation-gpt2";
const COLAB_URL =
  "https://colab.research.google.com/github/rupeshpanda/gita-finetune-demo/blob/main/notebook/gita_finetune.ipynb";

const DECISION_ROWS = [
  ["What it teaches", "Style and tone", "Nothing — retrieves facts"],
  ["Factual accuracy", "Can hallucinate", "Grounded in source text"],
  ["Source citations", "No", "Yes"],
  ["Cost", "One-time training cost", "Inference + vector DB cost"],
  ["Data updates", "Requires retraining", "Update the index"],
  ["Latency", "Fast (no retrieval)", "Adds retrieval overhead"],
  ["Best for", "Style transfer, format enforcement", "Q&A, fact lookup, live data"],
];

const FINE_TUNE_WINS = [
  {
    icon: "📋",
    title: "Format enforcement",
    detail:
      "SAP change-request outputs must follow a specific XML schema. Fine-tuning on examples teaches the model that schema. RAG cannot enforce format.",
  },
  {
    icon: "✍️",
    title: "Style transfer",
    detail:
      "Legal contracts written in your firm's specific voice. A fine-tuned model internalises that style at scale.",
  },
  {
    icon: "⚡",
    title: "Latency-critical tasks",
    detail:
      "No retrieval overhead. A fine-tuned model responds in one forward pass — decisive for embedded or mobile apps.",
  },
  {
    icon: "🔒",
    title: "Proprietary task types",
    detail:
      "Internal framework code review with no public documentation to retrieve from. The training data IS the knowledge.",
  },
  {
    icon: "🏥",
    title: "Domain vocabulary",
    detail:
      "Medical, legal, or financial terminology where the base model generates plausible but wrong jargon.",
  },
];

export default function GitaFinetuneLab() {
  return (
    <main style={{ background: "var(--bg)", color: "var(--ink)" }}>
      {/* ── Nav breadcrumb ── */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: "0.82rem",
          color: "var(--muted)",
        }}
      >
        <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>
          Home
        </Link>
        <span>/</span>
        <Link href="/lab" style={{ color: "var(--muted)", textDecoration: "none" }}>
          Lab
        </Link>
        <span>/</span>
        <span style={{ color: "var(--ink)" }}>Gita Fine-tuning Demo</span>
      </div>

      {/* ── Hero ── */}
      <section
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "64px 24px 48px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          {["AI/ML", "Enterprise AI", "LLMs", "Open Source"].map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "3px 10px",
                borderRadius: 20,
                border: "1px solid #C8922A",
                color: "#C8922A",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            lineHeight: 1.2,
            color: "var(--navy)",
            marginBottom: 16,
          }}
        >
          Fine-tuning a Language Model: A Working Demo
        </h1>
        <p
          style={{
            fontSize: "1.05rem",
            color: "var(--muted)",
            lineHeight: 1.7,
            maxWidth: 620,
          }}
        >
          What it is, when to use it, and why RAG might serve you better.
          Built with GPT-2, Bhagavad Gita text, and a Colab T4 GPU.
        </p>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* ── Demo embed ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px" }}>
        <SectionLabel>The Demo</SectionLabel>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.5rem",
            color: "var(--navy)",
            marginBottom: 8,
          }}
        >
          Ask the same question to base GPT-2 and the Gita model
        </h2>
        <p style={{ color: "var(--muted)", marginBottom: 24, lineHeight: 1.6 }}>
          Side-by-side responses reveal exactly what fine-tuning changes — and what it doesn't.
        </p>

        {/* Demo launch card */}
        <div
          style={{
            borderRadius: 12,
            border: "1px solid var(--border)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            background: "var(--card)",
            padding: "48px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2.5rem" }}>⚡</div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.25rem",
                color: "var(--navy)",
                marginBottom: 8,
              }}
            >
              Live on Streamlit Cloud
            </div>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: 440 }}>
              Models load from HuggingFace Hub. Generation runs on CPU — allow 15–30 s for the first response.
            </p>
          </div>
          <a
            href={STREAMLIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#C8922A",
              color: "#fff",
              padding: "12px 28px",
              borderRadius: 6,
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Open Demo →
          </a>
          <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: 0 }}>
            Opens in a new tab · Streamlit Cloud · free tier
          </p>
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* ── What I built ── */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        <SectionLabel>What I Built</SectionLabel>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.5rem",
            color: "var(--navy)",
            marginBottom: 24,
          }}
        >
          The pipeline, start to finish
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            lineHeight: 1.7,
            color: "var(--ink)",
          }}
        >
          <p>
            <strong>Data:</strong> The full text of the Bhagavad Gita from Project Gutenberg
            (#2388, Sir Edwin Arnold translation). Pre-processed into 100-word chunks, split 80/20
            for training and validation.
          </p>
          <p>
            <strong>Training:</strong> GPT-2 (124M parameters) fine-tuned using HuggingFace
            Transformers <code>Trainer</code> API. 3 epochs on a Google Colab T4 GPU — about
            30 minutes total. The notebook is fully reproducible.
          </p>
          <p>
            <strong>The side-by-side comparison</strong> is the whole point. Base GPT-2 drifts
            into generic internet text within a sentence. The fine-tuned model stays in the
            vocabulary of the Gita — dharma, karma, Arjuna — because that's the only text it saw
            during fine-tuning.
          </p>
          <p>
            <strong>What the demo honestly shows:</strong> fine-tuning changes <em>style and
            vocabulary</em>. It does not give a model factual understanding. For accurate Q&A on
            a document, RAG is the right call.
          </p>
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* ── Fine-tuning vs RAG ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <SectionLabel>Key Learnings</SectionLabel>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.5rem",
            color: "var(--navy)",
            marginBottom: 8,
          }}
        >
          Fine-tuning vs RAG — the decision framework
        </h2>
        <p style={{ color: "var(--muted)", marginBottom: 28, lineHeight: 1.6 }}>
          Most practitioners reach for fine-tuning when RAG would serve them better.
          Here's when each wins.
        </p>

        {/* Comparison table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.88rem",
              marginBottom: 40,
            }}
          >
            <thead>
              <tr style={{ background: "var(--bg-secondary)" }}>
                <th
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "var(--muted)",
                    fontSize: "0.78rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    border: "1px solid var(--border)",
                  }}
                >
                  Dimension
                </th>
                <th
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#C8922A",
                    fontSize: "0.78rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    border: "1px solid var(--border)",
                  }}
                >
                  Fine-tuning
                </th>
                <th
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "var(--accent)",
                    fontSize: "0.78rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    border: "1px solid var(--border)",
                  }}
                >
                  RAG
                </th>
              </tr>
            </thead>
            <tbody>
              {DECISION_ROWS.map(([dim, ft, rag], i) => (
                <tr
                  key={dim}
                  style={{ background: i % 2 === 0 ? "var(--card)" : "var(--bg-secondary)" }}
                >
                  <td
                    style={{
                      padding: "10px 14px",
                      fontWeight: 600,
                      border: "1px solid var(--border)",
                      color: "var(--ink)",
                    }}
                  >
                    {dim}
                  </td>
                  <td style={{ padding: "10px 14px", border: "1px solid var(--border)", color: "var(--muted)" }}>
                    {ft}
                  </td>
                  <td style={{ padding: "10px 14px", border: "1px solid var(--border)", color: "var(--muted)" }}>
                    {rag}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* When fine-tuning wins */}
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.25rem",
            color: "var(--navy)",
            marginBottom: 20,
          }}
        >
          When fine-tuning IS the right choice
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {FINE_TUNE_WINS.map(({ icon, title, detail }) => (
            <div
              key={title}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "18px 20px",
                background: "var(--card)",
              }}
            >
              <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>{icon}</div>
              <div style={{ fontWeight: 600, marginBottom: 6, color: "var(--navy)" }}>{title}</div>
              <div style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6 }}>
                {detail}
              </div>
            </div>
          ))}
        </div>

        {/* The architecture that works */}
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            borderLeft: "4px solid #C8922A",
            borderRadius: "0 10px 10px 0",
            padding: "20px 24px",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8, color: "var(--navy)" }}>
            The architecture that actually works
          </div>
          <pre
            style={{
              fontFamily: "monospace",
              fontSize: "0.82rem",
              color: "var(--ink)",
              whiteSpace: "pre",
              overflowX: "auto",
              margin: "0 0 12px",
              lineHeight: 1.8,
            }}
          >
{`RAG layer          → retrieves the right passage for the question
Fine-tuned model   → formats and explains it in a specific voice
Structured output  → cited, formatted, on-brand`}
          </pre>
          <p style={{ fontSize: "0.88rem", color: "var(--muted)", margin: 0 }}>
            RAG handles <strong>what to say</strong>. Fine-tuning handles <strong>how to say it</strong>.
            Neither alone is sufficient for enterprise Q&amp;A.
          </p>
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* ── Resources ── */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 64px" }}>
        <SectionLabel>Resources</SectionLabel>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.5rem",
            color: "var(--navy)",
            marginBottom: 24,
          }}
        >
          Everything open source
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "GitHub Repo", href: GITHUB_URL, desc: "Full code, notebook, and data pipeline" },
            { label: "Fine-tuned Model (HuggingFace)", href: HF_URL, desc: "rupeshpanda/gita-text-generation-gpt2" },
            { label: "Training Notebook (Colab)", href: COLAB_URL, desc: "Reproducible, runs free on T4 GPU" },
            { label: "Live Demo (Streamlit)", href: STREAMLIT_URL, desc: "Side-by-side base vs fine-tuned" },
          ].map(({ label, href, desc }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 18px",
                border: "1px solid var(--border)",
                borderRadius: 8,
                background: "var(--card)",
                textDecoration: "none",
                transition: "border-color 0.2s",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: "var(--navy)", fontSize: "0.95rem" }}>
                  {label}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 2 }}>
                  {desc}
                </div>
              </div>
              <span style={{ color: "var(--muted)", fontSize: "1.1rem", flexShrink: 0 }}>↗</span>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: 48,
            padding: "28px 28px",
            background: "var(--navy)",
            borderRadius: 12,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.2rem",
              color: "#fff",
              marginBottom: 10,
            }}
          >
            Experimenting with AI in your enterprise?
          </div>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", marginBottom: 20 }}>
            Let's talk about what fine-tuning, RAG, and agentic systems can actually do
            for your organisation.
          </p>
          <a
            href="/#contact"
            style={{
              display: "inline-block",
              padding: "10px 28px",
              background: "#C8922A",
              color: "#fff",
              borderRadius: 6,
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            Get in touch
          </a>
        </div>
      </section>
    </main>
  );
}

/* ── Inline SectionLabel matching site style ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--muted)",
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}
