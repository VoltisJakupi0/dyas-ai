import { ImageResponse } from "next/og";
import { hero, site } from "@/lib/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
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
          background: "#eeece7",
          color: "#111111",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            opacity: 0.55,
          }}
        >
          {site.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 980 }}>
          <div style={{ fontSize: 58, fontWeight: 600, lineHeight: 1.08, letterSpacing: -1.4 }}>
            {hero.headline}
          </div>
          <div style={{ fontSize: 26, lineHeight: 1.35, opacity: 0.72, maxWidth: 820 }}>{hero.body}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
