"use client";
import { useState } from "react";
import { SectionLabel } from "./SectionLabel";

type ContactData = {
  eyebrow: string;
  headline: string;
  sub: string;
  links: { key: string; val: string; url: string }[];
};

export default function Contact({ data }: { data: ContactData }) {
  const [form, setForm] = useState({ name: "", org: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubscribed(true);
  }

  return (
    <section id="contact" className="px-6 py-8 md:py-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-[1fr_480px] gap-12 md:gap-20">
          <div>
            <SectionLabel text="GET IN TOUCH" />
            <h2 className="font-serif text-6xl md:text-7xl text-heading leading-tight mb-6 whitespace-pre-line mt-2">
              {data.headline}
            </h2>
            <p className="text-base text-muted leading-relaxed mb-10">
              Working through an AI integration challenge? Want an honest
              conversation with someone who&apos;s been in the room - not a
              vendor pitch deck? Reach out.
            </p>

            {/* Subscribe block */}
            <div
              className="mb-10"
              style={{
                background: "var(--bg-secondary)",
                borderRadius: 8,
                padding: 24,
                maxWidth: 440,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--ink)",
                  marginBottom: 4,
                }}
              >
                Get new perspectives in your inbox
              </p>
              <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>
                Occasional. No noise. Unsubscribe anytime.
              </p>
              {subscribed ? (
                <p style={{ fontSize: 13, color: "var(--accent)", fontWeight: 500 }}>
                  ✓ You&apos;re subscribed.
                </p>
              ) : (
                <form onSubmit={handleSubscribe} style={{ display: "flex", gap: 8 }}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    required
                    style={{
                      flex: 1,
                      padding: "9px 12px",
                      border: "1px solid var(--border)",
                      borderRadius: 4,
                      fontSize: 14,
                      background: "var(--card)",
                      color: "var(--ink)",
                      outline: "none",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: "var(--accent)",
                      color: "#fff",
                      padding: "9px 18px",
                      borderRadius: 4,
                      fontSize: 13,
                      fontWeight: 500,
                      border: "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Subscribe →
                  </button>
                </form>
              )}
            </div>

            <div className="flex flex-col gap-5">
              {data.links.map((link) => (
                <div key={link.key} className="flex items-start gap-4">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted w-20 pt-0.5 flex-shrink-0">
                    {link.key}
                  </span>
                  <a
                    href={link.url}
                    className="text-sm text-ink transition-colors"
                    style={{ textDecoration: "none" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = "var(--ink)")
                    }
                  >
                    {link.val}
                  </a>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted mt-8">
              I read every message personally and reply within 48 hours.
            </p>
          </div>

          <div>
            {submitted ? (
              <div className="flex items-center justify-center bg-card border border-border rounded-2xl p-10 text-center min-h-[400px]">
                <div>
                  <div className="text-4xl mb-5">✓</div>
                  <h3 className="font-serif text-2xl text-navy mb-2">Message received.</h3>
                  <p className="text-sm text-muted leading-relaxed max-w-xs mx-auto">
                    I&apos;ll reply personally within a day or two.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 text-sm border border-border rounded-xl bg-card text-ink placeholder:text-muted focus:outline-none transition-colors"
                  style={{ outline: "none" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                />
                <input
                  type="text"
                  name="org"
                  placeholder="Company & role"
                  value={form.org}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 text-sm border border-border rounded-xl bg-card text-ink placeholder:text-muted focus:outline-none transition-colors"
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="your@company.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 text-sm border border-border rounded-xl bg-card text-ink placeholder:text-muted focus:outline-none transition-colors"
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                />
                <textarea
                  name="message"
                  placeholder="Describe the AI integration challenge you're facing…"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3.5 text-sm border border-border rounded-xl bg-card text-ink placeholder:text-muted focus:outline-none transition-colors resize-none"
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                />
                <button
                  type="submit"
                  className="w-full py-3.5 text-white text-sm font-medium rounded-xl transition-colors"
                  style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background = "var(--accent-hover)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background = "var(--accent)")
                  }
                >
                  Send message →
                </button>
                <p className="text-xs text-center text-muted">
                  I read every message personally and reply within 48 hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
