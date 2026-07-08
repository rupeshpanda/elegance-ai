"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionLabel } from "./SectionLabel";

const GOLD = "#C8922A";

type Rule = { name: string; pattern: string; file: string; summary: string };

const RULES: Rule[] = [
  {
    name: "api-conventions",
    pattern: "src/api/**/*",
    file: ".claude/rules/api-conventions.md",
    summary: "Validate input early, return typed results, no business logic in handlers.",
  },
  {
    name: "testing-conventions",
    pattern: "**/*.test.*",
    file: ".claude/rules/testing-conventions.md",
    summary: "describe/it structure, one assertion concept per test, happy path first.",
  },
];

const CANDIDATE_FILES = ["src/api/users.ts", "src/lib/utils.ts", "src/lib/utils.test.ts", "README.md"];

/** Minimal glob matcher — supports `**` (any depth) and `*` (single segment). */
function globToRegExp(glob: string): RegExp {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") {
        re += ".*";
        i++;
        if (glob[i + 1] === "/") i++;
      } else {
        re += "[^/]*";
      }
    } else if ("/\\^$+?.()|[]{}".includes(c)) {
      re += "\\" + c;
    } else {
      re += c;
    }
  }
  return new RegExp("^" + re + "$");
}

function matchingRules(path: string): Rule[] {
  return RULES.filter((rule) => globToRegExp(rule.pattern).test(path));
}

const CONCEPTS = [
  {
    q: "CLAUDE.md hierarchy & precedence",
    a: "Claude Code reads CLAUDE.md at multiple levels — global (~/.claude/CLAUDE.md), project root, and any nested directory CLAUDE.md files above the file you're working on. All applicable levels get combined into context; more specific (closer to the file) instructions take precedence when they conflict with broader ones. This is what makes a single project CLAUDE.md apply consistently to every teammate who opens `claude` there — it's not personal config, it's committed to the repo.",
  },
  {
    q: "Rules glob matching (.claude/rules/)",
    a: "Each file in .claude/rules/ carries YAML frontmatter with a `paths` array of globs. Claude Code only loads that rule's content into context when the file you're reading or editing matches one of its globs — a rule scoped to `src/api/**/*` stays out of context entirely while you're editing a README. This keeps context lean: you get exactly the conventions relevant to what you're touching, not every rule the team has ever written.",
  },
  {
    q: "Skill isolation via context: fork",
    a: "A skill normally runs inline in your conversation — its tool calls and reasoning show up in your transcript. Setting `context: fork` in a skill's frontmatter runs it in an isolated subagent instead: it gets its own context window, does its work, and returns only the final result to your main conversation. Combined with `allowed-tools`, this is how you build a skill that's both self-contained and safely scoped — e.g. a changelog drafter that can read git history and grep files, but can't edit anything and doesn't clutter your main thread with its intermediate steps.",
  },
  {
    q: "MCP env-var expansion for credentials",
    a: "`.mcp.json` entries can reference `${VAR_NAME}` inside `args`, `env`, or `headers` — Claude Code expands it from your shell environment when the server launches. This means a project's MCP config can be committed to git (so every teammate gets the same server wired up) without ever committing an actual secret: each person exports their own token locally, and the JSON file itself stays credential-free.",
  },
  {
    q: "Plan mode vs. direct execution",
    a: "Plan mode has Claude explore and propose an approach before touching any files, then waits for approval. Direct execution just starts making changes. The gap between them barely shows on a one-line bug fix — but widens fast on anything with real ambiguity (which files to touch, what to name something, which edge cases matter). The rule of thumb: the more a task's correct shape depends on judgment calls you'd want to weigh in on, the more plan mode earns its keep.",
  },
];

const QUIZ = [
  {
    q: "What determines whether a .claude/rules/*.md file gets loaded for a given edit?",
    options: [
      "Its position in the file list",
      "The `paths` glob in its YAML frontmatter matching the file being edited",
      "Alphabetical order of the rule files",
      "Whichever rule was edited most recently",
    ],
    correct: 1,
    explain: "Rules are matched purely by glob against the file in play — nothing about ordering or recency is involved.",
  },
  {
    q: "A skill's frontmatter has `context: fork`. What does that actually change?",
    options: [
      "It skips all tool-permission checks",
      "It runs in an isolated subagent, so its intermediate tool calls don't clutter the main conversation",
      "It becomes available in every project automatically",
      "It disables the skill's `allowed-tools` restriction",
    ],
    correct: 1,
    explain: "Forking gives the skill its own context window. allowed-tools still applies inside it — isolation and tool restriction are independent controls.",
  },
  {
    q: '`.mcp.json` has `"DATABASE_URL": "${DATABASE_URL}"` inside a server\'s `env` block. What does that accomplish?',
    options: [
      "Hardcodes the same DATABASE_URL for every teammate",
      "Expands to the value of your shell's DATABASE_URL variable at launch — so the secret is never committed to the repo",
      "Prompts the user in-chat to type a database URL",
      "Creates a brand-new environment variable visible to the whole OS",
    ],
    correct: 1,
    explain: "The JSON file is safe to commit precisely because the actual value only ever lives in each teammate's own shell environment.",
  },
  {
    q: "Your project has a .mcp.json AND your personal ~/.claude.json both define MCP servers. What happens when you open Claude Code here?",
    options: [
      "Only the project-scoped servers load; personal ones are ignored",
      "Only whichever server was configured most recently loads",
      "Both are available simultaneously — project and user scope aren't mutually exclusive",
      "You're forced to pick one scope before Claude Code will start",
    ],
    correct: 2,
    explain: "Scopes stack. `claude mcp list` shows project servers alongside your personal ones in the same session.",
  },
  {
    q: "For which of these would plan mode most likely add real value over direct execution?",
    options: [
      "Fixing a one-line variable-name typo",
      "Adding a feature that touches multiple files and involves judgment calls about scope",
      "Running `npm install`",
      "Printing \"Hello World\"",
    ],
    correct: 1,
    explain: "Plan mode pays off in proportion to how much ambiguity a task has — trivial, single-path tasks barely benefit.",
  },
];

