"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { revelaAoEntrar } from "@/lib/anima";
import { useIsoLayoutEffect } from "@/lib/use-iso-layout-effect";

/**
 * Seção 5 — sobre a marca.
 *
 * ATENÇÃO (Arthur): o texto abaixo é RASCUNHO. Só dois fatos são verificados —
 * a Dalami foi registrada em 05/03/2024 por Milena Dalathea da Silva, e a loja
 * da Rod. João Gualberto Soares, 118 foi anunciada no Instagram para 12/03.
 * O resto é preenchimento e precisa ser trocado pela história real antes de
 * o site ir ao ar. O mesmo texto se repete, ampliado, na página /sobre.
 */
export const HISTORIA_RASCUNHO = {
  linha1: "Desde 2024,",
  linha2: "doce de verdade",
  linha3: "nos Ingleses.",
  paragrafo:
    "A Dalami nasceu em março de 2024, das mãos de Milena Dalathea, com uma ideia simples: bolo bom é bolo feito com calma. Hoje são mais de vinte sabores na vitrine, todos produzidos na própria loja, na Rod. João Gualberto Soares.",
};

export default function SobreMarca() {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      gsap.fromTo(
        ".sobre-foto",
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 1.1,
          ease: "power4.inOut",
          scrollTrigger: { trigger: ".sobre-foto", start: "top 82%" },
        },
      );

      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          ".sobre-item",
          { opacity: 0, x: 36 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: rootRef.current, start: "top 70%" },
          },
        );
      });

      // Celular: o texto fica abaixo da foto, longe do topo da seção.
      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>(".sobre-item").forEach((item) => {
          revelaAoEntrar(item, { opacity: 0, x: 24 }, { trigger: item, start: "top 92%", duration: 0.6 });
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="bg-sand py-24 md:py-32">
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-6 md:grid-cols-2 md:gap-20">
        <div className="sobre-foto relative aspect-[4/5] overflow-hidden rounded-[2rem]">
          <Image
            src="/images/bolo-chocolate.jpg"
            alt="Fatia de bolo de chocolate da Dalami, servida no prato da casa"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <div className="sobre-item mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-olive" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-olive uppercase">
              Nossa história
            </span>
          </div>

          <h2 className="sobre-item font-poster mb-7 leading-[0.9] tracking-tight text-ink uppercase" style={{ fontSize: "clamp(36px, 5vw, 68px)" }}>
            {HISTORIA_RASCUNHO.linha1}
            <br />
            <span className="text-olive">{HISTORIA_RASCUNHO.linha2}</span>
            <br />
            {HISTORIA_RASCUNHO.linha3}
          </h2>

          <p className="sobre-item font-body mb-9 max-w-md text-[16px] leading-relaxed text-ink/65">
            {HISTORIA_RASCUNHO.paragrafo}
          </p>

          <Link
            href="/sobre"
            className="sobre-item font-mono group inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.24em] text-olive uppercase"
          >
            Conheça nossa história
            <span className="transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden>
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
