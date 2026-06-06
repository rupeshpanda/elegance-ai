"use client";

import Link from "next/link";

// Update this URL after deploying to Vercel
const RESOLVE_URL = "https://resolve-mcp-demo.vercel.app";
const GITHUB_URL = "https://github.com/rupeshpanda/resolve-mcp-demo";

const MCP_STEPS = [
  {
    step: "1",
    title: "listTools() discovery",
    detail:
      "On startup the agent connects to both MCP servers and calls listTools(). The Connected Systems panel is populated dynamically from what each server declares — not hard-coded.",
  },
  {
    step: "2",
    title: "Tool-use loop",
    detail:
      "The agent sends Claude the merged tool list. Claude decides which tools to call, in what order. The agent executes each callTool() and appends the result. The loop runs until Claude returns a final answer.",
  },
  {
    step: "3",
    title: "Cross-system reconciliation",
    detail:
      "Billing says PAID. Access Control says SUSPENDED. The agent reasons over both systems of record, identifies the contradiction, and resolves it — reactivate_subscription only if billing confirms payment.",
  },
  {
    step: "4",
    title: "Live trace visibility",
    detail:
      "Every tool_call, tool_result, and agent_thinking event streams to the UI over SSE. The Orchestration Trace panel shows the exact reasoning chain in real time.",
  },
];

const ARCHITECTURE = [
  { tier: "Browser", label: "Resolve Console", detail: "3-pane React app. Conversation + live SSE trace panel." },
  {
    tier: "Agent Layer",
    label: "/api/agent",
    detail: "MCP Client connects to both servers. Runs Claude tool-use loop. Streams SSE events.",
  },
  {
    tier: "MCP Server",
    label: "Billing MCP",
    detail: "get_billing_history, verify_payment. Seeded in-memory data.",
  },
  {
    tier: "MCP Server",
    label: "Access Control MCP",
    detail: "lookup_customer, get_access_status, reactivate_subscription. Mutable in-memory record.",
  },
];

