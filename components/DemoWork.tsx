import { SectionLabel } from "./SectionLabel";

type Project = { slug: string; title: string; desc: string; tags: readonly string[]; status: string; url: string };

const CAPABILITIES: Record<string, string[]> = {
  "enterprise-ai-readiness": [
    "Scores readiness across data, integration, governance, talent, and strategy",
    "Generates a structured diagnostic report with dimension scores",
    "Surfaces specific gaps with prioritised recommendations",
    "Built on Claude API with structured output and enterprise architecture framing",
  ],
  "inference-cost-modeller": [
    "Models token costs across model tiers (Opus / Sonnet / Haiku)",
    "Accounts for context length, call frequency, and caching strategies",
    "Outputs cost comparison matrix for different deployment patterns",
    "Designed for CIOs sizing AI budgets before platform commitment",
  ],
  "sap-context-bridge": [
    "Bridges SAP transactional data and CRM signals in a single context window",
    "Natural language churn-risk analysis across two disconnected systems",
    "Demonstrates the context engineering pattern for enterprise RAG",
    "Live Claude API calls with structured SSE streaming output",
  ],
};

export default function DemoWork({ projects }: { projects: Project[] }) {
  return (
    <section id="work" className="px-6 py-8 md:py-10">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-5 md:mb-10">
          <SectionLabel text="BUILT TO SHOW" />
          <h2 className="font-serif text-6xl md:text-7xl text-heading leading-tight whitespace-pre-line mb-4">
            Built to show. Shared to teach.
          </h2>
          <p className="text-base text-muted leading-relaxed">
            Live AI systems built to prove enterprise architecture patterns. Each
            is documented with design decisions, not just output.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {projects.map((project, idx) => {
            const caps = CAPABILITIES[project.slug] ?? [];
            const isLive = project.url && project.url !== "#";
            return (
              <div
                key={project.slug}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: 24,
                  background: "var(--card)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <span className="section-label">DEMO {String(idx + 1).padStart(2, "0")}</span>

                <div>
                  <h3
                    style={{
                      fontWeight: 600,
                      fontSize: 16,
                      color: "var(--navy)",
                      margin: "0 0 8px",
                    }}
                  >
                    {project.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55, margin: 0 }}>
                    {project.desc}
                  </p>
                </div>

                {caps.length > 0 && (
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                    {caps.map((cap) => (
                      <li
                        key={cap}
                        style={{
                          fontSize: 13,
                          color: "var(--muted)",
                          lineHeight: 1.8,
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                        }}
                      >
                        <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }}>·</span>
                        {cap}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag-badge">{tag}</span>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 20, alignItems: "center", marginTop: "auto" }}>
                  {isLive ? (
                    <a
                      href={project.url}
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--accent)",
                        textDecoration: "none",
                      }}
                    >
                      Launch demo →
                    </a>
                  ) : (
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>Coming soon</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
