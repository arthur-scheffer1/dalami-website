"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect no navegador, useEffect na renderização do servidor.
 *
 * As animações precisam definir o estado inicial ANTES da primeira pintura;
 * com useEffect comum o conteúdo aparece por um quadro e só então é escondido,
 * o que pisca. useLayoutEffect direto, por sua vez, emite aviso no servidor —
 * daí a troca condicional.
 */
export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
