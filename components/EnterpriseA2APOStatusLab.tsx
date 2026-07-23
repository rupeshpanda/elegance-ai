"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────

type TraceEvent = {
  event: string;
  status: string;
  service: string;
  timestamp: string;
  duration_ms: number | null;
  detail: Record<string, unknown>;
};

type PurchaseOrderSummary = {
  po_number: string;
  supplier_name: string | null;
  material: string | null;
  ordered_quantity: number | null;
  confirmed_quantity: number | null;
  requested_delivery_date: string | null;
  fulfillment_status: string | null;
  estimated_arrival_date: string | null;
  delivery_outlook: "on_time" | "at_risk" | "delayed" | null;
};

type SourceRef = { name: string; type: string };

type Metrics = {
  total_duration_ms: number;
  a2a_duration_ms: number | null;
  model_calls: number;
  remote_agent_calls: number;
};

type QueryResult = {
  request_id: string;
  answer: string;
  purchase_order: PurchaseOrderSummary | null;
  sources: SourceRef[];
  metrics: Metrics;
};

type Turn = {
  id: string;
  question: string;
  status: "streaming" | "done" | "error";
  trace: TraceEvent[];
  result: QueryResult | null;
  errorMessage?: string;
};

type AgentCardInterface = { url?: string; protocolVersion?: string; protocolBinding?: string };
type AgentCardSkill = { id?: string; name?: string; description?: string; tags?: string[] };
type AgentCard = {
  name?: string;
  description?: string;
  version?: string;
  supportedInterfaces?: AgentCardInterface[];
  capabilities?: { streaming?: boolean; pushNotifications?: boolean };
  defaultInputModes?: string[];
  defaultOutputModes?: string[];
  skills?: AgentCardSkill[];
  securitySchemes?: unknown;
};

// ─────────────────────────────────────────────────────────────────────────
// Static content
// ─────────────────────────────────────────────────────────────────────────

const SUGGESTED_QUESTIONS = [
  "What is the latest status of PO 4500012345?",
  "Has PO 4500012388 shipped?",
  "Is PO 4500012420 still expected on time?",
  "Check the status of PO 4500012999.",
];

const TECH_BADGES = ["Google ADK", "Gemini", "A2A Protocol", "SAP Scenario", "Synthetic Data"];

const WITHOUT_A2A = [
  "Emails",
  "Phone calls",
  "Supplier portals",
  "Point-to-point custom integrations",
  "Direct system access",
  "A different integration pattern for every agent",
];

const WITH_A2A = [
  "Discover the supplier agent",
  "Understand its capabilities",
  "Send a standard agent request",
  "Receive a structured response",
  "Preserve organizational and system boundaries",
];

const COMPARISON_ROWS = [
  { pattern: "API", purpose: "Application invokes a defined system function", boundary: "System to system" },
  { pattern: "MCP", purpose: "An agent accesses tools, data or enterprise systems", boundary: "Agent to tool" },
  { pattern: "Local sub-agent", purpose: "Agents collaborate inside one controlled application", boundary: "Same team or codebase" },
  { pattern: "A2A", purpose: "Independently built agents discover and communicate", boundary: "Cross-team or cross-company" },
];

