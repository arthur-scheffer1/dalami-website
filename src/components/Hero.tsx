"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { SITE } from "@/lib/site";
import CakePhoto from "./CakePhoto";

/**
 * Hero: tipografia gigante sobre fundo creme, com a foto do bolo atrás da
 * palavra, inclinando-se em direção ao cursor.
 *
 * Dois cuidados estruturais:
 *
 * - A centralização do bolo (CSS) e a animação do bolo (GSAP) moram em
 *   elementos diferentes. Num elemento só, o GSAP reescreveria o `transform`
 *   e congelaria o `-50%` da centralização num valor em pixels, tirando o
 *   bolo do centro no primeiro redimensionamento da janela.
 * - Os textos laterais moram em colunas próprias do grid, nunca sobrepostos
 *   em position: absolute, para não colidirem com o título.
 */
export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cakeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // A palavra inteira sobe por trás de uma máscara, em vez de entrar letra
      // a letra: o SplitText embrulharia cada caractere numa caixa própria e
      // quebraria as ligações da cursiva, que são o traço da fonte.
      tl.from(".hero-word", { yPercent: 108, duration: 1.2 })
        // Sem `opacity` aqui de propósito: `from` aplica o estado inicial na
        // hora, então qualquer falha nesta timeline deixaria o bolo invisível
        // para sempre. A entrada é só de escala — se a animação não rodar, o
        // pior caso é o bolo aparecer sem animar, não sumir.
        .from(cakeRef.current, { scale: 0.68, duration: 1.3, ease: "power3.out" }, "-=0.9")
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
          {/* A máscara (overflow-hidden) é o que faz a palavra surgir subindo.
              O padding inferior dá espaço para o floreio da cursiva, que desce
              abaixo da linha de base e seria cortado sem ele. */}
          <h1
            aria-label={SITE.nomeCompleto}
            className="font-script relative z-20 w-full text-center leading-[1.05] text-ink"
            style={{ fontSize: "clamp(72px, 17vw, 250px)" }}
          >
            <span className="block overflow-hidden pb-[0.16em]">
              <span className="hero-word inline-block">Dalami</span>
            </span>
          </h1>

          {/* O bolo, atrás da palavra. A camada de fora só centraliza (CSS puro,
              intocada pelo GSAP); a de dentro é a que anima. */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 w-[52%] max-w-[380px] -translate-x-1/2 -translate-y-1/2 sm:w-[44%] lg:w-[38%]">
            <div ref={cakeRef}>
              <CakePhoto
                src="/images/bolo-hero.png"
                alt="Bolo de chocolate com ganache e morangos"
                className="w-full"
              />
            </div>
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
