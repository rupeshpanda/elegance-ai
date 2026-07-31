import type { Metadata } from "next";
import A2AProtocolDeepDive from "../../../../components/A2AProtocolDeepDive";

export const metadata: Metadata = {
  title: "A2A and MCP: What Is Actually Different | Elegance AI",
  description:
    "A2A in plain terms. What it actually is, how it is different from MCP, and why cross-company agent communication is about to matter a lot more than most enterprises are tracking.",
  openGraph: {
    title: "A2A and MCP: What Is Actually Different",
    description:
      "MCP gives your agent a longer arm. A2A gives your agent a phone number to someone else's agent. Why that distinction is about to matter a lot more in enterprise AI.",
    type: "article",
  },
};

export default function A2AProtocolPage() {
  return <A2AProtocolDeepDive />;
}
