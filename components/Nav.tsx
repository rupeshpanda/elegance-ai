"use client";
import { useState } from "react";
import { LogoMark } from "./LogoMark";

const desktopLinks = [
  { label: "Perspectives", href: "#perspectives" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
];

const mobileLinks = [
  { label: "Perspectives", href: "#perspectives" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "AI Edge", href: "#edge" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <LogoMark />

        <nav className="hidden md:flex items-center gap-8">
          {desktopLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://lu.ma/1fxx84io"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--ink)",
              padding: "5px 14px",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)";
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--accent-light)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink)";
              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
            }}
          >
            Join AI Edge →
          </a>
        </nav>

        <button
          className="md:hidden p-1 text-ink"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-bg px-6 py-5 flex flex-col gap-5">
          {mobileLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://lu.ma/1fxx84io"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="text-sm py-2.5 bg-indigo text-white rounded-full text-center"
          >
            Join AI Edge →
          </a>
        </div>
      )}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
    </svg>
  );
}
