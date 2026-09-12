/**
 * Cardápio de encomendas da Dalami — transcrito do PDF oficial
 * ("Cardápio de Bolos inteiros Dalami", gerado no Canva em 04/08/2026).
 * Preços em reais, por tamanho.
 */

export type Tamanho = "P" | "M" | "G" | "GG";

export type Bolo = {
  nome: string;
  descricao: string;
  precos: Partial<Record<Tamanho, number>>;
  /** Observação quando o item foge da tabela de tamanhos. */
  obs?: string;
  campeao?: boolean;
};

export type Categoria = {
  id: string;
  titulo: string;
  subtitulo: string;
  bolos: Bolo[];
};

export const TAMANHOS = [
  { sigla: "P", diametro: "17 cm de diâmetro", rende: "10 a 12 fatias" },
  { sigla: "M", diametro: "20 cm de diâmetro", rende: "22 a 25 fatias" },
  { sigla: "G", diametro: "25 cm de diâmetro", rende: "40 a 45 fatias" },
  { sigla: "GG", diametro: "30 × 20 cm, quadrado", rende: "média de 65 a 70 fatias" },
] as const;

export const COMO_ENCOMENDAR = [
  "Faça o pedido pelo WhatsApp com, no mínimo, 2 dias de antecedência.",
  "A confirmação ocorre mediante pagamento de pelo menos 50% do valor.",
  "A retirada é feita na loja; combine o horário de retirada no pedido.",
] as const;

export const AVISO_DECORACAO =
  "Nossos bolos seguem o estilo e as decorações tradicionais da Dalami. No momento não trabalhamos com decorações personalizadas, temáticas, reproduções de fotos ou modelos específicos.";

/** O bolo-herói da seção 2 — campeão de vendas, escolhido pelo Arthur. */
export const BOLO_HEROI = {
  nome: "Morango e Nutella",
  ingredientes: [
    "Massa tradicional de chocolate",
    "Nata com morango",
    "Nutella",
    "Brigadeiro branco",
  ],
  descricao:
    "Massa de chocolate, recheio de nata com morango e de Nutella com brigadeiro branco.",
  // Mesma fatia do post de ingredientes, porém sem as legendas do Canva
  // sobrepostas — os ingredientes aparecem em HTML na seção.
  imagem: "/images/fatia-nutella-morango.jpg",
} as const;

