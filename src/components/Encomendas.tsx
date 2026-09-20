"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { revelaAoEntrar } from "@/lib/anima";
import { useIsoLayoutEffect } from "@/lib/use-iso-layout-effect";
import { AVISO_DECORACAO, TAMANHOS } from "@/lib/menu";
import PassoAPasso from "./PassoAPasso";
import SeloRedondo from "./SeloRedondo";
import { SITE } from "@/lib/site";

/** Seção 6 — encomendas: tamanhos, regras e o caminho pro WhatsApp. */
export default function Encomendas() {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
      // Gatilho único, sem scrub: a entrada toca uma vez quando a seção chega e
      // fica onde parou. Presa à rolagem, ela se desfazia ao subir — e o texto
      // ficava refém da barra em vez de simplesmente aparecer.
      const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: rootRef.current, start: "top 72%" },
        });

        tl.fromTo(".enc-eyebrow", { opacity: 0.05, y: 14 }, { opacity: 1, y: 0, duration: 0.6 })
          .fromTo(
            // A folga de -30% em cima e embaixo existe para o recorte não
            // decepar acento: com leading apertado o til e o agudo sobem acima
            // da caixa da linha, e um inset colado na borda os corta ao meio.
            ".enc-heading",
            { clipPath: "inset(-30% 100% -30% 0)" },
            { clipPath: "inset(-30% 0% -30% 0)", duration: 1, ease: "power4.inOut" },
            "-=0.3",
          )
          .fromTo(".enc-texto", { opacity: 0.05, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.5");

        gsap.fromTo(
          ".enc-tamanho",
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: ".enc-tamanhos", start: "top 78%" },
          },
        );

        gsap.fromTo(
          ".enc-passo",
          { opacity: 0, x: -22 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: ".enc-passos", start: "top 82%" },
          },
        );
      });

      // Celular: os quatro cartões de tamanho viram uma coluna alta; com um
      // gatilho só, os últimos animariam muito antes de entrarem na tela.
      mm.add("(max-width: 767px)", () => {
        revelaAoEntrar(".enc-eyebrow", { opacity: 0.05, y: 14 });
        revelaAoEntrar(
          ".enc-heading",
          { clipPath: "inset(-30% 100% -30% 0)" },
          { clipPath: "inset(-30% 0% -30% 0)", duration: 0.9, ease: "power4.inOut", start: "top 88%" },
        );
        revelaAoEntrar(".enc-texto", { opacity: 0.05, y: 16 });

        gsap.utils.toArray<HTMLElement>(".enc-tamanho").forEach((cartao) => {
          revelaAoEntrar(cartao, { opacity: 0, y: 24 }, { trigger: cartao, start: "top 92%", duration: 0.6 });
        });

        gsap.utils.toArray<HTMLElement>(".enc-passo").forEach((passo) => {
          revelaAoEntrar(passo, { opacity: 0, x: -18 }, { trigger: passo, start: "top 94%", duration: 0.5 });
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="encomendas"
      ref={rootRef}
      /* Kraft: a encomenda é a seção do papel — caixa, etiqueta, pedido
         anotado. A textura é CSS puro, sem requisição de imagem. */
      className="textura-kraft bg-cream pt-14 pb-12 md:py-24"
    >
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-11 flex flex-col gap-6 md:mb-16 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
          <div className="enc-eyebrow mb-4">
            <span className="font-mono text-[12px] font-bold tracking-[0.28em] text-olive-texto uppercase">
              Encomendas
            </span>
          </div>
          <h2
            className="enc-heading font-poster mb-7 leading-[0.9] tracking-tight text-ink uppercase"
            style={{ fontSize: "clamp(40px, 6vw, 86px)" }}
          >
            Bolo inteiro
            <br />
            pra sua data
          </h2>
          <p className="enc-texto font-body text-[17px] leading-relaxed text-ink/70">
            Todos os sabores do cardápio saem em quatro tamanhos. Os rendimentos são
            aproximados e variam conforme o corte de cada fatia.
          </p>
          </div>

          {/* "Feito hoje" é o segundo uso do carimbo: mesma peça, outra
              informação. Some no celular — ali ele disputaria a largura com
              o título em vez de acompanhá-lo. */}
          <SeloRedondo
            texto="Feito hoje"
            tom="olive"
            className="hidden h-28 w-28 shrink-0 md:block lg:h-32 lg:w-32"
          />
        </div>

        <div className="enc-tamanhos mb-12 grid md:mb-20 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TAMANHOS.map((t) => (
            <div
              key={t.sigla}
              className="enc-tamanho rounded-2xl border border-ink/12 bg-sand/50 p-7 transition-colors duration-300 hover:border-olive/50"
            >
              <span className="font-poster block text-5xl leading-none text-olive-texto">{t.sigla}</span>
              <span className="font-mono mt-4 block text-[12px] tracking-[0.18em] text-ink/50 uppercase">
                {t.diametro}
              </span>
              <span className="font-display mt-2 block text-lg text-ink italic">{t.rende}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-14 md:grid-cols-2 md:gap-20">
          <div className="enc-passos">
            <PassoAPasso classeItem="enc-passo" />

            <a
              href={SITE.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono mt-10 inline-flex items-center gap-3 rounded-full bg-olive-deep px-8 py-4 text-[12px] font-bold tracking-[0.24em] text-gold uppercase transition-colors duration-300 hover:bg-olive-deep"
            >
              Encomendar no WhatsApp
              <span aria-hidden>→</span>
            </a>
          </div>

          <div className="rounded-[2rem] bg-olive-deep p-9 md:p-11">
            <h3 className="font-mono mb-6 text-[12px] tracking-[0.3em] text-gold uppercase">
              Antes de pedir
            </h3>
            <p className="font-display text-xl leading-relaxed text-cream/85 italic md:text-2xl">
              {AVISO_DECORACAO}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
