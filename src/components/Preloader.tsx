/**
 * Cortina de carregamento: um véu creme sobre a página, na mesma cor do hero.
 *
 * O logo do carregamento é o próprio wordmark do hero, que enche de oliva no
 * lugar onde já vai ficar (ver `.hero-word-enchendo` no globals.css). Com um
 * logo só, ele não se move e a transição vira apenas o fundo saindo.
 *
 * A cortina já foi verde. Não deu: o Safari no iPhone pinta a barra de status
 * e a barra inferior copiando a cor das beiradas da página, ignora a
 * `theme-color` e faz a troca com transição animada — as barras seguiam verdes
 * depois de a página já estar creme, e isso aparecia como faixa. Na cor do
 * site não existe diferença para ele copiar.
 *
 * É CSS puro, sem JavaScript, e isso é deliberado: uma cortina que depende de
 * JS para sumir cobre o site inteiro se o script falhar.
 */
export default function Preloader() {
  return <div className="preloader" aria-hidden="true" />;
}
