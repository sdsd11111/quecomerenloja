import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatbotIA } from "@/components/ChatbotIA";
import { SITE } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500", "600", "700", "800"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", style: ["normal", "italic"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Dónde Comer en Loja | Restaurantes, Platos Típicos y Huecas",
    template: "%s | Qué Comer en Loja",
  },
  description: "Guía definitiva para comer en Loja: mejores restaurantes en Loja, auténtico repe lojano, cecina, cafeterías, desayunos, alitas, pizzas y chifas sin intermediarios.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_EC",
    siteName: SITE.name,
    title: "Dónde Comer en Loja | Guía de Restaurantes, Huecas y Repe Lojano",
    description: "Encuentra los mejores restaurantes en Loja, cafeterías, desayunos típicos, repe lojano y comida rápida local. Menús del día y contacto directo.",
    url: SITE.url,
  },
};

export const viewport: Viewport = { themeColor: "#8B3A2A" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-EC" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <a href="#contenido" className="fixed -top-24 left-5 z-50 bg-white p-3 focus:top-3">Saltar al contenido</a>
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
        <ChatbotIA />
      </body>
    </html>
  );
}
