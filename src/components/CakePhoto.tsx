"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * Bolo real do hero: foto recortada (PNG com fundo transparente) que se inclina
 * em direção ao cursor, com perspectiva — a mesma sensação de "olhar para o
 * ponteiro" do modelo 3D, porém com bolo de verdade.
 *
 * A inclinação persegue o alvo com amortecimento (não salta até ele) e é
 * aplicada direto no style, fora do React, para não re-renderizar a cada frame.
 * Quem tem prefers-reduced-motion recebe amplitude reduzida, não foto parada.
 */
export default function CakePhoto({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    // Mesmo critério do antigo Cake3D: quem pede menos movimento perde a
    // amplitude, não o efeito. Desligar tudo aqui deixava o bolo parado para
    // qualquer um com "reduzir movimento" ativado no sistema.
    const prefereMenos = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const forca = prefereMenos ? 0.35 : 1;

    const alvo = { x: 0, y: 0 };
    const atual = { x: 0, y: 0 };

    const onPointerMove = (e: PointerEvent) => {
      // -1..1 em relação ao centro da janela
      alvo.x = (e.clientX / window.innerWidth) * 2 - 1;
      alvo.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let raf = 0;
    const animar = () => {
      raf = requestAnimationFrame(animar);

      atual.x += (alvo.x - atual.x) * 0.06;
      atual.y += (alvo.y - atual.y) * 0.06;

      // Giro horizontal mais solto que a inclinação vertical: virar demais para
      // cima ou para baixo denuncia que é uma foto plana.
      const rotY = atual.x * 16 * forca;
      const rotX = -atual.y * 8 * forca;
      const deslocX = atual.x * 12 * forca;

      inner.style.transform = `perspective(1100px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate3d(${deslocX}px, 0, 0)`;
    };
    animar();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div ref={wrapRef} className={className}>
      {/* Dimensões explícitas em vez de `fill`: com `fill` a altura dependia de
          uma cascata de percentuais (aspect-square -> h-full -> h-full), e se
          qualquer elo não resolvesse, a imagem virava 0px e sumia em silêncio. */}
      <div
        ref={innerRef}
        className="w-full will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <Image
          src={src}
          alt={alt}
          width={734}
          height={720}
          priority
          /* A caixa nunca passa de 380px — pedir 520px servia imagem maior que
             o necessário em toda tela grande. */
          sizes="(max-width: 640px) 60vw, 380px"
          className="h-auto w-full drop-shadow-[0_40px_45px_rgba(27,19,16,0.28)]"
        />
      </div>
    </div>
  );
}
