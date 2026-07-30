import type { Metadata } from "next";
import A2AProtocolDeepDive from "../../../../components/A2AProtocolDeepDive";

export const metadata: Metadata = {
  title: "What A2A Actually Is — And Why It Isn't MCP | Elegance AI",
  description:
    "A2A in plain terms: what it actually is, how it's different from MCP, and why cross-company agent communication is about to matter a lot more than most enterprises are tracking.",
  openGraph: {
    title: "What A2A Actually Is — And Why It Isn't MCP",
    description:
      "MCP gives your agent a longer arm. A2A gives your agent a phone number to someone else's agent. Why that distinction is about to matter a lot more in enterprise AI.",
    type: "article",
  },
};

export default function A2AProtocolPage() {
  return <A2AProtocolDeepDive />;
}
