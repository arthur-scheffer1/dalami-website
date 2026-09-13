"use client";

import { useEffect } from "react";
import { lenisRef } from "@/lib/lenis-instance";

/**
 * Faz os links de âncora da própria página (#bolo-heroi, #encomendas,
 * #localizacao, as categorias do cardápio) rolarem pelo Lenis.
 *
 * Sem isto o navegador dá um salto instantâneo, que destoa do scroll suave do
 * resto do site. Links para outras páginas seguem o caminho normal do Next.
 */
export default function AncoraSuave() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Cliques com modificador abrem em outra aba/janela: não interferir.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const link = (e.target as HTMLElement).closest("a");
      if (!link || link.target === "_blank") return;

      const href = link.getAttribute("href");
      if (!href || !href.includes("#")) return;

      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      // Âncora de outra página: deixa o Next navegar e só depois o hash age.
      if (url.pathname !== window.location.pathname) return;

      const id = decodeURIComponent(url.hash.slice(1));
      if (!id) return;

      const alvo = document.getElementById(id);
      if (!alvo) return;

      e.preventDefault();

      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(alvo, { offset: -8, duration: 1.2 });
      } else {
        alvo.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      window.history.pushState(null, "", url.hash);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
