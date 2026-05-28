import { SectionLabel } from "./SectionLabel";

const STEPS = [
  {
    step: "STEP 01",
    title: "Read",
    body: "Start with the Perspectives. If the framing resonates with how you think about enterprise AI challenges, that's a signal we'll have a useful conversation.",
  },
  {
    step: "STEP 02",
    title: "Reach Out",
    body: "Send a message with your specific challenge. No form to fill out — just email or LinkedIn. I read every message personally.",
  },
  {
    step: "STEP 03",
    title: "Conversation",
    body: "A candid 30-minute call. No proposal at the end, no follow-up sales sequence. If there's something I can help with, we'll both know quickly.",
  },
];

export default function HowIEngage() {
  return (
    <section id="how-i-engage" className="px-6 py-8 md:py-14">
      <div className="max-w-6xl mx-auto">
        <div className="mb-5 md:mb-10">
          <SectionLabel text="HOW IT WORKS" />
          <h2 className="font-serif text-5xl md:text-6xl text-navy leading-tight mb-3">
            How I engage
          </h2>
          <p className="text-base text-muted">
            No pitch. No invoice. Just an honest conversation.
          </p>
        </div>

        <div className="grid md:grid-cols-3">
          {STEPS.map((s, idx) => {
            const isLast = idx === STEPS.length - 1;
            return (
              <div
                key={s.step}
                className={[
                  "py-8 md:py-0",
                  idx > 0 ? "md:pl-8" : "",
                  !isLast ? "md:pr-8" : "",
                  !isLast ? "border-b md:border-b-0 md:border-r border-border" : "",
                ].filter(Boolean).join(" ")}
              >
                <span className="section-label">{s.step}</span>
                <h3
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                    color: "var(--navy)",
                    margin: "8px 0",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--muted)",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {s.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
