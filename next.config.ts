import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * Sobre o `'unsafe-inline'` em script-src: o App Router do Next emite scripts
 * inline executáveis para entregar a carga do React (`self.__next_f.push(...)`
 * — 18 KB deles só na home). Sem `'unsafe-inline'`, a hidratação quebra e o
 * site vira HTML morto. A alternativa oficial é nonce por middleware, mas
 * middleware torna toda rota dinâmica, e este site é inteiramente estático —
 * trocaríamos renderização estática por uma proteção que, aqui, não tem o que
 * proteger: não há formulário, nem entrada de usuário, nem conteúdo de
 * terceiro em nenhuma página. Está anotado no relatório como decisão humana.
 *
 * O resto da política é apertado de verdade: origem própria por padrão,
 * `object-src 'none'` (sem Flash/applet), `base-uri 'self'` (ninguém reescreve
 * a base das URLs relativas), `form-action 'self'` e `frame-ancestors 'none'`,
 * que é o que impede clickjacking.
 */
const CSP = [
  "default-src 'self'",
  // va.vercel-scripts.com é o domínio de origem do Analytics quando o proxy
  // do Vercel não está disponível; em produção ele serve por /_vercel, que
  // já cai em 'self'.
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  // O Tailwind e o Next injetam estilo inline, e o projeto usa `style={{}}`
  // em máscaras e tamanhos calculados.
  "style-src 'self' 'unsafe-inline'",
  // Todas as imagens são locais. `data:` cobre o ruído SVG da textura kraft;
  // `blob:` cobre o otimizador de imagem do Next.
  "img-src 'self' data: blob:",
  // next/font hospeda as fontes no próprio domínio.
  "font-src 'self'",
  // Beacon do Speed Insights quando não passa pelo proxy do Vercel.
  "connect-src 'self' https://vitals.vercel-insights.com",
  // O único terceiro embutido é o mapa.
  "frame-src https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const CABECALHOS_SEGURANCA = [
  { key: "Content-Security-Policy", value: CSP },
  // Redundante com frame-ancestors para navegador que ainda não lê CSP nível 2.
  { key: "X-Frame-Options", value: "DENY" },
  // Impede o navegador de adivinhar o tipo de um arquivo e executar como
  // script algo que foi servido como imagem ou texto.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Não vaza o caminho completo da página ao sair para o iFood, o Instagram
  // ou o WhatsApp — só o domínio.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // O site não usa câmera, microfone nem localização. Negar explicitamente
  // vale também para qualquer iframe embutido.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Dois anos de HTTPS obrigatório, incluindo subdomínios.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Tira o `X-Powered-By: Next.js`: dizer a versão do framework para quem
  // está sondando só ajuda quem sonda.
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:caminho*", headers: CABECALHOS_SEGURANCA }];
  },
};

export default nextConfig;
