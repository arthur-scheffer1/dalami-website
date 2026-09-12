"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { lenisRef as sharedLenisRef } from "@/lib/lenis-instance";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;
    sharedLenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Web fonts swapping in (next/font `display: swap`) reflow the page after
    // Lenis has already taken its initial height measurement, and its resize
    // observer only re-measures on a 250ms debounce. Force an immediate
    // re-measure once fonts settle so early scroll/ScrollTrigger math isn't
    // based on a shorter, pre-swap page.
    document.fonts.ready.then(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      sharedLenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
