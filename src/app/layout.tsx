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
// `preload: false`: a Fraunces vem em dois arquivos (normal e itálico) e é
// a mais pesada do conjunto. Sendo pré-carregada, ela disputava a banda com
// a Yellowtail — que é a fonte do título "Cardápio", no alto da página, onde
// a demora aparecia. Sem o pré-carregamento ela continua chegando, só que
// depois de quem está acima da dobra.
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
  preload: false,
});

// Sem lista de pesos: o Outfit e' variavel, e pedir 300/400/500/600/700
// baixava cinco arquivos estaticos em vez de um so' com a faixa inteira.
// Cinco arquivos a mais disputando banda atrasam o resto — inclusive a
// Yellowtail do titulo "Cardapio", que e' o que aparecia trocando de fonte
// no meio do carregamento.
const outfit = Outfit({
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

/* Pinta as barras do navegador no celular. Vale para quem respeita a
   declaracao — o Safari no iPhone nao respeita: ele copia a cor que ve nas
   beiradas da pagina, e por isso quem resolve o caso dele e' o recuo da
   cortina no globals.css, nao este valor. */
export const viewport: Viewport = {
  /* Sem isto o navegador do celular encaixa a página dentro da área segura
     e sobra uma faixa no topo, atrás do relógio e da bateria, e outra na
     base, atrás do indicador. Com `cover` a página vai de borda a borda, e
     quem é fixo devolve o espaço no próprio recuo (ver .area-segura-* no
     globals.css) para nada ficar embaixo do relógio. */
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3ede2" },
    { media: "(prefers-color-scheme: dark)", color: "#f3ede2" },
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

/**
 * Serializa um objeto para dentro de uma tag <script>.
 *
 * O JSON.stringify sozinho não basta: ele escapa aspas e barras invertidas,
 * mas deixa `<` passar. Um valor contendo `</script>` fecharia a tag no meio
 * do JSON e o navegador trataria o resto como marcação. `<` é lido pelo
 * parser de JSON como `<`, então o dado chega idêntico do outro lado.
 */
function paraJsonSeguro(dados: unknown) {
  return JSON.stringify(dados).replace(/</g, "\\u003c");
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${archivoBlack.variable} ${yellowtail.variable} ${fraunces.variable} ${outfit.variable} ${spaceMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          /* O objeto é montado acima a partir do SITE, não vem de fora. Ainda
             assim o `<` sai escapado: dentro de um bloco <script>, a sequência
             `</script>` em QUALQUER valor fecharia a tag antes da hora e o
             resto viraria HTML no documento. É a única forma de injeção que
             sobrevive ao JSON.stringify, e o escape custa uma linha. */
          dangerouslySetInnerHTML={{ __html: paraJsonSeguro(DADOS_ESTRUTURADOS) }}
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
