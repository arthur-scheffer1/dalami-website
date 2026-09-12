import type { Metadata } from "next";
import { Archivo_Black, Fraunces, Outfit, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// Hero/poster type: heavy neo-grotesk, the weight the reference leans on.
const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
  display: "swap",
});

// Serif de apoio para os nomes dos bolos — dá o tom de confeitaria que um
// grotesco sozinho não dá.
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const outfit = Outfit({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dalami | Confeitaria e Cafeteria",
  description:
    "Dalami — confeitaria e cafeteria nos Ingleses, Florianópolis. Bolos artesanais, doces e café espresso.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${archivoBlack.variable} ${fraunces.variable} ${outfit.variable} ${spaceMono.variable}`}
    >
      <body>
        <SmoothScroll>
          <Nav />
          {children}
          <Footer />
        </SmoothScroll>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
