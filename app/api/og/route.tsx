import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Elegance AI";
  const tag = searchParams.get("tag") ?? "Enterprise AI";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: "#ffffff",
        }}
      >
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: "#0D7377",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>E</span>
          </div>
          <span style={{ fontSize: 16, fontWeight: 500, color: "#111" }}>
            Elegance AI
          </span>
        </div>

        {/* Title block */}
        <div>
          <div
            style={{
              fontSize: 13,
              color: "#0D7377",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 20,
            }}
          >
            {tag}
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 500,
              color: "#111",
              lineHeight: 1.2,
              maxWidth: 820,
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer */}
        <div style={{ fontSize: 14, color: "#888" }}>
          Rupesh Panda · eleganceai.ai
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
