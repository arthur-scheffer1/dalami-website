import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata = { title: "Página não encontrada | Dalami" };

export default function NaoEncontrada() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-7 bg-cream px-6 py-32 text-center">
      <span className="font-mono text-[10px] tracking-[0.3em] text-olive uppercase">
        Erro 404
      </span>
      <h1
        className="font-poster leading-[0.9] tracking-tight text-ink uppercase"
        style={{ fontSize: "clamp(38px, 6vw, 84px)" }}
      >
        Essa fatia
        <br />
        acabou
      </h1>
      <p className="font-display max-w-sm text-lg text-ink/70 italic">
        A página que você procurava não existe — mas o cardápio continua cheio.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="font-mono rounded-full bg-olive px-7 py-4 text-[10px] font-bold tracking-[0.22em] text-gold uppercase transition-colors duration-300 hover:bg-olive-deep"
        >
          Voltar ao início
        </Link>
        <Link
          href="/cardapio"
          className="font-mono rounded-full border border-olive/40 px-7 py-4 text-[10px] font-bold tracking-[0.22em] text-olive uppercase transition-colors duration-300 hover:border-olive hover:bg-olive hover:text-gold"
        >
          Ver o cardápio
        </Link>
      </div>
      <p className="font-mono mt-4 text-[10px] tracking-[0.18em] text-ink/40 uppercase">
        {SITE.endereco.bairro} — {SITE.endereco.cidade}/{SITE.endereco.uf}
      </p>
    </main>
  );
}
