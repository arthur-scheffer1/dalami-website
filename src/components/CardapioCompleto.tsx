"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { revelaAoEntrar } from "@/lib/anima";
import { garanteVisivel } from "@/lib/garante-visivel";
import { useIsoLayoutEffect } from "@/lib/use-iso-layout-effect";
import { AVISO_DECORACAO, BRIGADEIROS, CATEGORIAS, FOTOS_BOLOS, TAMANHOS } from "@/lib/menu";
import { linkPedidoDeBolo, linkWhatsApp } from "@/lib/whatsapp";
import PassoAPasso from "./PassoAPasso";
import { SITE } from "@/lib/site";
import Faixa from "./Faixa";
import { CELULAR, DESKTOP } from "@/lib/breakpoints";

const ORDEM_TAMANHOS = ["P", "M", "G", "GG"] as const;

export default function CardapioCompleto() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [ativa, setAtiva] = useState<string>(CATEGORIAS[0].id);
  // Cada categoria alterna sozinha entre lista de texto e grade de fotos.
  const [modoFotos, setModoFotos] = useState<Record<string, boolean>>({});

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Mesmo motivo do BoloHeroi: so "chars" deixaria o navegador partir
      // "Cardapio" no meio numa tela estreita.
      const split = new SplitText(".card-titulo", { type: "words,chars" });
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

      mm.add(DESKTOP, () => {
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
      mm.add(CELULAR, () => {
        gsap.utils.toArray<HTMLElement>(".cat-head").forEach((head) => {
          revelaAoEntrar(head, { opacity: 0, y: 20 }, { trigger: head, start: "top 92%", duration: 0.6 });
        });
        gsap.utils.toArray<HTMLElement>(".cat-bolo").forEach((linha) => {
          revelaAoEntrar(linha, { opacity: 0.05, y: 16 }, { trigger: linha, start: "top 94%", duration: 0.5 });
        });
      });

      return () => split.revert();
    }, rootRef);
    // Se a animação do título não terminar, o texto volta sozinho.
    const solta = garanteVisivel(".card-titulo, .card-titulo *");

    return () => {
      solta();
      ctx.revert();
    };
  }, []);

  return (
    <main ref={rootRef} className="bg-cream">
      {/* Cabeçalho: nome em cursiva, como no hero da home */}
      <header className="mx-auto max-w-[1400px] px-6 pt-32 pb-10 md:pt-40 md:pb-16">
        <span className="font-mono mb-6 block text-[12px] tracking-[0.3em] text-olive-texto uppercase">
          Encomendas · {SITE.endereco.bairro}
        </span>
        <h1
          className="font-script leading-[1.05] text-olive-texto"
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
            className="group inline-flex items-center gap-3 rounded-full bg-[#d81b28] px-7 py-4 text-white shadow-sm transition-transform duration-300 hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor" aria-hidden>
              <path d="M7 4h10a1 1 0 0 1 .97.76L18.3 7H21a1 1 0 1 1 0 2h-.3l-1.2 9.25A3 3 0 0 1 16.53 21H7.47a3 3 0 0 1-2.97-2.75L3.3 9H3a1 1 0 1 1 0-2h2.7l.33-2.24A1 1 0 0 1 7 4zm.87 3h8.26l-.2-1H8.07l-.2 1zM5.32 9l1.16 9a1 1 0 0 0 .99.88h9.06a1 1 0 0 0 .99-.88L18.68 9H5.32zm3.43 2.5a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0v-4zm4.5 0a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0v-4z" />
            </svg>
            <span className="font-mono text-[12px] font-bold tracking-[0.2em] uppercase">
              Pedir no iFood
            </span>
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
              &rarr;
            </span>
          </a>
          <span className="font-mono max-w-sm text-[12px] leading-relaxed tracking-[0.16em] text-ink/45 uppercase">
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
          <h2 className="font-mono mb-10 text-[12px] tracking-[0.3em] text-olive-texto uppercase">
            O tamanho ideal para a sua ocasião
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TAMANHOS.map((t) => (
              <div key={t.sigla} className="rounded-2xl border border-ink/12 bg-cream p-7">
                <span className="font-poster block text-5xl leading-none text-olive-texto">{t.sigla}</span>
                <span className="font-mono mt-4 block text-[12px] tracking-[0.18em] text-ink/50 uppercase">
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
      <div className="mx-auto max-w-[1400px] px-6 py-14 md:py-24">
        <div className="gap-16 lg:grid lg:grid-cols-[200px_minmax(0,1fr)]">
          <nav aria-label="Categorias do cardápio" className="hidden lg:block">
            <div className="sticky top-28">
              <span className="font-mono mb-5 block text-[12px] tracking-[0.3em] text-ink/40 uppercase">
                Categorias
              </span>
              <ul className="flex flex-col gap-1 border-l border-ink/15">
                {CATEGORIAS.map((cat, i) => {
                  const atual = ativa === cat.id;
                  return (
                    <li key={cat.id}>
                      <a
                        href={`#${cat.id}`}
                        aria-current={atual ? "true" : undefined}
                        /* Marca no clique, sem esperar a rolagem chegar: a
                           viagem suave leva mais de um segundo, e o menu
                           ficava apontando a categoria antiga esse tempo
                           todo. O ScrollTrigger continua mandando em quem
                           rola com o dedo. */
                        onClick={() => setAtiva(cat.id)}
                        className={`-ml-px flex items-baseline gap-3 rounded-r-lg border-l-2 py-2.5 pl-4 transition-all duration-300 ${
                          atual
                            ? "border-olive bg-olive/10 font-semibold text-olive-texto"
                            : "border-transparent text-ink/60 hover:border-olive/30 hover:bg-ink/4 hover:text-ink"
                        }`}
                      >
                        <span
                          className={`font-mono text-[12px] tracking-[0.2em] transition-colors duration-300 ${
                            atual ? "text-olive-texto" : "text-ink/40"
                          }`}
                        >
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
                  {/* Oliva a 70%, nao a 25%: na opacidade antiga o numero
                      dava 1,37:1 de contraste sobre o creme e sumia. A 70%
                      da 2,6:1, que num corpo desse tamanho ja se le bem. */}
                  <span className="font-poster shrink-0 text-5xl leading-none text-olive-texto/70 md:text-7xl">
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

                {/* Abas Lista / Fotos: quem só quer o preço fica na lista de
                    sempre; quem quer decidir pela foto troca de aba. Nenhuma
                    foto mora dentro da linha, então nada de hover simulado
                    nem miniatura espremida — o texto e a foto vivem em dois
                    modos separados, cada um por inteiro. */}
                <div className="mb-8 inline-flex gap-1 rounded-full border border-ink/15 bg-cream p-1">
                  <button
                    type="button"
                    onClick={() => setModoFotos((m) => ({ ...m, [cat.id]: false }))}
                    className={`font-mono rounded-full px-5 py-2.5 text-[12px] font-bold tracking-[0.18em] uppercase transition-colors duration-300 ${
                      !modoFotos[cat.id] ? "bg-olive-deep text-gold" : "text-ink/45 hover:text-ink/75"
                    }`}
                  >
                    Lista
                  </button>
                  <button
                    type="button"
                    onClick={() => setModoFotos((m) => ({ ...m, [cat.id]: true }))}
                    className={`font-mono rounded-full px-5 py-2.5 text-[12px] font-bold tracking-[0.18em] uppercase transition-colors duration-300 ${
                      modoFotos[cat.id] ? "bg-olive-deep text-gold" : "text-ink/45 hover:text-ink/75"
                    }`}
                  >
                    Fotos
                  </button>
                </div>

                {modoFotos[cat.id] ? (
                  <div className="cat-fotos grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {cat.bolos
                      .filter((bolo) => FOTOS_BOLOS[bolo.nome])
                      .map((bolo) => {
                        const precos = Object.values(bolo.precos).filter(
                          (v): v is number => v != null,
                        );
                        const menorPreco = precos.length ? Math.min(...precos) : null;
                        return (
                          <a
                            key={bolo.nome}
                            href={linkPedidoDeBolo(bolo.nome)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative isolate block aspect-square overflow-hidden rounded-2xl"
                          >
                            <Image
                              src={FOTOS_BOLOS[bolo.nome]}
                              alt={bolo.nome}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                            <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent pt-10 pb-3.5 px-4">
                              <span className="font-display block text-[15px] leading-tight text-cream">
                                {bolo.nome}
                              </span>
                              {menorPreco != null && (
                                <span className="font-mono mt-1 block text-[12px] tracking-[0.1em] text-cream/75 uppercase">
                                  A partir de R$ {menorPreco}
                                </span>
                              )}
                            </span>
                            {bolo.campeao && (
                              <span className="font-mono absolute top-3 left-3 rounded-full bg-gold-logo px-2.5 py-1 text-[7px] font-bold tracking-[0.14em] text-olive-deep uppercase">
                                Campeão
                              </span>
                            )}
                            <span className="font-mono absolute right-3 bottom-3 rounded-full bg-gold-logo px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-olive-deep uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              Pedir
                            </span>
                          </a>
                        );
                      })}
                    {cat.bolos.every((bolo) => !FOTOS_BOLOS[bolo.nome]) && (
                      <p className="font-mono col-span-full py-10 text-center text-[12px] tracking-[0.14em] text-ink/40 uppercase">
                        Fotos desta categoria em breve
                      </p>
                    )}
                  </div>
                ) : (
                <div className="relative border-t border-ink/15">
                  {cat.bolos.map((bolo) => (
                    <article
                      key={bolo.nome}
                      className="cat-bolo group relative isolate grid gap-4 border-b border-ink/15 py-8 transition-colors duration-300 md:grid-cols-12 md:gap-8 md:px-4 md:hover:bg-olive/5"
                    >
                      <div className="flex items-start gap-4 md:col-span-5">
                        {/* Miniatura redonda: dá rosto ao item sem virar
                            galeria. Fica fora do fluxo do texto, então o nome
                            continua começando na mesma coluna em toda linha,
                            tenha foto ou não. */}
                        {FOTOS_BOLOS[bolo.nome] ? (
                          <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-ink/10 md:h-16 md:w-16">
                            <Image
                              src={FOTOS_BOLOS[bolo.nome]}
                              alt=""
                              fill
                              sizes="64px"
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </span>
                        ) : (
                          <span className="block h-14 w-14 shrink-0 rounded-full border border-dashed border-ink/15 md:h-16 md:w-16" />
                        )}
                        <h3 className="font-display flex flex-wrap items-center gap-3 text-2xl text-ink transition-transform duration-300 md:text-3xl md:group-hover:translate-x-1.5">
                          {bolo.nome}
                          {bolo.campeao && (
                            /* Medalha: fundo no dourado do logo, texto no
                               oliva profundo. Dá 5,5:1 de contraste, que um
                               selo de 8px precisa. */
                            <span className="font-mono rounded-full bg-gold-logo px-3 py-1.5 text-[8px] font-bold tracking-[0.18em] text-olive-deep uppercase">
                              Campeão de vendas
                            </span>
                          )}
                        </h3>
                      </div>

                      <p className="font-body text-[15px] leading-relaxed text-ink/60 md:col-span-4">
                        {bolo.descricao}
                        {bolo.obs && (
                          <span className="font-mono mt-2 block text-[12px] tracking-[0.14em] text-olive-texto uppercase">
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
                            <span className="font-mono block text-[12px] tracking-[0.2em] text-ink/40 uppercase">
                              {t}
                            </span>
                            <span className="font-mono text-sm text-olive-texto">R$ {bolo.precos[t]}</span>
                          </span>
                        ))}

                        <a
                          href={linkPedidoDeBolo(bolo.nome)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-olive-deep px-5 py-3 text-[12px] font-bold tracking-[0.16em] text-gold uppercase transition-colors duration-300 hover:bg-olive md:w-auto"
                        >
                          Pedir este
                          <span aria-hidden>&rarr;</span>
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* Brigadeiros */}
      <section className="bg-olive-deep py-14 md:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 md:grid-cols-2 md:gap-20">
          <div>
            <span className="font-mono mb-4 block text-[12px] tracking-[0.3em] text-gold uppercase">
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

          <ul className="grid grid-cols-2 gap-x-8 self-center border-t border-gold-logo/25">
            {BRIGADEIROS.sabores.map((s) => (
              <li
                key={s}
                className="font-body border-b border-gold-logo/25 py-3.5 text-[15px] text-cream/80"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Como encomendar */}
      <section className="bg-cream py-14 md:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-14 px-6 md:grid-cols-2 md:gap-20">
          <div>
            <PassoAPasso nivel="h2" />
            <a
              href={linkWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono mt-10 inline-flex items-center gap-3 rounded-full bg-olive-deep px-8 py-4 text-[12px] font-bold tracking-[0.24em] text-gold uppercase transition-colors duration-300 hover:bg-olive-deep"
            >
              Encomendar no WhatsApp
              <span aria-hidden>→</span>
            </a>
          </div>

          <div className="self-start rounded-[2rem] border border-ink/12 bg-sand/50 p-9">
            <h3 className="font-mono mb-5 text-[12px] tracking-[0.3em] text-olive-texto uppercase">
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
