/**
 * Selo redondo, no espírito da etiqueta da embalagem: um anel de texto em
 * volta e o lettering do logo no meio.
 *
 * O texto curvo é `textPath` de verdade, correndo sobre um círculo — não
 * letras giradas uma a uma. Letra girada individualmente nunca assenta na
 * curva: o espaçamento abre nas verticais e fecha nas horizontais, e a
 * palavra fica tremida. O `textPath` deixa o próprio motor de texto resolver.
 *
 * O miolo é o wordmark vetorizado da marca, entrando por máscara CSS — o
 * mesmo arquivo do hero e do menu, então não há download novo.
 */
export default function SeloRedondo({
  texto,
  className = "",
  tom = "gold",
}: {
  /** O que corre no anel. Repete duas vezes, separado por um ponto. */
  texto: string;
  className?: string;
  /** `gold` para fundo escuro; `olive` para fundo claro. */
  tom?: "gold" | "olive";
}) {
  // Ids únicos por instância: dois selos na mesma página compartilhando o id
  // do caminho fariam o segundo texto correr pelo círculo do primeiro.
  const id = `selo-${texto.replace(/[^a-zA-Z]/g, "").slice(0, 10)}-${texto.length}`;

  const cor = tom === "gold" ? "var(--color-gold-logo)" : "var(--color-olive-texto)";

  // O anel tem 232 unidades de perímetro (2·pi·37). Texto longo dando duas
  // voltas obrigaria um corpo tão pequeno que, no tamanho em que o selo
  // aparece na tela, sairia com uns 6px — ilegível. Então texto longo dá uma
  // volta só, com o corpo maior; texto curto dá duas, que é o que fecha o
  // anel sem sobra.
  const voltas = texto.length > 12 ? 1 : 2;
  const corpo = voltas === 1 ? 10.5 : 9;
  const espaco = voltas === 1 ? 1.6 : 1.1;

  return (
    <span
      className={`relative inline-block shrink-0 ${className}`}
      role="img"
      aria-label={texto}
    >
      <svg viewBox="0 0 100 100" className="selo-anel h-full w-full" aria-hidden="true">
        <defs>
          {/* Começa em cima, no meio, e corre no sentido horário. */}
          <path
            id={id}
            d="M 50 50 m 0 -37 a 37 37 0 1 1 0 74 a 37 37 0 1 1 0 -74"
            fill="none"
          />
        </defs>

        <circle cx="50" cy="50" r="48.2" fill="none" stroke={cor} strokeWidth="1.1" />
        <circle
          cx="50"
          cy="50"
          r="44.6"
          fill="none"
          stroke={cor}
          strokeWidth="0.6"
          strokeDasharray="1.2 2.4"
          opacity="0.75"
        />
        <circle cx="50" cy="50" r="28.5" fill="none" stroke={cor} strokeWidth="0.6" opacity="0.5" />

        <text
          style={{ fill: cor }}
          fontSize={corpo}
          letterSpacing={espaco}
          fontWeight="700"
          fontFamily="var(--font-space-mono), monospace"
        >
          {/* O ponto separa as repetições para não virar uma palavra só. */}
          <textPath href={`#${id}`} startOffset="0%">
            {Array.from({ length: voltas }, () => `${texto.toUpperCase()} · `).join("")}
          </textPath>
        </text>
      </svg>

      {/* O lettering no centro, por máscara — mesmo vetor do hero. */}
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 block w-[38%] -translate-x-1/2 -translate-y-1/2"
        style={{
          aspectRatio: "557 / 130",
          backgroundColor: cor,
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
    </span>
  );
}
