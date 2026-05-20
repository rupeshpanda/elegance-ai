"use client";
import { useState } from "react";
import Link from "next/link";
import JoinModal from "./JoinModal";

const navLinks = [
  { label: "Perspectives", href: "#perspectives" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "AI Edge", href: "#edge" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-bg/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <DiamondLogo />
            <span className="text-xs font-semibold tracking-[0.2em] text-navy uppercase">
              Elegance AI
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted hover:text-ink transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => setModalOpen(true)}
              className="text-sm px-5 py-2 bg-indigo text-white rounded-full hover:bg-indigo-dark transition-colors"
            >
              Join AI Edge
            </button>
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
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false);
                setModalOpen(true);
              }}
              className="text-sm py-2.5 bg-indigo text-white rounded-full"
            >
              Join AI Edge
            </button>
          </div>
        )}
      </header>

      <JoinModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

function DiamondLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <polygon points="20,2 38,20 20,38 2,20" fill="#4338CA" />
      <polygon points="20,8 32,20 20,32 8,20" fill="#FAFAF8" />
      <polygon points="20,14 26,20 20,26 14,20" fill="#4338CA" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      />
    </svg>
  );
}
