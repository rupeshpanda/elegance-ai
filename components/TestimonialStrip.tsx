export default function TestimonialStrip() {
  return (
    <section style={{ background: "var(--bg-secondary)", padding: "var(--space-section-sm) 0" }}>
      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "0 24px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: 72,
            lineHeight: 1,
            color: "var(--accent)",
            fontFamily: "Georgia, serif",
            marginBottom: -8,
          }}
        >
          &ldquo;
        </span>
        <p
          className="font-serif"
          style={{
            fontSize: "1.2rem",
            lineHeight: 1.65,
            fontWeight: 400,
            color: "var(--ink)",
          }}
        >
          Finally — AI writing that speaks to the realities of enterprise IT,
          not just startup greenfield. This is what CIOs actually need to read.
        </p>
        <p
          style={{
            fontSize: 13,
            color: "var(--muted)",
            marginTop: 20,
          }}
        >
          — VP of Technology, Fortune 500
        </p>
      </div>
    </section>
  );
}
