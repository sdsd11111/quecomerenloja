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
  title: { default: "QuÃ© Comer en Loja | Ruta GastronÃ³mica Verificada", template: "%s | QuÃ© Comer en Loja" },
  description: "Descubre quÃ© comer en Loja: cocina tradicional, cafÃ©s y restaurantes. Consulta menÃºs del dÃ­a y contacta directamente por WhatsApp, sin apps ni comisiones.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_EC",
    siteName: SITE.name,
    title: "QuÃ© Comer en Loja | Ruta GastronÃ³mica Verificada",
    description: "La ruta gastronÃ³mica de Loja, en tu bolsillo. MenÃºs del dÃ­a y contacto directo con el restaurante.",
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
