import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mvps.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "www.agendaculturalloja.com",
      },
      {
        protocol: "https",
        hostname: "agendaculturalloja.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
