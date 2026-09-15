import type { MetadataRoute } from "next";
import { URL_SITE } from "@/lib/url-site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: URL_SITE, changeFrequency: "monthly", priority: 1 },
    { url: `${URL_SITE}/cardapio`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${URL_SITE}/sobre`, changeFrequency: "yearly", priority: 0.5 },
  ];
}
