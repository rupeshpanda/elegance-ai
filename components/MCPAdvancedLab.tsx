"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ToolTrace {
  tool: string;
  input: Record<string, unknown>;
  output: string;
}

interface WorkspaceFile {
  content: string;
  modified: string;
}

type Workspace = Record<string, WorkspaceFile>;

const INITIAL_WORKSPACE: Workspace = {
  "README.md": {
    content:
      "# MCP Advanced Lab Workspace\n\nWelcome to the MCP workspace demo.\n\nThis workspace demonstrates MCP file tools running via HTTP transport.",
    modified: new Date().toISOString(),
  },
  "test.txt": {
    content:
      "# Test File\nThis is a test file in the workspace.\nMCP tools can read, write, list, and delete files here.",
    modified: new Date().toISOString(),
  },
};

const CONCEPTS = [
  {
    id: "what-is-mcp",
    title: "What is MCP?",
    body: `The Model Context Protocol (MCP) is an open standard by Anthropic that defines how AI models connect to external data sources and tools. Think of it as USB-C for AI integrations — a universal connector so any LLM can talk to any tool using the same protocol.

Before MCP, every AI integration was custom-built and brittle. MCP standardises the interface: a tool built once works with any MCP-compatible host — Claude, GPT, or a local model.

MCP separates concerns into three roles: the Host (your app), the Client (manages the protocol connection), and the Server (exposes tools, resources, and prompts).`,
  },
  {
    id: "transport",
    title: "Transport Layers",
    body: `MCP supports three transport mechanisms:

**stdio** — The simplest transport. The host spawns a server as a child process and communicates via stdin/stdout. Ideal for local tools like filesystem servers or code linters.

**HTTP + SSE** — The server runs as an HTTP service. Clients connect and receive events via Server-Sent Events. Good for remote servers shared across multiple clients.

**Streamable HTTP** — The modern standard (MCP 1.0+). A single HTTP endpoint handles both request/response and streaming via chunked transfer. This is what FastMCP uses and what this lab implements.

Choosing transport: use stdio for local tools, Streamable HTTP for anything you want to deploy or share.`,
  },
  {
    id: "tools",
    title: "Tools",
    body: `Tools are the primary way MCP servers expose functionality to AI models. Each tool has:

- **name** — unique identifier (e.g., \`read_file\`, \`search_database\`)
- **description** — natural language description the LLM uses to decide when to call it
- **inputSchema** — JSON Schema defining the expected parameters

When the LLM decides to use a tool, it generates a \`tool_use\` block with the tool name and arguments. The host executes the tool and returns the result as a \`tool_result\` block. The LLM then incorporates the result into its response.

This lab exposes four tools: \`list_files\`, \`read_file\`, \`write_file\`, and \`delete_file\`.`,
  },
  {
    id: "resources",
    title: "Resources",
    body: `Resources allow MCP servers to expose data that clients can read directly — without the LLM needing to call a tool. They're URI-addressed, like \`file://workspace/README.md\` or \`db://customers/42\`.

Resources come in two forms:
- **Static resources** — fixed URI, fixed content (e.g., a config file)
- **Resource templates** — URI templates with parameters (e.g., \`file://workspace/{filename}\`)

The key distinction from tools: resources are for *reading* data directly, while tools are for *taking actions*. Resources are indexed and can be listed; tools are invoked with intent.

In the Python FastMCP server we built, \`@mcp.resource("file://workspace/{filename}")\` exposes every workspace file as a readable resource.`,
  },
  {
    id: "prompts",
    title: "Prompt Templates",
    body: `MCP Prompts are reusable, parameterised prompt templates that servers expose to clients. They let you encode best-practice prompting patterns into the server itself.

A prompt has a name, optional arguments, and returns a list of messages. Example:

\`\`\`python
@mcp.prompt()
def review_code(filename: str) -> str:
    return f"Review the code in '{filename}' for bugs, security issues, and style."
\`\`\`

Clients can list available prompts with \`prompts/list\` and render them with \`prompts/get\`. This is powerful for building consistent AI workflows — your team defines the prompts once in the server, and all clients reuse them.`,
  },
  {
    id: "roots",
    title: "Roots & Workspace Boundaries",
    body: `Roots define the workspace boundary — the set of directories or URIs a server is permitted to operate within. When a client connects, it can declare roots to constrain the server.

In our server, we enforce this with:
\`\`\`python
BASE_DIR = Path(__file__).parent / "workspace"
BASE_DIR.mkdir(exist_ok=True)

def is_within_roots(path: Path) -> bool:
    try:
        path.resolve().relative_to(BASE_DIR.resolve())
        return True
    except ValueError:
        return False
\`\`\`

Any attempt to access files outside \`workspace/\` is rejected. This is a critical security boundary — without it, a malicious prompt could trick the server into reading \`/etc/passwd\` or writing to system directories.`,
  },
  {
    id: "sampling",
    title: "Sampling (Bidirectional LLM Calls)",
    body: `Sampling is one of MCP's most powerful features — it allows the *server* to request an LLM completion from the *client*. This inverts the usual flow.

Normally: Client → Server (tool call) → Client (result)
With sampling: Server → Client (LLM call) → Server (LLM response) → Client

Why is this useful? It lets server-side tools embed intelligence. For example, a code analysis tool could ask the LLM to summarise what it found, but the LLM call is made via the client (which has the API key and user context), not the server.

The client shows an approval dialog to the user before making the LLM call — maintaining human oversight. Full sampling requires the low-level MCP SDK; FastMCP has limited support.`,
  },
  {
    id: "architecture",
    title: "Host / Client / Server Architecture",
    body: `MCP defines three distinct roles:

**Host** — The application the user interacts with (e.g., Claude Desktop, a custom Gradio/Next.js app). The host manages the user session, renders responses, and decides which servers to connect to.

**Client** — A protocol layer inside the host that manages the MCP connection to a specific server. One host can maintain many clients (one per server). The client handles the transport, session initialisation, and JSON-RPC message routing.

**Server** — Exposes tools, resources, and prompts. Servers are typically domain-specific (a filesystem server, a database server, a Slack server). They're stateless by design — each request is independent.

In this lab: the Next.js app is the Host, the API route acts as the Client (calling Claude with tool definitions), and the tools themselves simulate the Server.`,
  },
];

