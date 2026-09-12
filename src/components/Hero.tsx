"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { SITE } from "@/lib/site";
import CakePhoto from "./CakePhoto";

/**
 * Hero no espírito da referência ("Too Much Sauce"): tipografia gigante sobre
 * fundo creme, com um objeto atravessando as letras — aqui um bolo 3D que
 * acompanha o cursor.
 *
 * O entrelaçamento são duas cópias da palavra: a de trás recebe o bolo por
 * cima, e a da frente é recortada por clip-path, de modo que só a metade
 * superior das letras volta a aparecer sobre o bolo.
 *
 * Os textos laterais moram em colunas próprias do grid (não sobrepostos em
 * position: absolute, como antes) — assim nunca colidem com o título.
 */
export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cakeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const splits = gsap.utils
        .toArray<HTMLElement>(".hero-word")
        .map((el) => new SplitText(el, { type: "chars" }));
      const chars = splits.flatMap((s) => s.chars);

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(chars, {
        yPercent: 115,
        duration: 1.1,
        stagger: { each: 0.035, from: "center" },
      })
        // Sem `opacity` aqui de propósito: `from` aplica o estado inicial na
        // hora, então qualquer falha nesta timeline deixaria o bolo invisível
        // para sempre. A entrada é só de escala — se a animação não rodar, o
        // pior caso é o bolo aparecer sem animar, não sumir.
        .from(cakeRef.current, { scale: 0.68, duration: 1.3, ease: "power3.out" }, "-=0.85")
        .from(".hero-side", { opacity: 0, y: 14, duration: 0.6, stagger: 0.1 }, "-=0.7")
        .from(".hero-eyebrow", { opacity: 0, y: 12, duration: 0.6 }, "-=0.6")
        .from(".hero-cta", { opacity: 0, scale: 0.9, duration: 0.5 }, "-=0.4");

      // O bolo desce um pouco mais devagar que a página, enquanto o hero sai.
      gsap.to(cakeRef.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      return () => splits.forEach((s) => s.revert());
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-cream pt-28 pb-16"
    >
      <div className="hero-eyebrow mx-auto mb-10 max-w-4xl px-6 text-center">
        <span className="font-mono text-[10px] tracking-[0.34em] text-olive uppercase sm:text-[11px]">
          {SITE.slogan}
        </span>
      </div>

      {/* Três colunas em telas largas: texto | título+bolo | texto */}
      <div className="mx-auto grid w-full max-w-[1500px] items-center gap-8 px-6 lg:grid-cols-[minmax(130px,180px)_minmax(0,1fr)_minmax(130px,180px)] lg:gap-10">
        <p className="hero-side font-mono hidden text-[10px] leading-relaxed tracking-[0.12em] text-ink/55 uppercase lg:block">
          Confeitaria artesanal nos Ingleses. Receitas de recheio generoso e
          acabamento feito à mão.
        </p>

        <div className="relative flex items-center justify-center">
          {/* A palavra fica por cima do bolo, inteira */}
          <h1
            aria-label={SITE.nomeCompleto}
            className="font-poster relative z-20 w-full text-center leading-[0.8] tracking-[-0.02em] text-ink"
            style={{ fontSize: "clamp(64px, 15vw, 230px)" }}
          >
            <span className="hero-word inline-block">DALAMI</span>
          </h1>

          {/* O bolo, atrás da palavra */}
          <div
            ref={cakeRef}
            className="pointer-events-none absolute top-1/2 left-1/2 z-0 w-[38%] max-w-[380px] min-w-[190px] -translate-x-1/2 -translate-y-1/2"
          >
            <CakePhoto
              src="/images/bolo-hero.png"
              alt="Bolo de chocolate com ganache e morangos"
              className="h-full w-full"
            />
          </div>

        </div>

        <p className="hero-side font-mono hidden text-right text-[10px] leading-relaxed tracking-[0.12em] text-ink/55 uppercase lg:block">
          Bolos inteiros por encomenda, fatias na vitrine e café todos os dias.
        </p>
      </div>

      <div className="relative z-30 mt-12 flex flex-col items-center gap-6 px-6">
        <p className="font-display max-w-md text-center text-lg text-ink/70 italic">
          {SITE.slogan2}.
        </p>
        <a
          href="#bolo-heroi"
          className="hero-cta font-mono inline-flex items-center rounded-full bg-olive px-8 py-4 text-[11px] font-bold tracking-[0.24em] text-gold uppercase transition-colors duration-300 hover:bg-olive-deep"
        >
          Ver os bolos
        </a>
      </div>
    </section>
  );
}
