import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────
// Content — grounded directly in the a2a-sdk Python package's type
// definitions (a2a.types), not general recollection. Field names and the
// task-state enum below match what the SDK actually ships.
// ─────────────────────────────────────────────────────────────────────────

const AGENT_CARD_FIELDS: { field: string; meaning: string }[] = [
  { field: "name / description", meaning: "What the agent is, in plain language." },
  {
    field: "skills",
    meaning:
      "The concrete things it can do — each with an id, description, tags, and example prompts. This lab's supplier declares exactly one: get_purchase_order_status.",
  },
  {
    field: "capabilities",
    meaning:
      "Which protocol features are actually on: streaming, pushNotifications, extensions, an extended (auth-gated) card.",
  },
  {
    field: "securitySchemes",
    meaning: "How a caller is expected to authenticate — see the security section below.",
  },
  {
    field: "defaultInputModes / defaultOutputModes",
    meaning: "MIME types the agent accepts and returns — text/plain, application/json, etc.",
  },
  {
    field: "provider / version / documentationUrl",
    meaning: "Who runs it, which version, where to read more — ordinary API-catalog metadata.",
  },
];

const TASK_STATES: { state: string; meaning: string; scenario: string; usedHere: boolean }[] = [
  {
    state: "submitted",
    meaning: "The task exists. The agent hasn't started working it yet.",
    scenario: "The supplier's queue acknowledges the request the instant it arrives.",
    usedHere: true,
  },
  {
    state: "working",
    meaning: "The agent is actively producing a result.",
    scenario: "The supplier's model is running its get_purchase_order_status tool call.",
    usedHere: true,
  },
  {
    state: "input-required",
    meaning: "The agent needs more from the caller before it can continue.",
    scenario: '"Which line item on this PO?" — the task pauses instead of guessing.',
    usedHere: false,
  },
  {
    state: "auth-required",
    meaning: "The agent needs additional authorization before it can continue.",
    scenario: "A supplier that gates full shipment detail behind a stronger credential.",
    usedHere: false,
  },
  {
    state: "completed",
    meaning: "Done. The task's artifact holds the final result.",
    scenario: "The structured PO status this lab's supplier hands back.",
    usedHere: true,
  },
  {
    state: "failed",
    meaning: "The agent tried and hit an unrecoverable error.",
    scenario: "The supplier's own backend (its real ERP, in a real deployment) is unreachable.",
    usedHere: false,
  },
  {
    state: "canceled",
    meaning: "The caller withdrew the request before it finished.",
    scenario: "A buyer UI lets someone abandon a slow-running lookup.",
    usedHere: false,
  },
  {
    state: "rejected",
    meaning: "The agent declined to work the task at all.",
    scenario: "A PO number outside the requesting buyer's authorization.",
    usedHere: false,
  },
];

const PART_TYPES: { kind: string; meaning: string }[] = [
  { kind: "text", meaning: "Plain prose — most chat-style exchanges." },
  { kind: "file", meaning: "A reference (URL) or inline bytes — a PDF invoice, a shipment photo." },
  {
    kind: "data",
    meaning:
      "Structured JSON. This lab's supplier is constrained (via output_schema) to answer only in this form, so the buyer parses real fields instead of scraping prose.",
  },
];

const SECURITY_SCHEMES = [
  "API Key",
  "HTTP Auth (Bearer / Basic)",
  "Mutual TLS",
  "OAuth2 — authorization code, client credentials, device code, and password flows",
  "OpenID Connect",
];

const COMPARISON = [
  {
    pattern: "Plain API",
    when: "You control both ends, or the contract is small and stable.",
    example: "Your checkout service calling your own payments service.",
  },
  {
    pattern: "MCP",
    when: "One agent needs tools, files, or data — not another agent's judgment.",
    example: "Claude reading and writing files in a sandboxed workspace.",
  },
  {
    pattern: "Local sub-agent",
    when: "Multiple agents live in one codebase, one team, one deploy.",
    example: "A planner agent delegating to a summarizer agent in the same process.",
  },
  {
    pattern: "A2A",
    when: "The other agent is independently built, owned, and deployed — you can't see or change its internals.",
    example: "This lab: a buyer's agent asking a different company's agent a question.",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
      {children}
    </span>
  );
}