const TUTORIAL_STEPS = [
  { title: "Define the enterprise boundary", body: "Model the buyer and supplier as separately owned systems and services, from the start — this is what the whole exercise is about." },
  { title: "Create synthetic buyer SAP data", body: "A JSON file of purchase orders (PO number, supplier, material, quantity, requested delivery date) plus a get_buyer_purchase_order_context() tool that reads only it." },
  { title: "Create synthetic supplier ERP data", body: "A separate JSON file of fulfillment records (acknowledgment, confirmed quantity, ship date, ETA, carrier, tracking) plus a get_purchase_order_status() tool." },
  { title: "Build the Supplier Fulfillment Agent", body: "A Google ADK LlmAgent with the ERP tool and an instruction that forbids inventing values the tool didn't return — data minimization is enforced here, not downstream." },
  { title: "Expose the supplier agent through A2A", body: "to_a2a(root_agent, port=8001) wraps the agent in a Starlette app that auto-generates and serves its Agent Card, and mounts the A2A JSON-RPC routes." },
  { title: "Run the supplier service", body: "uvicorn server:a2a_app --host localhost --port 8001 — a real, separate process the buyer never touches directly." },
  { title: "Inspect the Agent Card", body: "Fetch /.well-known/agent-card.json (path may vary by SDK version) and confirm name, skills, protocol version, and service URL before consuming it." },
  { title: "Create the remote supplier proxy", body: "RemoteA2aAgent(name=..., agent_card=<card_url>) resolves the card and speaks A2A on the buyer's behalf." },
  { title: "Build the Buyer Procurement Agent", body: "Its own LlmAgent with the buyer SAP tool plus a plain tool function that drives the RemoteA2aAgent through its own Runner, catching A2A failures explicitly." },
  { title: "Execute the buyer agent", body: "InMemorySessionService + Runner + run_async(), same as any ADK agent — the remote call is just another tool call from here." },
  { title: "Add the streaming web experience", body: "A FastAPI POST /query/stream endpoint emits each step as a Server-Sent Event as it happens, so the browser can render a live trace instead of a single blob after the fact." },
  { title: "Run everything locally", body: "Two Python services plus this Next.js app, three processes, no Docker required for local dev — see the lab's README for exact commands." },
  { title: "Deploy the services", body: "Supplier and buyer each become their own Cloud Run service; the buyer is configured with the supplier's live Cloud Run URL as SUPPLIER_AGENT_CARD_URL." },
  { title: "Validate the real boundary", body: "Stop the supplier service and confirm the buyer returns a controlled 'unavailable' response instead of silently fabricating one — that's the whole point." },
];

const ENTERPRISE_CONSIDERATIONS = [
  "Identity & authorization — service-to-service identity (OAuth2, mTLS, or workload identity), declared in the Agent Card and enforced by the supplier.",
  "Data minimization — the supplier agent should only ever return data for purchase orders the calling buyer is entitled to see.",
  "Agent discovery — how a buyer first learns a trusted supplier agent exists and where its Agent Card lives.",
  "Contract & schema versioning — the A2A message schema and skill definitions need a versioning and deprecation policy.",
  "Network security — private networking instead of a public endpoint, where the relationship allows it.",
  "Auditability — every A2A call logged with a request ID, timing, and outcome.",
  "Observability — trace visibility into buyer-tool calls, A2A calls, and failures, without exposing hidden model reasoning.",
  "Timeouts & bounded retries — so a slow or struggling supplier degrades gracefully instead of hanging the buyer.",
  "Rate limits — both to protect the supplier and to keep a public demo from being abused.",
  "Human escalation — what happens, and who is notified, when a supplier agent is degraded for an extended period.",
  "Service-level expectations — agreed availability and response-time targets between buyer and supplier.",
  "Supplier onboarding & offboarding — how a new supplier agent gets trusted, and how that trust gets revoked.",
];

// ─────────────────────────────────────────────────────────────────────────
// Small shared bits
// ─────────────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </div>
  );
}