export const CATEGORIAS: Categoria[] = [
  {
    id: "classicos",
    titulo: "Os clássicos da Dalami",
    subtitulo: "Sabores que conquistam desde a primeira fatia.",
    bolos: [
      {
        nome: "Bolo Dalami",
        descricao:
          "Massa de chocolate, um recheio de brigadeiro branco e um recheio de brigadeiro 50% cacau.",
        precos: { P: 160, M: 230, G: 295, GG: 335 },
        campeao: true,
      },
      {
        nome: "Bolo Catarina",
        descricao:
          "Massa de baunilha, doce de ovos, doce de leite com nozes, coco queimado, nata, camada fina de coco e brigadeiro de chocolate, finalizado com fio de ovos.",
        precos: { P: 170, M: 250, G: 315, GG: 370 },
        campeao: true,
      },
      {
        nome: "Morango e Nutella",
        descricao:
          "Massa de chocolate, recheio de nata com morango e de Nutella com brigadeiro branco.",
        precos: { P: 185, M: 270, G: 345, GG: 395 },
        campeao: true,
      },
      {
        nome: "Matilda Cake",
        descricao:
          "Massa de chocolate, com 4 camadas: duas de trufa de chocolate nobre e duas de brigadeiro de chocolate 50%. Acompanha 300 ml de calda de chocolate.",
        precos: { P: 190, M: 280, G: 365, GG: 415 },
        campeao: true,
      },
    ],
  },
  {
    id: "frutados",
    titulo: "Leves, frutados e marcantes",
    subtitulo: "Combinações equilibradas para diferentes estilos de comemoração.",
    bolos: [
      {
        nome: "Morango e nata",
        descricao:
          "Massa de baunilha, duas camadas finas de brigadeiro branco com nata e morangos frescos picados.",
        precos: { P: 170, M: 250, G: 330, GG: 375 },
      },
      {
        nome: "Torta Mineira",
        descricao:
          "Massa de baunilha, brigadeiro de coco com doce de leite, abacaxi cozido e nata.",
        precos: { P: 160, M: 240, G: 290, GG: 345 },
      },
      {
        nome: "Pêssego e Abacaxi",
        descricao:
          "Massa de baunilha, recheio de nata, abacaxi cozido com pêssego e doce de leite.",
        precos: { P: 165, M: 245, G: 295, GG: 345 },
      },
      {
        nome: "Limão siciliano e frutas vermelhas",
        descricao:
          "Massa blueberry (pão de ló com mirtilo), brigadeiro de limão siciliano com camadas de geleia de frutas vermelhas artesanal.",
        precos: { P: 170, M: 250, G: 330, GG: 385 },
      },
    ],
  },
  {
    id: "tradicionais",
    titulo: "Sabores tradicionais",
    subtitulo: "Chocolate, Nutella e cremosidade em versões generosas.",
    bolos: [
      {
        nome: "Floresta negra",
        descricao:
          "Massa de chocolate, com camada de nata, mousse de chocolate, brigadeiro branco e chocolate, cerejas picadas e pedacinhos de chocolate nobre.",
        precos: { P: 170, M: 250, G: 330, GG: 370 },
      },
      {
        nome: "Ninho e Nutella",
        descricao:
          "Massa de chocolate, dois recheios de brigadeiro e mousse de leite em pó com camada generosa de Nutella.",
        precos: { P: 175, M: 270, G: 345, GG: 390 },
      },
      {
        nome: "Prestígio",
        descricao:
          "Massa de chocolate, brigadeiro de coco, brigadeiro de chocolate e coco ralado.",
        precos: { P: 160, M: 240, G: 290, GG: 350 },
      },
      {
        nome: "Ninho trufado",
        descricao:
          "Massa de chocolate, mousse de Ninho trufado e brigadeiro de chocolate 50% cacau.",
        precos: { P: 160, M: 240, G: 290, GG: 350 },
      },
    ],
  },
  {
    id: "casa-de-vo",
    titulo: "Sabores atemporais",
    subtitulo: "Bolos que lembram casa de vó.",
    bolos: [
      {
        nome: "Ameixa, coco e doce de leite",
        descricao:
          "Massa de baunilha, brigadeiro de coco com doce de leite e mousse de doce de leite com ameixas pretas picadas.",
        precos: { P: 160, M: 245, G: 290, GG: 350 },
      },
      {
        nome: "Cocada e ameixa",
        descricao: "Massa de baunilha, duas camadas de cocada com ameixa.",
        precos: { P: 160, M: 235, G: 280, GG: 340 },
      },
      {
        nome: "Damasco e doce de leite",
        descricao:
          "Massa de baunilha, com mousse de doce de leite, damasco e finalizado com amêndoas.",
        precos: { P: 160, M: 245, G: 290, GG: 350 },
      },
    ],
  },
  {
    id: "acidos",
    titulo: "Sabores sutilmente ácidos",
    subtitulo: "Para quem procura uma opção não tão doce.",
    bolos: [
      {
        nome: "Red Velvet",
        descricao:
          "Massa de baunilha com corante vermelho, mousse de cream cheese e geleia de frutas vermelhas.",
        precos: { P: 175, M: 250, G: 300, GG: 360 },
      },
      {
        nome: "Cheesecake de frutas vermelhas",
        descricao:
          "Base de bolacha maizena, cream cheese e geleia artesanal de frutas vermelhas.",
        precos: { P: 185 },
        obs: "Tamanho único de 25 cm, rende 15 a 18 fatias.",
      },
    ],
  },
  {
    id: "premium",
    titulo: "Especiais Premium Dalami",
    subtitulo: "Linha especial, bolos exclusivos e lançamentos.",
    bolos: [
      {
        nome: "Bolo Snickers",
        descricao:
          "Massa de chocolate, camadas de trufa de chocolate 50%, caramelo salgado e creme branco com amendoim.",
        precos: { P: 175, M: 250, G: 330, GG: 370 },
      },
      {
        nome: "Bolo chocolate da Milka",
        descricao:
          "Massa de chocolate, duas camadas com brigadeiro de chocolate, brigadeiro branco e muitos pedaços de chocolate Milka tradicional.",
        precos: { P: 195, M: 295, G: 375, GG: 475 },
      },
      {
        nome: "Bolo Kinder Bueno",
        descricao:
          "Massa de chocolate, uma camada de mousse de chocolate nobre e outra de chocolate branco, com Kinder Bueno na finalização.",
        precos: { P: 185, M: 260, G: 335, GG: 400 },
      },
      {
        nome: "Bolo de Pudim",
        descricao:
          "Massa de baunilha, uma camada inteirinha de pudim e outra de mousse de doce de leite, finalizado com chantilly e calda de pudim.",
        precos: { P: 170, M: 245, G: 300, GG: 355 },
        campeao: true,
      },
    ],
  },
];

export const BRIGADEIROS = {
  descricao: "Produzidos artesanalmente, com aproximadamente 23 g cada.",
  sabores: [
    "Chocolate ao leite",
    "Chocolate meio amargo",
    "Chocolate branco",
    "Ferrero",
    "Ninho com Nutella",
    "Ninho com Oreo",
    "Brûlée",
    "Beijinho",
    "Churros",
  ],
  preco: "R$ 225,00 o cento",
  minimo:
    "Pedido mínimo de 50 unidades; abaixo de 50 unidades, consultar preço unitário. O cento pode ter até 4 sabores; o meio cento, até 2.",
} as const;
