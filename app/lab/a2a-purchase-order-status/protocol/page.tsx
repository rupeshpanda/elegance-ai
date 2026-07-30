import type { Metadata } from "next";
import A2AProtocolDeepDive from "../../../../components/A2AProtocolDeepDive";

export const metadata: Metadata = {
  title: "How A2A Actually Works — Protocol Deep-Dive | Elegance AI",
  description:
    "Agent discovery, the task lifecycle state machine, messages vs. artifacts vs. parts, streaming vs. push notifications, and real security schemes — grounded in the A2A SDK's actual type definitions, not a simplified retelling.",
  openGraph: {
    title: "How A2A Actually Works",
    description:
      "The task lifecycle, object model, streaming, and security schemes behind the Agent2Agent protocol — explained from the real SDK types, not guesswork.",
    type: "article",
  },
};

export default function A2AProtocolPage() {
  return <A2AProtocolDeepDive />;
}
