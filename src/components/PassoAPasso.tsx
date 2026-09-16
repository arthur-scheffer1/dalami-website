import { COMO_ENCOMENDAR } from "@/lib/menu";

/**
 * As regras de encomenda como passo a passo numerado, com uma trilha ligando
 * os números.
 *
 * Antes era uma lista de linhas separadas por borda: correta, mas lida como
 * "avisos", não como um caminho a seguir. Círculo numerado com fio entre eles
 * é o desenho que faz alguém reconhecer um tutorial sem precisar ler.
 *
 * Vive num componente só porque aparece na home e no cardápio — duas cópias do
 * mesmo desenho divergem na primeira alteração.
 */
export default function PassoAPasso({
  nivel: Titulo = "h3",
  classeItem = "",
}: {
  nivel?: "h2" | "h3";
  classeItem?: string;
}) {
  return (
    <>
      <span className="font-mono mb-3 block text-[10px] tracking-[0.3em] text-olive uppercase">
        Passo a passo
      </span>
      <Titulo className="font-display mb-9 text-2xl text-ink md:text-3xl">
        Como encomendar
      </Titulo>

      <ol className="relative flex flex-col gap-6">
        {/* Começa e termina dentro do primeiro e do último círculo, para o fio
            não sobrar nas pontas. Fica atrás: os círculos são opacos. */}
        <span
          aria-hidden
          className="absolute top-6 bottom-6 left-[19px] w-px bg-olive/25"
        />
        {COMO_ENCOMENDAR.map((passo, i) => (
          <li key={passo} className={`relative flex gap-5 ${classeItem}`}>
            <span className="font-mono relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-olive text-sm font-bold text-gold">
              {i + 1}
            </span>
            <span className="font-body self-center text-[15px] leading-relaxed text-ink/75">
              {passo}
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}
