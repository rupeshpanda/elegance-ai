import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

const REQUESTS_PER_MINUTE = 15;
const WINDOW_MS = 60_000;

// Self-contained sliding-window rate limiter, in-memory per serverless
// instance — not a hard guarantee across instances, but stops naive
// request loops cheaply. Kept local to this route rather than a shared
// lib module, since this A2A demo endpoint is meant to stand on its own.
const requestLog = new Map<string, number[]>();

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function rateLimit(ip: string, limit: number): boolean {
  const now = Date.now();
  const hits = (requestLog.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= limit) {
    requestLog.set(ip, hits);
    return false;
  }
  hits.push(now);
  requestLog.set(ip, hits);
  return true;
}

// Server-side only — never exposed to the browser. The buyer service is a
// separately deployed Python/ADK service (see /000-AGENTIC AI/enterprise-a2a-po-status-lab),
// not a same-repo API route, because the whole point of this lab is that
// buyer and supplier are genuinely independent services.
const BUYER_AGENT_API_URL = process.env.BUYER_AGENT_API_URL ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  if (!rateLimit(clientIp(req), REQUESTS_PER_MINUTE)) {
    return NextResponse.json(
      { error: "Too many requests — please wait a minute." },
      { status: 429 }
    );
  }

  let message: string;
  try {
    const body = await req.json();
    message = body.message;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Missing 'message' field." }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${BUYER_AGENT_API_URL}/query/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
  } catch {
    return NextResponse.json(
      { error: "The buyer agent service is currently unavailable." },
      { status: 502 }
    );
  }

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: "The buyer agent service returned an unexpected response." },
      { status: 502 }
    );
  }

  // Manually pump the upstream body into a new ReadableStream rather than
  // passing upstream.body straight through — returning an undici fetch()
  // body directly as a route handler's Response can silently stall after
  // the first chunk. Explicit pumping is the reliable pattern for proxying
  // a streaming response through a Next.js route handler.
  const upstreamBody = upstream.body;
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // Chromium withholds roughly the first ~2KB of a fetch() streaming
      // response from the reader regardless of headers — a well-known
      // quirk with no header-based fix. A leading SSE comment line (":"
      // prefix, ignored by any conforming client) padded past that
      // threshold forces it to start flushing immediately instead of
      // only after the connection closes.
      controller.enqueue(encoder.encode(":" + " ".repeat(2048) + "\n\n"));

      const reader = upstreamBody.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
      } catch (err) {
        controller.error(err);
        return;
      }
      controller.close();
    },
    cancel(reason) {
      upstreamBody.cancel(reason).catch(() => {});
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      // Without this, Chromium's MIME-sniffing buffers roughly the first
      // 1KB of a streamed response before exposing any of it to a fetch()
      // ReadableStream reader — the stream looks "stuck" in the browser
      // even though curl/Node/httpx all see it arrive incrementally.
      "X-Content-Type-Options": "nosniff",
    },
  });
}
