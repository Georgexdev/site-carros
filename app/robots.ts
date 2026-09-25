import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Diz ao Google o que ele pode ler. O painel e o login ficam de fora das buscas.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/login"],
    },
    sitemap: SITE_URL + "/sitemap.xml",
  };
}
