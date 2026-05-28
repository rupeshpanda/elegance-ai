"use client";
import { useState, useEffect } from "react";

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinModal({ isOpen, onClose }: JoinModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-bg rounded-2xl p-8 md:p-10 max-w-md w-full shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-ink transition-colors"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            />
          </svg>
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-4">✓</div>
            <h3 className="font-serif text-2xl text-navy mb-2">You&apos;re in.</h3>
            <p className="text-sm text-muted leading-relaxed">
              I&apos;ll send you the details for our next Wednesday session. See you there.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-7">
              <p className="text-xs font-semibold tracking-widest text-indigo uppercase mb-2">
                The AI Edge
              </p>
              <h3 className="font-serif text-2xl text-navy mb-2">Join for free</h3>
              <p className="text-sm text-muted leading-relaxed">
                Monthly live session - 1st Wednesday of each month. No fees. No upsells.
                Practical AI education for enterprise practitioners.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 text-sm border border-border rounded-xl bg-card text-ink placeholder:text-muted focus:outline-none focus:border-indigo transition-colors"
              />
              <input
                type="email"
                placeholder="your@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 text-sm border border-border rounded-xl bg-card text-ink placeholder:text-muted focus:outline-none focus:border-indigo transition-colors"
              />
              <button
                type="submit"
                className="w-full py-3 bg-indigo text-white text-sm font-medium rounded-xl hover:bg-indigo-dark transition-colors"
              >
                Reserve my spot →
              </button>
              <p className="text-xs text-center text-muted">
                100 members · Every Wednesday · Always free
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
