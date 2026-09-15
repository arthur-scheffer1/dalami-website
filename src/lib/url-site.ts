/**
 * Endereço público do site.
 *
 * A Vercel injeta VERCEL_PROJECT_PRODUCTION_URL automaticamente, e ela aponta
 * sempre para o domínio de produção — inclusive quando o build roda numa
 * pré-visualização. Assim as URLs absolutas de metadata e sitemap não precisam
 * de domínio chumbado no código.
 */
export const URL_SITE = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";
