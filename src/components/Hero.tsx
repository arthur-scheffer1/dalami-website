"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { SITE } from "@/lib/site";

/**
 * Quanto a entrada do hero espera, em segundos, para coincidir com a saída da
 * cortina do Preloader. Precisa acompanhar os tempos de `.preloader` no
 * globals.css: começa um pouco antes de a cortina terminar de sumir, para o
 * hero já estar em movimento quando aparece, em vez de começar do zero.
 */
const ATRASO_PRELOADER = 1.45;

/**
 * Só a primeira carga tem cortina. Em navegação client-side (voltar do
 * cardápio, por exemplo) o layout não remonta e o Preloader não roda, então
 * esperar aqui deixaria o hero parado por um segundo e meio sem motivo.
 */
let jaMostrouCortina = false;

/**
 * Hero: tipografia gigante sobre fundo creme, atravessada na diagonal por uma
 * faixa de ganache que desce do canto superior esquerdo.
 *
 * Cada faixa mora em três camadas encaixadas, e isso é proposital: a rotação
 * fica no CSS da camada de fora, o parallax numa camada do meio e a entrada na
 * de dentro. Num elemento só, o GSAP reescreveria o `transform` inteiro e
 * apagaria a rotação no primeiro quadro da animação.
 *
 * Os textos laterais moram em colunas próprias do grid, nunca sobrepostos em
 * position: absolute, para não colidirem com o título.
 */
export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefereMenos = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const atraso = jaMostrouCortina ? 0 : prefereMenos ? 0.35 : ATRASO_PRELOADER;
    jaMostrouCortina = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: atraso, defaults: { ease: "power4.out" } });

      // A palavra inteira sobe por trás de uma máscara, em vez de entrar letra
      // a letra: o SplitText embrulharia cada caractere numa caixa própria e
      // quebraria as ligações da cursiva, que são o traço da fonte.
      tl.from(".hero-word", { yPercent: 108, duration: 1.2 })
        .from(
          ".hero-faixa",
          { xPercent: -7, opacity: 0, duration: 1.5, stagger: 0.18, ease: "power3.out" },
          0,
        )
        .from(".hero-side", { opacity: 0, y: 14, duration: 0.6, stagger: 0.1 }, "-=0.3")
        .from(".hero-eyebrow", { opacity: 0, y: 12, duration: 0.6 }, "-=0.6")
        .from(".hero-cta", { opacity: 0, scale: 0.9, duration: 0.5 }, "-=0.4");

      // Desliza na rolagem ao longo do próprio eixo, já que esta camada mora
      // dentro do elemento rotacionado.
      gsap.to(".faixa-parallax", {
        xPercent: 6,
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
      {/* Atravessa na diagonal, do alto à esquerda para baixo à direita. Passa
          por baixo do wordmark: por cima, ela partiria o nome ao meio. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[12%] z-0"
        style={{ transform: "rotate(20deg)" }}
      >
        <div className="faixa-parallax">
          <div className="hero-faixa">
            <Image
              src="/images/ganache-escura.webp"
              alt=""
              width={2079}
              height={507}
              priority
              className="-ml-[26%] w-[152%] max-w-none"
            />
          </div>
        </div>
      </div>

      <div className="hero-eyebrow relative z-10 mx-auto mb-10 max-w-4xl px-6 text-center">
        <span className="font-mono text-[10px] tracking-[0.34em] text-olive uppercase sm:text-[11px]">
          {SITE.slogan}
        </span>
      </div>

      {/* Três colunas em telas largas: texto | título | texto */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1500px] items-center gap-8 px-6 lg:grid-cols-[minmax(130px,180px)_minmax(0,1fr)_minmax(130px,180px)] lg:gap-10">
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
