import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{
      source: "/:path*",
      has: [{ type: "host", value: "tempnumber.ng" }],
      destination: "https://www.tempnumber.ng/:path*",
      permanent: true,
    }];
  },
};

export default nextConfig;