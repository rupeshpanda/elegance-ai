import { NextResponse } from "next/server";

export const maxDuration = 15;

// Allowlisted server-side only — the browser never supplies or sees this
// URL directly. Per the A2A spec, an Agent Card is meant to be fetched
// live from the remote agent, not hardcoded — so this always re-fetches
// rather than caching a stale copy.
const SUPPLIER_AGENT_CARD_URL =
  process.env.SUPPLIER_AGENT_CARD_URL ?? "http://localhost:8001/.well-known/agent-card.json";

export async function GET() {
  try {
    const upstream = await fetch(SUPPLIER_AGENT_CARD_URL, { cache: "no-store" });
    if (!upstream.ok) {
      return NextResponse.json(
        { error: "The supplier agent's Agent Card could not be retrieved." },
        { status: 502 }
      );
    }
    const card = await upstream.json();
    return NextResponse.json(card);
  } catch {
    return NextResponse.json(
      { error: "The supplier agent is currently unavailable." },
      { status: 502 }
    );
  }
}
