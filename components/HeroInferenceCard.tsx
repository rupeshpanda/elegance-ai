"use client";
import { useEffect, useRef, useState } from "react";

const DEPTHS = [1, 3, 8, 20];
const BASE = [742, 891, 45];
const TIER_COLORS = ["#0D7377", "#1D9E75", "#5DCAA5"];
const TIER_NAMES = ["Frontier", "Standard", "Economy"];

export function HeroInferenceCard() {
  const [di, setDi] = useState(1);
  const [displayCost, setDisplayCost] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  const prevCostRef = useRef(0);

  const mult = DEPTHS[di];
  const tiers = BASE.map((b) => b * mult);
  const total = tiers.reduce((a, b) => a + b, 0);
  const maxBar = BASE.reduce((a, b) => a + b, 0) * 20;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setDisplayCost(total); return; }
    const start = prevCostRef.current;
    prevCostRef.current = total;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - t0) / 600, 1);
      setDisplayCost(start + (total - start) * p);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [di]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(() => setDi((d) => (d + 1) % DEPTHS.length), 2400);
    return () => clearInterval(id);
  }, []);

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString();

  return (
    <a
      href="/inference-cost-modeller"
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 36px rgba(0,0,0,0.16)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.1)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>Inference Cost Modeller</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className="live-dot" />
          <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1D9E75", fontWeight: 500 }}>
            Live
          </span>
        </span>
      </div>

      <div style={{ fontFamily: "var(--font-dm-serif)", fontSize: 34, fontWeight: 500, lineHeight: 1, color: "var(--navy)", fontVariantNumeric: "tabular-nums" }}>
        {fmt(displayCost)}
      </div>
      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 16, marginTop: 4 }}>
        projected monthly cost
      </div>

      {tiers.map((t, k) => (
        <div key={k} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
            <span style={{ color: "var(--muted)" }}>{TIER_NAMES[k]}</span>
            <span style={{ fontWeight: 500, fontVariantNumeric: "tabular-nums", color: "var(--ink)" }}>{fmt(t)}</span>
          </div>
          <div style={{ height: 6, background: "var(--accent-light)", borderRadius: 3, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                borderRadius: 3,
                background: TIER_COLORS[k],
                width: `${Math.min((t / maxBar) * 100 * 3, 100)}%`,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>
      ))}

      <div
        style={{
          marginTop: 14,
          paddingTop: 14,
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 10, color: "var(--muted)" }}>Agentic depth</span>
        <span style={{ display: "flex", gap: 4 }}>
          {DEPTHS.map((d, idx) => (
            <span
              key={d}
              style={{
                fontSize: 10,
                fontWeight: 500,
                padding: "2px 7px",
                borderRadius: 99,
                background: idx === di ? "var(--accent-light)" : "var(--bg-secondary)",
                color: idx === di ? "var(--accent)" : "var(--muted)",
                transition: "all 0.3s",
              }}
            >
              {d}x
            </span>
          ))}
        </span>
      </div>
    </a>
  );
}
