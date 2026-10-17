import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.tempnumber.ng";

  return [
    ...["whatsapp", "telegram", "google"].map((service) => ({ url: `${base}/services/${service}` })),
    { url: `${base}/developers`, changeFrequency: "monthly", priority: 0.8 },
    {
      url: base,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/pricing`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/long-term-rentals`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${base}/dedicated-numbers`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${base}/faq`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/reseller`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/temporary-email`,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${base}/legal/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/legal/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
