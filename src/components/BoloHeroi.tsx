"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, SplitText } from "@/lib/gsap";
import { BOLO_HEROI } from "@/lib/menu";

/**
 * Seção 2 — um bolo só, em tamanho grande, com nome e ingredientes.
 * Fundo verde-oliva da marca para separar do creme do hero.
 *
 * Regra de ouro dos reveals com scrub (herdada do Bola 8): começar quando o
 * elemento subiu ~40% da tela ("top 60%"), não quando ele espia na borda.
 */
export default function BoloHeroi() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText(".heroi-nome", { type: "chars" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 60%",
          end: "top -20%",
          scrub: true,
        },
      });

      tl.fromTo(".heroi-eyebrow", { opacity: 0.05, y: 14 }, { opacity: 1, y: 0, duration: 0.4 })
        .fromTo(".heroi-eyebrow-line", { width: 0 }, { width: 40, duration: 0.4 }, "<")
        .fromTo(split.chars, { opacity: 0.08, yPercent: 60 }, { opacity: 1, yPercent: 0, duration: 0.9, stagger: 0.04 })
        .fromTo(".heroi-desc", { opacity: 0.05, y: 16 }, { opacity: 1, y: 0, duration: 0.4 })
        .fromTo(".heroi-ing", { opacity: 0.05, x: -24 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.12 })
        .fromTo(".heroi-cta", { opacity: 0.05, y: 14 }, { opacity: 1, y: 0, duration: 0.35 });

      // A foto abre num clip e deriva devagar enquanto a seção passa.
      gsap.fromTo(
        ".heroi-foto",
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.2,
          ease: "power4.inOut",
          scrollTrigger: { trigger: ".heroi-foto-wrap", start: "top 75%" },
        },
      );
      gsap.fromTo(
        ".heroi-foto-img",
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: ".heroi-foto-wrap",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      return () => split.revert();
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="bolo-heroi"
      ref={rootRef}
      className="relative overflow-hidden bg-olive-deep py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-6 md:grid-cols-2 md:gap-20">
        <div className="heroi-foto-wrap order-1 md:order-none">
          <div className="heroi-foto relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <div className="heroi-foto-img relative h-[114%] w-full">
              <Image
                src={BOLO_HEROI.imagem}
                alt={`Fatia do bolo ${BOLO_HEROI.nome} da Dalami`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="heroi-eyebrow mb-5 flex items-center gap-3" style={{ opacity: 0.05 }}>
            <span className="heroi-eyebrow-line h-px bg-gold" style={{ width: 0 }} />
            <span className="font-mono text-[10px] tracking-[0.3em] text-gold uppercase">
              Campeão de vendas
            </span>
          </div>

          <h2
            className="heroi-nome font-poster mb-6 leading-[0.88] tracking-tight text-cream uppercase"
            style={{ fontSize: "clamp(44px, 6.5vw, 92px)" }}
          >
            {BOLO_HEROI.nome}
          </h2>

          <p className="heroi-desc font-body mb-9 max-w-md text-[17px] leading-relaxed text-cream/70">
            {BOLO_HEROI.descricao}
          </p>

          <ul className="mb-10 flex flex-col gap-0 border-t border-cream/15">
            {BOLO_HEROI.ingredientes.map((ing, i) => (
              <li
                key={ing}
                className="heroi-ing flex items-baseline gap-5 border-b border-cream/15 py-4"
                style={{ opacity: 0.05 }}
              >
                <span className="font-mono text-[10px] tracking-[0.2em] text-gold/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-xl text-cream italic md:text-2xl">{ing}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/cardapio#classicos"
            className="heroi-cta font-mono group inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.24em] text-gold uppercase"
            style={{ opacity: 0.05 }}
          >
            Conheça o {BOLO_HEROI.nome}
            <span className="transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden>
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
