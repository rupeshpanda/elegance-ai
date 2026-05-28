"use client";
import Link from "next/link";

export function LogoMark() {
  return (
    <Link
      href="/"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}
    >
      <svg width="32" height="32" viewBox="0 0 34 34" aria-label="Elegance AI" aria-hidden="true">
        <rect width="34" height="34" rx="7" fill="#0D7377" />
        <circle cx="12" cy="17" r="2.6" fill="#fff" />
        <circle cx="22" cy="11" r="2.6" fill="#fff" />
        <circle cx="22" cy="23" r="2.6" fill="#fff" />
        <path d="M14 16 L22 12 M14 18 L22 22" stroke="#fff" strokeWidth="1.5" />
      </svg>
      <span style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)", letterSpacing: "-0.01em" }}>
        Elegance AI
      </span>
    </Link>
  );
}
