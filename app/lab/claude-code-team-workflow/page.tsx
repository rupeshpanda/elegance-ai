import type { Metadata } from "next";
import ClaudeCodeWorkflowLab from "../../../components/ClaudeCodeWorkflowLab";

export const metadata: Metadata = {
  title: "Configuring Claude Code for a Team Workflow — Lab | Elegance AI",
  description:
    "Project CLAUDE.md hierarchies, path-scoped rules, an isolated forked skill, and multi-server MCP config with credential expansion — with an interactive rule-matcher demo and a knowledge-check quiz.",
  openGraph: {
    title: "Configuring Claude Code for a Team Workflow",
    description:
      "Project CLAUDE.md hierarchies, path-scoped rules, an isolated forked skill, and multi-server MCP config with credential expansion.",
    type: "article",
  },
};

export default function ClaudeCodeWorkflowPage() {
  return <ClaudeCodeWorkflowLab />;
}
