"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { revelaAoEntrar } from "@/lib/anima";
import { useIsoLayoutEffect } from "@/lib/use-iso-layout-effect";
import { AVISO_DECORACAO, BRIGADEIROS, CATEGORIAS, TAMANHOS } from "@/lib/menu";
import PassoAPasso from "./PassoAPasso";
import { SITE } from "@/lib/site";
import Faixa from "./Faixa";

const ORDEM_TAMANHOS = ["P", "M", "G", "GG"] as const;

/** Nem todo bolo tem foto; os que têm acendem a foto atrás da própria linha. */
const FOTOS: Record<string, string> = {
  "Morango e Nutella": "/images/fatia-nutella-morango.jpg",
  "Bolo Dalami": "/images/bolo-chocolate.jpg",
  "Matilda Cake": "/images/calda-chocolate.jpg",
  "Bolo Catarina": "/images/vitrine.jpg",
  "Bolo de Pudim": "/images/cheesecake-red-velvet.jpg",
  "Red Velvet": "/images/cheesecake-red-velvet.jpg",
  "Torta Mineira": "/images/vitrine.jpg",
};

export default function CardapioCompleto() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [ativa, setAtiva] = useState<string>(CATEGORIAS[0].id);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText(".card-titulo", { type: "chars" });
      const mm = gsap.matchMedia();

      gsap.from(split.chars, {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.03,
      });
      gsap.from(".card-sub", { opacity: 0, y: 18, duration: 0.8, delay: 0.3, ease: "power3.out" });

      // Trilha lateral: marca a categoria que está sendo lida.
      CATEGORIAS.forEach((cat) => {
        ScrollTrigger.create({
          trigger: `#${cat.id}`,
          start: "top 40%",
          end: "bottom 40%",
          onEnter: () => setAtiva(cat.id),
          onEnterBack: () => setAtiva(cat.id),
        });
      });

      mm.add("(min-width: 768px)", () => {
        gsap.utils.toArray<HTMLElement>(".cat-bloco").forEach((bloco) => {
          gsap.fromTo(
            bloco.querySelectorAll(".cat-head"),
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: bloco, start: "top 78%" },
            },
          );
          gsap.fromTo(
            bloco.querySelectorAll(".cat-bolo"),
            { opacity: 0.05, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.07,
              ease: "power3.out",
              scrollTrigger: { trigger: bloco, start: "top 74%" },
            },
          );
        });
      });

      // Celular: cada linha espera a própria vez — a lista de um bloco ocupa
      // várias telas, e um gatilho único terminaria muito antes.
      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>(".cat-head").forEach((head) => {
          revelaAoEntrar(head, { opacity: 0, y: 20 }, { trigger: head, start: "top 92%", duration: 0.6 });
        });
        gsap.utils.toArray<HTMLElement>(".cat-bolo").forEach((linha) => {
          revelaAoEntrar(linha, { opacity: 0.05, y: 16 }, { trigger: linha, start: "top 94%", duration: 0.5 });

          const foto = linha.querySelector(".cat-bolo-foto");
          if (foto) {
            revelaAoEntrar(
              foto,
              { xPercent: 55, opacity: 0.2 },
              { trigger: linha, start: "top 94%", duration: 0.6, xPercent: 0, ease: "power2.out" },
            );
          }
        });
      });

      return () => split.revert();
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="bg-cream">
      {/* Cabeçalho: nome em cursiva, como no hero da home */}
      <header className="mx-auto max-w-[1400px] px-6 pt-36 pb-14 md:pt-44 md:pb-20">
        <span className="font-mono mb-6 block text-[10px] tracking-[0.3em] text-olive uppercase">
          Encomendas · {SITE.endereco.bairro}
        </span>
        <h1
          className="font-script leading-[1.05] text-olive"
          style={{ fontSize: "clamp(56px, 12vw, 180px)" }}
        >
          <span className="block overflow-hidden pb-[0.16em]">
            <span className="card-titulo inline-block">Cardápio</span>
          </span>
        </h1>
        <p className="card-sub font-poster mt-2 leading-[0.9] tracking-tight text-ink uppercase" style={{ fontSize: "clamp(26px, 4vw, 58px)" }}>
          Bolos inteiros
        </p>
        <p className="card-sub font-body mt-7 max-w-xl text-[17px] leading-relaxed text-ink/60">
          Receitas artesanais, recheios generosos e acabamento feito com cuidado em
          cada detalhe. {CATEGORIAS.reduce((n, c) => n + c.bolos.length, 0)} sabores, quatro tamanhos.
        </p>

        {/* Atalho para quem quer comer hoje: o cardápio desta página é de bolo
            inteiro por encomenda, com 2 dias de antecedência. A linha abaixo do
            botão existe para a pessoa não confundir as duas coisas. */}
        <div className="card-sub mt-9 flex flex-col items-start gap-3">
          <a
            href={SITE.ifood}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full bg-[#EA1D2C] px-7 py-4 text-white shadow-sm transition-transform duration-300 hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor" aria-hidden>
              <path d="M7 4h10a1 1 0 0 1 .97.76L18.3 7H21a1 1 0 1 1 0 2h-.3l-1.2 9.25A3 3 0 0 1 16.53 21H7.47a3 3 0 0 1-2.97-2.75L3.3 9H3a1 1 0 1 1 0-2h2.7l.33-2.24A1 1 0 0 1 7 4zm.87 3h8.26l-.2-1H8.07l-.2 1zM5.32 9l1.16 9a1 1 0 0 0 .99.88h9.06a1 1 0 0 0 .99-.88L18.68 9H5.32zm3.43 2.5a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0v-4zm4.5 0a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0v-4z" />
            </svg>
            <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase">
              Pedir no iFood
            </span>
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
              &rarr;
            </span>
          </a>
          <span className="font-mono max-w-sm text-[10px] leading-relaxed tracking-[0.16em] text-ink/45 uppercase">
            Fatias e doces com entrega hoje &middot; os bolos inteiros abaixo s&atilde;o por encomenda
          </span>
        </div>
      </header>

      <Faixa
        itens={[SITE.slogan, "Feito à mão", "Produção diária", "Ingleses · Florianópolis"]}
        className="bg-sand/40"
      />

      {/* Tamanhos */}
      <section className="border-b border-ink/10 bg-sand/40 py-16">
        <div className="mx-auto max-w-[1400px] px-6">
          <h2 className="font-mono mb-10 text-[10px] tracking-[0.3em] text-olive uppercase">
            O tamanho ideal para a sua ocasião
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TAMANHOS.map((t) => (
              <div key={t.sigla} className="rounded-2xl border border-ink/12 bg-cream p-7">
                <span className="font-poster block text-5xl leading-none text-olive">{t.sigla}</span>
                <span className="font-mono mt-4 block text-[10px] tracking-[0.18em] text-ink/50 uppercase">
                  {t.diametro}
                </span>
                <span className="font-display mt-2 block text-lg text-ink italic">{t.rende}</span>
              </div>
            ))}
          </div>
          <p className="font-body mt-8 text-sm text-ink/50">
            Os rendimentos são aproximados e podem variar conforme o corte de cada fatia.
          </p>
        </div>
      </section>

      {/* Categorias, com trilha lateral no desktop */}
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:py-28">
        <div className="gap-16 lg:grid lg:grid-cols-[200px_minmax(0,1fr)]">
          <nav aria-label="Categorias do cardápio" className="hidden lg:block">
            <div className="sticky top-28">
              <span className="font-mono mb-5 block text-[9px] tracking-[0.3em] text-ink/40 uppercase">
                Categorias
              </span>
              <ul className="flex flex-col gap-1 border-l border-ink/15">
                {CATEGORIAS.map((cat, i) => {
                  const atual = ativa === cat.id;
                  return (
                    <li key={cat.id}>
                      <a
                        href={`#${cat.id}`}
                        className={`-ml-px flex items-baseline gap-3 border-l-2 py-2 pl-4 transition-all duration-300 ${
                          atual
                            ? "border-olive text-olive"
                            : "border-transparent text-ink/45 hover:text-ink/80"
                        }`}
                      >
                        <span className="font-mono text-[9px] tracking-[0.2em]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-body text-[13px] leading-snug">{cat.titulo}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          <div>
            {CATEGORIAS.map((cat, i) => (
              <section key={cat.id} id={cat.id} className="cat-bloco mb-24 scroll-mt-28 last:mb-0">
                <div className="cat-head mb-10 flex items-start gap-5 md:gap-7">
                  <span className="font-poster shrink-0 text-4xl leading-none text-olive/25 md:text-6xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="max-w-2xl">
                    <h2
                      className="font-poster leading-[0.95] tracking-tight text-ink uppercase"
                      style={{ fontSize: "clamp(28px, 4.2vw, 56px)" }}
                    >
                      {cat.titulo}
                    </h2>
                    <p className="font-body mt-3 text-[15px] text-ink/55">{cat.subtitulo}</p>
                  </div>
                </div>

                <div className="relative border-t border-ink/15">
                  {cat.bolos.map((bolo) => (
                    <article
                      key={bolo.nome}
                      className="cat-bolo group relative isolate grid gap-4 border-b border-ink/15 py-8 pr-24 transition-colors duration-300 md:grid-cols-12 md:gap-8 md:px-4 md:pr-4 md:hover:bg-olive/5"
                    >
                      {/* Desktop: a foto acende atrás da própria linha, sem
                          empurrar nada — quem entra e sai é só opacidade. O
                          véu de creme por cima mantém o texto legível. */}
                      {FOTOS[bolo.nome] && (
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block"
                        >
                          <Image
                            src={FOTOS[bolo.nome]}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 0px, 1100px"
                            className="scale-105 object-cover transition-transform duration-[900ms] ease-out group-hover:scale-100"
                          />
                          <span className="absolute inset-0 block bg-gradient-to-r from-cream/92 via-cream/82 to-cream/70" />
                        </span>
                      )}

                      {/* Celular: não existe hover, então a miniatura entra
                          sozinha, presa na borda direita da linha e contida
                          na sua altura — discreta, sem empurrar o texto (o
                          espaço já está reservado pelo pr-24 do <article>) e
                          grande o bastante para acertar com o dedo. Desliza
                          de dentro da própria borda quando a linha entra na
                          tela (ver ScrollTrigger abaixo). */}
                      {FOTOS[bolo.nome] && (
                        <span
                          aria-hidden="true"
                          className="cat-bolo-foto pointer-events-none absolute top-1/2 right-4 h-20 w-20 -translate-y-1/2 overflow-hidden rounded-xl shadow-sm md:hidden"
                        >
                          <Image
                            src={FOTOS[bolo.nome]}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </span>
                      )}

                      <div className="md:col-span-5">
                        <h3 className="font-display flex flex-wrap items-center gap-3 text-2xl text-ink transition-transform duration-300 md:text-3xl md:group-hover:translate-x-1.5">
                          {bolo.nome}
                          {bolo.campeao && (
                            <span className="font-mono rounded-full bg-olive px-3 py-1.5 text-[8px] font-bold tracking-[0.18em] text-gold uppercase">
                              Campeão de vendas
                            </span>
                          )}
                        </h3>
                      </div>

                      <p className="font-body text-[15px] leading-relaxed text-ink/60 md:col-span-4">
                        {bolo.descricao}
                        {bolo.obs && (
                          <span className="font-mono mt-2 block text-[10px] tracking-[0.14em] text-olive uppercase">
                            {bolo.obs}
                          </span>
                        )}
                      </p>

                      <div className="flex flex-wrap items-start gap-x-5 gap-y-2 md:col-span-3 md:justify-end">
                        {ORDEM_TAMANHOS.filter((t) => bolo.precos[t] != null).map((t) => (
                          <span
                            key={t}
                            className="rounded-lg border border-ink/10 px-2.5 py-1.5 text-right transition-colors duration-300 group-hover:border-olive/30"
                          >
                            <span className="font-mono block text-[9px] tracking-[0.2em] text-ink/40 uppercase">
                              {t}
                            </span>
                            <span className="font-mono text-sm text-olive">R$ {bolo.precos[t]}</span>
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* Brigadeiros */}
      <section className="bg-olive-deep py-20 md:py-28">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 md:grid-cols-2 md:gap-20">
          <div>
            <span className="font-mono mb-4 block text-[10px] tracking-[0.3em] text-gold uppercase">
              Para completar a mesa
            </span>
            <h2 className="font-script mb-6 leading-[1.05] text-gold" style={{ fontSize: "clamp(46px, 7vw, 96px)" }}>
              Brigadeiros
            </h2>
            <p className="font-body mb-8 max-w-md text-[16px] leading-relaxed text-cream/70">
              {BRIGADEIROS.descricao}
            </p>
            <p className="font-poster mb-3 text-3xl text-cream uppercase md:text-4xl">
              {BRIGADEIROS.preco}
            </p>
            <p className="font-body max-w-md text-sm leading-relaxed text-cream/55">
              {BRIGADEIROS.minimo}
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-x-8 self-center border-t border-cream/15">
            {BRIGADEIROS.sabores.map((s) => (
              <li
                key={s}
                className="font-body border-b border-cream/15 py-3.5 text-[15px] text-cream/80"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Como encomendar */}
      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto grid max-w-[1400px] gap-14 px-6 md:grid-cols-2 md:gap-20">
          <div>
            <PassoAPasso nivel="h2" />
            <a
              href={SITE.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono mt-10 inline-flex items-center gap-3 rounded-full bg-olive px-8 py-4 text-[11px] font-bold tracking-[0.24em] text-gold uppercase transition-colors duration-300 hover:bg-olive-deep"
            >
              Encomendar no WhatsApp
              <span aria-hidden>→</span>
            </a>
          </div>

          <div className="self-start rounded-[2rem] border border-ink/12 bg-sand/50 p-9">
            <h3 className="font-mono mb-5 text-[10px] tracking-[0.3em] text-olive uppercase">
              Antes de pedir
            </h3>
            <p className="font-display text-xl leading-relaxed text-ink/80 italic">
              {AVISO_DECORACAO}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
