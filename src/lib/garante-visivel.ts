"use client";

import { gsap } from "@/lib/gsap";

/**
 * Rede de segurança para texto que entra por animação.
 *
 * O problema: `gsap.from` e `fromTo` aplicam o estado inicial na hora, por
 * estilo embutido. Se a animação não terminar — fonte que demora e desloca a
 * medição, ScrollTrigger cujo gatilho nunca é alcançado porque a altura da
 * página mudou, erro em qualquer ponto entre o começo e o fim — o elemento
 * fica com `opacity: 0` para sempre. Foi o que fazia o título "Cardápio"
 * aparecer vazio.
 *
 * A solução não é tirar a animação: é garantir que, passado o tempo em que
 * ela deveria ter acabado, o que estiver invisível volte a aparecer. Quem
 * animou normalmente já está em opacidade 1 e não é tocado.
 *
 * Devolve a função de limpeza, para o efeito do React cancelar o relógio ao
 * desmontar.
 */
export function garanteVisivel(seletor: string, ms = 2600) {
  const relogio = setTimeout(() => {
    const alvos = document.querySelectorAll<HTMLElement>(seletor);
    for (const alvo of alvos) {
      // Lê o valor computado, não o embutido: o elemento pode estar invisível
      // por causa de um pai animado, e nesse caso quem precisa de socorro é o
      // pai — mexer no filho não resolveria e ainda atrapalharia.
      if (parseFloat(getComputedStyle(alvo).opacity) < 0.05) {
        gsap.set(alvo, { clearProps: "opacity,transform,visibility" });
      }
    }
  }, ms);

  return () => clearTimeout(relogio);
}
