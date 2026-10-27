export const dynamic = "force-dynamic";

import type { Metadata, Viewport } from "next";
import { League_Spartan, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { Footer } from "@/components/Footer";
import { FloatingSearchWidget } from "@/components/FloatingSearchWidget";
import { SITE } from "@/lib/site";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-league-spartan",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Dónde Comer en Loja | Restaurantes, Platos Típicos y Huecas",
    template: "%s | Qué Comer en Loja",
  },
  description: "Guía definitiva para comer en Loja: mejores restaurantes en Loja, auténtico repe lojano, cecina, cafeterías, desayunos, alitas, pizzas y chifas sin intermediarios.",
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon-180.png", sizes: "180x180" },
    ],
    other: [
      { rel: "android-chrome", url: "/android-chrome-192.png", sizes: "192x192" },
      { rel: "android-chrome", url: "/android-chrome-512.png", sizes: "512x512" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "es_EC",
    siteName: SITE.name,
    title: "Dónde Comer en Loja | Guía de Restaurantes, Huecas y Repe Lojano",
    description: "Encuentra los mejores restaurantes en Loja, cafeterías, desayunos típicos, repe lojano y comida rápida local. Menús del día y contacto directo.",
    url: SITE.url,
    images: [
      {
        url: "/og-logo.png",
        width: 1200,
        height: 630,
        alt: "Qué Comer en Loja — Guía Gastronómica Local",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dónde Comer en Loja | Guía Gastronómica",
    description: "Repe lojano, cecina, cafeterías y los mejores restaurantes de Loja, Ecuador.",
    images: ["/og-logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#153E3E",   /* Petróleo Profundo — color principal de marca */
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-EC" className={`${leagueSpartan.variable} ${plusJakartaSans.variable}`}>
      <body>
        <a href="#contenido" className="fixed -top-24 left-5 z-50 bg-white p-3 focus:top-3">
          Saltar al contenido
        </a>
        <LanguageProvider>
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
        <FloatingSearchWidget />
        <ChatbotWidget origen="quecomerenloja" />
      </LanguageProvider>
      </body>
    </html>
  );
}
