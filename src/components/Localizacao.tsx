"use client";

import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { revelaAoEntrar } from "@/lib/anima";
import { useIsoLayoutEffect } from "@/lib/use-iso-layout-effect";
import { SITE } from "@/lib/site";
import EstadoLoja from "./EstadoLoja";

/** Tracinhos curtos em diagonal — a textura impressa na caixa das fatias. */
function Hachura({ className, cor = "var(--color-ink)" }: { className?: string; cor?: string }) {
  return (
    <svg viewBox="0 0 56 40" className={className} fill="none">
      {[0, 1, 2, 3].map((linha) =>
        [0, 1, 2, 3].map((coluna) => (
          <line
            key={`${linha}-${coluna}`}
            x1={coluna * 14 + 2}
            y1={linha * 11 + 1}
            x2={coluna * 14 + 7}
            y2={linha * 11 + 9}
            stroke={cor}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        )),
      )}
    </svg>
  );
}

/** Malha de pontinhos — o outro grafismo da caixa. */
function Pontos({ className, cor = "var(--color-ink)" }: { className?: string; cor?: string }) {
  return (
    <svg viewBox="0 0 56 40" className={className}>
      {[0, 1, 2, 3].map((linha) =>
        [0, 1, 2, 3].map((coluna) => (
          <circle
            key={`${linha}-${coluna}`}
            cx={coluna * 14 + 6}
            cy={linha * 11 + 5}
            r="1.9"
            fill={cor}
          />
        )),
      )}
    </svg>
  );
}

/**
 * As formas orgânicas da embalagem. Todas ancoradas nas bordas do cartão: o
 * conteúdo mora no meio, então nenhuma mancha de cor passa por baixo de texto.
 */
function Grafismos() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Canto superior esquerdo — verde com eco de linha fina */}
      <svg viewBox="0 0 240 240" className="absolute -top-px -left-px w-[52%] max-w-[300px]">
        <path
          d="M0 0 H164 C160 44 128 66 96 82 C64 98 46 126 52 156 C58 184 34 208 0 220 Z"
          fill="var(--color-olive-deep)"
        />
        <path
          d="M186 6 C176 52 146 78 112 96 C80 112 66 138 72 168 C77 194 56 220 14 236"
          stroke="var(--color-ink)"
          strokeOpacity="0.35"
          strokeWidth="1.4"
          fill="none"
        />
      </svg>
      <Hachura className="absolute top-[12%] left-[30%] w-[13%] max-w-[74px] opacity-70" />

      {/* Canto superior direito — marrom com pontinhos */}
      <svg viewBox="0 0 240 240" className="absolute -top-px -right-px w-[46%] max-w-[280px]">
        <path
          d="M240 0 V118 C202 110 180 86 170 56 C161 30 140 12 110 6 C142 0 190 0 240 0 Z"
          fill="var(--color-tan)"
        />
        <path
          d="M240 150 C214 146 196 132 186 112 C178 96 164 86 146 84"
          stroke="var(--color-ink)"
          strokeOpacity="0.3"
          strokeWidth="1.4"
          fill="none"
        />
      </svg>
      <Pontos
        className="absolute top-[6%] right-[30%] w-[12%] max-w-[70px] opacity-60"
        cor="var(--color-olive-deep)"
      />

      {/* Canto inferior esquerdo — verde, rosa por cima */}
      <svg viewBox="0 0 240 240" className="absolute -bottom-px -left-px w-[44%] max-w-[270px]">
        <path
          d="M0 240 V126 C36 132 58 154 68 182 C76 204 96 220 124 226 C92 236 42 240 0 240 Z"
          fill="var(--color-olive-deep)"
        />
        <path
          d="M46 74 C64 68 82 78 86 96 C90 114 78 130 60 132 C42 134 28 120 28 102 C28 88 34 78 46 74 Z"
          fill="var(--color-blush)"
        />
      </svg>
      <Hachura
        className="absolute bottom-[16%] left-[26%] w-[12%] max-w-[70px] opacity-60"
        cor="var(--color-olive-deep)"
      />

      {/* Canto inferior direito — a mancha verde maior */}
      <svg viewBox="0 0 240 240" className="absolute -right-px -bottom-px w-[54%] max-w-[310px]">
        <path
          d="M240 240 H62 C68 200 96 178 132 164 C168 150 188 122 182 92 C176 60 200 34 240 24 Z"
          fill="var(--color-olive-deep)"
        />
        <path
          d="M24 236 C34 198 62 174 100 160 C136 146 156 118 150 86 C145 58 164 32 200 18"
          stroke="var(--color-ink)"
          strokeOpacity="0.3"
          strokeWidth="1.4"
          fill="none"
        />
      </svg>
      <Pontos
        className="absolute right-[8%] bottom-[26%] w-[12%] max-w-[70px] opacity-50"
        cor="var(--color-cream)"
      />

      {/* Respingos de cor nas laterais */}
      <svg viewBox="0 0 80 80" className="absolute top-[46%] -left-px w-[9%] max-w-[54px]">
        <path
          d="M0 10 C24 4 44 16 46 38 C48 58 32 74 10 76 C4 76 2 74 0 72 Z"
          fill="var(--color-blush)"
        />
      </svg>
      <svg viewBox="0 0 80 80" className="absolute top-[58%] -right-px w-[10%] max-w-[58px]">
        <path
          d="M80 8 C56 2 34 16 32 38 C30 60 48 76 74 78 C77 78 79 76 80 74 Z"
          fill="var(--color-tan)"
        />
      </svg>
    </div>
  );
}