function OutlookBadge({ outlook }: { outlook: PurchaseOrderSummary["delivery_outlook"] }) {
  if (!outlook) return null;
  const styles: Record<string, { bg: string; fg: string; label: string }> = {
    on_time: { bg: "#dcfce7", fg: "#15803d", label: "On time" },
    at_risk: { bg: "#fef9c3", fg: "#92400e", label: "At risk" },
    delayed: { bg: "#fee2e2", fg: "#b91c1c", label: "Delayed" },
  };
  const s = styles[outlook];
  return (
    <span
      style={{
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        padding: "3px 10px",
        borderRadius: 20,
        background: s.bg,
        color: s.fg,
      }}
    >
      {s.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────

export default function EnterpriseA2APOStatusLab() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);

  const [agentCard, setAgentCard] = useState<AgentCard | null>(null);
  const [agentCardError, setAgentCardError] = useState<string | null>(null);
  const [agentCardLoading, setAgentCardLoading] = useState(true);
  const [showAgentCardJson, setShowAgentCardJson] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setAgentCardLoading(true);
    fetch("/api/lab/a2a-po-status/agent-card")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.error) setAgentCardError(String(data.error));
        else setAgentCard(data as AgentCard);
      })
      .catch(() => {
        if (!cancelled) setAgentCardError("The supplier agent is currently unavailable.");
      })
      .finally(() => {
        if (!cancelled) setAgentCardLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [turns]);

  async function runQuery(question: string) {
    const trimmed = question.trim();
    if (!trimmed || sending) return;

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    setTurns((prev) => [...prev, { id, question: trimmed, status: "streaming", trace: [], result: null }]);
    setExpandedTraceId(id);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/lab/a2a-po-status/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let sepIndex: number;
        while ((sepIndex = buffer.indexOf("\n\n")) !== -1) {
          const rawEvent = buffer.slice(0, sepIndex);
          buffer = buffer.slice(sepIndex + 2);

          let eventType = "message";
          let dataLine = "";
          for (const line of rawEvent.split("\n")) {
            if (line.startsWith("event: ")) eventType = line.slice(7).trim();
            else if (line.startsWith("data: ")) dataLine = line.slice(6);
          }
          if (!dataLine) continue;

          let data: unknown;
          try {
            data = JSON.parse(dataLine);
          } catch {
            continue;
          }

          if (eventType === "trace") {
            const traceEvent = data as TraceEvent;
            setTurns((prev) =>
              prev.map((t) => (t.id === id ? { ...t, trace: [...t.trace, traceEvent] } : t))
            );
          } else if (eventType === "result") {
            const result = data as QueryResult;
            setTurns((prev) =>
              prev.map((t) => (t.id === id ? { ...t, result, status: "done" } : t))
            );
          }
        }
      }
    } catch {
      setTurns((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                status: "error",
                errorMessage: "Something went wrong reaching the buyer agent. Please try again.",
              }
            : t
        )
      );
    } finally {
      setSending(false);
    }
  }

  function reset() {
    setTurns([]);
    setExpandedTraceId(null);
  }

  const supplierReachable = !agentCardLoading && !agentCardError && !!agentCard;
  const interfaceInfo = agentCard?.supportedInterfaces?.[0];

  return (
    <main style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh", paddingBottom: 60 }}>
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
        <span style={{ color: "var(--ink)" }}>Enterprise A2A: Purchase Order Status</span>
      </div>

      {/* Hero */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "52px 24px 32px" }}>
        <SectionLabel>Elegance AI Enterprise Lab</SectionLabel>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.9rem, 4.2vw, 2.7rem)",
            color: "var(--navy)",
            lineHeight: 1.18,
            marginBottom: 16,
          }}
        >
          When one enterprise agent needs an answer from another
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--muted)", lineHeight: 1.75, maxWidth: 680, marginBottom: 24 }}>
          A buyer&rsquo;s procurement agent asks a supplier&rsquo;s fulfillment agent for the latest purchase
          order status through the A2A protocol. Neither company exposes its internal ERP system or agent
          implementation.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
          {TECH_BADGES.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
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
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Try the lab", href: "#interactive-lab" },
            { label: "See the architecture", href: "#architecture" },
            { label: "Build it step by step", href: "#tutorial" },
          ].map((a) => (
            <a
              key={a.href}
              href={a.href}
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--accent)",
                textDecoration: "none",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "8px 16px",
              }}
            >
              {a.label} →
            </a>
          ))}
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Why A2A */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
        <SectionLabel>Why A2A is needed</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
          <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 24, background: "var(--card)" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--muted)", marginBottom: 14 }}>
              Without A2A
            </div>
            <ul style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.92rem", color: "var(--muted)", paddingLeft: 18 }}>
              {WITHOUT_A2A.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div style={{ border: "1px solid var(--accent)", borderRadius: 12, padding: 24, background: "var(--accent-light)" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent)", marginBottom: 14 }}>
              With A2A
            </div>
            <ul style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.92rem", color: "var(--ink)", paddingLeft: 18 }}>
              {WITH_A2A.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.75, fontStyle: "italic" }}>
          The buyer does not need to know whether the supplier agent uses Google ADK, LangGraph, Java,
          Python, SAP, Oracle or a custom ERP. It needs a trusted A2A-compatible interface.
        </p>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Interactive lab */}
      <section id="interactive-lab" style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
        <SectionLabel>Interactive lab</SectionLabel>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--navy)", marginBottom: 20 }}>
          Ask the Buyer Procurement Agent
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "stretch" }}>
          {/* Buyer panel */}
          <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
                Buyer Company
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--navy)", marginTop: 4 }}>
                Buyer Procurement Agent
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>SAP S/4HANA · simulated</div>
            </div>

            <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column", gap: 16, maxHeight: 480, overflowY: "auto" }}>
              {turns.length === 0 && (
                <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                  Ask about a purchase order, or click a suggestion below.
                </p>
              )}
              {turns.map((t) => (
                <div key={t.id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div
                    style={{
                      alignSelf: "flex-end",
                      maxWidth: "90%",
                      background: "var(--bg-secondary)",
                      borderRadius: 10,
                      padding: "8px 12px",
                      fontSize: "0.88rem",
                    }}
                  >
                    {t.question}
                  </div>
                  {t.status === "streaming" && (
                    <div style={{ fontSize: "0.82rem", color: "var(--muted)", display: "flex", alignItems: "center" }}>
                      <span className="live-dot" />
                      Working…
                    </div>
                  )}
                  {t.status === "error" && (
                    <div style={{ fontSize: "0.85rem", color: "#b91c1c" }}>{t.errorMessage}</div>
                  )}
                  {t.status === "done" && t.result && (
                    <div style={{ fontSize: "0.88rem", color: "var(--ink)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                      {t.result.answer}
                    </div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div style={{ padding: 16, borderTop: "1px solid var(--border)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => runQuery(q)}
                    disabled={sending}
                    style={{
                      fontSize: "0.72rem",
                      padding: "4px 10px",
                      borderRadius: 20,
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      color: "var(--muted)",
                      cursor: sending ? "default" : "pointer",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runQuery(input);
                }}
                style={{ display: "flex", gap: 8 }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="What is the latest status of PO ...?"
                  disabled={sending}
                  style={{
                    flex: 1,
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: "0.88rem",
                    background: "var(--bg)",
                    color: "var(--ink)",
                  }}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: "var(--accent)",
                    color: "white",
                    cursor: sending ? "default" : "pointer",
                    opacity: sending || !input.trim() ? 0.6 : 1,
                  }}
                >
                  Send
                </button>
                <button
                  type="button"
                  onClick={reset}
                  disabled={sending || turns.length === 0}
                  style={{
                    fontSize: "0.85rem",
                    padding: "8px 14px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "var(--muted)",
                    cursor: "pointer",
                  }}
                >
                  Reset
                </button>
              </form>
            </div>
          </div>

          {/* Middle indicator */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "0 4px",
              minWidth: 120,
            }}
          >
            <div style={{ fontSize: "0.68rem", color: "var(--muted)", textAlign: "center", lineHeight: 1.5 }}>
              Buyer Agent
              <br />
              →A2A Request→
              <br />
              Supplier Agent
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--muted)", textAlign: "center", lineHeight: 1.5 }}>
              Buyer Agent
              <br />
              ←A2A Response←
              <br />
              Supplier Agent
            </div>
            {sending && (
              <div style={{ fontSize: "0.7rem", color: "var(--accent)", display: "flex", alignItems: "center" }}>
                <span className="live-dot" />
                Live
              </div>
            )}
          </div>

          {/* Supplier panel */}
          <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
                Supplier Company
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--navy)", marginTop: 4 }}>
                Supplier Fulfillment Agent
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Supplier ERP · simulated</div>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <StatusRow label="Agent status" ok={supplierReachable} okLabel="Online" badLabel={agentCardLoading ? "Checking…" : "Unavailable"} />
              <StatusRow label="Agent Card availability" ok={supplierReachable} okLabel="Published" badLabel="Not reachable" />
              <div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 4 }}>Exposed skill</div>
                <div style={{ fontSize: "0.85rem", color: "var(--ink)" }}>get_purchase_order_status</div>
              </div>
              <div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 4 }}>A2A endpoint</div>
                <div style={{ fontSize: "0.8rem", color: "var(--ink)", wordBreak: "break-all" }}>
                  {interfaceInfo?.url ?? "—"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest result panel */}
        {turns.length > 0 && turns[turns.length - 1].result && (
          <ResultPanel turn={turns[turns.length - 1]} />
        )}

        {/* Trace panels */}
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          {turns.map((t) => (
            <TracePanel
              key={t.id}
              turn={t}
              expanded={expandedTraceId === t.id}
              onToggle={() => setExpandedTraceId(expandedTraceId === t.id ? null : t.id)}
            />
          ))}
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Architecture */}
      <section id="architecture" style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
        <SectionLabel>Architecture</SectionLabel>
        <ArchitectureDiagram />
        <ul style={{ marginTop: 20, fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.9, paddingLeft: 18 }}>
          <li>Separate ownership, separate deployment, separate data — no shared database.</li>
          <li>No direct buyer access to the supplier&rsquo;s ERP.</li>
          <li>A2A is the only agent-to-agent boundary between the two enterprises.</li>
        </ul>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Agent Card viewer */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
        <SectionLabel>Inspect the Agent Card</SectionLabel>
        <p style={{ fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.75, marginBottom: 20, maxWidth: 640 }}>
          An Agent Card is the machine-readable description of what an agent can do and how another agent
          can communicate with it. This is fetched live from the deployed Supplier Fulfillment Agent — never
          hardcoded.
        </p>

        {agentCardLoading && <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Fetching the live Agent Card…</p>}
        {agentCardError && (
          <p style={{ fontSize: "0.9rem", color: "#b91c1c" }}>
            Could not fetch the Agent Card: {agentCardError}
          </p>
        )}
        {agentCard && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
              <Field label="Agent name" value={agentCard.name} />
              <Field label="Description" value={agentCard.description} />
              <Field label="Version" value={agentCard.version} />
              <Field label="Protocol version" value={interfaceInfo?.protocolVersion} />
              <Field label="Service URL" value={interfaceInfo?.url} />
              <Field label="Input modes" value={agentCard.defaultInputModes?.join(", ")} />
              <Field label="Output modes" value={agentCard.defaultOutputModes?.join(", ")} />
              <Field
                label="Skills"
                value={agentCard.skills?.map((s) => s.name).filter(Boolean).join(", ")}
              />
              <Field
                label="Authentication"
                value="None declared — public demo endpoint. A production deployment would declare OAuth2/mTLS here."
              />
            </div>

            <button
              onClick={() => setShowAgentCardJson((v) => !v)}
              style={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--accent)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {showAgentCardJson ? "Hide" : "Show"} raw JSON {showAgentCardJson ? "▲" : "▼"}
            </button>
            {showAgentCardJson && (
              <pre
                style={{
                  marginTop: 12,
                  fontSize: "0.78rem",
                  lineHeight: 1.6,
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: 16,
                  overflowX: "auto",
                }}
              >
                {JSON.stringify(agentCard, null, 2)}
              </pre>
            )}
          </>
        )}
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Comparison table */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
        <SectionLabel>A2A versus API, MCP and local sub-agents</SectionLabel>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)" }}>
                {["Pattern", "Primary purpose", "Typical boundary"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "var(--muted)", fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.pattern} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600, color: "var(--navy)" }}>{row.pattern}</td>
                  <td style={{ padding: "10px 12px", color: "var(--ink)" }}>{row.purpose}</td>
                  <td style={{ padding: "10px 12px", color: "var(--muted)" }}>{row.boundary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: 16, fontSize: "0.9rem", color: "var(--muted)", fontStyle: "italic" }}>
          A2A still runs over standard network technologies. Its value is the common agent interaction
          model, not the elimination of APIs.
        </p>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Tutorial */}
      <section id="tutorial" style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
        <SectionLabel>Build it end to end</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {TUTORIAL_STEPS.map((step, i) => (
            <div key={step.title} style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: i < TUTORIAL_STEPS.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div
                style={{
                  flexShrink: 0,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "var(--accent-light)",
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}
              >
                {i + 1}
              </div>
              <div>
                <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--navy)", marginBottom: 4 }}>
                  {step.title}
                </div>
                <div style={{ fontSize: "0.87rem", color: "var(--muted)", lineHeight: 1.65 }}>{step.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Enterprise considerations */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
        <SectionLabel>Enterprise considerations</SectionLabel>
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "10px 24px", fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.7, paddingLeft: 18 }}>
          {ENTERPRISE_CONSIDERATIONS.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Footer note */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 0" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7 }}>
          Elegance AI Lab — Practical learning for applied and agentic AI. Built with synthetic data. Not
          connected to a production SAP system.
        </p>
      </section>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────

function StatusRow({ label, ok, okLabel, badLabel }: { label: string; ok: boolean; okLabel: string; badLabel: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{label}</span>
      <span
        style={{
          fontSize: "0.72rem",
          fontWeight: 600,
          padding: "2px 10px",
          borderRadius: 20,
          background: ok ? "#dcfce7" : "#fef9c3",
          color: ok ? "#15803d" : "#92400e",
        }}
      >
        {ok ? okLabel : badLabel}
      </span>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: "0.86rem", color: "var(--ink)", wordBreak: "break-word" }}>{value || "—"}</div>
    </div>
  );
}

function ResultPanel({ turn }: { turn: Turn }) {
  const result = turn.result;
  if (!result) return null;
  const po = result.purchase_order;

  return (
    <div style={{ marginTop: 24, border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)", padding: 24 }}>
      <SectionLabel>Result</SectionLabel>
      {po && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
          <Field label="PO Number" value={po.po_number} />
          <Field label="Supplier" value={po.supplier_name} />
          <Field label="Material" value={po.material} />
          <Field label="Ordered quantity" value={po.ordered_quantity?.toString()} />
          <Field label="Confirmed quantity" value={po.confirmed_quantity?.toString()} />
          <Field label="Requested delivery date" value={po.requested_delivery_date} />
          <Field label="Supplier status" value={po.fulfillment_status} />
          <Field label="Estimated arrival" value={po.estimated_arrival_date} />
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>
              Delivery outlook
            </div>
            <OutlookBadge outlook={po.delivery_outlook} />
          </div>
        </div>
      )}

      <p style={{ fontSize: "0.92rem", color: "var(--ink)", lineHeight: 1.7, marginBottom: 16, whiteSpace: "pre-wrap" }}>
        {result.answer}
      </p>

      {result.sources.length > 0 && (
        <div style={{ fontSize: "0.8rem", color: "var(--muted)", borderTop: "1px solid var(--border)", paddingTop: 14 }}>
          {result.sources.map((s) => (
            <div key={s.name}>
              {s.name === "Buyer SAP" ? "Buyer context" : "Supplier status"}: {s.type === "a2a_remote_agent" ? "Supplier Fulfillment Agent through A2A" : "Simulated SAP S/4HANA"}
            </div>
          ))}
        </div>
      )}

      <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 12 }}>
        {result.metrics.total_duration_ms.toFixed(0)}ms total
        {result.metrics.a2a_duration_ms != null && ` · ${result.metrics.a2a_duration_ms.toFixed(0)}ms A2A`}
        {` · ${result.metrics.model_calls} model call${result.metrics.model_calls === 1 ? "" : "s"}`}
        {` · ${result.metrics.remote_agent_calls} remote agent call${result.metrics.remote_agent_calls === 1 ? "" : "s"}`}
      </div>
    </div>
  );
}

