"use client";

import { useEffect, useState } from "react";
import { estadoDaLoja, type EstadoLoja as Estado } from "@/lib/horario";

/**
 * Ponto verde ou cinza com "Aberto até 20h" / "Fechado · abre 12h".
 *
 * Só calcula depois de montar, e renderiza nada antes disso: o servidor não
 * sabe que horas são no navegador de quem acessa, e qualquer diferença entre
 * os dois estouraria a hidratação. Reavalia a cada minuto para não mentir para
 * quem deixa a aba aberta na virada do horário.
 */
export default function EstadoLoja({ className = "" }: { className?: string }) {
  const [estado, setEstado] = useState<Estado | null>(null);

  useEffect(() => {
    const avaliar = () => setEstado(estadoDaLoja());
    avaliar();
    const id = setInterval(avaliar, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!estado) return null;

  const { aberto, hora, outroDia } = estado;

  return (
    <span className={`font-mono inline-flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase ${className}`}>
      <span className="relative flex h-2 w-2 shrink-0">
        {aberto && (
          /* O anel nasce maior que o ponto: partindo dos mesmos 8px o pulso
             quase não se percebe, porque o ping dobra de tamanho e some. */
          <span className="absolute -inset-[3px] animate-ping rounded-full bg-olive opacity-60" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${aberto ? "bg-olive" : "bg-alerta"}`}
        />
      </span>
      {aberto ? (
        `Aberto até ${hora}h`
      ) : (
        <>
          {/* Só a palavra fica vermelha: pintar a frase inteira transformaria
              o horário de abertura, que é a informação útil, em alarme. */}
          <span className="text-alerta">Fechado</span>
          <span> · abre {outroDia ? "amanhã " : ""}{hora}h</span>
        </>
      )}
    </span>
  );
}
