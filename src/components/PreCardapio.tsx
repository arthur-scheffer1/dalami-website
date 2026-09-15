"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { revelaAoEntrar } from "@/lib/anima";
import { useIsoLayoutEffect } from "@/lib/use-iso-layout-effect";
import { CATEGORIAS } from "@/lib/menu";

/**
 * Seção 3 — prévia do cardápio: os campeões de venda, com preço a partir de.
 * Cada linha carrega o id da própria categoria, para levar à âncora certa do
 * cardápio — antes todas apontavam para #classicos, inclusive o Bolo de Pudim,
 * que fica na linha premium.
 */
const DESTAQUES = CATEGORIAS.flatMap((c) =>
  c.bolos.filter((b) => b.campeao).map((b) => ({ ...b, categoria: c.id })),
);

export default function PreCardapio() {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 60%",
            end: "top -20%",
            scrub: true,
          },
        });

        tl.fromTo(".pc-eyebrow", { opacity: 0.05, y: 14 }, { opacity: 1, y: 0, duration: 0.4 })
          .fromTo(
            ".pc-heading",
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: 0.9 },
          )
          .fromTo(".pc-cta", { opacity: 0.05, x: 30 }, { opacity: 1, x: 0, duration: 0.4 });

        gsap.fromTo(
          ".pc-linha",
          { opacity: 0.05, y: 22 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.18,
            ease: "none",
            scrollTrigger: {
              trigger: ".pc-lista",
              start: "top 70%",
              end: "bottom 70%",
              scrub: true,
            },
          },
        );
      });

      // Celular: a lista fica alta demais para um scrub único preso ao topo —
      // cada linha aparece quando ela mesma entra na tela.
      mm.add("(max-width: 767px)", () => {
        revelaAoEntrar(".pc-eyebrow", { opacity: 0.05, y: 14 });
        revelaAoEntrar(
          ".pc-heading",
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power4.inOut", start: "top 88%" },
        );
        revelaAoEntrar(".pc-cta", { opacity: 0.05, x: 30 });

        gsap.utils.toArray<HTMLElement>(".pc-linha").forEach((linha) => {
          revelaAoEntrar(linha, { opacity: 0.05, y: 18 }, { trigger: linha, start: "top 94%", duration: 0.5 });
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="pc-eyebrow mb-4">
              <span className="font-mono text-[10px] tracking-[0.3em] text-olive uppercase">
                Cardápio
              </span>
            </div>
            <h2
              className="pc-heading font-poster leading-[0.9] tracking-tight text-ink uppercase"
              style={{ fontSize: "clamp(40px, 6vw, 86px)" }}
            >
              Os campeões
              <br />
              de venda
            </h2>
          </div>
          <Link
            href="/cardapio"
            className="pc-cta font-mono group inline-flex items-center gap-3 rounded-full border px-7 py-4 text-[11px] font-bold tracking-[0.24em] border-olive/40 text-olive uppercase transition-colors duration-300 hover:border-olive hover:bg-olive hover:text-gold"
          >
            Ver cardápio completo
            <span className="transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden>
              →
            </span>
          </Link>
        </div>

        <div className="pc-lista border-t border-ink/15">
          {DESTAQUES.map((bolo) => (
            <Link
              key={bolo.nome}
              href={`/cardapio#${bolo.categoria}`}
              className="pc-linha group flex items-baseline justify-between gap-6 border-b border-ink/15 py-7 transition-colors duration-300 hover:bg-olive/5"
            >
              <span className="font-display text-2xl text-ink transition-transform duration-300 group-hover:translate-x-2 md:text-4xl">
                {bolo.nome}
              </span>
              <span className="font-mono shrink-0 text-[10px] tracking-[0.16em] text-olive uppercase md:text-xs">
                a partir de R$ {bolo.precos.P}
              </span>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}
