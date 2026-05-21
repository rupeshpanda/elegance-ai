import { site } from "@/lib/content";

const footerLinks = [
  { label: "Perspectives", href: "#perspectives" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "AI Edge", href: "#edge" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <circle cx="14" cy="14" r="12" stroke="#4338CA" strokeWidth="0.8" opacity="0.35"/>
            <circle cx="14" cy="14" r="7.5" stroke="#4338CA" strokeWidth="0.8" opacity="0.6"/>
            <circle cx="14" cy="14" r="3" fill="#4338CA"/>
          </svg>
          <span className="text-sm font-semibold tracking-[0.2em] text-navy uppercase">
            {site.name}
          </span>
        </div>

        <nav className="flex flex-wrap justify-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] text-muted hover:text-ink transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <p className="text-[11px] text-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