const EXERCISES = [
  {
    title: "Task 1 — Single-file bug fix",
    body: "A handler checks `!id` to reject empty ids, but a whitespace-only id like \"   \" slips through and produces a bogus record. Fix the validation.",
    expect: "Plan mode and direct execution should converge on nearly the same fix — a baseline for what \"no meaningful difference\" looks like.",
  },
  {
    title: "Task 2 — Multi-file migration",
    body: "Extract a type shared by one handler into its own module, then update the original file to import it from there — previewing what happens once more files need the same shape.",
    expect: "Touches two files and a signature — enough ambiguity (naming, exact location) that plan mode should visibly surface those decisions before editing.",
  },
  {
    title: "Task 3 — New feature",
    body: "Add a new handler following the same pattern as an existing one, plus a co-located test file, with two different path-scoped rules both in play at once.",
    expect: "The biggest task — this is where plan mode should differ most from direct execution: it has to ask or state assumptions instead of guessing at edge cases.",
  },
];

function QuizItem({ item, index }: { item: (typeof QUIZ)[number]; index: number }) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "20px 22px",
        background: "var(--card)",
      }}
    >
      <div style={{ fontWeight: 600, color: "var(--navy)", marginBottom: 14, lineHeight: 1.5 }}>
        {index + 1}. {item.q}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {item.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === item.correct;
          const showState = selected !== null;
          let border = "var(--border)";
          let bg = "var(--bg)";
          if (showState && isSelected && isCorrect) {
            border = "#15803d";
            bg = "#dcfce7";
          } else if (showState && isSelected && !isCorrect) {
            border = "#dc2626";
            bg = "#fee2e2";
          } else if (showState && !isSelected && isCorrect) {
            border = "#15803d";
          }
          return (
            <button
              key={opt}
              onClick={() => setSelected(i)}
              disabled={selected !== null}
              style={{
                textAlign: "left",
                padding: "10px 14px",
                borderRadius: 8,
                border: `1px solid ${border}`,
                background: bg,
                color: "var(--ink)",
                fontSize: "0.9rem",
                cursor: selected === null ? "pointer" : "default",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <p style={{ marginTop: 12, fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6 }}>
          {selected === item.correct ? "Correct — " : "Not quite — "}
          {item.explain}
        </p>
      )}
    </div>
  );
}

