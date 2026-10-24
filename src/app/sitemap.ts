import type { MetadataRoute } from "next";
import { resolveSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = resolveSiteUrl();
  return [
    { url: site, changeFrequency: "weekly", priority: 1 },
    { url: `${site}/search`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site}/board`, changeFrequency: "daily", priority: 0.85 },
    { url: `${site}/franchise`, changeFrequency: "weekly", priority: 0.75 },
    { url: `${site}/compare`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site}/playoffs`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site}/team`, changeFrequency: "monthly", priority: 0.65 },
  ];
}
