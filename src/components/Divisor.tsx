/**
 * Fio que separa as fotos: um escorrido de ganache traçado à mão, com os
 * pontinhos e tracinhos impressos na caixa das fatias.
 *
 * Estático de propósito, e sem uma linha de JavaScript.
 *
 * Antes ele se desenhava da esquerda para a direita ao entrar na tela, e o
 * efeito colateral era pior que o efeito: `gsap.fromTo` aplica o estado
 * inicial no mesmo instante em que monta, então a linha nascia invisível e só
 * existia depois que a rolagem passasse pelo gatilho. Quem chegasse nela antes
 * disso — ou com o script lento, ou com o gatilho errando por qualquer
 * remedição de altura — via um vão vazio entre as fotos.
 *
 * Sem animação não há estado inicial a aplicar: o desenho é o que está no
 * HTML, e ele está sempre lá.
 */
export default function Divisor({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`} aria-hidden>
      <svg
        viewBox="0 0 1200 80"
        fill="none"
        className="w-full max-w-[1100px]"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Amplitudes irregulares de propósito: onda perfeita parece régua, e o
            que a marca usa na embalagem é traço de mão. */}
        <path
          d="M8 44 C 96 18, 178 62, 268 42 C 352 24, 420 58, 508 46 C 588 35, 650 14, 742 34 C 832 54, 890 66, 980 48 C 1062 32, 1128 40, 1192 30"
          stroke="var(--color-olive)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />

        {/* Pingos escorrendo do fio, como calda prestes a cair */}
        <circle cx="268" cy="42" r="4.5" fill="var(--color-olive)" />
        <circle cx="742" cy="34" r="6" fill="var(--color-olive)" />
        <circle cx="980" cy="48" r="3.5" fill="var(--color-tan)" />
        <circle cx="508" cy="46" r="3" fill="var(--color-blush)" />

        {/* Tracinhos da embalagem, soltos acima e abaixo da linha */}
        {[
          [120, 16],
          [136, 12],
          [152, 18],
          [1050, 62],
          [1066, 58],
          [1082, 64],
        ].map(([x, y]) => (
          <line
            key={`${x}-${y}`}
            x1={x}
            y1={y}
            x2={x + 7}
            y2={y + 11}
            stroke="var(--color-ink)"
            strokeOpacity="0.45"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
}
