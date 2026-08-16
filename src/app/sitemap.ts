import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  return [
    { url: site, changeFrequency: "weekly", priority: 1 },
    { url: `${site}/compare`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
