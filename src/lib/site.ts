/** Dados reais da Dalami — confirmados pelo Arthur e pelo cardápio oficial. */
export const SITE = {
  nome: "Dalami",
  nomeCompleto: "Dalami Confeitaria",
  slogan: "A vida merece ser saboreada",
  slogan2: "Cada pedaço da vida merece ser saboreado",

  endereco: {
    rua: "Rod. João Gualberto Soares, 118",
    bairro: "Ingleses",
    cidade: "Florianópolis",
    uf: "SC",
  },

  // Segunda a sábado das 12h às 20h; domingo das 14h às 20h.
  horarios: [
    { dias: "Segunda a sábado", horas: "12h — 20h" },
    { dias: "Domingo", horas: "14h — 20h" },
  ],

  whatsapp: {
    display: "(48) 98860-4881",
    // wa.me exige só dígitos, com código do país
    href: "https://wa.me/5548988604881",
  },

  instagram: {
    handle: "@dalamicafeteria",
    href: "https://instagram.com/dalamicafeteria",
  },

  facebook: "https://www.facebook.com/share/1Pda9EzZGy/?mibextid=wwXIfr",

  ifood:
    "https://www.ifood.com.br/delivery/florianopolis-sc/dalami-confeitaria-ingleses-do-rio-vermelho/361dd14b-2500-4cdd-93e5-2431cf04a9d0",

  maps: "https://www.google.com/maps/search/?api=1&query=Dalami+Confeitaria+Rod.+Jo%C3%A3o+Gualberto+Soares+118+Ingleses+Florian%C3%B3polis",

  mapsEmbed:
    "https://www.google.com/maps?q=Rod.+Jo%C3%A3o+Gualberto+Soares,+118,+Ingleses,+Florian%C3%B3polis+-+SC&output=embed",
} as const;

/**
 * Os mesmos horários acima, em formato de máquina: 0 é domingo, 6 é sábado, e
 * as horas são em formato 24h. Servem para o indicador de "aberto agora" e
 * para os dados estruturados que o Google lê.
 *
 * Existe em separado de propósito: a versão de cima é texto para humanos e
 * muda de redação sem aviso; esta aqui é contrato.
 */
export const HORARIOS_SEMANA: Record<number, [number, number]> = {
  0: [14, 20],
  1: [12, 20],
  2: [12, 20],
  3: [12, 20],
  4: [12, 20],
  5: [12, 20],
  6: [12, 20],
};

/** Onde a confeitaria fica — o relógio de quem visita não serve para saber se ela está aberta. */
export const FUSO = "America/Sao_Paulo";

/**
 * Só páginas de verdade. "Encomendas" saiu daqui de propósito: é a seção 6 da
 * home, não uma página — no menu ela dava a impressão de que o link não levava
 * a lugar nenhum. Quem quer encomendar tem o botão do WhatsApp no Nav.
 */
export const PAGINAS = [
  { href: "/", label: "Home" },
  { href: "/cardapio", label: "Cardápio" },
  { href: "/sobre", label: "Sobre nós" },
] as const;
