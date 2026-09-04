import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/enquiry",
        destination: "/contact",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
