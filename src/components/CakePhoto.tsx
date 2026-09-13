"use client";

import { useEffect, useRef, useState } from "react";
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
  const [carregada, setCarregada] = useState(false);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    // Quem pede menos movimento perde amplitude, não o efeito: desligar tudo
    // aqui deixava o bolo parado para qualquer um com "reduzir movimento"
    // ativado no sistema.
    const prefereMenos = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const forca = prefereMenos ? 0.35 : 1;

    // Sem ponteiro fino (celular e tablet) não existe cursor para seguir, e o
    // bolo ficaria completamente parado. Nesses aparelhos ele balança sozinho,
    // devagar, em vez de perseguir alguma coisa.
    const semCursor = window.matchMedia("(hover: none)").matches;

    const alvo = { x: 0, y: 0 };
    const atual = { x: 0, y: 0 };

    const onPointerMove = (e: PointerEvent) => {
      // -1..1 em relação ao centro da janela
      alvo.x = (e.clientX / window.innerWidth) * 2 - 1;
      alvo.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!semCursor) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    const inicio = performance.now();
    let raf = 0;
    const animar = () => {
      raf = requestAnimationFrame(animar);

      if (semCursor) {
        const t = (performance.now() - inicio) / 1000;
        alvo.x = Math.sin(t * 0.45) * 0.5;
        alvo.y = Math.sin(t * 0.31) * 0.28;
      }

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
          onLoad={() => setCarregada(true)}
          /* A sombra só entra depois que a imagem decodifica. drop-shadow segue
             o canal alpha; sem bitmap decodificado não há alpha, e o navegador
             projeta a sombra da CAIXA do elemento — um retângulo escuro em volta
             do bolo, visível só na primeira visita, antes de o arquivo entrar em
             cache. */
          className={`h-auto w-full transition-[filter] duration-500 ${
            carregada ? "drop-shadow-[0_40px_45px_rgba(27,19,16,0.28)]" : ""
          }`}
        />
      </div>
    </div>
  );
}
