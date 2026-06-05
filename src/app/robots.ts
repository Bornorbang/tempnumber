import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/admin/",
          "/api/",
          "/auth/",
          "/payment/",
        ],
      },
    ],
    sitemap: "https://tempnumber.ng/sitemap.xml",
    host: "https://tempnumber.ng",
  };
}
