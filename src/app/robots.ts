import type { MetadataRoute } from "next";
import { resolveSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const site = resolveSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/u/", "/compare", "/board", "/franchise", "/playoffs"],
      disallow: ["/api/", "/team"],
    },
    sitemap: `${site}/sitemap.xml`,
  };
}
