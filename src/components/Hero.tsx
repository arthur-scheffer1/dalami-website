"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { SITE } from "@/lib/site";
import EstadoLoja from "./EstadoLoja";

/**
 * Quanto a entrada do hero espera, em segundos, para coincidir com a saída da
 * cortina do Preloader. Precisa acompanhar os tempos de `.preloader` no
 * globals.css: começa um pouco antes de a cortina terminar de sumir, para o
 * hero já estar em movimento quando aparece, em vez de começar do zero.
 *
 * Quando a cortina sai antecipada, a entrada continua neste tempo — ela toca
 * com o hero já visível, o que é o mesmo efeito de sempre, só que sem espera.
 */
const ATRASO_PRELOADER = 0.62;

/**
 * Só a primeira carga tem cortina. Em navegação client-side (voltar do
 * cardápio, por exemplo) o layout não remonta e o Preloader não roda, então
 * esperar aqui deixaria o hero parado por um segundo e meio sem motivo.
 */
let jaMostrouCortina = false;

/**
 * Hero: tipografia gigante sobre fundo creme.
 *
 * Os textos laterais moram em colunas próprias do grid, nunca sobrepostos em
 * position: absolute, para não colidirem com o título.
 */
/** Quanto o traço em volta do botão se afasta da borda dele, em px. */
const FOLGA_TRACO = 5;

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  // O traço é um retângulo de cantos totalmente arredondados, e o raio
  // depende da altura real do botão — que muda com a fonte, com o idioma e
  // com o tamanho da tela. Por isso ele é medido, não chutado: um raio fixo
  // sairia de registro da pílula assim que qualquer uma dessas coisas mudar.
  const [medida, setMedida] = useState<{ l: number; a: number } | null>(null);

  // No servidor o módulo nunca é mutado (a flag só muda dentro do efeito), então
  // o HTML sai sempre com a cortina — e a primeira hidratação bate. Em navegação
  // client-side a flag já está marcada e o hero entra sem esperar por cortina
  // nenhuma.
  const [primeiraCarga] = useState(() => !jaMostrouCortina);

  useEffect(() => {
    const botao = ctaRef.current;
    if (!botao) return;

    const observador = new ResizeObserver(() => {
      // offsetWidth/Height e não contentRect: o contentRect desconta o
      // padding, e o traço tem de acompanhar a borda visível da pílula.
      setMedida({ l: botao.offsetWidth, a: botao.offsetHeight });
    });
    observador.observe(botao);
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    const prefereMenos = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const atraso = jaMostrouCortina
      ? 0
      : prefereMenos
        ? 0.35
        : ATRASO_PRELOADER;
    jaMostrouCortina = true;

    const ctx = gsap.context(() => {
      // Tempos absolutos em vez de relativos: na primeira carga a palavra não
      // entra por aqui — ela já está na tela, enchendo — e um encadeamento
      // relativo empurraria todo o resto para trás ao perder esse elo.
      const tl = gsap.timeline({
        delay: atraso,
        defaults: { ease: "power4.out" },
      });

      // Só quando não houve cortina: aí a palavra sobe por trás da máscara. Com
      // cortina ela já apareceu preenchendo, e animá-la de novo seria um
      // segundo movimento no mesmo elemento.
      //
      // A palavra inteira sobe junta, nunca letra a letra: o SplitText
      // embrulharia cada caractere numa caixa própria e quebraria as ligações
      // da cursiva, que são o traço da fonte.
      if (!primeiraCarga) {
        tl.from(".hero-word", { yPercent: 108, duration: 1.2 }, 0);
      }

      tl.from(
        ".hero-side",
        { opacity: 0, y: 14, duration: 0.6, stagger: 0.1 },
        0.9,
      )
        .from(".hero-estado", { opacity: 0, duration: 0.6 }, 0.9);

      // O botao "Ver os bolos" nao entra por animacao de proposito. Um `from`
      // com opacity 0 aplica o estado inicial na hora, entao qualquer falha na
      // timeline deixaria o botao invisivel — e invisivel aqui significa
      // inclicavel.
    }, rootRef);

    return () => ctx.revert();
  }, [primeiraCarga]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-cream pt-28 pb-16"
    >
      {/* No celular vai para o canto inferior direito, perto do polegar e longe
          do menu; no desktop fica em cima, onde a faixa de ganache já passou,
          porque ela desce da esquerda para a direita.

          Encolhe por escala, não por tamanho de fonte: a classe de tamanho
          mora dentro do componente, e sobrepô-la com outra classe arbitrária
          dá resultado imprevisível — quem vence é a ordem no CSS gerado.

          Fica em z-30, abaixo da cortina, para não vazar no carregamento. */}
      <div className="hero-estado area-segura-base-margem absolute right-4 bottom-6 z-30 origin-bottom-right scale-90 md:top-28 md:right-8 md:bottom-auto md:mb-0 md:origin-top-right md:scale-100">
        <EstadoLoja className="rounded-full bg-cream/80 px-4 py-2.5 text-ink/65 backdrop-blur-sm" />
      </div>

      {/* Três colunas em telas largas: texto | título | texto */}
      <div
        className={`relative mx-auto grid w-full max-w-[1500px] items-center ${
          primeiraCarga ? "pointer-events-none z-[95]" : "z-10"
        } gap-8 px-6 lg:grid-cols-[minmax(130px,180px)_minmax(0,1fr)_minmax(130px,180px)] lg:gap-10`}
      >
        <p className="hero-side font-mono hidden text-[12px] leading-relaxed tracking-[0.12em] text-ink/55 uppercase lg:block">
          Confeitaria artesanal nos Ingleses. Receitas de recheio generoso e
          acabamento feito à mão.
        </p>

        <div className="flex items-center justify-center">
          {/* O wordmark é o logo real vetorizado, não uma fonte parecida.
              Entra como máscara CSS: assim o arquivo fica cacheado à parte em
              vez de inflar o HTML, e a cor continua vindo do CSS.
              O overflow-hidden do pai é o que faz a palavra surgir subindo. */}
          <h1
            aria-label={SITE.nomeCompleto}
            className="mx-auto w-full max-w-[1185px]"
          >
            <span className="block overflow-hidden">
              {/* Duas camadas mascaradas pelo mesmo desenho: o contorno atrás,
                  as letras na frente cobrindo a metade interna do traço. */}
              <span
                className="hero-word relative block w-full"
                style={{ aspectRatio: "557 / 130" }}
              >
                <span
                  className={`hero-contorno absolute inset-0 block ${
                    primeiraCarga ? "hero-contorno-atrasado" : ""
                  }`}
                />
                <span
                  className={`absolute inset-0 block bg-olive ${
                    primeiraCarga ? "hero-word-enchendo" : ""
                  }`}
                  style={{
                    maskImage: "url(/images/dalami-wordmark.svg)",
                    WebkitMaskImage: "url(/images/dalami-wordmark.svg)",
                    /* Os 97% precisam bater com os do contorno, senão os dois
                       desenhos saem de registro e o traço fica torto. */
                    maskSize: "97%",
                    WebkitMaskSize: "97%",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                  }}
                />
              </span>
            </span>
          </h1>
        </div>

        <p className="hero-side font-mono hidden text-right text-[12px] leading-relaxed tracking-[0.12em] text-ink/55 uppercase lg:block">
          Bolos inteiros por encomenda, fatias na vitrine e café todos os dias.
        </p>
      </div>

      <div className="relative z-30 mt-12 flex flex-col items-center px-6">
        <Link
          ref={ctaRef}
          href="/cardapio"
          className="hero-cta font-display relative inline-flex items-center rounded-full bg-olive-deep px-8 py-4 text-lg text-gold italic transition-colors duration-300 hover:bg-olive-deep"
        >
          Ver os bolos

          {/* O traço dourado que dá a volta no botão.
              Só existe depois da medição: sem ela o SVG sairia sem tamanho e
              o desenho ficaria torto. Se o JavaScript não rodar, não aparece
              traço nenhum e o botão continua inteiro — ele é enfeite, e
              enfeite não pode ser condição para o botão funcionar.

              O `pathLength="1"` normaliza o perímetro para 1, então o traço
              anima de 1 a 0 sem ninguém precisar medir o contorno. */}
          {medida && (
            <svg
              aria-hidden="true"
              className={`hero-cta-traco pointer-events-none absolute ${
                primeiraCarga ? "hero-cta-traco-atrasado" : ""
              }`}
              style={{
                left: -FOLGA_TRACO,
                top: -FOLGA_TRACO,
                width: medida.l + FOLGA_TRACO * 2,
                height: medida.a + FOLGA_TRACO * 2,
              }}
              viewBox={`0 0 ${medida.l + FOLGA_TRACO * 2} ${medida.a + FOLGA_TRACO * 2}`}
              fill="none"
            >
              <rect
                x="0.8"
                y="0.8"
                width={medida.l + FOLGA_TRACO * 2 - 1.6}
                height={medida.a + FOLGA_TRACO * 2 - 1.6}
                rx={(medida.a + FOLGA_TRACO * 2 - 1.6) / 2}
                /* A cor vai no style, nao no atributo: var() dentro de
                   atributo de apresentacao do SVG e' irregular no Safari,
                   e la' o traco simplesmente nao apareceria. */
                style={{ stroke: "var(--color-gold-logo)" }}
                strokeWidth="1.6"
                pathLength="1"
              />
            </svg>
          )}
        </Link>
      </div>
    </section>
  );
}
