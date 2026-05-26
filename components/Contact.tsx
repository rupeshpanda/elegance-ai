"use client";
import { useState } from "react";

type ContactData = {
  eyebrow: string;
  headline: string;
  sub: string;
  links: { key: string; val: string; url: string }[];
};

export default function Contact({ data }: { data: ContactData }) {
  const [form, setForm] = useState({ name: "", org: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="contact" className="py-20 md:py-28 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-[1fr_480px] gap-12 md:gap-20">
          <div>
            <p className="text-xs font-semibold tracking-widest text-indigo uppercase mb-4">
              {data.eyebrow}
            </p>
            <h2 className="font-serif text-5xl md:text-6xl text-navy leading-tight mb-6 whitespace-pre-line">
              {data.headline}
            </h2>
            <p className="text-base text-muted leading-relaxed mb-10">{data.sub}</p>

            <div className="flex flex-col gap-5">
              {data.links.map((link) => (
                <div key={link.key} className="flex items-start gap-4">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted w-20 pt-0.5 flex-shrink-0">
                    {link.key}
                  </span>
                  <a href={link.url} className="text-sm text-ink hover:text-indigo transition-colors">
                    {link.val}
                  </a>
                </div>
              ))}
            </div>
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
                <input type="text" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3.5 text-sm border border-border rounded-xl bg-card text-ink placeholder:text-muted focus:outline-none focus:border-indigo transition-colors" />
                <input type="text" name="org" placeholder="Company & role" value={form.org} onChange={handleChange} className="w-full px-4 py-3.5 text-sm border border-border rounded-xl bg-card text-ink placeholder:text-muted focus:outline-none focus:border-indigo transition-colors" />
                <input type="email" name="email" placeholder="your@company.com" value={form.email} onChange={handleChange} required className="w-full px-4 py-3.5 text-sm border border-border rounded-xl bg-card text-ink placeholder:text-muted focus:outline-none focus:border-indigo transition-colors" />
                <textarea name="message" placeholder="Describe the AI integration challenge you're facing…" value={form.message} onChange={handleChange} required rows={5} className="w-full px-4 py-3.5 text-sm border border-border rounded-xl bg-card text-ink placeholder:text-muted focus:outline-none focus:border-indigo transition-colors resize-none" />
                <button type="submit" className="w-full py-3.5 bg-indigo text-white text-sm font-medium rounded-xl hover:bg-indigo-dark transition-colors">
                  Send message →
                </button>
                <p className="text-xs text-center text-muted">I read every message personally and reply within 48 hours.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
