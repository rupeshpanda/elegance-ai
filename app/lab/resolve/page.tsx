import type { Metadata } from "next";
import ResolveLab from "../../../components/ResolveLab";

export const metadata: Metadata = {
  title: "Resolve: Autonomous Support Resolution on MCP — Elegance AI",
  description:
    "A production-grade support agent built on MCP client–server architecture. " +
    "Reconciles billing and access systems in real time with a live orchestration trace.",
  openGraph: {
    title: "Resolve: Autonomous Support Resolution on MCP",
    description:
      "An AI agent that orchestrates across siloed systems of record, reconciles their disagreements, " +
      "and takes the remediating action — with every step inspectable.",
    type: "article",
  },
};

export default function ResolvePage() {
  return <ResolveLab />;
}
