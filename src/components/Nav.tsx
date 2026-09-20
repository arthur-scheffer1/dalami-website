"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PAGINAS, SITE } from "@/lib/site";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [rolou, setRolou] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // O menu passou a acompanhar a rolagem: no cardápio, que é longo, ele antes
  // sumia no topo e só voltava se a pessoa rolasse tudo de volta. Ganha fundo
  // quando sai do topo, para não ficar boiando sobre o conteúdo.
  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha o menu mobile ao tocar fora dele, não só no botão.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (toggleRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <header
      className={`area-segura-topo fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        rolou || open
          ? "border-b border-ink/10 bg-cream/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        /* Sem o teto de 1400px: preso a ele, o logo e o menu paravam a meio
           caminho da borda em tela larga e sobrava um vao morto dos dois
           lados. Aqui a barra ocupa a largura toda e o respiro vem do recuo,
           que cresce com a tela. O conteudo das secoes segue capado em
           1400px — e' a barra que vai ate a ponta, de proposito. */
        className={`flex w-full items-center justify-between px-6 transition-all duration-300 md:px-10 lg:px-14 ${
          rolou ? "py-3" : "py-5"
        }`}
      >
        <Link href="/" className="-m-2 flex items-center gap-2.5 p-2">
          {/* Vetor em vez do PNG: a 36px o raster vinha embaçado, com os
              artefatos do JPG de origem. O círculo já vem no desenho, então
              não precisa de rounded-full. `unoptimized` porque o otimizador do
              Next recusa SVG sem liberar `dangerouslyAllowSVG`. */}
          <Image
            src="/images/logo-dalami.svg"
            alt=""
            width={100}
            height={100}
            unoptimized
            priority
            className="h-9 w-9"
          />
          {/* Mesmo vetor do hero. O nome fica em sr-only porque aqui ele é
              desenho, não texto — sem isso o link do logo ficaria sem rótulo. */}
          <span
            aria-hidden
            className="block h-[18px] w-[77px] bg-olive"
            style={{
              maskImage: "url(/images/dalami-wordmark.svg)",
              WebkitMaskImage: "url(/images/dalami-wordmark.svg)",
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
            }}
          />
          <span className="sr-only">{SITE.nome}</span>
          <span className="font-mono mt-1 hidden text-[8px] tracking-[0.3em] text-ink/50 uppercase sm:inline">
            Confeitaria
          </span>
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {PAGINAS.map((p) => {
            const isActive = !p.href.includes("#") && pathname === p.href;
            return (
              <li key={p.href}>
                <Link
                  href={p.href}
                  scroll={!p.href.includes("#")}
                  className={`font-mono -m-2 inline-block p-2 text-[10px] font-bold tracking-[0.22em] uppercase transition-colors duration-300 hover:text-olive ${
                    isActive ? "text-olive" : "text-ink/65"
                  }`}
                >
                  {p.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          ref={toggleRef}
          aria-label="Menu"
          aria-expanded={open}
          className="flex flex-col gap-1.5 p-3 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block h-0.5 w-6 origin-center bg-ink transition-all duration-200 ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-ink transition-all duration-200 ${open ? "scale-x-0 opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 origin-center bg-ink transition-all duration-200 ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      <div
        ref={menuRef}
        className={`overflow-hidden transition-all duration-300 md:hidden ${open ? "max-h-96" : "max-h-0"}`}
      >
        <div className="border-t border-ink/10 bg-cream/98 px-6 pt-2 pb-6">
          {PAGINAS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              scroll={!p.href.includes("#")}
              onClick={() => setOpen(false)}
              className="font-mono flex items-center border-b border-ink/10 py-4 text-xs font-bold tracking-[0.2em] text-ink/75 uppercase"
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
