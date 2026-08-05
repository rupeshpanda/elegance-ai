import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SAP Sales Change Impact Assessment | EleganceAI Lab",
  description:
    "A bounded SAP Explore workshop lab that produces an evidence-based, reviewable Change Impact Assessment.",
};

const labUrl = process.env.NEXT_PUBLIC_SAP_CHANGE_IMPACT_LAB_URL;

export default function SapSalesChangeImpactAssessmentPage() {
  return (
    <main style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "80vh" }}>
      <div style={{ borderBottom: "1px solid var(--border)", padding: "12px 24px", fontSize: "0.82rem", color: "var(--muted)" }}>
        <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>Home</Link>
        <span aria-hidden="true"> / </span>
        <Link href="/lab" style={{ color: "var(--muted)", textDecoration: "none" }}>Lab</Link>
        <span aria-hidden="true"> / </span>
        <span>SAP Sales Change Impact Assessment</span>
      </div>

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "72px 24px 88px" }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>
          SAP S/4HANA Explore Workshop Lab
        </div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 5vw, 3.25rem)", color: "var(--navy)", lineHeight: 1.12, marginBottom: 20 }}>
          From workshop discussion to a reviewable change assessment.
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.8, maxWidth: 650, marginBottom: 28 }}>
          Compare the As-Is and To-Be customer-order process, then inspect an evidence-linked assessment across process, roles, technology, data, controls, reporting, training, and testing. The standalone lab uses synthetic data and keeps final review authority with the business owner.
        </p>

        {labUrl ? (
          <a href={labUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", padding: "11px 20px", borderRadius: 6, background: "var(--accent)", color: "white", fontWeight: 600, textDecoration: "none" }}>
            Open the standalone lab ↗
          </a>
        ) : (
          <div style={{ border: "1px solid var(--border)", borderRadius: 10, padding: "20px", background: "var(--card)", maxWidth: 620 }}>
            <strong style={{ color: "var(--navy)" }}>Local verification is complete; deployment is pending review.</strong>
            <p style={{ color: "var(--muted)", lineHeight: 1.65, margin: "8px 0 0" }}>
              Configure <code>NEXT_PUBLIC_SAP_CHANGE_IMPACT_LAB_URL</code> when the standalone project is approved for deployment. The Lab index will then link directly to it.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
