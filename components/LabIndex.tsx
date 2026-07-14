"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Lab = {
  slug: string;
  /** External demo URL. When set, the card links out instead of to /lab/<slug>. */
  href?: string;
  title: string;
  desc: string;
  tags: string[];
  status: "live" | "soon";
  meta: string;
};

const LABS: Lab[] = [
  {
    slug: "what-is-an-agent",
    href: "https://what-is-an-agent.vercel.app",
    title: "What Is an Agent?",
    desc:
      "A beginner lab that explains what an AI agent actually is. Learn how models, tools, tool definitions, agent loops, memory, and the harness work through a simple enterprise leave assistant with exactly two tools. Ask it a question and watch every decision in a safe execution trace: which tool it picked, with what input, and what came back. Level: Beginner. Time: 10 to 15 minutes.",
    tags: ["Agents", "Tool Calling", "LangChain", "Groq"],
    status: "live" as const,
    meta: "LangChain · Llama 3.3 70B · Groq · Next.js",
  },
  {
    slug: "finetuning-decision-lab",
    href: "https://finetuning-decision-lab.vercel.app",
    title: "When Does Fine-Tuning Earn Its Keep?",
    desc:
      "The same conversation run live through three models, base BART, a fine-tuned BART, and Claude Haiku, side by side with cost and latency. A working demo plus a CIO decision framework: prompt first, RAG for missing facts, and fine-tune only for proprietary judgment, volume economics, or data that can't leave.",
    tags: ["AI/ML", "Fine-tuning", "LLMs", "Inference Economics"],
    status: "live" as const,
    meta: "BART · SAMSum · Claude Haiku · Cloud Run · Next.js",
  },
  {
    slug: "procurement-exception-triage-agent",
    href: "https://procurement-exception-triage-agent.vercel.app/lab/procurement-exception-triage-agent",
    title: "Procurement Exception Triage Agent",
    desc:
      "An enterprise agentic AI pilot on Claude Haiku. The agent investigates delayed POs, blocked invoices, and vendor risk through governed MCP tools — with a deterministic $25K approval hook, structured errors, human-review escalation, live agent-loop streaming, and per-run cost tracking (~half a cent per triage).",
    tags: ["Agents", "MCP", "Governance", "Claude"],
    status: "live" as const,
    meta: "Claude Haiku · MCP · Hooks · SSE · Next.js",
  },
  {
    slug: "data-extraction",
    title: "Structured Data Extraction Pipeline",
    desc:
      "A self-correcting structured output pipeline for enterprise contracts. Implements Pydantic validation schemas, self-healing retry loops, Message Batches API for 100+ documents, and a human-in-the-loop exception dashboard.",
    tags: ["Structured Output", "Validation", "Batches API", "HITL"],
    status: "live" as const,
    meta: "JSON Schema · Pydantic · Claude · Next.js · Python",
  },
  {
    slug: "claude-code-team-workflow",
    title: "Configuring Claude Code for a Team Workflow",
    desc:
      "Project CLAUDE.md hierarchies, path-scoped rules, an isolated forked skill, and multi-server MCP config with credential expansion — with an interactive rule-matcher demo and a knowledge-check quiz.",
    tags: ["Claude Code", "MCP", "DevEx"],
    status: "live" as const,
    meta: "Claude Code · MCP · Rules · Skills",
  },
  {
    slug: "mcp-advanced",
    title: "MCP HTTP Transport & Tool Use",
    desc:
      "A live demo of the Model Context Protocol over HTTP. Claude uses MCP tools to manage a real file workspace — read, write, list, delete — with every tool call visible in the trace panel. Includes a deep-dive on MCP concepts.",
    tags: ["MCP", "Tool Use", "Claude", "HTTP Transport"],
    status: "live" as const,
    meta: "MCP · Claude Haiku · HTTP · Python · Next.js",
  },
  {
    slug: "resolve",
    title: "Resolve: Autonomous Support Resolution on MCP",
    desc:
      "An AI agent that reconciles two siloed systems of record in real time — billing and access control — and shows every step of its reasoning in a live trace panel. Built on a real MCP client–server architecture.",
    tags: ["MCP", "Agents", "Claude", "Next.js"],
    status: "live" as const,
    meta: "MCP · Claude Sonnet · SSE · TypeScript",
  },
  {
    slug: "gita-finetuning",
    title: "Fine-tuning a Language Model: A Working Demo",
    desc:
      "Side-by-side comparison of base GPT-2 vs a domain fine-tuned model. Shows exactly what fine-tuning changes — and when RAG is the better call.",
    tags: ["AI/ML", "LLMs", "Open Source"],
    status: "live" as const,
    meta: "GPT-2 · HuggingFace · Streamlit",
  },
];

