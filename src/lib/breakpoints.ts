/**
 * O ponto de virada entre celular e desktop.
 *
 * Existe porque o valor aparecia solto em 24 lugares, escrito à mão em cada
 * `gsap.matchMedia`. Um número repetido assim não é constante, é um convite a
 * divergência: bastava alguém corrigir 767 para 768 num arquivo e o site
 * passava a ter uma faixa de largura sem animação nenhuma — ou com as duas ao
 * mesmo tempo.
 *
 * O valor é o `md` do Tailwind. As duas consultas são complementares e não se
 * sobrepõem: 767.98 fecha o intervalo sem deixar buraco em tela de densidade
 * fracionária, onde a largura pode não ser inteira.
 */
export const LARGURA_DESKTOP = 768;

export const DESKTOP = `(min-width: ${LARGURA_DESKTOP}px)`;
export const CELULAR = `(max-width: ${LARGURA_DESKTOP - 0.02}px)`;
