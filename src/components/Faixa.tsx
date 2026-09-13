"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/use-iso-layout-effect";

/**
 * Faixa de texto em movimento contínuo, para quebrar a sequência de blocos
 * estáticos do cardápio.
 *
 * O conteúdo é duplicado e o conjunto desliza exatamente meia largura: quando
 * a primeira cópia sai, a segunda está no lugar dela, e o laço reinicia sem
 * emenda visível.
 */
export default function Faixa({
  itens,
  className = "",
}: {
  itens: string[];
  className?: string;
}) {
  const trilhoRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const trilho = trilhoRef.current;
    if (!trilho) return;

    const ctx = gsap.context(() => {
      const prefereMenos = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.to(trilho, {
        xPercent: -50,
        duration: prefereMenos ? 90 : 38,
        ease: "none",
        repeat: -1,
      });
    }, trilho);

    return () => ctx.revert();
  }, []);

  const conteudo = [...itens, ...itens];

  return (
    <div className={`overflow-hidden border-y border-ink/10 py-6 ${className}`} aria-hidden="true">
      <div ref={trilhoRef} className="flex w-max items-center gap-10 whitespace-nowrap">
        {conteudo.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-10">
            <span className="font-display text-2xl text-ink/70 italic md:text-3xl">{item}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-olive" />
          </span>
        ))}
      </div>
    </div>
  );
}
