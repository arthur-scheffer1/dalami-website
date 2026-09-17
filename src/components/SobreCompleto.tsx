"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { revelaAoEntrar } from "@/lib/anima";
import { useIsoLayoutEffect } from "@/lib/use-iso-layout-effect";
import { SITE } from "@/lib/site";

/**
 * ⚠️ PÁGINA SOBRE — TEXTO PROVISÓRIO.
 *
 * Fatos verificados: a Cafeteria e Confeitaria Dalami foi registrada em
 * 05/03/2024, tem como proprietária Milena Dalathea da Silva e fica na
 * Rod. João Gualberto Soares, 118, nos Ingleses. Tudo o que vai além disso
 * nos parágrafos abaixo é RASCUNHO escrito por mim para dar forma à página —
 * precisa ser substituído pela história real antes de publicar.
 */
const PARAGRAFOS_RASCUNHO = [
  "A Dalami começou em março de 2024, com Milena Dalathea à frente e uma convicção simples: bolo bom não tem pressa. Massa, recheio e cobertura feitos no mesmo dia, na própria loja.",
  "Hoje a vitrine da Rod. João Gualberto Soares reúne mais de vinte sabores — dos clássicos que saem todo dia aos lançamentos da linha premium — além dos bolos inteiros que saem por encomenda para as datas de quem mora nos Ingleses.",
  "A régua continua a mesma do primeiro dia: recheio generoso, decoração tradicional bem feita e nada de atalho.",
];

const VALORES = [
  { n: "01", titulo: "Feito à mão", texto: "Produção diária na própria loja, sem terceirizar receita." },
  { n: "02", titulo: "Recheio generoso", texto: "Camada farta — a fatia tem que valer o corte." },
  { n: "03", titulo: "Decoração tradicional", texto: "Acabamento clássico da casa, bem executado." },
];

export default function SobreCompleto() {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      // A palavra sobe inteira, nunca letra a letra: é o desenho do logo, e
      // separá-lo em caracteres quebraria as ligações da cursiva.
      gsap.from(".sobre-word", { yPercent: 108, duration: 1.1, ease: "power4.out" });
      gsap.from(".sobre-artigo", { opacity: 0, y: 18, duration: 0.8, delay: 0.15, ease: "power3.out" });

      gsap.fromTo(
        ".sobre-p",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: { trigger: ".sobre-texto", start: "top 78%" },
        },
      );

      gsap.utils.toArray<HTMLElement>(".sobre-img").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.2,
            ease: "power4.inOut",
            scrollTrigger: { trigger: el, start: "top 82%" },
          },
        );
      });

      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          ".sobre-valor",
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: ".sobre-valores", start: "top 80%" },
          },
        );
      });

      // Celular: os três valores empilham; cada um espera a própria vez.
      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>(".sobre-valor").forEach((valor) => {
          revelaAoEntrar(valor, { opacity: 0, y: 24 }, { trigger: valor, start: "top 92%", duration: 0.6 });
        });
      });

    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="bg-cream">
      <header className="mx-auto max-w-[1400px] px-6 pt-36 pb-16 md:pt-44 md:pb-24">
        <span className="font-mono mb-5 block text-[10px] tracking-[0.3em] text-olive uppercase">
          Sobre nós
        </span>
        {/* "Dalami" é o logo real vetorizado, não uma fonte parecida — entra
            como máscara CSS, do mesmo jeito que no hero da home, então o
            arquivo fica cacheado à parte e a cor continua vindo do CSS.
            O "A" fica na cursiva do cardápio: o vetor só tem a palavra
            Dalami, e é a fonte mais próxima do lettering dela. */}
        <h1 aria-label="A Dalami" className="flex items-end gap-3 md:gap-5">
          <span
            aria-hidden
            className="sobre-artigo font-script leading-none text-olive"
            style={{ fontSize: "clamp(34px, 5vw, 86px)" }}
          >
            A
          </span>
          <span className="block flex-1 overflow-hidden">
            <span
              className="sobre-word block w-full max-w-[980px] bg-olive"
              style={{
                aspectRatio: "557 / 130",
                maskImage: "url(/images/dalami-wordmark.svg)",
                WebkitMaskImage: "url(/images/dalami-wordmark.svg)",
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "left bottom",
                WebkitMaskPosition: "left bottom",
              }}
            />
          </span>
        </h1>
      </header>

      <section className="mx-auto grid max-w-[1400px] gap-14 px-6 pb-24 md:grid-cols-2 md:gap-20">
        <div className="sobre-img relative aspect-[4/5] overflow-hidden rounded-[2rem]">
          <Image
            src="/images/vitrine.jpg"
            alt="Vitrine da Dalami Confeitaria, nos Ingleses"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="sobre-texto self-center">
          {PARAGRAFOS_RASCUNHO.map((p) => (
            <p key={p} className="sobre-p font-body mb-6 text-[17px] leading-relaxed text-ink/70">
              {p}
            </p>
          ))}
          <p className="sobre-p font-display mt-4 text-2xl text-olive italic">{SITE.slogan}.</p>
        </div>
      </section>

      <section className="sobre-valores border-y border-ink/12 bg-sand/40 py-20">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-6 md:grid-cols-3">
          {VALORES.map((v) => (
            <div key={v.n} className="sobre-valor">
              <span className="font-mono block text-[10px] tracking-[0.24em] text-olive">{v.n}</span>
              <h2 className="font-display mt-3 mb-3 text-2xl text-ink">{v.titulo}</h2>
              <p className="font-body text-[15px] leading-relaxed text-ink/60">{v.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-24">
        {/* Escalonadas em vez de lado a lado no mesmo tamanho: duas fotos
            iguais e coladas leem como erro de diagramação. Proporções e alturas
            diferentes dão respiro e hierarquia — a primeira manda. */}
        <div className="grid items-end gap-8 md:grid-cols-12 md:gap-12">
          <div className="sobre-img relative aspect-[4/5] overflow-hidden rounded-[2rem] md:col-span-7">
            <Image
              src="/images/caixa-rosa.jpg"
              alt="Caixa da Dalami com uma fatia de bolo de chocolate"
              fill
              sizes="(max-width: 768px) 100vw, 58vw"
              className="object-cover"
            />
          </div>
          <div className="sobre-img relative aspect-square overflow-hidden rounded-[2rem] md:col-span-5 md:mb-20">
            <Image
              src="/images/bolo-chocolate-inteiro.jpg"
              alt="Bolo de chocolate inteiro da Dalami, coberto de ganache e brigadeiros"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <p
            className="font-poster leading-[0.95] tracking-tight text-ink uppercase"
            style={{ fontSize: "clamp(28px, 4vw, 56px)" }}
          >
            Venha experimentar
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/cardapio"
              className="font-mono rounded-full bg-olive px-7 py-4 text-[10px] font-bold tracking-[0.22em] text-gold uppercase transition-colors duration-300 hover:bg-olive-deep"
            >
              Ver cardápio
            </Link>
            <Link
              href="/#localizacao"
              className="font-mono rounded-full border border-ink/25 px-7 py-4 text-[10px] font-bold tracking-[0.22em] text-ink uppercase transition-colors duration-300 hover:border-olive hover:text-olive"
            >
              Como chegar
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
