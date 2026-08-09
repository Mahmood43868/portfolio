import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Link preview card. Rendered at build/request time by next/og, so it always
 * matches whatever is in profile.ts — no image to maintain by hand.
 */
export default function OpengraphImage() {
  const tech = profile.skills
    .flatMap((g) => g.items.map((i) => i.name))
    .slice(0, 6)
    .join("   ·   ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000000",
          color: "#f2f2f2",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#34e0bd",
              color: "#000000",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            {profile.initials}
          </div>
          <div style={{ fontSize: 22, color: "#a3a3a3", letterSpacing: "0.08em" }}>
            {profile.location.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1 }}>
            {profile.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 28 }}>
            <div style={{ width: 64, height: 4, background: "#34e0bd", borderRadius: 4 }} />
            <div style={{ fontSize: 34, color: "#34e0bd" }}>{profile.role}</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #2a2a2a",
            paddingTop: 28,
            fontSize: 20,
            color: "#838383",
          }}
        >
          <div style={{ display: "flex" }}>{tech}</div>
          <div style={{ display: "flex" }}>
            {profile.seo.siteUrl.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
