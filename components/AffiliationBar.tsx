import { SectionLabel } from "./SectionLabel";

const AFFILIATIONS = [
  "Cognizant",
  "Hitachi Consulting",
  "Capgemini",
  "HCL",
  "NIT Calicut",
  "UT Dallas · Jindal",
  "IIM India",
  "Bordeaux University",
];

export default function AffiliationBar() {
  return (
    <section className="px-6 py-6 md:py-10" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-6xl mx-auto">
        <SectionLabel text="BACKGROUND & AFFILIATIONS" />
        <div className="flex flex-wrap gap-x-8 gap-y-4 items-center mt-4">
          {AFFILIATIONS.map((name) => (
            <span
              key={name}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--muted)",
                opacity: 0.7,
                letterSpacing: "0.02em",
                transition: "opacity 0.2s ease",
              }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
