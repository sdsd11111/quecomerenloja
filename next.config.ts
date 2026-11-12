import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // Tesseract.js necesita resolverse con `require` nativo: su worker script
  // usa __dirname y no sobrevive al empaquetado del servidor.
  serverExternalPackages: ["tesseract.js"],
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
