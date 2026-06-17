import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo/site";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const LIME = "#e2ef5f";
const LIME_SHADOW = "#c8d84a";
const DARK = "#1a1a2e";
const PINK = "#fb64d0";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fff8ef 0%, #fde6f5 42%, #dff1ff 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 56,
            padding: "56px 72px",
            borderRadius: 40,
            border: "6px solid rgba(26,26,46,0.1)",
            background: "rgba(255,255,255,0.88)",
            boxShadow: "0 24px 80px rgba(26,26,46,0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              width: 196,
              height: 196,
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 8,
                width: 176,
                height: 24,
                borderRadius: 12,
                background: LIME_SHADOW,
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 176,
                height: 176,
                borderRadius: 48,
                background: LIME,
                boxShadow: "0 8px 0 0 #c8d84a",
              }}
            >
              <span
                style={{
                  fontSize: 112,
                  fontWeight: 900,
                  color: DARK,
                  lineHeight: 1,
                  marginTop: -8,
                }}
              >
                P
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 88,
                fontWeight: 800,
                letterSpacing: -2,
                lineHeight: 1,
              }}
            >
              <span style={{ color: DARK }}>Play</span>
              <span style={{ color: PINK }}>Trivia</span>
            </div>
            <div
              style={{
                marginTop: 20,
                fontSize: 38,
                fontWeight: 700,
                color: PINK,
                lineHeight: 1.2,
              }}
            >
              {SITE_TAGLINE}
            </div>
            <div
              style={{
                marginTop: 24,
                display: "flex",
                gap: 12,
              }}
            >
              {[PINK, "#59b0f7", LIME].map((color) => (
                <div
                  key={color}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 999,
                    background: color,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 28,
            right: 36,
            fontSize: 20,
            fontWeight: 700,
            color: "rgba(26,26,46,0.35)",
          }}
        >
          {SITE_NAME}
        </div>
      </div>
    ),
    size,
  );
}
