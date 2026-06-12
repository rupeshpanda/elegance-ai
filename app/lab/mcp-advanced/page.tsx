import type { Metadata } from "next";
import MCPAdvancedLab from "@/components/MCPAdvancedLab";

export const metadata: Metadata = {
  title: "MCP HTTP Transport & Tool Use — Lab | Elegance AI",
  description:
    "Live demo of the Model Context Protocol over HTTP. Claude uses MCP tools to manage a real file workspace — read, write, list, and delete files — with every tool call visible in the trace panel.",
};

export default function MCPAdvancedPage() {
  return <MCPAdvancedLab />;
}
