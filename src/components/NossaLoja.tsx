"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { revelaAoEntrar } from "@/lib/anima";
import { useIsoLayoutEffect } from "@/lib/use-iso-layout-effect";
import { SITE } from "@/lib/site";

/**
 * Seção "Nossa loja" — o ambiente, o mural e a fachada.
 *
 * FALTA UMA FOTO: não existe foto da FACHADA na pasta `public/images`. O
 * terceiro quadro abaixo está montado e esperando por ela; hoje mostra a
 * vitrine no lugar. Quando a foto da placa verde-água entrar, é trocar o
 * `src` e o `alt` do quadro marcado com "// TROCAR PELA FACHADA".
 */
export default function NossaLoja() {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          ".loja-item",
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: rootRef.current, start: "top 76%" },
          },
        );
      });

      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>(".loja-item").forEach((el) => {
          revelaAoEntrar(el, { opacity: 0, y: 18 }, { trigger: el, start: "top 92%", duration: 0.6 });
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      /* O rosa da caixa de viagem: quebra a sequência de seções em creme sem
         recorrer de novo ao verde escuro, que já carrega o bolo herói e os
         brigadeiros. */
      className="bg-blush-suave py-12 md:py-20"
    >
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="loja-item mb-10 max-w-2xl md:mb-14">
          <span className="font-mono mb-4 block text-[12px] font-bold tracking-[0.28em] text-olive-texto uppercase">
            Nossa loja
          </span>
          <h2
            className="font-display leading-[1.05] tracking-tight text-ink"
            style={{ fontSize: "clamp(34px, 5.5vw, 68px)" }}
          >
            Entra, senta e fica
          </h2>
          <p className="font-body mt-5 max-w-lg text-[17px] leading-relaxed text-ink/70">
            Um salão claro no meio dos {SITE.endereco.bairro}, com mural pintado à mão,
            café na xícara e a vitrine cheia desde cedo.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-12 md:gap-5">
          <figure className="loja-item relative col-span-full overflow-hidden rounded-[1.75rem] md:col-span-7">
            <div className="relative aspect-[4/3] md:aspect-[4/3]">
              <Image
                src="/images/salao-dalami.jpg"
                alt="Salão da Dalami, com o mural colorido pintado na parede e mesas de madeira clara"
                fill
                sizes="(max-width: 768px) 100vw, 58vw"
                className="object-cover"
              />
            </div>
          </figure>

          <div className="col-span-full grid gap-4 md:col-span-5 md:gap-5">
            <figure className="loja-item relative overflow-hidden rounded-[1.75rem]">
              <div className="relative aspect-[4/3] md:aspect-[16/11]">
                <Image
                  src="/images/vitrine.jpg"
                  alt="Vitrine da Dalami com bolos e tortas em fatias"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </figure>

            {/* TROCAR PELA FACHADA — não há foto da placa verde-água na pasta
                de imagens. Enquanto não houver, este quadro mostra a caixa da
                marca, que também é identidade; o alt muda junto com a foto. */}
            <figure className="loja-item relative overflow-hidden rounded-[1.75rem]">
              <div className="relative aspect-[4/3] md:aspect-[16/11]">
                <Image
                  src="/images/caixa-rosa.jpg"
                  alt="Caixa da Dalami com uma fatia de bolo"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
