import { LogoMark } from "./LogoMark";

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
        <LogoMark />

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
          © {new Date().getFullYear()} Elegance AI
        </p>
      </div>
    </footer>
  );
}
