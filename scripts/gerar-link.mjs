// Gera um link de acesso com validade para o site.
//
// Uso:
//   node scripts/gerar-link.mjs            -> link válido por 48 horas
//   node scripts/gerar-link.mjs 24         -> link válido por 24 horas
//   node scripts/gerar-link.mjs 72 https://outro-endereco.com
//
// O segredo (ACCESS_SECRET) é lido da variável de ambiente ou do arquivo
// .env.local na raiz do projeto. Precisa ser o mesmo valor configurado na Vercel.

import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";

const horas = Number(process.argv[2] ?? 48);
const base = (process.argv[3] ?? "https://dalami-website.vercel.app").replace(/\/+$/, "");

if (!Number.isFinite(horas) || horas <= 0) {
  console.error("Informe um número de horas maior que zero. Ex.: node scripts/gerar-link.mjs 48");
  process.exit(1);
}

function lerSegredo() {
  if (process.env.ACCESS_SECRET) return process.env.ACCESS_SECRET;
  try {
    const texto = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const linha of texto.split(/\r?\n/)) {
      const m = linha.match(/^\s*ACCESS_SECRET\s*=\s*(.*)\s*$/);
      if (m) return m[1].replace(/^["']|["']$/g, "");
    }
  } catch {
    // sem .env.local
  }
  return null;
}

const segredo = lerSegredo();
if (!segredo) {
  console.error("ACCESS_SECRET não encontrado (nem no ambiente, nem em .env.local).");
  process.exit(1);
}

const expira = String(Math.floor(Date.now() / 1000) + Math.round(horas * 3600));
const assinatura = createHmac("sha256", segredo)
  .update(`dalami-acesso:${expira}`)
  .digest("base64url");

const quando = new Date(Number(expira) * 1000).toLocaleString("pt-BR", {
  timeZone: "America/Sao_Paulo",
});

console.log(`${base}/acesso?t=${expira}.${assinatura}`);
console.error(`Válido até ${quando} (horário de Brasília).`);
