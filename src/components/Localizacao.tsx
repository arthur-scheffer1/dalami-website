"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { revelaAoEntrar } from "@/lib/anima";
import { useIsoLayoutEffect } from "@/lib/use-iso-layout-effect";
import { SITE } from "@/lib/site";

/** Seção 8 — venha nos visitar: endereço, horários, atalhos e mapa. */
export default function Localizacao() {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          ".loc-item",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: rootRef.current, start: "top 72%" },
          },
        );
      });

      // Celular: endereço, horários e botões ficam empilhados numa coluna bem
      // alta — os botões estariam a uma tela de distância do gatilho comum.
      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>(".loc-item").forEach((item) => {
          revelaAoEntrar(item, { opacity: 0, y: 24 }, { trigger: item, start: "top 92%", duration: 0.6 });
        });
      });

      gsap.fromTo(
        ".loc-mapa",
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 1.2,
          ease: "power4.inOut",
          scrollTrigger: { trigger: ".loc-mapa", start: "top 85%" },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="localizacao" ref={rootRef} className="bg-olive-deep py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-14 grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <span className="loc-item font-mono mb-4 block text-[10px] tracking-[0.3em] text-gold uppercase">
              Onde estamos
            </span>
            <h2
              className="loc-item font-poster mb-8 leading-[0.9] tracking-tight text-cream uppercase"
              style={{ fontSize: "clamp(40px, 6vw, 86px)" }}
            >
              Venha nos
              <br />
              visitar
            </h2>

            <div className="loc-item mb-8">
              <span className="font-mono mb-3 block text-[10px] tracking-[0.22em] text-gold/70 uppercase">
                Endereço
              </span>
              <address className="font-display text-2xl leading-snug text-cream not-italic md:text-3xl">
                {SITE.endereco.rua}
                <br />
                {SITE.endereco.bairro} — {SITE.endereco.cidade}/{SITE.endereco.uf}
              </address>
            </div>

            <div className="loc-item mb-9">
              <span className="font-mono mb-3 block text-[10px] tracking-[0.22em] text-gold/70 uppercase">
                Horários
              </span>
              <div className="border-t border-cream/15">
                {SITE.horarios.map((h) => (
                  <div
                    key={h.dias}
                    className="flex items-baseline justify-between gap-6 border-b border-cream/15 py-4"
                  >
                    <span className="font-body text-[15px] text-cream/75">{h.dias}</span>
                    <span className="font-mono text-xs tracking-[0.16em] text-gold">{h.horas}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="loc-item flex flex-wrap gap-3">
              <a
                href={SITE.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono rounded-full bg-gold px-7 py-4 text-[10px] font-bold tracking-[0.22em] text-olive-deep uppercase transition-colors duration-300 hover:bg-gold-light"
              >
                Como chegar
              </a>
              <a
                href={SITE.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono rounded-full border border-cream/30 px-7 py-4 text-[10px] font-bold tracking-[0.22em] text-cream uppercase transition-colors duration-300 hover:border-gold hover:text-gold"
              >
                WhatsApp
              </a>
              <a
                href={SITE.ifood}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono rounded-full border border-cream/30 px-7 py-4 text-[10px] font-bold tracking-[0.22em] text-cream uppercase transition-colors duration-300 hover:border-gold hover:text-gold"
              >
                Pedir no iFood
              </a>
            </div>
          </div>

          <div className="loc-mapa relative min-h-[420px] overflow-hidden rounded-[2rem] border border-cream/15">
            <iframe
              src={SITE.mapsEmbed}
              title="Mapa com a localização da Dalami Confeitaria"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full"
              style={{ border: 0, filter: "grayscale(0.25) contrast(1.05)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
