"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { revelaAoEntrar } from "@/lib/anima";
import { useIsoLayoutEffect } from "@/lib/use-iso-layout-effect";
import { AVISO_DECORACAO, COMO_ENCOMENDAR, TAMANHOS } from "@/lib/menu";
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
            ".enc-heading",
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "power4.inOut" },
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
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power4.inOut", start: "top 88%" },
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
    <section id="encomendas" ref={rootRef} className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-16 max-w-2xl">
          <div className="enc-eyebrow mb-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-olive uppercase">
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
          <p className="enc-texto font-body text-[17px] leading-relaxed text-ink/65">
            Todos os sabores do cardápio saem em quatro tamanhos. Os rendimentos são
            aproximados e variam conforme o corte de cada fatia.
          </p>
        </div>

        <div className="enc-tamanhos mb-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TAMANHOS.map((t) => (
            <div
              key={t.sigla}
              className="enc-tamanho rounded-2xl border border-ink/12 bg-sand/50 p-7 transition-colors duration-300 hover:border-olive/50"
            >
              <span className="font-poster block text-5xl leading-none text-olive">{t.sigla}</span>
              <span className="font-mono mt-4 block text-[10px] tracking-[0.18em] text-ink/50 uppercase">
                {t.diametro}
              </span>
              <span className="font-display mt-2 block text-lg text-ink italic">{t.rende}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-14 md:grid-cols-2 md:gap-20">
          <div className="enc-passos">
            <h3 className="font-mono mb-8 text-[10px] tracking-[0.3em] text-olive uppercase">
              Como fazer sua encomenda
            </h3>
            <ol className="border-t border-ink/15">
              {COMO_ENCOMENDAR.map((passo, i) => (
                <li
                  key={passo}
                  className="enc-passo flex items-baseline gap-5 border-b border-ink/15 py-5"
                >
                  <span className="font-mono text-[10px] tracking-[0.2em] text-olive">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-body text-[15px] leading-relaxed text-ink/75">{passo}</span>
                </li>
              ))}
            </ol>

            <a
              href={SITE.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono mt-10 inline-flex items-center gap-3 rounded-full bg-olive px-8 py-4 text-[11px] font-bold tracking-[0.24em] text-gold uppercase transition-colors duration-300 hover:bg-olive-deep"
            >
              Encomendar no WhatsApp
              <span aria-hidden>→</span>
            </a>
            <p className="font-mono mt-4 text-[10px] tracking-[0.18em] text-ink/40 uppercase">
              {SITE.whatsapp.display}
            </p>
          </div>

          <div className="rounded-[2rem] bg-olive-deep p-9 md:p-11">
            <h3 className="font-mono mb-6 text-[10px] tracking-[0.3em] text-gold uppercase">
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