/** Seção 8 — venha nos visitar: o cartão reproduz a caixa das fatias. */
export default function Localizacao() {
  const rootRef = useRef<HTMLDivElement>(null);

  // O iframe do Google Maps engole os eventos de roda: com o ponteiro em cima
  // dele, o Lenis para de receber scroll e a página trava enquanto o mapa tenta
  // dar zoom. Ele começa inerte e só ganha interação depois de um clique
  // deliberado, voltando a ser inerte quando o ponteiro sai.
  const [mapaAtivo, setMapaAtivo] = useState(false);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      gsap.fromTo(
        ".loc-caixa",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 78%" },
        },
      );

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
    <section id="localizacao" ref={rootRef} className="bg-olive-deep px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="loc-caixa relative overflow-hidden rounded-[1.75rem] border-2 border-white bg-cream px-6 py-16 sm:px-10 md:rounded-[2.5rem] md:px-16 md:py-24">
          <Grafismos />

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <span className="loc-item font-mono mb-8 block text-[10px] tracking-[0.3em] text-ink/50 uppercase">
              Onde estamos
            </span>

            <div className="loc-item">
              <span
                className="font-script block leading-[0.95] text-olive-deep"
                style={{ fontSize: "clamp(62px, 11vw, 132px)" }}
              >
                {SITE.nome}
              </span>
              <span className="font-mono mt-1 block text-[10px] tracking-[0.42em] text-olive-deep/80 uppercase sm:text-xs">
                Confeitaria
              </span>
            </div>

            <h2 className="loc-item font-display mt-7 text-2xl leading-snug text-ink/75 italic md:text-3xl">
              Venha nos visitar
            </h2>

            <div className="mt-14 grid gap-10 text-left sm:grid-cols-2 sm:gap-12">
              <div className="loc-item">
                <span className="font-mono mb-3 block text-[10px] tracking-[0.22em] text-olive-deep/60 uppercase">
                  Endereço
                </span>
                <address className="font-display text-xl leading-snug text-ink not-italic md:text-2xl">
                  {SITE.endereco.rua}
                  <br />
                  {SITE.endereco.bairro} — {SITE.endereco.cidade}/{SITE.endereco.uf}
                </address>
              </div>

              <div className="loc-item">
                <span className="font-mono mb-3 block text-[10px] tracking-[0.22em] text-olive-deep/60 uppercase">
                  Horários
                </span>
                <div className="border-t border-ink/15">
                  {SITE.horarios.map((h) => (
                    <div
                      key={h.dias}
                      className="flex items-baseline justify-between gap-5 border-b border-ink/15 py-3"
                    >
                      <span className="font-body text-[14px] text-ink/70">{h.dias}</span>
                      <span className="font-mono text-[11px] tracking-[0.14em] text-olive-deep">
                        {h.horas}
                      </span>
                    </div>
                  ))}
                </div>
                <EstadoLoja className="mt-4 text-ink/60" />
              </div>
            </div>

            <div className="loc-item mt-12 flex flex-wrap justify-center gap-3">
              <a
                href={SITE.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono rounded-full bg-olive-deep px-7 py-4 text-[10px] font-bold tracking-[0.22em] text-gold uppercase transition-colors duration-300 hover:bg-olive"
              >
                Como chegar
              </a>
              <a
                href={SITE.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono rounded-full border border-olive-deep/30 px-7 py-4 text-[10px] font-bold tracking-[0.22em] text-olive-deep uppercase transition-colors duration-300 hover:border-olive-deep hover:bg-olive-deep hover:text-gold"
              >
                WhatsApp
              </a>
              <a
                href={SITE.ifood}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono rounded-full border border-olive-deep/30 px-7 py-4 text-[10px] font-bold tracking-[0.22em] text-olive-deep uppercase transition-colors duration-300 hover:border-olive-deep hover:bg-olive-deep hover:text-gold"
              >
                Pedir no iFood
              </a>
            </div>
          </div>
        </div>

        <div
          className="loc-mapa relative mt-5 min-h-[340px] overflow-hidden rounded-[1.75rem] border border-cream/15 md:mt-6 md:min-h-[420px] md:rounded-[2.5rem]"
          onMouseLeave={() => setMapaAtivo(false)}
        >
          <iframe
            src={SITE.mapsEmbed}
            title="Mapa com a localização da Dalami Confeitaria"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className={`absolute inset-0 h-full w-full ${mapaAtivo ? "" : "pointer-events-none"}`}
            style={{ border: 0, filter: "grayscale(0.25) contrast(1.05)" }}
          />

          {!mapaAtivo && (
            <button
              type="button"
              onClick={() => setMapaAtivo(true)}
              className="group absolute inset-0 z-10 flex cursor-pointer items-end justify-center pb-6"
              aria-label="Ativar o mapa para arrastar e ampliar"
            >
              <span className="font-mono rounded-full bg-olive-deep/85 px-5 py-3 text-[10px] font-bold tracking-[0.2em] text-cream uppercase backdrop-blur-sm transition-colors duration-300 group-hover:bg-olive-deep">
                Clique para usar o mapa
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
