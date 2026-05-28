"use client";
import { useState } from "react";
import { SectionLabel } from "./SectionLabel";

const FAQS = [
  {
    q: "What does a conversation with you actually look like?",
    a: "A 30-minute call with no agenda other than your question. I'll share what I know from real delivery experience and be honest when something is outside my wheelhouse. There's no pitch at the end.",
  },
  {
    q: "Are you available for paid consulting engagements?",
    a: "Everything here is genuinely pro bono. If you're working on something at the intersection of enterprise AI and SAP where deep program delivery experience would be valuable, reach out - we can have that conversation.",
  },
  {
    q: "What industries do you have direct experience in?",
    a: "Utilities, manufacturing, retail, and life sciences - all in large-scale SAP S/4HANA transformations. The architecture and governance thinking transfers across sectors.",
  },
  {
    q: "How is this different from vendor content or sponsored analysis?",
    a: "No sponsorships, no affiliate arrangements, no vendor relationships that colour the analysis. Everything here comes from direct delivery experience running large-scale SAP programs for enterprise clients.",
  },
  {
    q: "What's the AI Edge community?",
    a: "A free monthly session (1st Wednesday, 1 hour) for business leaders and practitioners. No prerequisites, no fees, no upsell path. It started because I couldn't find AI education honest about enterprise IT constraints.",
  },
  {
    q: "Can I access demo source code or architecture docs?",
    a: "The demos are documented with architecture decisions and design rationale. Reach out directly - some are hosted, some I walk through on a call.",
  },
];

export default function AccordionFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="px-6 py-8 md:py-10" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-5 md:mb-10">
          <SectionLabel text="COMMON QUESTIONS" />
          <h2 className="font-serif text-6xl md:text-7xl text-navy leading-tight">
            Common questions
          </h2>
        </div>

        <div style={{ maxWidth: 720 }}>
          {FAQS.map((item, i) => (
            <div
              key={i}
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                borderBottom: "1px solid var(--border)",
                padding: "18px 0",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 500, color: "var(--ink)", paddingRight: 16 }}>
                  {item.q}
                </span>
                <span
                  style={{
                    fontSize: 22,
                    color: "var(--accent)",
                    fontWeight: 300,
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  {open === i ? "−" : "+"}
                </span>
              </div>
              {open === i && (
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "var(--muted)",
                    marginTop: 12,
                    maxWidth: 640,
                    marginBottom: 0,
                  }}
                >
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
