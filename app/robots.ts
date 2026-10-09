import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/buscar"],
      },
      // Bots de Inteligencia Artificial & LLMs (GEO: Generative Engine Optimization)
      // Permite el rastreo total para que ChatGPT, Claude, Perplexity y Gemini citen quecomerenloja.com
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "anthropic-ai",
          "PerplexityBot",
          "Google-Extended",
          "Bytespider",
          "CCBot",
          "cohere-ai",
          "Meta-ExternalAgent",
          "OAI-SearchBot",
        ],
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
