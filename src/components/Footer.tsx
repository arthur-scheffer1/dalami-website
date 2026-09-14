import Link from "next/link";
import Image from "next/image";
import { PAGINAS, SITE } from "@/lib/site";

const SOCIAIS = [
  { label: "Instagram", href: SITE.instagram.href },
  { label: "Google Maps", href: SITE.maps },
  { label: "WhatsApp", href: SITE.whatsapp.href },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-cream py-14">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 px-6">
        {/* Marca e emblema numa linha própria: dentro da linha dos links, o
            emblema virava só mais uma coluna e despencava para o fim da pilha
            quando ela empilha em telas estreitas. */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <span className="font-display text-3xl leading-none text-olive italic">
              {SITE.nome}
            </span>
            <p className="font-mono mt-2 text-[9px] tracking-[0.3em] text-ink/45 uppercase">
              Confeitaria
            </p>
          </div>

          {/* Decorativo: o nome da marca já aparece como texto ao lado,
              então o emblema não repete isso para o leitor de tela. */}
          <Image
            src="/images/logo-dalami.svg"
            alt=""
            width={100}
            height={100}
            unoptimized
            className="h-16 w-16 shrink-0"
          />
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">

          <div className="flex flex-wrap gap-x-7 gap-y-3">
            {SOCIAIS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono -m-2 p-2 text-[10px] font-bold tracking-[0.22em] text-ink/60 uppercase transition-colors duration-300 hover:text-olive"
              >
                {s.label}
              </a>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-7 gap-y-3">
            {PAGINAS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="font-mono -m-2 p-2 text-[10px] font-bold tracking-[0.22em] text-ink/60 uppercase transition-colors duration-300 hover:text-olive"
              >
                {p.label}
              </Link>
            ))}
          </div>

          <address className="font-body max-w-[230px] text-sm leading-relaxed text-ink/55 not-italic">
            {SITE.endereco.rua}
            <br />
            {SITE.endereco.bairro} — {SITE.endereco.cidade}/{SITE.endereco.uf}
          </address>
        </div>

        <div className="font-mono border-t border-ink/10 pt-6 text-[9px] tracking-[0.2em] text-ink/35 uppercase">
          © 2026 Dalami Confeitaria · Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
}
