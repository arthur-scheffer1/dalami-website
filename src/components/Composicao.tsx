"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import Divisor from "./Divisor";
import { DESKTOP } from "@/lib/breakpoints";

/**
 * Seção 4 — composição visual, não galeria: fotos grandes, muito espaço vazio
 * e frases curtas entre elas. Cada foto tem seu próprio parallax.
 */
export default function Composicao() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      gsap.utils.toArray<HTMLElement>(".comp-foto").forEach((el, i) => {
        const img = el.querySelector(".comp-img");

        gsap.fromTo(
          el,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.2,
            ease: "power4.inOut",
            scrollTrigger: { trigger: el, start: "top 80%" },
          },
        );

        // Só para cima: a imagem interna tem 116% de altura e começa alinhada ao
        // topo da moldura, então qualquer deslocamento positivo abriria uma
        // fresta de fundo no topo. O limite de -13% consome exatamente a sobra.
        //
        // Só no desktop. Preso à rolagem, este tween repinta uma foto grande a
        // cada quadro — no celular é o que fazia a rolagem travar, e a
        // profundidade que ele dá numa tela de 6 polegadas é quase nula.
        mm.add(DESKTOP, () => {
          gsap.fromTo(
            img,
            { yPercent: 0 },
            {
              yPercent: -13,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        // Alterna o sentido da deriva horizontal para a composição não ficar
        // rígida. Sem scrub: isto é revelação, não profundidade — presa à
        // rolagem, ela se desfazia quando a pessoa subia.
        gsap.fromTo(
          el,
          { x: i % 2 === 0 ? -18 : 18 },
          {
            x: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%" },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".comp-frase").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%" },
          },
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="overflow-hidden bg-cream py-16 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Linha 1 — foto grande à esquerda, frase solta à direita */}
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-16">
          <div className="comp-foto relative aspect-[4/5] overflow-hidden rounded-[2rem] md:col-span-7">
            <div className="comp-img relative h-[116%] w-full">
              <Image
                src="/images/vitrine.jpg"
                alt="Vitrine da Dalami com bolos e tortas em fatias"
                fill
                sizes="(max-width: 768px) 100vw, 58vw"
                className="object-cover"
              />
            </div>
          </div>
          <p className="comp-frase font-display text-3xl leading-tight text-ink italic md:col-span-5 md:text-4xl">
            Tudo o que está na vitrine foi feito hoje, à mão, aqui atrás.
          </p>
        </div>

        <Divisor className="py-12 md:py-20" />

        {/* Linha 2 — frase curta à esquerda, duas fotos à direita */}
        <div className="grid items-end gap-10 md:grid-cols-12 md:gap-16">
          <p className="comp-frase font-mono text-[12px] leading-loose tracking-[0.2em] text-ink/55 uppercase md:col-span-3">
            Massa, recheio
            <br />e cobertura.
            <br />
            Nada de atalho.
          </p>
          <div className="comp-foto relative aspect-[3/4] overflow-hidden rounded-[2rem] md:col-span-4">
            <div className="comp-img relative h-[116%] w-full">
              <Image
                src="/images/torta-limao.jpg"
                alt="Torta de limão siciliano com merengue maçaricado, no prato da Dalami"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="comp-foto relative aspect-square overflow-hidden rounded-[2rem] md:col-span-5">
            <div className="comp-img relative h-[116%] w-full">
              <Image
                src="/images/mil-folhas-morango.jpg"
                alt="Fatia de mil-folhas com creme e morangos frescos"
                fill
                sizes="(max-width: 768px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <Divisor className="py-12 md:py-20" />

        {/* Linha 3 — foto larga centralizada com frase por cima */}
        <div className="relative">
          <div className="comp-foto relative mx-auto aspect-[16/10] w-full overflow-hidden rounded-[2rem] md:w-[78%]">
            <div className="comp-img relative h-[116%] w-full">
              <Image
                src="/images/caixa-rosa.jpg"
                alt="Caixa rosa da Dalami aberta, com uma fatia de bolo de chocolate dentro"
                fill
                sizes="(max-width: 768px) 100vw, 78vw"
                className="object-cover"
              />
            </div>
          </div>
          <p className="comp-frase font-poster mt-10 text-center leading-[0.95] tracking-tight text-ink uppercase" style={{ fontSize: "clamp(32px, 5vw, 68px)" }}>
            Pra levar pra casa
          </p>
        </div>
      </div>
    </section>
  );
}
