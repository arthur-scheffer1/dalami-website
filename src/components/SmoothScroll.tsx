"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { lenisRef as sharedLenisRef } from "@/lib/lenis-instance";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
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
    // carregamento. Um link direto para /cardapio#classicos, aberto de fora,
    // precisa continuar caindo na categoria certa.
    const navegacao = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;

    if (navegacao?.type === "reload") {
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

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
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
      gsap.ticker.remove(lenis.raf);
      sharedLenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