export default function ResolveLab() {
  return (
    <main style={{ background: "var(--bg)", color: "var(--ink)" }}>
      {/* Breadcrumb */}
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
        <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/lab" style={{ color: "var(--muted)", textDecoration: "none" }}>Lab</Link>
        <span>/</span>
        <span style={{ color: "var(--ink)" }}>Resolve</span>
      </div>

      {/* Header */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "52px 24px 36px" }}>
        <div
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: 12,
          }}
        >
          Lab · Agentic Systems
        </div>

        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.7rem, 4vw, 2.5rem)",
            color: "var(--navy)",
            lineHeight: 1.18,
            marginBottom: 16,
            letterSpacing: "-0.02em",
          }}
        >
          Resolve: Autonomous Support Resolution on MCP
        </h1>

        <p style={{ fontSize: "1rem", color: "var(--muted)", lineHeight: 1.7, maxWidth: 560, marginBottom: 28 }}>
          A production-grade support agent built on a real MCP client–server architecture. It reconciles
          two siloed systems of record in real time — and shows every step of its reasoning in the UI.
        </p>

        {/* Tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 32 }}>
          {["MCP", "Agents", "Claude", "Next.js", "SSE", "TypeScript"].map((tag) => (
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

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a
            href={RESOLVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "10px 22px",
              borderRadius: 8,
              background: "var(--accent, #0f766e)",
              color: "white",
              fontSize: "0.88rem",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Launch Live Demo →
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "10px 22px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              color: "var(--ink)",
              fontSize: "0.88rem",
              fontWeight: 600,
              textDecoration: "none",
              background: "var(--card)",
            }}
          >
            Source on GitHub
          </a>
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Live embed */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 0" }}>
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
          Live Demo
        </div>

        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 6px 24px -8px rgba(28,27,24,.14)",
          }}
        >
          <iframe
            src={RESOLVE_URL}
            width="100%"
            height="720"
            style={{ display: "block", border: "none" }}
            title="Resolve — Autonomous Support Resolution Demo"
            allow="clipboard-write"
          />
        </div>

        <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 10, textAlign: "right" }}>
          <a
            href={RESOLVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--muted)", textDecoration: "underline" }}
          >
            Open full screen ↗
          </a>
        </p>
      </section>

      {/* The scenario */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "52px 24px 0" }}>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.5rem",
            color: "var(--navy)",
            marginBottom: 16,
            letterSpacing: "-0.01em",
          }}
        >
          The scenario
        </h2>
        <p style={{ fontSize: "0.94rem", color: "var(--muted)", lineHeight: 1.75, marginBottom: 16 }}>
          A customer paid their subscription but still can&apos;t log in. Two systems of record disagree:
          Billing says the latest invoice is <strong>PAID</strong>; Access Control still has the account
          flagged <strong>SUSPENDED / past_due</strong> because a sync never cleared.
        </p>
        <p style={{ fontSize: "0.94rem", color: "var(--muted)", lineHeight: 1.75, marginBottom: 16 }}>
          The agent calls <code style={{ fontFamily: "monospace", fontSize: "0.88rem", background: "#f1efe9", padding: "1px 5px", borderRadius: 4 }}>lookup_customer</code> →{" "}
          <code style={{ fontFamily: "monospace", fontSize: "0.88rem", background: "#f1efe9", padding: "1px 5px", borderRadius: 4 }}>get_access_status</code> →{" "}
          <code style={{ fontFamily: "monospace", fontSize: "0.88rem", background: "#f1efe9", padding: "1px 5px", borderRadius: 4 }}>verify_payment</code> →
          reasons that the suspension is stale → calls{" "}
          <code style={{ fontFamily: "monospace", fontSize: "0.88rem", background: "#f1efe9", padding: "1px 5px", borderRadius: 4 }}>reactivate_subscription</code>. The status badge
          in the header animates from red SUSPENDED to green ACTIVE the moment the mutation lands.
        </p>
        <p style={{ fontSize: "0.94rem", color: "var(--muted)", lineHeight: 1.75 }}>
          There&apos;s also a Devin Cole test case — whose latest invoice is genuinely FAILED. The agent
          declines to reactivate and explains the actual problem. This proves the agent reasons over evidence,
          not just rubber-stamps requests.
        </p>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "52px 24px 0" }}>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.5rem",
            color: "var(--navy)",
            marginBottom: 24,
            letterSpacing: "-0.01em",
          }}
        >
          How the MCP loop works
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {MCP_STEPS.map(({ step, title, detail }) => (
            <div
              key={step}
              style={{
                display: "flex",
                gap: 16,
                padding: "20px",
                border: "1px solid var(--border)",
                borderRadius: 10,
                background: "var(--card)",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "var(--accent, #0f766e)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  flexShrink: 0,
                }}
              >
                {step}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.96rem",
                    color: "var(--navy)",
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  {title}
                </div>
                <p style={{ fontSize: "0.86rem", color: "var(--muted)", lineHeight: 1.65, margin: 0 }}>
                  {detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "52px 24px 0" }}>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.5rem",
            color: "var(--navy)",
            marginBottom: 20,
            letterSpacing: "-0.01em",
          }}
        >
          Architecture — three tiers, one Next.js app
        </h2>

        <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          {ARCHITECTURE.map(({ tier, label, detail }, i) => (
            <div
              key={label}
              style={{
                display: "grid",
                gridTemplateColumns: "100px 160px 1fr",
                gap: 16,
                padding: "14px 20px",
                borderBottom: i < ARCHITECTURE.length - 1 ? "1px solid var(--border)" : "none",
                background: i % 2 === 0 ? "var(--card)" : "var(--bg)",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                {tier}
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.82rem",
                  color: "var(--navy)",
                  fontWeight: 600,
                }}
              >
                {label}
              </span>
              <span style={{ fontSize: "0.84rem", color: "var(--muted)", lineHeight: 1.55 }}>
                {detail}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* The thesis */}
      <section
        style={{
          maxWidth: 800,
          margin: "52px auto 0",
          padding: "32px",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.25rem",
            color: "var(--navy)",
            marginBottom: 12,
            letterSpacing: "-0.01em",
          }}
        >
          Why MCP changes support operations
        </h2>
        <p style={{ fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.75 }}>
          The real unlock of MCP isn&apos;t &ldquo;AI can call an API&rdquo; — it&apos;s that an agent can
          orchestrate across siloed systems of record that were never designed to talk to each other,
          reconcile their disagreements, and take the remediating action — with every step inspectable.
          The help desk is just the first place that pays for itself.
        </p>
      </section>

      <div style={{ height: 80 }} />
    </main>
  );
}
