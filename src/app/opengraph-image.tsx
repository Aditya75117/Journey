import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.title;
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
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "#F2F0EB",
          background:
            "radial-gradient(circle at 80% 18%, #253140 0%, #131820 40%, #0B0D10 74%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 54,
            fontWeight: 800,
            letterSpacing: "-0.04em",
          }}
        >
          AD.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              maxWidth: 1020,
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
            }}
          >
            {site.title}
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 980,
              fontSize: 27,
              lineHeight: 1.35,
              color: "#C5CED9",
            }}
          >
            {site.description}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
