import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // The resume lives at the clean URL /resume.pdf, but a recruiter who
        // hits Save ends up with a folder full of files called "resume.pdf".
        // `inline` keeps it previewing in the browser tab rather than forcing
        // a download; `filename` only decides what it's called if they do save.
        source: "/resume.pdf",
        headers: [
          {
            key: "Content-Disposition",
            value: 'inline; filename="Mahmood-Ul-Hassan-Resume.pdf"',
          },
          // Short cache: replacing the PDF should take effect the same day,
          // not whenever a CDN feels like it.
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
