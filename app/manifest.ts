import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Qué Comer en Loja | Guía Gastronómica",
    short_name: "Qué Comer Loja",
    description: "Guía completa de restaurantes, huecas, cafeterías y platos típicos en Loja, Ecuador.",
    start_url: "/",
    display: "standalone",
    background_color: "#153E3E",
    theme_color: "#153E3E",
    icons: [
      {
        src: "/android-chrome-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
