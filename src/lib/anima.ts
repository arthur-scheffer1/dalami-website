"use client";

import { gsap } from "@/lib/gsap";

/**
 * Revela um elemento quando ele próprio entra na tela.
 *
 * Usado nas telas estreitas. No desktop as seções usam uma timeline com scrub
 * presa ao topo da seção, o que funciona porque o conteúdo cabe em pouca
 * altura. No celular tudo empilha, o conteúdo fica muito abaixo desse topo e a
 * animação terminaria antes de a pessoa chegar nele — por isso aqui cada bloco
 * tem o seu próprio gatilho.
 *
 * O estado inicial vive no tween (fromTo), nunca no HTML: assim, se o GSAP não
 * rodar, o conteúdo permanece visível em vez de sumir.
 */
export function revelaAoEntrar(
  alvo: gsap.TweenTarget,
  de: gsap.TweenVars,
  opts: { trigger?: gsap.DOMTarget; start?: string } & gsap.TweenVars = {},
) {
  const { trigger, start = "top 90%", ...resto } = opts;

  return gsap.fromTo(alvo, de, {
    opacity: 1,
    x: 0,
    y: 0,
    duration: 0.7,
    ease: "power3.out",
    ...resto,
    scrollTrigger: {
      trigger: trigger ?? (alvo as gsap.DOMTarget),
      start,
    },
  });
}
