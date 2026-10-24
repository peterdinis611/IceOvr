import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
    ],
  },
  async rewrites() {
    return [
      // Prefer /form/:user.png — avoids colliding with GitHub usernames ending in "-form"
      {
        source: "/form/:username.png",
        destination: "/api/form/:username",
      },
      {
        source: "/card/:username.png",
        destination: "/api/card/:username",
      },
      // Legacy pretty URLs (kept for existing README embeds)
      {
        source: "/:username-form.png",
        destination: "/api/form/:username",
      },
      {
        source: "/:username.png",
        destination: "/api/card/:username",
      },
    ];
  },
};

export default nextConfig;
