import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mvps.b-cdn.net",
      },
    ],
  },
};

export default nextConfig;
