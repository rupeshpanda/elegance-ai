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
          <svg width="22" height="22" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <polygon points="20,2 38,20 20,38 2,20" fill="#4338CA" />
            <polygon points="20,8 32,20 20,32 8,20" fill="#FAFAF8" />
            <polygon points="20,14 26,20 20,26 14,20" fill="#4338CA" />
          </svg>
          <span className="text-xs font-semibold tracking-[0.2em] text-navy uppercase">
            {site.name}
          </span>
        </div>

        <nav className="flex flex-wrap justify-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs text-muted hover:text-ink transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <p className="text-xs text-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
