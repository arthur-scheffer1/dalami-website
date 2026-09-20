"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { revelaAoEntrar } from "@/lib/anima";
import { useIsoLayoutEffect } from "@/lib/use-iso-layout-effect";
import { SITE } from "@/lib/site";

/**
 * Bloco do Instagram.
 *
 * A grade é de imagens estáticas, de propósito: a API do Instagram exige
 * token com renovação periódica, e um token vencido derruba a seção inteira
 * no site de um cliente que não vai perceber. Aqui, no pior caso, as fotos
 * ficam desatualizadas — o que ninguém nota — em vez de sumirem.
 *
 * As fotos são as mesmas que já estão na pasta, recortadas dos posts reais.
 * Cada uma leva ao perfil, não a um post específico: não tenho a URL dos
 * posts de origem, e apontar para um link inventado seria pior que apontar
 * para o perfil.
 */

const GRADE = [
  { src: "/images/morango-nutella.jpg", alt: "Fatia de bolo de morango com Nutella" },
  { src: "/images/matilda-cake.jpg", alt: "Fatia do Matilda Cake, de chocolate" },
  { src: "/images/red-velvet.jpg", alt: "Fatia de Red Velvet com cereja" },
  { src: "/images/bolo-dalami.jpg", alt: "Fatia do Bolo Dalami" },
  { src: "/images/mil-folhas-morango.jpg", alt: "Fatia de mil-folhas com morango" },
  { src: "/images/ninho-nutella.jpg", alt: "Fatia de bolo de Ninho com Nutella" },
] as const;

/**
 * NÚMERO A CONFIRMAR: os 15 mil seguidores vieram do Arthur, não de leitura
 * do perfil — o Instagram não entrega a contagem sem autenticar. Se o número
 * mudar, é aqui que se troca; se não der para confirmar, apagar a linha é
 * melhor do que deixar um número errado no ar.
 */
const SEGUIDORES = "15 mil";

export default function Instagram() {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          ".ig-foto",
          { opacity: 0, scale: 0.94 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: { trigger: rootRef.current, start: "top 78%" },
          },
        );
      });

      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>(".ig-foto").forEach((el) => {
          revelaAoEntrar(el, { opacity: 0, y: 14 }, { trigger: el, start: "top 94%", duration: 0.5 });
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="bg-cream py-12 md:py-20">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-9 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-mono mb-4 block text-[12px] font-bold tracking-[0.28em] text-olive-texto uppercase">
              No Instagram
            </span>
            <h2
              className="font-display leading-[1.05] tracking-tight text-ink"
              style={{ fontSize: "clamp(34px, 5.5vw, 68px)" }}
            >
              {SITE.instagram.handle}
            </h2>
            <p className="font-body mt-4 max-w-md text-[17px] leading-relaxed text-ink/70">
              {SEGUIDORES} de pessoas acompanham o corte de cada bolo por lá. As fotos
              saem da bancada direto para o feed.
            </p>
          </div>

          <a
            href={SITE.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono group inline-flex shrink-0 items-center gap-3 self-start rounded-full bg-olive-deep px-7 py-4 text-[12px] font-bold tracking-[0.2em] text-gold uppercase transition-colors duration-300 hover:bg-olive md:self-auto"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor" aria-hidden>
              <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zm0 6.18a3.66 3.66 0 1 0 0 7.32 3.66 3.66 0 0 0 0-7.32zm0 6.04a2.38 2.38 0 1 1 0-4.76 2.38 2.38 0 0 1 0 4.76zm4.66-6.18a.85.85 0 1 1-1.71 0 .85.85 0 0 1 1.71 0z" />
            </svg>
            Seguir
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
              &rarr;
            </span>
          </a>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {GRADE.map((foto) => (
            <a
              key={foto.src}
              href={SITE.instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ig-foto group relative block aspect-square overflow-hidden rounded-2xl"
            >
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-olive-deep/0 transition-colors duration-300 group-hover:bg-olive-deep/25" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
