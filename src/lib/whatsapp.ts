import { SITE } from "@/lib/site";

/**
 * Monta o link do WhatsApp, com ou sem mensagem pronta.
 *
 * Centralizado porque o link aparecia em seis lugares e a montagem da
 * mensagem morava dentro de um componente de cardápio — regra de negócio
 * ("como se pede um bolo") escondida em código de apresentação.
 *
 * `encodeURIComponent` não é opcional: nome de bolo tem acento, cedilha e
 * espaço, e sem codificar a mensagem chega truncada no primeiro caractere que
 * não couber numa URL.
 */
export function linkWhatsApp(mensagem?: string) {
  if (!mensagem) return SITE.whatsapp.href;
  return `${SITE.whatsapp.href}?text=${encodeURIComponent(mensagem)}`;
}

/** O pedido de um bolo específico, com o nome já escrito na mensagem. */
export function linkPedidoDeBolo(nome: string) {
  return linkWhatsApp(`Olá! Quero encomendar o bolo ${nome}`);
}
