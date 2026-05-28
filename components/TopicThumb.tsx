function AgenticSvg() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="40" cy="18" r="6" />
      <circle cx="20" cy="55" r="6" />
      <circle cx="60" cy="55" r="6" />
      <path d="M37 23 L23 50" strokeDasharray="2 3" />
      <path d="M43 23 L57 50" strokeDasharray="2 3" />
      <path d="M26 55 L54 55" strokeDasharray="2 3" />
      <path d="M52 52 l4 3 -4 3" />
    </svg>
  );
}

function ContextSvg() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="14" y="14" width="52" height="52" rx="4" />
      <rect x="24" y="24" width="32" height="32" rx="3" />
      <rect x="34" y="34" width="12" height="12" rx="2" />
    </svg>
  );
}

function HeadlessSvg() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="12" y="30" width="20" height="20" rx="3" />
      <rect x="48" y="18" width="20" height="14" rx="3" />
      <rect x="48" y="48" width="20" height="14" rx="3" />
      <path d="M32 40 L48 25" strokeDasharray="2 3" />
      <path d="M32 40 L48 55" strokeDasharray="2 3" />
    </svg>
  );
}

function InferenceSvg() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="16" y1="64" x2="64" y2="64" />
      <rect x="20" y="48" width="8" height="16" />
      <rect x="36" y="36" width="8" height="28" />
      <rect x="52" y="20" width="8" height="44" />
      <path d="M20 44 Q40 20 60 16" strokeDasharray="2 3" />
    </svg>
  );
}

function SapSvg() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="16" y="16" width="14" height="14" rx="2" />
      <rect x="50" y="16" width="14" height="14" rx="2" />
      <rect x="16" y="50" width="14" height="14" rx="2" />
      <rect x="50" y="50" width="14" height="14" rx="2" />
      <path d="M30 23 L50 23 M30 57 L50 57 M23 30 L23 50 M57 30 L57 50" strokeDasharray="2 3" />
    </svg>
  );
}

function DefaultSvg() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="40" cy="40" r="8" />
      <path d="M40 18 L40 32 M40 48 L40 62 M18 40 L32 40 M48 40 L62 40" />
    </svg>
  );
}

export function TopicThumb({ topic }: { topic: string }) {
  const key = topic.toLowerCase();
  let Svg = DefaultSvg;
  if (key.includes("agent") || key.includes("orchestr")) Svg = AgenticSvg;
  else if (key.includes("context") || key.includes("gap")) Svg = ContextSvg;
  else if (key.includes("headless") || key.includes("architect")) Svg = HeadlessSvg;
  else if (key.includes("inference") || key.includes("cost") || key.includes("econ")) Svg = InferenceSvg;
  else if (key.includes("sap") || key.includes("enterprise") || key.includes("4hana") || key.includes("intelligence")) Svg = SapSvg;

  return (
    <div
      style={{
        width: "calc(100% + 48px)",
        height: 110,
        background: "var(--accent-light)",
        borderRadius: "8px 8px 0 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "-24px -24px 16px -24px",
        color: "var(--accent)",
      }}
    >
      <div style={{ width: 72, height: 72 }}>
        <Svg />
      </div>
    </div>
  );
}
