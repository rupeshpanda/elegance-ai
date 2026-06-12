import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

interface WorkspaceFile {
  content: string;
  modified: string;
}
type Workspace = Record<string, WorkspaceFile>;

interface ToolTrace {
  tool: string;
  input: Record<string, unknown>;
  output: string;
}

const TOOLS: Anthropic.Tool[] = [
  {
    name: "list_files",
    description: "List all files in the workspace directory.",
    input_schema: { type: "object" as const, properties: {} },
  },
  {
    name: "read_file",
    description: "Read the contents of a file from the workspace.",
    input_schema: {
      type: "object" as const,
      properties: {
        filepath: { type: "string", description: "Path to the file to read" },
      },
      required: ["filepath"],
    },
  },
  {
    name: "write_file",
    description: "Write or create a file in the workspace.",
    input_schema: {
      type: "object" as const,
      properties: {
        filepath: { type: "string", description: "File path to write" },
        content: { type: "string", description: "Content to write" },
      },
      required: ["filepath", "content"],
    },
  },
  {
    name: "delete_file",
    description: "Delete a file from the workspace.",
    input_schema: {
      type: "object" as const,
      properties: {
        filepath: { type: "string", description: "File path to delete" },
      },
      required: ["filepath"],
    },
  },
];

function runTool(
  name: string,
  input: Record<string, string>,
  workspace: Workspace
): [string, Workspace] {
  if (name === "list_files") {
    const files = Object.keys(workspace);
    if (!files.length) return ["Workspace is empty.", workspace];
    return [
      files
        .map((f) => `FILE: ${f} (${workspace[f].content.length} bytes)`)
        .join("\n"),
      workspace,
    ];
  }
  if (name === "read_file") {
    const f = workspace[input.filepath];
    if (!f) return [`Error: File not found: ${input.filepath}`, workspace];
    return [f.content, workspace];
  }
  if (name === "write_file") {
    const updated = {
      ...workspace,
      [input.filepath]: {
        content: input.content,
        modified: new Date().toISOString(),
      },
    };
    return [
      `Successfully wrote ${input.content.length} characters to ${input.filepath}`,
      updated,
    ];
  }
  if (name === "delete_file") {
    if (!workspace[input.filepath])
      return [`Error: File not found: ${input.filepath}`, workspace];
    const { [input.filepath]: _, ...rest } = workspace;
    return [`Deleted ${input.filepath}`, rest];
  }
  return [`Unknown tool: ${name}`, workspace];
}

export async function POST(req: NextRequest) {
  const { messages, workspace = {} } = await req.json();

  const traces: ToolTrace[] = [];
  let ws: Workspace = workspace;
  const history = [...messages];

  let response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    system:
      "You are an AI assistant with access to a file workspace via MCP tools. Help users manage files, read and write content, and explore the workspace. Always explain what tools you're calling and why.",
    messages: history,
    tools: TOOLS,
  });

  while (response.stop_reason === "tool_use") {
    const assistantContent = response.content;
    history.push({ role: "assistant", content: assistantContent });

    const toolResults: Anthropic.ToolResultBlockParam[] = [];

    for (const block of assistantContent) {
      if (block.type === "tool_use") {
        const [output, newWs] = runTool(
          block.name,
          block.input as Record<string, string>,
          ws
        );
        ws = newWs;
        traces.push({ tool: block.name, input: block.input as Record<string, unknown>, output });
        toolResults.push({ type: "tool_result", tool_use_id: block.id, content: output });
      }
    }

    history.push({ role: "user", content: toolResults });

    response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      system:
        "You are an AI assistant with access to a file workspace via MCP tools. Help users manage files, read and write content, and explore the workspace. Always explain what tools you're calling and why.",
      messages: history,
      tools: TOOLS,
    });
  }

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  return NextResponse.json({ response: text, toolCalls: traces, workspace: ws });
}
