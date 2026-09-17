/**
 * Cortina de carregamento, em creme — a mesma cor do hero.
 *
 * O logo é o próprio wordmark do hero, que aparece da esquerda para a direita
 * como se estivesse sendo escrito (ver `.hero-word-enchendo` no globals.css).
 * Com um logo só, ele não se move quando a cortina sai e a transição fica
 * contínua.
 *
 * A barra e a legenda vivem aqui porque são da cortina, não do hero: elas
 * existem para dar o que a cor sozinha não dá. Fundo creme sobre página creme
 * não tem contraste para mostrar que algo saiu, então quem marca a passagem é
 * o movimento — a palavra sendo escrita, a barra enchendo e os dois saindo.
 *
 * A cortina já foi verde. Não deu: o Safari no iPhone pinta a barra de status
 * e a barra inferior copiando a cor das beiradas da página, ignora a
 * `theme-color` e faz a troca com transição animada — as barras seguiam verdes
 * depois de a página já estar creme, e isso aparecia como faixa.
 *
 * É CSS puro, sem JavaScript, e isso é deliberado: uma cortina que depende de
 * JS para sumir cobre o site inteiro se o script falhar.
 */
export default function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <span className="preloader-barra" />
      <span className="preloader-legenda">Confeitaria</span>
    </div>
  );
}