export default function A2AProtocolDeepDive() {
  return (
    <main className="bg-bg text-ink min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="border-b border-border px-6 py-3 text-sm text-muted flex items-center gap-2">
        <Link href="/" className="text-muted hover:text-ink no-underline">
          Home
        </Link>
        <span>/</span>
        <Link href="/lab" className="text-muted hover:text-ink no-underline">
          Lab
        </Link>
        <span>/</span>
        <Link
          href="/lab/a2a-purchase-order-status"
          className="text-muted hover:text-ink no-underline"
        >
          Enterprise A2A: Purchase Order Status
        </Link>
        <span>/</span>
        <span className="text-ink">Protocol Deep-Dive</span>
      </div>

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-6 pt-14 pb-8">
        <SectionLabel>A2A Protocol, Explained</SectionLabel>
        <h1 className="font-serif text-[clamp(1.9rem,4.2vw,2.7rem)] text-navy leading-tight mb-4">
          How the A2A protocol actually works
        </h1>
        <p className="text-[1.05rem] text-muted leading-relaxed">
          The interactive lab shows A2A working. This page explains what's actually happening
          underneath it — grounded directly in the protocol's real type definitions, not a
          simplified retelling. Every field and state named below is real, pulled from the
          same SDK this lab's supplier agent runs.
        </p>
      </section>

      <hr className="border-border max-w-2xl mx-auto" />

      {/* Agent discovery */}
      <section className="max-w-2xl mx-auto px-6 py-10">
        <SectionLabel>1. Agent discovery — the Agent Card</SectionLabel>
        <h2 className="font-serif text-2xl text-navy mb-4">
          Before any call happens, the caller has to find out what the other agent can do
        </h2>
        <p className="text-base text-ink leading-relaxed mb-5">
          An A2A agent publishes an <strong>Agent Card</strong> — usually at{" "}
          <code className="text-sm bg-bg-secondary px-1.5 py-0.5 rounded">
            /.well-known/agent-card.json
          </code>
          . It's the machine-readable answer to &ldquo;what are you, and how do I talk to
          you?&rdquo; This lab's own{" "}
          <Link href="/lab/a2a-purchase-order-status#interactive-lab" className="text-accent">
            Agent Card viewer
          </Link>{" "}
          fetches this live from the deployed supplier — never a hardcoded copy, because the
          whole point is that the card can change without the buyer's code changing.
        </p>
        <div className="border border-border rounded-xl overflow-hidden">
          {AGENT_CARD_FIELDS.map((f, i) => (
            <div
              key={f.field}
              className={`flex flex-col sm:flex-row gap-1 sm:gap-4 px-5 py-3 ${
                i < AGENT_CARD_FIELDS.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="sm:w-64 shrink-0 text-sm font-semibold text-navy">{f.field}</div>
              <div className="text-sm text-muted leading-relaxed">{f.meaning}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-border max-w-2xl mx-auto" />

      {/* Task lifecycle */}
      <section className="max-w-2xl mx-auto px-6 py-10">
        <SectionLabel>2. A task, not a request</SectionLabel>
        <h2 className="font-serif text-2xl text-navy mb-4">
          A2A doesn't model a call. It models a stateful task.
        </h2>
        <p className="text-base text-ink leading-relaxed mb-5">
          This is the part most explanations skip, and it's the actual reason A2A exists
          instead of &ldquo;just use an API.&rdquo; A plain HTTP call is request in, response
          out — it has no vocabulary for &ldquo;I need more information before I can answer&rdquo;
          or &ldquo;this requires stronger authorization.&rdquo; A2A tasks move through a real
          state machine, so those situations are first-class outcomes instead of ad-hoc error
          codes.
        </p>
        <div className="flex flex-col gap-3">
          {TASK_STATES.map((s) => (
            <div
              key={s.state}
              className="border border-border rounded-lg px-5 py-3.5 flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-4"
            >
              <div className="sm:w-40 shrink-0 flex items-center gap-2">
                <code className="text-sm font-semibold text-navy">{s.state}</code>
                {s.usedHere && (
                  <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-accent bg-accent-light rounded-full px-2 py-0.5">
                    in this lab
                  </span>
                )}
              </div>
              <div className="text-sm text-ink leading-relaxed">
                {s.meaning}{" "}
                <span className="text-muted">{s.scenario}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted leading-relaxed mt-5">
          This lab only exercises the happy path —{" "}
          <code className="text-sm bg-bg-secondary px-1.5 py-0.5 rounded">submitted</code> →{" "}
          <code className="text-sm bg-bg-secondary px-1.5 py-0.5 rounded">working</code> →{" "}
          <code className="text-sm bg-bg-secondary px-1.5 py-0.5 rounded">completed</code>. A
          production supplier agent would realistically also hit{" "}
          <code className="text-sm bg-bg-secondary px-1.5 py-0.5 rounded">input-required</code>{" "}
          (ambiguous PO reference),{" "}
          <code className="text-sm bg-bg-secondary px-1.5 py-0.5 rounded">rejected</code> (PO
          outside the buyer's authorization), and{" "}
          <code className="text-sm bg-bg-secondary px-1.5 py-0.5 rounded">failed</code> (its
          real ERP is down) — this lab's own backend degrades gracefully when the supplier
          process is killed, but that's handled below the A2A layer, in the buyer's own
          error handling, not by an A2A task state.
        </p>
      </section>

      <hr className="border-border max-w-2xl mx-auto" />

      {/* Object model */}
      <section className="max-w-2xl mx-auto px-6 py-10">
        <SectionLabel>3. Messages, Artifacts, and Parts</SectionLabel>
        <h2 className="font-serif text-2xl text-navy mb-4">
          What's actually inside a task
        </h2>
        <p className="text-base text-ink leading-relaxed mb-5">
          A <strong>Task</strong> is the umbrella object — it has an id, a{" "}
          <code className="text-sm bg-bg-secondary px-1.5 py-0.5 rounded">contextId</code>{" "}
          (so a multi-turn exchange can be tied together), a current status, and two kinds of
          content:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-base text-ink leading-relaxed mb-6">
          <li>
            <strong>Messages</strong> — the back-and-forth. Every message carries a role
            (agent or user) and a list of <strong>Parts</strong>.
          </li>
          <li>
            <strong>Artifacts</strong> — the actual work product, kept distinct from the
            conversation that produced it. A task can accumulate messages while it's still
            being worked, then emit one artifact when it's done.
          </li>
        </ul>
        <p className="text-base text-ink leading-relaxed mb-4">
          A <strong>Part</strong> is multi-modal by design:
        </p>
        <div className="border border-border rounded-xl overflow-hidden mb-2">
          {PART_TYPES.map((p, i) => (
            <div
              key={p.kind}
              className={`flex flex-col sm:flex-row gap-1 sm:gap-4 px-5 py-3 ${
                i < PART_TYPES.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="sm:w-28 shrink-0 text-sm font-semibold text-navy">{p.kind}</div>
              <div className="text-sm text-muted leading-relaxed">{p.meaning}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-border max-w-2xl mx-auto" />

      {/* Streaming */}
      <section className="max-w-2xl mx-auto px-6 py-10">
        <SectionLabel>4. Streaming and long-running work</SectionLabel>
        <h2 className="font-serif text-2xl text-navy mb-4">
          Two different &ldquo;live&rdquo; things are happening in this lab — only one of them is A2A
        </h2>
        <p className="text-base text-ink leading-relaxed mb-4">
          It's easy to watch this lab's live trace panel and assume the two agents are
          streaming to each other over A2A. They aren't. This supplier's Agent Card declares{" "}
          <code className="text-sm bg-bg-secondary px-1.5 py-0.5 rounded">
            &quot;streaming&quot;: false
          </code>{" "}
          — fetch it yourself, it's real — so the buyer sends a plain{" "}
          <code className="text-sm bg-bg-secondary px-1.5 py-0.5 rounded">SendMessage</code>{" "}
          call and simply waits for the task to complete. The trace panel you watch updating
          live is a Server-Sent Events stream from the <em>buyer service to your browser</em>,
          layered entirely on top of — and independent from — the A2A call underneath it.
        </p>
        <p className="text-base text-ink leading-relaxed mb-4">
          When an agent's card <em>does</em> declare{" "}
          <code className="text-sm bg-bg-secondary px-1.5 py-0.5 rounded">
            streaming: true
          </code>
          , a caller can use{" "}
          <code className="text-sm bg-bg-secondary px-1.5 py-0.5 rounded">
            SendStreamingMessage
          </code>{" "}
          or{" "}
          <code className="text-sm bg-bg-secondary px-1.5 py-0.5 rounded">SubscribeToTask</code>{" "}
          instead, and get task-state updates over the wire as they happen — genuinely useful
          when a remote agent's work takes long enough that polling would be wasteful.
        </p>
        <p className="text-base text-ink leading-relaxed">
          For work that takes even longer — hours or days, like a supplier's real acknowledgment
          workflow — A2A also defines <strong>push notifications</strong>: the caller registers
          a webhook once, the connection closes, and the remote agent calls back when the task
          state changes. Neither service in this lab uses it (
          <code className="text-sm bg-bg-secondary px-1.5 py-0.5 rounded">
            pushNotifications: false
          </code>{" "}
          too), but it's the mechanism that makes A2A viable for genuinely slow enterprise
          processes, not just fast demo calls.
        </p>
      </section>

      <hr className="border-border max-w-2xl mx-auto" />

      {/* Security */}
      <section className="max-w-2xl mx-auto px-6 py-10">
        <SectionLabel>5. Security — what the protocol offers vs. what this demo has</SectionLabel>
        <h2 className="font-serif text-2xl text-navy mb-4">
          The Agent Card is also where trust gets declared
        </h2>
        <p className="text-base text-ink leading-relaxed mb-4">
          An Agent Card's{" "}
          <code className="text-sm bg-bg-secondary px-1.5 py-0.5 rounded">securitySchemes</code>{" "}
          field is where an agent states how it expects to be authenticated. The spec supports
          real enterprise auth, not a single generic &ldquo;token&rdquo; concept:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-base text-ink leading-relaxed mb-5">
          {SECURITY_SCHEMES.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="text-base text-ink leading-relaxed">
          This lab's supplier declares none of them — its Agent Card viewer says so plainly:{" "}
          <em>&ldquo;None declared — public demo endpoint.&rdquo;</em> That's an honest gap,
          not an oversight to gloss over. A real cross-company deployment would pick from the
          list above — most likely OAuth2 client credentials or mTLS for service-to-service
          traffic — and enforce it before the supplier agent ever reaches its own tools. See
          the main lab page's{" "}
          <Link href="/lab/a2a-purchase-order-status#architecture" className="text-accent">
            enterprise considerations
          </Link>{" "}
          section for the rest of what changes between a demo and a production deployment.
        </p>
      </section>

      <hr className="border-border max-w-2xl mx-auto" />

      {/* Comparison */}
      <section className="max-w-2xl mx-auto px-6 py-10">
        <SectionLabel>6. When A2A is the right tool</SectionLabel>
        <h2 className="font-serif text-2xl text-navy mb-4">
          It's one option among a few, not a universal replacement
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                {["Pattern", "Reach for it when…", "Example"].map((h) => (
                  <th key={h} className="text-left py-2.5 px-3 text-muted font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.pattern} className="border-b border-border">
                  <td className="py-2.5 px-3 font-semibold text-navy whitespace-nowrap">
                    {row.pattern}
                  </td>
                  <td className="py-2.5 px-3 text-ink">{row.when}</td>
                  <td className="py-2.5 px-3 text-muted">{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted leading-relaxed mt-4 italic">
          A2A still runs over ordinary HTTP and JSON-RPC. The protocol's value is the shared
          interaction model — discovery, tasks, artifacts, security declarations — not some
          new transport magic.
        </p>
      </section>

      <hr className="border-border max-w-2xl mx-auto" />

      {/* Footer nav */}
      <section className="max-w-2xl mx-auto px-6 pt-10">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/lab/a2a-purchase-order-status#interactive-lab"
            className="text-sm font-semibold text-accent border border-border rounded-lg px-4 py-2 no-underline"
          >
            ← Back to the interactive lab
          </Link>
          <a
            href="https://github.com/rupeshpanda/enterprise-a2a-po-status-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-accent border border-border rounded-lg px-4 py-2 no-underline"
          >
            View the source →
          </a>
        </div>
      </section>
    </main>
  );
}
