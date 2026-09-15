"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { revelaAoEntrar } from "@/lib/anima";
import { useIsoLayoutEffect } from "@/lib/use-iso-layout-effect";

/**
 * ⚠️ SEÇÃO 7 — DEPOIMENTOS FICTÍCIOS, NÃO PUBLICAR ASSIM.
 *
 * Não foi encontrada nenhuma avaliação pública indexada da Dalami (o iFood
 * bloqueia leitura automatizada e o Google Maps não apareceu nas buscas), e
 * inventar prova social como se fosse real enganaria quem lê o site.
 *
 * Os textos abaixo são EXEMPLOS DE DIAGRAMAÇÃO, escritos por mim. Antes de
 * publicar, substitua todos por avaliações reais do Google ou comentários do
 * Instagram, com o nome de quem escreveu, e apague este aviso.
 */
const DEPOIMENTOS_FICTICIOS = [
  {
    texto:
      "Pedi um bolo de morango com Nutella pro aniversário da minha mãe e sobrou fatia pra ninguém repetir. O recheio é generoso de verdade.",
    autor: "EXEMPLO — substituir",
    origem: "Google",
  },
  {
    texto:
      "Parei pra tomar um café e acabei levando uma caixinha pra casa. Atendimento super atencioso e a vitrine é uma tentação.",
    autor: "EXEMPLO — substituir",
    origem: "Google",
  },
  {
    texto:
      "Melhor bolo de chocolate que comi nos Ingleses. Massa úmida, cobertura na medida, nada enjoativo.",
    autor: "EXEMPLO — substituir",
    origem: "Instagram",
  },
];

export default function Depoimentos() {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          ".dep-card",
          { opacity: 0, y: 40, rotate: (i: number) => (i % 2 === 0 ? -1.5 : 1.5) },
          {
            opacity: 1,
            y: 0,
            rotate: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: { trigger: rootRef.current, start: "top 72%" },
          },
        );
      });

      // Celular: os três cartões viram uma pilha de quase três telas de altura.
      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>(".dep-card").forEach((card) => {
          revelaAoEntrar(card, { opacity: 0, y: 30 }, { trigger: card, start: "top 92%", duration: 0.6 });
        });
      });

      gsap.fromTo(
        // A folga de -30% em cima e embaixo existe para o recorte não
        // decepar acento: com leading apertado o til e o agudo sobem acima
        // da caixa da linha, e um inset colado na borda os corta ao meio.
        ".dep-heading",
        { clipPath: "inset(-30% 100% -30% 0)" },
        {
          clipPath: "inset(-30% 0% -30% 0)",
          duration: 1.1,
          ease: "power4.inOut",
          scrollTrigger: { trigger: ".dep-heading", start: "top 88%" },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-14 text-center">
          <span className="font-mono mb-4 block text-[10px] tracking-[0.3em] text-olive uppercase">
            Quem já provou
          </span>
          <h2
            className="dep-heading font-poster mx-auto leading-[0.92] tracking-tight text-ink uppercase"
            style={{ fontSize: "clamp(36px, 5.5vw, 78px)" }}
          >
            Dizem por aí
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {DEPOIMENTOS_FICTICIOS.map((d) => (
            <figure
              key={d.texto}
              className="dep-card flex flex-col justify-between rounded-[1.75rem] border border-ink/12 bg-sand/40 p-8"
            >
              <blockquote className="font-display text-xl leading-relaxed text-ink/85 italic">
                “{d.texto}”
              </blockquote>
              <figcaption className="mt-8 border-t border-ink/12 pt-5">
                <span className="font-mono block text-[10px] tracking-[0.2em] text-olive uppercase">
                  {d.autor}
                </span>
                <span className="font-mono mt-1 block text-[9px] tracking-[0.2em] text-ink/40 uppercase">
                  {d.origem}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
