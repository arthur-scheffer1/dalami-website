/**
 * Tela de carregamento: o wordmark enche de ganache de baixo para cima e a
 * cortina sobe revelando o site.
 *
 * É CSS puro, sem JavaScript, e isso é deliberado. Um preloader que depende de
 * JS para sumir vira uma cortina permanente sobre o site inteiro se o script
 * falhar ou demorar — a mesma armadilha que já deixou o bolo do hero invisível
 * duas vezes neste projeto, só que muito mais cara. Em CSS a animação se
 * completa sozinha, aconteça o que acontecer com o bundle.
 *
 * Fica fora do fluxo e marcado como decorativo: o conteúdo real já está no HTML
 * atrás dele, então leitor de tela e indexador não esperam nada.
 */
export default function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <div className="preloader-centro">
        <span className="preloader-marca" />
        <span className="preloader-legenda">Confeitaria</span>
      </div>
    </div>
  );
}