const TOOL_COLORS: Record<string, string> = {
  list_files: "#0D7377",
  read_file: "#4338CA",
  write_file: "#C8922A",
  delete_file: "#dc2626",
};

export default function MCPAdvancedLab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [workspace, setWorkspace] = useState<Workspace>(INITIAL_WORKSPACE);
  const [toolTraces, setToolTraces] = useState<ToolTrace[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [openConcept, setOpenConcept] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "traces">("chat");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/mcp/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          workspace,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
      setWorkspace(data.workspace);
      setToolTraces((prev) => [...prev, ...data.toolCalls]);
      if (data.toolCalls.length > 0) setActiveTab("traces");
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Failed to get response." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMessages([]);
    setWorkspace(INITIAL_WORKSPACE);
    setToolTraces([]);
    setSelectedFile(null);
  }

  const SUGGESTIONS = [
    "List all files in the workspace",
    "Read the README.md file",
    "Create a new file called notes.txt with some sample content",
    "Write a Python hello world script",
  ];

  return (
    <main style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "80vh" }}>
      {/* Breadcrumb */}
      <div style={{ borderBottom: "1px solid var(--border)", padding: "12px 24px", fontSize: "0.82rem", color: "var(--muted)", display: "flex", gap: 8, alignItems: "center" }}>
        <a href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>Home</a>
        <span>/</span>
        <a href="/lab" style={{ color: "var(--muted)", textDecoration: "none" }}>Lab</a>
        <span>/</span>
        <span style={{ color: "var(--ink)" }}>MCP Advanced</span>
      </div>

      {/* Hero */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "56px 24px 40px" }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>
          Lab · MCP
        </div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "var(--navy)", lineHeight: 1.2, marginBottom: 16 }}>
          MCP HTTP Transport & Tool Use
        </h1>
        <p style={{ fontSize: "1rem", color: "var(--muted)", lineHeight: 1.75, maxWidth: 580, marginBottom: 24 }}>
          A live demo of the Model Context Protocol over HTTP. Claude uses MCP tools to manage a real file workspace — read, write, list, delete — with every tool call visible in the trace panel.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["MCP", "Claude", "Tool Use", "HTTP Transport", "Next.js", "Python"].map((tag) => (
            <span key={tag} style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, border: "1px solid #C8922A", color: "#C8922A" }}>
              {tag}
            </span>
          ))}
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Main demo area */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        <div className="mcp-demo-grid">

          {/* Left: Workspace + file viewer */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Workspace panel */}
            <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
                  Workspace
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{Object.keys(workspace).length} files</span>
              </div>
              <div style={{ padding: "8px" }}>
                {Object.keys(workspace).length === 0 ? (
                  <div style={{ padding: "16px", fontSize: "0.82rem", color: "var(--muted)", textAlign: "center" }}>Empty workspace</div>
                ) : (
                  Object.keys(workspace).map((filename) => (
                    <button
                      key={filename}
                      onClick={() => setSelectedFile(selectedFile === filename ? null : filename)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "none",
                        background: selectedFile === filename ? "var(--accent-light)" : "transparent",
                        color: selectedFile === filename ? "var(--accent)" : "var(--ink)",
                        fontSize: "0.82rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span style={{ fontSize: "0.9rem" }}>
                        {filename.endsWith(".md") ? "📄" : filename.endsWith(".py") ? "🐍" : filename.endsWith(".json") ? "📋" : "📝"}
                      </span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{filename}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* File viewer */}
            {selectedFile && workspace[selectedFile] && (
              <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--ink)" }}>{selectedFile}</span>
                  <button onClick={() => setSelectedFile(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "0.9rem" }}>✕</button>
                </div>
                <pre style={{ margin: 0, padding: "12px 14px", fontSize: "0.72rem", lineHeight: 1.6, color: "var(--ink)", overflowX: "auto", maxHeight: 200, overflowY: "auto", background: "#fafaf8", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {workspace[selectedFile].content}
                </pre>
              </div>
            )}

            {/* Reset */}
            <button
              onClick={reset}
              style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: "0.8rem", cursor: "pointer" }}
            >
              Reset workspace
            </button>
          </div>

          {/* Right: Chat + traces */}
          <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 520 }}>
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
              {(["chat", "traces"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "12px 20px",
                    border: "none",
                    background: "transparent",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    color: activeTab === tab ? "var(--accent)" : "var(--muted)",
                    borderBottom: activeTab === tab ? "2px solid var(--accent)" : "2px solid transparent",
                    textTransform: "capitalize",
                  }}
                >
                  {tab === "traces" ? `Tool Traces (${toolTraces.length})` : "Chat"}
                </button>
              ))}
            </div>

            {/* Chat panel */}
            {activeTab === "chat" && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12, minHeight: 360, maxHeight: 400 }}>
                  {messages.length === 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "auto 0" }}>
                      <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 8 }}>Try asking:</p>
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => setInput(s)}
                          style={{ textAlign: "left", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", fontSize: "0.82rem", color: "var(--ink)", cursor: "pointer" }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                      <div
                        style={{
                          maxWidth: "80%",
                          padding: "10px 14px",
                          borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                          background: m.role === "user" ? "var(--accent)" : "var(--bg)",
                          color: m.role === "user" ? "#fff" : "var(--ink)",
                          border: m.role === "assistant" ? "1px solid var(--border)" : "none",
                          fontSize: "0.88rem",
                          lineHeight: 1.65,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div style={{ display: "flex", justifyContent: "flex-start" }}>
                      <div style={{ padding: "10px 14px", borderRadius: "12px 12px 12px 2px", border: "1px solid var(--border)", fontSize: "0.88rem", color: "var(--muted)" }}>
                        Thinking…
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                    placeholder="Ask Claude to use MCP tools…"
                    disabled={loading}
                    style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "0.88rem", outline: "none", background: "var(--bg)", color: "var(--ink)" }}
                  />
                  <button
                    onClick={send}
                    disabled={loading || !input.trim()}
                    style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: "0.88rem", fontWeight: 600, cursor: loading || !input.trim() ? "not-allowed" : "pointer", opacity: loading || !input.trim() ? 0.5 : 1 }}
                  >
                    Send
                  </button>
                </div>
              </div>
            )}

            {/* Traces panel */}
            {activeTab === "traces" && (
              <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10, minHeight: 360, maxHeight: 460 }}>
                {toolTraces.length === 0 ? (
                  <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "auto", textAlign: "center" }}>
                    No tool calls yet. Send a message to see traces.
                  </p>
                ) : (
                  toolTraces.map((trace, i) => (
                    <div key={i} style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                      <div style={{ padding: "8px 12px", background: TOOL_COLORS[trace.tool] || "#666", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#fff" }}>
                          {trace.tool}
                        </span>
                      </div>
                      <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                        <div>
                          <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.06em" }}>Input</span>
                          <pre style={{ margin: "4px 0 0", fontSize: "0.72rem", color: "var(--ink)", background: "#f4f4f0", padding: "6px 8px", borderRadius: 6, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {JSON.stringify(trace.input, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.06em" }}>Output</span>
                          <pre style={{ margin: "4px 0 0", fontSize: "0.72rem", color: "var(--ink)", background: "#f4f4f0", padding: "6px 8px", borderRadius: 6, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 100 }}>
                            {trace.output}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Architecture diagram */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px 0" }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 20 }}>
          Architecture
        </div>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--navy)", marginBottom: 12 }}>
          How the pieces connect
        </h2>
        <p style={{ fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: 32 }}>
          This lab implements the full MCP stack: a Python FastMCP server over HTTP, and a Next.js host that proxies Claude tool calls through API routes.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", padding: "4px 0 16px" }}>
          {[
            { label: "User", sub: "Browser", color: "#e8f5f5", border: "#0D7377", text: "#0D7377" },
            { label: "→", sub: "", color: "transparent", border: "transparent", text: "var(--muted)" },
            { label: "Host App", sub: "Next.js / Gradio", color: "#ede9fe", border: "#4338CA", text: "#4338CA" },
            { label: "→", sub: "", color: "transparent", border: "transparent", text: "var(--muted)" },
            { label: "MCP Client", sub: "API Route", color: "#fef3c7", border: "#C8922A", text: "#C8922A" },
            { label: "→ HTTP →", sub: "", color: "transparent", border: "transparent", text: "var(--muted)" },
            { label: "MCP Server", sub: "FastMCP / Python", color: "#dcfce7", border: "#15803d", text: "#15803d" },
            { label: "→", sub: "", color: "transparent", border: "transparent", text: "var(--muted)" },
            { label: "Workspace", sub: "File System", color: "#f0f9ff", border: "#0369a1", text: "#0369a1" },
          ].map((node, i) =>
            node.label.includes("→") ? (
              <div key={i} style={{ fontSize: "0.85rem", color: node.text, padding: "0 4px", flexShrink: 0 }}>{node.label}</div>
            ) : (
              <div key={i} style={{ flexShrink: 0, border: `1px solid ${node.border}`, borderRadius: 10, padding: "10px 14px", background: node.color, textAlign: "center", minWidth: 90 }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: node.text }}>{node.label}</div>
                {node.sub && <div style={{ fontSize: "0.68rem", color: node.text, opacity: 0.75, marginTop: 2 }}>{node.sub}</div>}
              </div>
            )
          )}
        </div>
      </section>

      {/* Concepts */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 20 }}>
          Concepts
        </div>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--navy)", marginBottom: 32 }}>
          MCP explained in depth
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {CONCEPTS.map(({ id, title, body }) => (
            <div key={id} style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
              <button
                onClick={() => setOpenConcept(openConcept === id ? null : id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "16px 20px",
                  background: openConcept === id ? "var(--accent-light)" : "var(--bg)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span style={{ fontSize: "0.95rem", fontWeight: 600, color: openConcept === id ? "var(--accent)" : "var(--ink)" }}>
                  {title}
                </span>
                <span style={{ color: "var(--muted)", fontSize: "1rem", flexShrink: 0 }}>
                  {openConcept === id ? "−" : "+"}
                </span>
              </button>

              {openConcept === id && (
                <div style={{ padding: "0 20px 20px", borderTop: "1px solid var(--border)" }}>
                  {body.split("\n\n").map((para, pi) => {
                    if (para.startsWith("```")) {
                      const code = para.replace(/```\w*\n?/, "").replace(/```$/, "");
                      return (
                        <pre key={pi} style={{ background: "#1e1e2e", color: "#cdd6f4", padding: "14px 16px", borderRadius: 8, fontSize: "0.78rem", lineHeight: 1.6, overflowX: "auto", margin: "12px 0", whiteSpace: "pre-wrap" }}>
                          {code}
                        </pre>
                      );
                    }
                    return (
                      <p key={pi} style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.75, marginTop: 14 }}
                        dangerouslySetInnerHTML={{
                          __html: para
                            .replace(/\*\*(.+?)\*\*/g, "<strong style='color:var(--ink)'>$1</strong>")
                            .replace(/`(.+?)`/g, "<code style='background:#f0f0ec;padding:1px 5px;border-radius:4px;font-size:0.82em'>$1</code>"),
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