const COMING = [
  { title: "RAG Pipeline from Scratch", tags: ["RAG", "Vector DB"] },
  { title: "Multi-Agent Orchestration Deep Dive", tags: ["Agents", "LLMs"] },
];

function LabLink({
  lab,
  children,
}: {
  lab: Lab;
  children: ReactNode;
}) {
  if (lab.href) {
    return (
      <a href={lab.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
        {children}
      </a>
    );
  }
  return (
    <Link href={`/lab/${lab.slug}`} style={{ textDecoration: "none" }}>
      {children}
    </Link>
  );
}

export default function LabIndex() {
  const [featured, ...rest] = LABS;

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
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px 40px" }}>
        <div
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: 14,
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
            marginBottom: 14,
          }}
        >
          Working demos and experiments
        </h1>
        <p style={{ fontSize: "1rem", color: "var(--muted)", lineHeight: 1.7, maxWidth: 520 }}>
          Hands-on builds showing AI concepts in practice — not slides, not theory.
          Each lab ships with source code, a live demo, and an honest writeup.
        </p>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* ── Featured lab ── */}
      {featured && (
        <section style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 0" }}>
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 20,
            }}
          >
            Latest
          </div>

          <LabLink lab={featured}>
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "32px",
                background: "var(--card)",
                transition: "box-shadow 0.2s, border-color 0.2s",
                cursor: "pointer",
              }}
            >
              {/* Status + meta row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "2px 10px",
                    borderRadius: 20,
                    background: featured.status === "live" ? "#dcfce7" : "#fef9c3",
                    color: featured.status === "live" ? "#15803d" : "#92400e",
                  }}
                >
                  {featured.status}
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{featured.meta}</span>
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.45rem",
                  color: "var(--navy)",
                  lineHeight: 1.3,
                  marginBottom: 12,
                }}
              >
                {featured.title}
              </h2>

              <p
                style={{
                  fontSize: "0.92rem",
                  color: "var(--muted)",
                  lineHeight: 1.7,
                  marginBottom: 24,
                  maxWidth: 560,
                }}
              >
                {featured.desc}
              </p>

              {/* Tags + CTA row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {featured.tags.map((tag) => (
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
                <span style={{ fontSize: "0.88rem", color: "var(--accent)", fontWeight: 600 }}>
                  {featured.href ? "Open live demo ↗" : "View lab →"}
                </span>
              </div>
            </div>
          </LabLink>
        </section>
      )}

      {/* ── Additional labs ── */}
      {rest.length > 0 && (
        <section style={{ maxWidth: 800, margin: "0 auto", padding: "24px 24px 0" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            {rest.map((lab) => (
              <LabLink key={lab.slug} lab={lab}>
                <div
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: "24px",
                    background: "var(--card)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      alignSelf: "flex-start",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      padding: "2px 8px",
                      borderRadius: 20,
                      background: lab.status === "live" ? "#dcfce7" : "#fef9c3",
                      color: lab.status === "live" ? "#15803d" : "#92400e",
                    }}
                  >
                    {lab.status}
                  </span>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", color: "var(--navy)", lineHeight: 1.3, margin: 0 }}>
                    {lab.title}
                  </h2>
                  <p style={{ fontSize: "0.87rem", color: "var(--muted)", lineHeight: 1.65, margin: 0, flex: 1 }}>{lab.desc}</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {lab.tags.map((tag) => (
                      <span key={tag} style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 20, border: "1px solid #C8922A", color: "#C8922A" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--accent)", fontWeight: 600 }}>
                    {lab.href ? "Open live demo ↗" : "View lab →"}
                  </div>
                </div>
              </LabLink>
            ))}
          </div>
        </section>
      )}

      {/* ── Coming soon ── */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 80px" }}>
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
          Coming next
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {COMING.map(({ title, tags }) => (
            <div
              key={title}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "16px 20px",
                background: "var(--bg-secondary)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: "0.92rem", color: "var(--muted)", fontStyle: "italic" }}>{title}</span>
              <div style={{ display: "flex", gap: 6 }}>
                {tags.map((tag) => (
                  <span key={tag} style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 20, border: "1px solid var(--border)", color: "var(--muted)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
