import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mvps.b-cdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.bunnycdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.agendaculturalloja.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "agendaculturalloja.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
