import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo/site";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fff8ef 0%, #fde6f5 45%, #dff1ff 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "8px solid rgba(26,26,46,0.12)",
            borderRadius: 48,
            background: "rgba(255,255,255,0.82)",
            padding: "64px 88px",
            boxShadow: "0 24px 80px rgba(26,26,46,0.12)",
          }}
        >
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              color: "#1a1a2e",
              letterSpacing: -2,
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 42,
              fontWeight: 700,
              color: "#fb64d0",
            }}
          >
            {SITE_TAGLINE}
          </div>
          <div
            style={{
              marginTop: 28,
              display: "flex",
              gap: 16,
            }}
          >
            {["Free to Play", "4 Quiz Rounds", "Solo & Multiplayer"].map((label) => (
              <div
                key={label}
                style={{
                  padding: "12px 20px",
                  borderRadius: 999,
                  background: "#e2ef5f",
                  color: "#1a1a2e",
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
