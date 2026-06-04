import type { Metadata } from "next";
import LabIndex from "../../components/LabIndex";

export const metadata: Metadata = {
  title: "Lab — Working AI Demos | Elegance AI",
  description:
    "Hands-on AI experiments and working demos — fine-tuning, RAG, agentic systems, and more. " +
    "Each lab is open source with a live demo and honest writeup.",
};

export default function LabPage() {
  return <LabIndex />;
}