function TracePanel({ turn, expanded, onToggle }: { turn: Turn; expanded: boolean; onToggle: () => void }) {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 10, background: "var(--card)" }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "0.82rem",
          color: "var(--muted)",
        }}
      >
        <span>
          Execution trace — &ldquo;{turn.question.length > 50 ? turn.question.slice(0, 50) + "…" : turn.question}&rdquo;
          {" "}({turn.trace.length} events)
        </span>
        <span>{expanded ? "▲" : "▼"}</span>
      </button>
      {expanded && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
          {turn.trace.length === 0 && <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Waiting for events…</span>}
          {turn.trace.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 10, fontSize: "0.78rem", fontFamily: "var(--font-mono, monospace)" }}>
              <span style={{ color: "var(--muted)", minWidth: 70 }}>
                {new Date(e.timestamp).toLocaleTimeString()}
              </span>
              <span
                style={{
                  fontWeight: 600,
                  color: e.status === "failed" ? "#b91c1c" : e.status === "completed" ? "#15803d" : "var(--accent)",
                  minWidth: 90,
                }}
              >
                {e.status}
              </span>
              <span style={{ color: "var(--ink)", minWidth: 90 }}>{e.service}</span>
              <span style={{ color: "var(--ink)" }}>{e.event}</span>
              {e.duration_ms != null && <span style={{ color: "var(--muted)" }}>{e.duration_ms.toFixed(0)}ms</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArchitectureDiagram() {
  const boxStyle: React.CSSProperties = {
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "10px 16px",
    fontSize: "0.85rem",
    color: "var(--ink)",
    background: "var(--card)",
    textAlign: "center",
  };
  const arrow = (
    <div style={{ color: "var(--muted)", fontSize: "1.1rem" }}>↓</div>
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "start" }}>
      <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 4 }}>
          Buyer Enterprise
        </div>
        <div style={boxStyle}>User</div>
        {arrow}
        <div style={boxStyle}>Buyer Procurement Agent</div>
        {arrow}
        <div style={boxStyle}>Buyer SAP Tool</div>
        {arrow}
        <div style={boxStyle}>Simulated SAP Data</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", writingMode: "vertical-rl", color: "var(--accent)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.05em" }}>
        A2A Protocol
      </div>

      <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 4 }}>
          Supplier Enterprise
        </div>
        <div style={boxStyle}>Supplier Fulfillment Agent</div>
        {arrow}
        <div style={boxStyle}>Supplier ERP Tool</div>
        {arrow}
        <div style={boxStyle}>Simulated Supplier ERP Data</div>
      </div>
    </div>
  );
}
