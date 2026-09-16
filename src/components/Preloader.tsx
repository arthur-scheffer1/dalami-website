/**
 * Cortina de carregamento: um véu no verde da marca sobre a página, e nada mais.
 *
 * O logo do carregamento é o próprio wordmark do hero, que enche de dourado no
 * lugar onde já vai ficar (ver `.hero-word-enchendo` no globals.css). Antes
 * havia um segundo logo aqui no meio da tela, e a troca entre os dois era
 * visível como um salto: um sumia, outro aparecia noutro tamanho e posição.
 * Com um só, o logo não se move e a transição vira apenas o fundo saindo.
 *
 * É CSS puro, sem JavaScript, e isso é deliberado: uma cortina que depende de
 * JS para sumir cobre o site inteiro se o script falhar. Em CSS a animação se
 * completa sozinha, aconteça o que acontecer com o bundle.
 *
 * Antecipar a saída por JS quando a página termina de pintar foi tentado e
 * descartado: trocar a animação no meio reinicia o preenchimento, e o dourado
 * volta ao zero para encher de novo. Os tempos foram encurtados em vez disso.
 */
/*
 * TEMPORARIO — diagnostico das faixas verdes no celular.
 *
 * Abrir o site com ?diag=1 pinta a cortina de azul. Se as faixas ficarem
 * azuis, a cor vem da cortina; se continuarem verdes, vem de outro elemento.
 * As duas causas pedem correcoes opostas, e sem essa resposta so da para
 * chutar. Remover assim que o bug estiver resolvido.
 */
const DIAGNOSTICO =
  "if(location.search.includes('diag'))document.documentElement.dataset.diag='1'";

export default function Preloader() {
  return (
    <>
      <div className="preloader" aria-hidden="true" />
      <script dangerouslySetInnerHTML={{ __html: DIAGNOSTICO }} />
    </>
  );
}
