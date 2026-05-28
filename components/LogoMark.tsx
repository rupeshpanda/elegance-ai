"use client";
import Link from "next/link";

export function LogoMark() {
  return (
    <Link
      href="/"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 5,
          background: "var(--accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ color: "#fff", fontSize: 13, fontWeight: 500, lineHeight: 1 }}>
          E
        </span>
      </div>
      <span
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: "var(--ink)",
          letterSpacing: "-0.01em",
        }}
      >
        Elegance AI
      </span>
    </Link>
  );
}
