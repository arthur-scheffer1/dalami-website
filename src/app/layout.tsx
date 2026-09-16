import type { Metadata, Viewport } from "next";
import { Archivo_Black, Fraunces, Outfit, Space_Mono, Yellowtail } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SITE, HORARIOS_SEMANA } from "@/lib/site";
import { URL_SITE } from "@/lib/url-site";
import SmoothScroll from "@/components/SmoothScroll";
import AncoraSuave from "@/components/AncoraSuave";
import Nav from "@/components/Nav";
import Preloader from "@/components/Preloader";
import BotaoWhatsApp from "@/components/BotaoWhatsApp";
import Footer from "@/components/Footer";

// Hero/poster type: heavy neo-grotesk, usado nos títulos de seção.
const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
  display: "swap",
});

// Script do nome da marca no hero — o mais próximo do lettering do logo.
const yellowtail = Yellowtail({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-yellowtail",
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

/* Pinta as barras do navegador no celular — atras da barra de status e da
   barra inferior.
 *
 * Comeca no VERDE da cortina, de proposito. O Safari ignora uma theme-color
 * que discorde do que ele ve na tela e copia a cor da pagina; declarando o
 * verde, as barras acompanham a cortina e a tela vira uma peca so, sem faixa
 * nenhuma. O Preloader troca para creme quando a cortina sai. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#58763e" },
    { media: "(prefers-color-scheme: dark)", color: "#58763e" },
  ],
};

const DESCRICAO =
  "Dalami — confeitaria e cafeteria nos Ingleses, Florianópolis. Bolos artesanais, doces e café espresso.";

export const metadata: Metadata = {
  /* Sem metadataBase, as URLs de imagem do Open Graph saem relativas — e
     relativo não funciona em prévia de link, que é servida por outro domínio. */
  metadataBase: new URL(URL_SITE),
  title: {
    default: "Dalami | Confeitaria e Cafeteria",
    template: "%s | Dalami",
  },
  description: DESCRICAO,
  openGraph: {
    title: "Dalami | Confeitaria e Cafeteria",
    description: DESCRICAO,
    url: URL_SITE,
    siteName: SITE.nomeCompleto,
    locale: "pt_BR",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Dalami | Confeitaria e Cafeteria", description: DESCRICAO },
};

/**
 * Dados estruturados de padaria/confeitaria. É o que permite ao Google mostrar
 * endereço, telefone e "aberto agora" direto no resultado de busca, em vez de
 * só um link azul.
 */
const DADOS_ESTRUTURADOS = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: SITE.nomeCompleto,
  description: DESCRICAO,
  url: URL_SITE,
  telephone: SITE.whatsapp.display,
  image: `${URL_SITE}/images/logo-dalami.svg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.endereco.rua,
    addressLocality: SITE.endereco.cidade,
    addressRegion: SITE.endereco.uf,
    addressCountry: "BR",
  },
  sameAs: [SITE.instagram.href, SITE.facebook, SITE.ifood],
  hasMenu: `${URL_SITE}/cardapio`,
  openingHoursSpecification: Object.entries(HORARIOS_SEMANA).map(([dia, [abre, fecha]]) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][Number(dia)],
    opens: `${String(abre).padStart(2, "0")}:00`,
    closes: `${String(fecha).padStart(2, "0")}:00`,
  })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${archivoBlack.variable} ${yellowtail.variable} ${fraunces.variable} ${outfit.variable} ${spaceMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          /* Objeto próprio, montado acima a partir do SITE — não vem de fora,
             então não há conteúdo de terceiro sendo injetado aqui. */
          dangerouslySetInnerHTML={{ __html: JSON.stringify(DADOS_ESTRUTURADOS) }}
        />
        <Preloader />
        <SmoothScroll>
          <AncoraSuave />
          <Nav />
          {children}
          <Footer />
        </SmoothScroll>
        <BotaoWhatsApp />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
