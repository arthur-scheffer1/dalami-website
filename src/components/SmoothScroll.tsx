"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { lenisRef as sharedLenisRef } from "@/lib/lenis-instance";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const navegacao = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    const recarregou = navegacao?.type === "reload";

    // Recarregar em qualquer página leva de volta à home. `replace` em vez de
    // `href` para a página de origem não ficar no histórico — senão o botão
    // voltar cairia nela e recarregar de novo traria a pessoa para cá outra
    // vez. Sai antes de montar o Lenis: esta instância não vai durar.
    if (recarregou && window.location.pathname !== "/") {
      window.location.replace("/");
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;
    sharedLenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    // Recarregar volta ao topo: a cortina do Preloader reaparece e o cliente
    // recomeça pelo hero, em vez de cair no meio da página com a animação
    // daquela seção já gasta e o logo do carregamento surgindo do nada.
    //
    // Só em recarga, detectada pela Navigation Timing API — não em qualquer
    // carregamento. Um link direto para /#localizacao, aberto de fora, precisa
    // continuar caindo na seção certa.
    if (recarregou) {
      // O navegador restaura o scroll sozinho no load; "manual" o impede, e o
      // scrollTo cobre o caso de a restauração já ter acontecido.
      history.scrollRestoration = "manual";

      // O hash entra na URL pelo AncoraSuave (pushState). Sem tirá-lo, o
      // navegador pula para a âncora mesmo com o scroll zerado.
      if (window.location.hash) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }

      lenis.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);

      // Devolve o controle ao navegador: voltar e avançar devem continuar
      // reabrindo a página na posição onde a pessoa estava.
      requestAnimationFrame(() => {
        history.scrollRestoration = "auto";
      });
    }

    // Guardado numa const: `gsap.ticker.remove(lenis.raf)` na limpeza tentava
    // remover uma funcao diferente da que entrou — o que foi adicionado e' esta
    // arrow, nao o metodo. O callback nunca saia, e cada remontagem empilhava
    // mais um rodando contra uma instancia ja destruida.
    const aoQuadro = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(aoQuadro);
    gsap.ticker.lagSmoothing(0);

    // Web fonts swapping in (next/font `display: swap`) reflow the page after
    // Lenis has already taken its initial height measurement, and its resize
    // observer only re-measures on a 250ms debounce. Force an immediate
    // re-measure once fonts settle so early scroll/ScrollTrigger math isn't
    // based on a shorter, pre-swap page.
    document.fonts.ready.then(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(aoQuadro);
      sharedLenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
