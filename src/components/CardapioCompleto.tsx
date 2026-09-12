"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { AVISO_DECORACAO, BRIGADEIROS, CATEGORIAS, COMO_ENCOMENDAR, TAMANHOS } from "@/lib/menu";
import { SITE } from "@/lib/site";

const ORDEM_TAMANHOS = ["P", "M", "G", "GG"] as const;

export default function CardapioCompleto() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText(".card-titulo", { type: "chars" });
      gsap.from(split.chars, {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.03,
      });

      gsap.from(".card-sub", { opacity: 0, y: 18, duration: 0.8, delay: 0.3, ease: "power3.out" });

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
            stagger: 0.12,
            ease: "none",
            scrollTrigger: { trigger: bloco, start: "top 70%", end: "bottom 75%", scrub: true },
          },
        );
      });

      return () => split.revert();
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="bg-cream">
      {/* Cabeçalho da página */}
      <header className="mx-auto max-w-[1400px] px-6 pt-36 pb-16 md:pt-44 md:pb-24">
        <span className="font-mono mb-5 block text-[10px] tracking-[0.3em] text-olive uppercase">
          Cardápio de encomendas
        </span>
        <h1
          className="card-titulo font-poster leading-[0.88] tracking-tight text-ink uppercase"
          style={{ fontSize: "clamp(48px, 9vw, 150px)" }}
        >
          Bolos inteiros
        </h1>
        <p className="card-sub font-display mt-8 max-w-xl text-xl text-ink/65 italic md:text-2xl">
          Receitas artesanais, recheios generosos e acabamento feito com cuidado em
          cada detalhe.
        </p>
      </header>

      {/* Tamanhos */}
      <section className="border-y border-ink/12 bg-sand/40 py-16">
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

      {/* Categorias */}
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:py-28">
        {CATEGORIAS.map((cat) => (
          <section key={cat.id} id={cat.id} className="cat-bloco mb-24 scroll-mt-28 last:mb-0">
            <div className="cat-head mb-10 max-w-2xl">
              <h2
                className="font-poster leading-[0.95] tracking-tight text-ink uppercase"
                style={{ fontSize: "clamp(30px, 4.4vw, 60px)" }}
              >
                {cat.titulo}
              </h2>
              <p className="font-body mt-3 text-[15px] text-ink/55">{cat.subtitulo}</p>
            </div>

            <div className="border-t border-ink/15">
              {cat.bolos.map((bolo) => (
                <article
                  key={bolo.nome}
                  className="cat-bolo grid gap-4 border-b border-ink/15 py-8 md:grid-cols-12 md:gap-8"
                >
                  <div className="md:col-span-5">
                    <h3 className="font-display flex flex-wrap items-center gap-3 text-2xl text-ink md:text-3xl">
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

                  <div className="flex flex-wrap items-start gap-x-6 gap-y-2 md:col-span-3 md:justify-end">
                    {ORDEM_TAMANHOS.filter((t) => bolo.precos[t] != null).map((t) => (
                      <span key={t} className="text-right">
                        <span className="font-mono block text-[9px] tracking-[0.2em] text-ink/40 uppercase">
                          {t}
                        </span>
                        <span className="font-mono text-sm text-ink">R$ {bolo.precos[t]}</span>
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Brigadeiros */}
      <section className="bg-olive-deep py-20 md:py-28">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 md:grid-cols-2 md:gap-20">
          <div>
            <span className="font-mono mb-4 block text-[10px] tracking-[0.3em] text-gold uppercase">
              Para completar a mesa
            </span>
            <h2
              className="font-poster mb-6 leading-[0.92] tracking-tight text-cream uppercase"
              style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
            >
              Brigadeiros
            </h2>
            <p className="font-body mb-8 max-w-md text-[16px] leading-relaxed text-cream/70">
              {BRIGADEIROS.descricao}
            </p>
            <p className="font-display mb-3 text-3xl text-gold italic">{BRIGADEIROS.preco}</p>
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
            <h2 className="font-mono mb-8 text-[10px] tracking-[0.3em] text-olive uppercase">
              Como fazer sua encomenda
            </h2>
            <ol className="border-t border-ink/15">
              {COMO_ENCOMENDAR.map((passo, i) => (
                <li key={passo} className="flex items-baseline gap-5 border-b border-ink/15 py-5">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-olive">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-body text-[15px] leading-relaxed text-ink/75">{passo}</span>
                </li>
              ))}
            </ol>
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
