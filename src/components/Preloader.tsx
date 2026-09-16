/**
 * Cortina de carregamento: um véu no verde da marca sobre a página inteira.
 *
 * O logo do carregamento é o próprio wordmark do hero, que enche de dourado no
 * lugar onde já vai ficar (ver `.hero-word-enchendo` no globals.css). Com um
 * logo só, ele não se move e a transição vira apenas o fundo saindo.
 *
 * A animação é CSS puro, e isso é deliberado: uma cortina que dependa de JS
 * para sumir cobre o site inteiro se o script falhar.
 *
 * O script abaixo não mexe na cortina — ele cuida das barras do SISTEMA. O
 * Safari no iPhone pinta a barra de status e a barra inferior com a cor da
 * página, e ignora uma `theme-color` que discorde do que ele vê na tela. Em
 * vez de brigar com isso, a página começa declarando o verde: as barras ficam
 * verdes junto com a cortina, a tela inteira vira uma peça só, e quando a
 * cortina sai elas voltam ao creme junto com ela.
 *
 * Se o script não rodar, as barras ficam verdes num site creme — feio, porém
 * inofensivo. É o único caminho aqui que não depende do navegador obedecer.
 */
const TROCA_COR_DAS_BARRAS = `
setTimeout(function () {
  var metas = document.querySelectorAll('meta[name="theme-color"]');
  for (var i = 0; i < metas.length; i++) metas[i].setAttribute("content", "#f3ede2");
}, 750);
`;

export default function Preloader() {
  return (
    <>
      <div className="preloader" aria-hidden="true" />
      <script dangerouslySetInnerHTML={{ __html: TROCA_COR_DAS_BARRAS }} />
    </>
  );
}