export default function ClaudeCodeWorkflowLab() {
  const [selectedFile, setSelectedFile] = useState(CANDIDATE_FILES[0]);
  const [openConcept, setOpenConcept] = useState<number | null>(0);
  const matches = matchingRules(selectedFile);

  return (
    <main style={{ background: "var(--bg)", color: "var(--ink)" }}>
      {/* Breadcrumb */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: "0.82rem",
          color: "var(--muted)",
        }}
      >
        <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>
          Home
        </Link>
        <span>/</span>
        <Link href="/lab" style={{ color: "var(--muted)", textDecoration: "none" }}>
          Lab
        </Link>
        <span>/</span>
        <span style={{ color: "var(--ink)" }}>Claude Code Team Workflow</span>
      </div>

      {/* Hero */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px 48px" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {["Claude Code", "MCP", "DevEx", "Rules & Skills"].map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "3px 10px",
                borderRadius: 20,
                border: `1px solid ${GOLD}`,
                color: GOLD,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            lineHeight: 1.2,
            color: "var(--navy)",
            marginBottom: 16,
          }}
        >
          Configuring Claude Code for a Team Workflow
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--muted)", lineHeight: 1.7, maxWidth: 620 }}>
          Project CLAUDE.md hierarchies, path-scoped rules, an isolated forked skill, and multi-server
          MCP config with credential expansion — the pieces that make Claude Code behave consistently
          across a whole team instead of just one laptop.
        </p>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Interactive: which rule fires? */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <SectionLabel text="Try It" />
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--navy)", marginBottom: 8 }}>
          Which rule fires for this file?
        </h2>
        <p style={{ color: "var(--muted)", marginBottom: 24, lineHeight: 1.6 }}>
          Two rules are configured, each scoped to a glob. Pick a file below and see which one — if any —
          would actually load into context.
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {CANDIDATE_FILES.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFile(f)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: `1px solid ${selectedFile === f ? "var(--accent)" : "var(--border)"}`,
                background: selectedFile === f ? "var(--accent)" : "var(--card)",
                color: selectedFile === f ? "#fff" : "var(--ink)",
                fontFamily: "monospace",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "20px 24px",
            background: "var(--card)",
          }}
        >
          <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: 10 }}>
            Editing <code style={{ fontFamily: "monospace" }}>{selectedFile}</code> —
          </div>
          {matches.length === 0 ? (
            <div style={{ color: "var(--muted)", fontStyle: "italic" }}>No rule matches. Nothing extra loads into context.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {matches.map((r) => (
                <div key={r.name} style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 14 }}>
                  <div style={{ fontWeight: 600, color: "var(--navy)", fontFamily: "monospace", fontSize: "0.9rem" }}>
                    {r.file} <span style={{ color: "var(--muted)", fontWeight: 400 }}>(paths: [&quot;{r.pattern}&quot;])</span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: 4 }}>{r.summary}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Architecture strip */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <SectionLabel text="How It Layers" />
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--navy)", marginBottom: 24 }}>
          CLAUDE.md hierarchy, broadest to narrowest
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {[
            { label: "~/.claude/CLAUDE.md", desc: "Global — every project" },
            { label: "project/CLAUDE.md", desc: "This repo — every teammate" },
            { label: ".claude/rules/*.md", desc: "Path-scoped — only matching files" },
            { label: ".claude/skills/*", desc: "Invoked on demand, optionally forked" },
          ].map((step, i, arr) => (
            <div key={step.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "14px 16px",
                  background: "var(--card)",
                  minWidth: 180,
                }}
              >
                <div style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "var(--navy)", fontWeight: 600 }}>
                  {step.label}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 4 }}>{step.desc}</div>
              </div>
              {i < arr.length - 1 && <span style={{ color: "var(--muted)" }}>→</span>}
            </div>
          ))}
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Concepts accordion */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        <SectionLabel text="Concepts" />
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--navy)", marginBottom: 24 }}>
          The five pieces, explained
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CONCEPTS.map((c, i) => (
            <div key={c.q} style={{ border: "1px solid var(--border)", borderRadius: 10, background: "var(--card)" }}>
              <button
                onClick={() => setOpenConcept(openConcept === i ? null : i)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  color: "var(--navy)",
                  fontSize: "0.95rem",
                }}
              >
                {c.q}
                <span style={{ color: "var(--muted)", fontWeight: 400 }}>{openConcept === i ? "−" : "+"}</span>
              </button>
              {openConcept === i && (
                <div style={{ padding: "0 20px 18px", fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.7 }}>
                  {c.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Quiz */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        <SectionLabel text="Test Yourself" />
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--navy)", marginBottom: 8 }}>
          Quick knowledge check
        </h2>
        <p style={{ color: "var(--muted)", marginBottom: 24, lineHeight: 1.6 }}>
          Five questions, no scoring pressure — pick an answer to see if it lands.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {QUIZ.map((item, i) => (
            <QuizItem key={item.q} item={item} index={i} />
          ))}
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Hands-on exercises */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 64px" }}>
        <SectionLabel text="Hands-On" />
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--navy)", marginBottom: 8 }}>
          Plan mode vs. direct execution — three tasks
        </h2>
        <p style={{ color: "var(--muted)", marginBottom: 24, lineHeight: 1.6 }}>
          Run each of these twice in your own sandbox — once in plan mode, once with direct execution —
          and compare what actually differed.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {EXERCISES.map((ex) => (
            <div key={ex.title} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: "18px 20px", background: "var(--card)" }}>
              <div style={{ fontWeight: 600, color: "var(--navy)", marginBottom: 8 }}>{ex.title}</div>
              <div style={{ fontSize: "0.9rem", color: "var(--ink)", lineHeight: 1.6, marginBottom: 10 }}>{ex.body}</div>
              <div style={{ fontSize: "0.82rem", color: "var(--muted)", fontStyle: "italic", lineHeight: 1.6 }}>{ex.expect}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: 48,
            padding: "28px 28px",
            background: "var(--navy)",
            borderRadius: 12,
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", color: "#fff", marginBottom: 10 }}>
            Rolling out Claude Code across a team?
          </div>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", marginBottom: 20 }}>
            Happy to talk through CLAUDE.md hierarchies, rules, skills, and MCP config for your setup.
          </p>
          <a
            href="/#contact"
            style={{
              display: "inline-block",
              padding: "10px 28px",
              background: GOLD,
              color: "#fff",
              borderRadius: 6,
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            Get in touch
          </a>
        </div>
      </section>
    </main>
  );
}
