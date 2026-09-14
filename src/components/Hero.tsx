"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { SITE } from "@/lib/site";

/**
 * Hero: tipografia gigante sobre fundo creme.
 *
 * Os textos laterais moram em colunas próprias do grid, nunca sobrepostos em
 * position: absolute, para não colidirem com o título.
 */
export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // A palavra inteira sobe por trás de uma máscara, em vez de entrar letra
      // a letra: o SplitText embrulharia cada caractere numa caixa própria e
      // quebraria as ligações da cursiva, que são o traço da fonte.
      tl.from(".hero-word", { yPercent: 108, duration: 1.2 })
        // -=0.3 em vez de -=0.7: o tween do bolo ficava entre os dois e
        // empurrava esta entrada para frente. Sem ele, o atraso vira explícito
        // para o resto da cadeia continuar no mesmo ritmo de antes.
        .from(".hero-side", { opacity: 0, y: 14, duration: 0.6, stagger: 0.1 }, "-=0.3")
        .from(".hero-eyebrow", { opacity: 0, y: 12, duration: 0.6 }, "-=0.6")
        .from(".hero-cta", { opacity: 0, scale: 0.9, duration: 0.5 }, "-=0.4");
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

        <div className="flex items-center justify-center">
          {/* O wordmark é o logo real vetorizado, não uma fonte parecida.
              Entra como máscara CSS: assim o arquivo fica cacheado à parte em
              vez de inflar o HTML, e a cor continua vindo do CSS.
              O overflow-hidden do pai é o que faz a palavra surgir subindo. */}
          <h1 aria-label={SITE.nomeCompleto} className="mx-auto w-full max-w-[1150px]">
            <span className="block overflow-hidden">
              <span
                className="hero-word block w-full bg-olive"
                style={{
                  aspectRatio: "557 / 130",
                  maskImage: "url(/images/dalami-wordmark.svg)",
                  WebkitMaskImage: "url(/images/dalami-wordmark.svg)",
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskPosition: "center",
                }}
              />
            </span>
          </h1>
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
          className="hero-cta font-display inline-flex items-center rounded-full bg-olive px-8 py-4 text-lg text-gold italic transition-colors duration-300 hover:bg-olive-deep"
        >
          Ver os bolos
        </a>
      </div>
    </section>
  );
}
