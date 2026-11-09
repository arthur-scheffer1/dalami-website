# Dalami Confeitaria

Site da [Dalami Confeitaria e Cafeteria](https://instagram.com/dalamicafeteria) —
Ingleses, Florianópolis. Cardápio de bolos por encomenda, vitrine do dia e a
história da casa.

## Como rodar

```bash
npm install
npm run dev     # http://localhost:3000
```

Para conferir o que vai de fato para o ar, use o build de produção — várias
coisas (cabeçalhos de segurança, otimização de imagem, divisão de pacotes)
só existem nele:

```bash
npm run build && npm start
```

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Estilo | Tailwind v4, tokens em `src/app/globals.css` |
| Animação | GSAP + ScrollTrigger |
| Rolagem | Lenis (só no mouse; o toque segue nativo) |
| Hospedagem | Vercel |

## Mapa do projeto

```
src/
  app/          rotas, metadados, sitemap, robots, ícones
  components/   uma seção da página por arquivo
  lib/          dados do cardápio, informações da loja, helpers
  proxy.ts      trava de acesso por link com validade
```

Os dados que mudam com frequência estão separados do layout de propósito:
`src/lib/menu.ts` tem o cardápio inteiro (sabores, preços, tamanhos, fotos) e
`src/lib/site.ts` tem endereço, horários e contatos. Dá para atualizar preço
sem abrir um componente.

## Acesso por link

`src/proxy.ts` fecha o site atrás de um link com prazo de validade, para
mostrar a proposta antes de publicar. É um HMAC-SHA256 do horário de
expiração — sem banco e sem estado.

```bash
node scripts/gerar-link.mjs 7     # link válido por 7 dias
```

O segredo vive na variável de ambiente `ACCESS_SECRET` (na Vercel, ou em
`.env.local` para testar). **Sem ela, a trava fica desligada e o site abre
normalmente** — então produção sem a variável é site aberto, o que é o
comportamento desejado depois do lançamento. Para invalidar todos os links de
uma vez, troque o valor e publique de novo.

## Acessibilidade

Todo texto do site cumpre contraste AA da WCAG (4,5:1 em corpo normal, 3:1 em
corpo grande). Isso é verificado medindo a cor final contra o fundo real de
cada elemento, não no olho — se for mexer em cor, vale remedir.

## Pendências

- **Depoimentos são exemplos de diagramação**, assinados "EXEMPLO — substituir"
  em `src/components/Depoimentos.tsx`. Precisam virar depoimentos reais ou sair
  do ar antes do lançamento.
- **Falta foto da fachada.** O terceiro quadro de "Nossa loja" está montado e
  marcado com `TROCAR PELA FACHADA`.
- **A contagem de seguidores do Instagram** está fixa em `Instagram.tsx` e
  precisa de confirmação.
