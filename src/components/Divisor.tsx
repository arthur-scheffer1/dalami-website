"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/use-iso-layout-effect";

/**
 * Fio que separa as fotos: um escorrido de ganache traçado à mão, com os
 * pontinhos e tracinhos impressos na caixa das fatias.
 *
 * A linha se desenha da esquerda para a direita ao entrar na tela. O truque é
 * `pathLength="1"`: ele normaliza o comprimento do traço para 1, então o
 * dasharray funciona sem ninguém precisar medir o caminho em JavaScript — e
 * continua certo se a curva mudar depois.
 */
export default function Divisor({ className = "" }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const prefereMenos = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.fromTo(
        ".divisor-fio",
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: prefereMenos ? 0.3 : 1.6,
          ease: "power2.inOut",
          scrollTrigger: { trigger: rootRef.current, start: "top 88%" },
        },
      );

      gsap.fromTo(
        ".divisor-enfeite",
        { opacity: 0, scale: 0.4 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "back.out(2)",
          scrollTrigger: { trigger: rootRef.current, start: "top 84%" },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className={`flex items-center justify-center ${className}`} aria-hidden>
      <svg
        viewBox="0 0 1200 80"
        fill="none"
        className="w-full max-w-[1100px]"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Amplitudes irregulares de propósito: onda perfeita parece régua, e o
            que a marca usa na embalagem é traço de mão. */}
        <path
          className="divisor-fio"
          d="M8 44 C 96 18, 178 62, 268 42 C 352 24, 420 58, 508 46 C 588 35, 650 14, 742 34 C 832 54, 890 66, 980 48 C 1062 32, 1128 40, 1192 30"
          stroke="var(--color-olive)"
          strokeWidth="2.6"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
        />

        {/* Pingos escorrendo do fio, como calda prestes a cair */}
        <circle className="divisor-enfeite" cx="268" cy="42" r="4.5" fill="var(--color-olive)" />
        <circle className="divisor-enfeite" cx="742" cy="34" r="6" fill="var(--color-olive)" />
        <circle className="divisor-enfeite" cx="980" cy="48" r="3.5" fill="var(--color-tan)" />
        <circle className="divisor-enfeite" cx="508" cy="46" r="3" fill="var(--color-blush)" />

        {/* Tracinhos da embalagem, soltos acima e abaixo da linha */}
        {[
          [120, 16],
          [136, 12],
          [152, 18],
          [1050, 62],
          [1066, 58],
          [1082, 64],
        ].map(([x, y]) => (
          <line
            key={`${x}-${y}`}
            className="divisor-enfeite"
            x1={x}
            y1={y}
            x2={x + 7}
            y2={y + 11}
            stroke="var(--color-ink)"
            strokeOpacity="0.45"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
}
