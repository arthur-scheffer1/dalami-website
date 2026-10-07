import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Acesso por convite com validade.
 *
 * Só entra quem abre um link do tipo /acesso?t=<expira>.<assinatura>. O link
 * vale até o horário embutido nele; ao abrir, o navegador recebe um cookie que
 * vale até o mesmo horário. Passou do prazo, o site volta a ficar fechado.
 *
 * Sem estado e sem banco: a assinatura é um HMAC-SHA256 do horário de expiração
 * com o segredo ACCESS_SECRET. Para invalidar todos os links de uma vez, troque
 * o valor de ACCESS_SECRET na Vercel e publique de novo.
 *
 * Se ACCESS_SECRET não existir, o filtro fica desligado e o site abre normal.
 */

const COOKIE = "dalami_acesso";
const PREFIXO = "dalami-acesso:";
const encoder = new TextEncoder();

function paraBase64Url(bytes: ArrayBuffer): string {
  let binario = "";
  for (const b of new Uint8Array(bytes)) binario += String.fromCharCode(b);
  return btoa(binario).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function assinar(segredo: string, expira: string): Promise<string> {
  const chave = await crypto.subtle.importKey(
    "raw",
    encoder.encode(segredo),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const assinatura = await crypto.subtle.sign(
    "HMAC",
    chave,
    encoder.encode(PREFIXO + expira),
  );
  return paraBase64Url(assinatura);
}

// Comparação que não revela, pelo tempo de resposta, quantos caracteres batem.
function iguais(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diferenca = 0;
  for (let i = 0; i < a.length; i++) {
    diferenca |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diferenca === 0;
}

/** Devolve quantos segundos ainda restam, ou null se o token não vale. */
async function segundosRestantes(
  token: string | undefined,
  segredo: string,
): Promise<number | null> {
  if (!token) return null;
  const partes = token.split(".");
  if (partes.length !== 2) return null;
  const [expira, assinatura] = partes;
  if (!/^\d{9,12}$/.test(expira)) return null;

  const esperada = await assinar(segredo, expira);
  if (!iguais(assinatura, esperada)) return null;

  const restante = Number(expira) - Math.floor(Date.now() / 1000);
  return restante > 0 ? restante : null;
}

const PAGINA_FECHADA = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Acesso restrito</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f3ede2;color:#1f2a1f;font-family:system-ui,sans-serif;text-align:center;padding:24px}
  h1{font-size:1.4rem;margin:0 0 .5rem}
  p{margin:0;color:#6f6a5c}
</style>
</head>
<body>
<main>
<h1>Acesso restrito</h1>
<p>Este endereço é aberto por convite. Se o seu link expirou, peça um novo.</p>
</main>
</body>
</html>`;

function fechado(status: number): NextResponse {
  return new NextResponse(PAGINA_FECHADA, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

export async function proxy(request: NextRequest) {
  const segredo = process.env.ACCESS_SECRET;
  if (!segredo) return NextResponse.next();

  const { pathname, searchParams } = request.nextUrl;

  if (pathname === "/acesso") {
    const token = searchParams.get("t") ?? undefined;
    const restante = await segundosRestantes(token, segredo);
    if (restante === null) return fechado(403);

    const resposta = NextResponse.redirect(new URL("/", request.url));
    resposta.cookies.set(COOKIE, token as string, {
      httpOnly: true,
      secure: request.nextUrl.protocol === "https:",
      sameSite: "lax",
      path: "/",
      maxAge: restante,
    });
    resposta.headers.set("cache-control", "no-store");
    return resposta;
  }

  const restante = await segundosRestantes(
    request.cookies.get(COOKIE)?.value,
    segredo,
  );
  if (restante === null) return fechado(401);

  const resposta = NextResponse.next();
  resposta.headers.set("x-robots-tag", "noindex, nofollow");
  return resposta;
}

export const config = {
  // Tudo passa pelo filtro, menos os arquivos internos do Next que a própria
  // página de "acesso restrito" não usa.
  matcher: ["/((?!_next/static|_next/image|_vercel).*)"],
};
