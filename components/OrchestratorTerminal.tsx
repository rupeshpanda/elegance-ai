"use client";
import { useEffect, useRef, useState } from "react";

const LINES = [
  { t: '$ agent.run("reconcile Q2 invoices")', c: "#8b949e" },
  { t: "✓ task decomposed → 4 subtasks", c: "#3fb950" },
  { t: "✓ routed to specialist agents", c: "#3fb950" },
  { t: "⏸ checkpoint: human approval req.", c: "#d29922" },
  { t: "→ 500 invoices · 12 flagged >$10K", c: "#39c5cf" },
  { t: "✓ CFO summary generated", c: "#3fb950" },
  { t: "audit trail: complete", c: "#e6edf3" },
];

export function OrchestratorTerminal() {
  const [done, setDone] = useState<{ t: string; c: string }[]>([]);
  const [cur, setCur] = useState("");
  const [li, setLi] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setDone(LINES); return; }

    let ci = 0;
    const line = LINES[li];

    if (!line) {
      timerRef.current = setTimeout(() => {
        setDone([]);
        setCur("");
        setLi(0);
      }, 2600);
      return () => clearTimeout(timerRef.current);
    }

    const tick = () => {
      if (ci <= line.t.length) {
        setCur(line.t.substring(0, ci));
        ci++;
        timerRef.current = setTimeout(tick, line.t.charAt(ci - 1) === " " ? 14 : 26);
      } else {
        setDone((d) => [...d, line]);
        setCur("");
        timerRef.current = setTimeout(
          () => setLi((l) => l + 1),
          line.t.includes("checkpoint") ? 600 : 280
        );
      }
    };
    timerRef.current = setTimeout(tick, 100);
    return () => clearTimeout(timerRef.current);
  }, [li]);

  return (
    <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)" }}>
      <div
        style={{
          background: "#161b22",
          padding: "9px 12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ display: "flex", gap: 5 }}>
          {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
            <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
          ))}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span className="live-dot" />
          <span
            style={{
              fontSize: 8.5,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#3fb950",
              fontWeight: 500,
              fontFamily: "ui-monospace, monospace",
            }}
          >
            Live demo
          </span>
        </span>
      </div>

      <div
        style={{
          background: "#0d1117",
          padding: 14,
          fontFamily: "ui-monospace, monospace",
          fontSize: 10.5,
          lineHeight: 1.85,
          minHeight: 150,
        }}
      >
        {done.map((l, i) => (
          <div key={i} style={{ color: l.c }}>
            {l.t}
          </div>
        ))}
        {cur && (
          <div style={{ color: LINES[li]?.c }}>
            {cur}
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 12,
                background: "#39c5cf",
                verticalAlign: "middle",
                animation: "blink 1s step-end infinite",
              }}
            />
          </div>
        )}
      </div>

      <div
        style={{
          background: "#161b22",
          padding: "9px 12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span style={{ fontSize: 10, color: "#8b949e", fontFamily: "ui-monospace, monospace" }}>
          agentic-orchestrator
        </span>
        <span style={{ fontSize: 10, color: "#39c5cf", fontWeight: 500, fontFamily: "ui-monospace, monospace" }}>
          Coming soon
        </span>
      </div>
    </div>
  );
}
