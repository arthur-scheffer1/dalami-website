/**
 * Cortina de carregamento: um véu creme sobre a página, e nada mais.
 *
 * O logo do carregamento é o próprio wordmark do hero, que enche de ganache no
 * lugar onde já vai ficar (ver `.hero-word-enchendo` no globals.css). Antes
 * havia um segundo logo aqui no meio da tela, e a troca entre os dois era
 * visível como um salto: um sumia, outro aparecia noutro tamanho e posição.
 * Com um só, o logo não se move e a transição vira apenas o fundo saindo.
 *
 * É CSS puro, sem JavaScript, e isso é deliberado: uma cortina que depende de
 * JS para sumir cobre o site inteiro se o script falhar. Em CSS a animação se
 * completa sozinha, aconteça o que acontecer com o bundle.
 */
export default function Preloader() {
  return <div className="preloader" aria-hidden="true" />;
}
