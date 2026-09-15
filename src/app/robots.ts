import type { MetadataRoute } from "next";
import { URL_SITE } from "@/lib/url-site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${URL_SITE}/sitemap.xml`,
  };
}
