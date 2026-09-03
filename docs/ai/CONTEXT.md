# CONTEXT — WD PDR

Verdade técnica consolidada. Leia isto **antes** de escrever código.
Estado operacional (fila, quem faz o quê) fica em [FILA.md](FILA.md).

---

## O produto

App de orçamento de PDR — reparação de amolgadelas sem pintura, "martelinho de ouro" —
para a oficina **WD PDR**, em Leiria, Portugal. O dono chama-se Wan Diego e é cliente
do Lucas, que desenvolve. Duas frentes na mesma app:

- **`/`** — o cliente final escolhe o veículo, marca os amassados clicando na foto real
  da carroçaria, vê o preço na hora, deixa o contacto e descarrega o PDF.
- **`/oficina`** — o painel interno: orçamentos, clientes, seguradoras, definições de preço.
- **`/privacidade`** — política de privacidade, só em português (é aviso legal local).

Produção: `wd-pdr-quote-gmf8.vercel.app` · Repo: `luucasrod/wd-pdr-quote` ·
Deploy automático no push para `main`.

## Stack

Vite + React 19 + TypeScript + Tailwind v4 + Radix + lucide-react + Framer Motion + jsPDF.
Sem framework de servidor: é uma SPA. Funções serverless só em `api/` (hoje só o keep-alive).

## Estado da persistência — leia isto antes de mexer em dados

**Hoje é 100% `localStorage`**, via `src/hooks/use-local-collection.ts`. Isso significa que:

- O pedido que o cliente submete fica **no navegador dele**. A oficina nunca o vê.
- O preço mostrado no site público usa sempre a tabela de fábrica e 45 €/h, porque
  `usePricingConfig()` lê do `localStorage` do **visitante**, que está vazio.

Ambos desaparecem quando a migração para Supabase (fila F5/F6) estiver feita. **Não tente
resolver nenhum dos dois com remendos no localStorage** — a solução é o banco.

### Supabase — já desenhado, testado, e à espera de conta

O schema, as políticas RLS e a função de submissão estão em `supabase/migrations/`,
**já aplicados e verificados** num projeto real (que foi depois pausado, por questão de
quota — ver `docs/TRANSFERIR-SUPABASE.md`).

Modelo: `shop_settings` (linha única, leitura pública), `clients`, `insurers`, `quotes`.

**A regra de ouro do RLS aqui**: o público **lê preços** e **escreve o próprio pedido**,
e mais nada. Verificado com `set role anon`: lê 0 orçamentos, 0 clientes, 0 seguradoras.

**A armadilha que já mordeu**: o plano original era o site fazer
`insert clients ... returning id` e depois inserir o orçamento. Falha sempre, porque
`RETURNING` exige política de leitura. Por isso existe `public.submeter_pedido(...)`,
uma função `security definer` que valida, grava cliente + orçamento na mesma transação e
devolve só o id. **O papel `anon` não tem escrita direta em tabela nenhuma.**

## A tabela WKO — até onde é oficial

Fonte: **WKO, Unverbindliche Leitlinien Nr. 10 — Hagel-Dellen Reparatur (04/2023)**.
Fotos em `docs/referencia/`. São **três** tamanhos, não mais:

| | |
|---|---|
| `minor` | **leicht** — 0-20 mm |
| `medium` | **mittel** — 20-30 mm |
| `severe` | **stark** — 30-45 mm |

Os valores de `DEFAULT_HOURLY_TABLE` foram comparados linha a linha com a tabela oficial: **batem
exatamente** em todas as faixas que ela cobre.

⚠️ **A oficial para nas 351-400 para leicht/mittel e nas 181-200 para stark.** Tudo o que a app tem
acima disso (16 linhas) foi extrapolado e não é oficial — ver issue #40. Não acrescentar mais linhas
inventadas.

**Validação independente**: a app antiga do dono (`pdr.app.br`) usa a mesma tabela × 50 €/h.
Verificado em quatro casos das gravações de ecrã (14 pequenas → 44,00 = 0,88 × 50; 45 médias →
168,00 = 3,36 × 50; 24 grandes → 144,00 = 2,88 × 50; 200 pequenas → 216,00 = 4,32 × 50).
**O nosso motor é matematicamente idêntico ao que ele já usa.**

## Motor de preço — `src/lib/pricing.ts`

1. Agrupa os marcadores por peça (`partId`, inferido da posição do clique).
2. Determina a severidade predominante da peça.
3. Consulta a tabela WKO (Áustria, reparação de granizo) pela faixa de quantidade.
4. Aplica a percentagem do **tipo de peça** (Padrão 0%, Alumínio +20%, Difícil Acesso +25%,
   Pré-empurrar +25%) — editável pelo dono nas Definições.
5. Soma preparação (0,2 AW por peça, teto de 1 AW), acabamento manual e 2 agravamentos de 25%.
6. Multiplica pela taxa horária.

A unidade é **AW** (*Arbeitsaufwand*, unidade de trabalho da tabela austríaca), não horas
literais. Não traduzir para "horas" na UI.

**A tabela de preço fixo (€ por faixa) foi removida** na Phase 1, por decisão de um agente,
**sem** o dono ter respondido se usa preço fixo ou preço/hora. Se ele responder "valor fixo",
recuperar de `git show 95cc71f^:src/data/pricing/pricing-config.ts`.

## Armadilhas que quebram em silêncio

### i18n — 5 idiomas, tipados
`src/i18n/translations.ts` (~1400 linhas) tem `TranslationShape` e os 5 objetos
(pt, en, de, fr, es). Faltar uma chave num idioma **quebra o build**. O ficheiro ser único
foi a origem de **6 dos 9 conflitos** entre os dois agentes na Phase 1 — por isso partir
o ficheiro é uma tarefa da fila (F1), e é solo.

Português de **Portugal** em todo o `pt`: matrícula, contacto, orçamento, ecrã, telemóvel.

### O passcode do `/oficina` não é segurança
`VITE_OFICINA_PASSCODE` é uma variável do frontend, portanto **está legível dentro do
JavaScript público** (`grep wdpdr2026 dist/assets/*.js` acerta). É um dissuasor.

Hoje o risco prático é baixo, porque sem servidor um visitante que entre vê o painel
**vazio**, com os dados do próprio navegador. Passa a ser risco a sério no dia em que
houver Supabase — daí a autenticação real ser tarefa da fila (F7).

### `useLocalCollection` não sincroniza
Cada componente tem a sua cópia do estado. Duas abas abertas sobrescrevem-se.
Desaparece com a migração para Supabase.

### Inferência de peça é a mesma para os 5 veículos
`src/lib/part-inference.ts` usa faixas de coordenada fixas. Van e compacto têm proporções
bem diferentes de um sedan, e um erro aqui muda o agrupamento por peça — logo, muda o preço.

## Convenções de código

- Componentes funcionais, ficheiros em kebab-case, imports com alias `@/`
- `cn()` de `src/lib/utils.ts` para compor classes
- Tokens CSS (`var(--color-ink-950)`, `var(--color-amber-500)`, `var(--radius-md)`),
  nunca cores literais
- **Não superengenheirar.** O dono do projeto pediu explicitamente entregas "básicas,
  sem ser nada demais". Resolver o problema descrito, não construir abstrações para
  problemas futuros.

## Identidade visual

- Preto `#0a0a0b` + âmbar `#f5a623`
- **O traço preto do logo real fica ilegível em fundo escuro** — logo só em fundo claro
- Contacto real, que aparece no PDF e no 404: +351 936 077 121 · wd.pdr@gmail.com
- Morada: Rua Santo André, Edifício Europa, Lote 4 – Escritório 5, 2410-541 Leiria

## Histórico que evita repetir erros

- **Phase 1** (7 issues, sem backend) foi feita em paralelo por Claude e Codex em branches
  separadas. As duas compilavam sozinhas e **não compilavam juntas**: o Codex trocou o
  modelo de tipo de peça (`isAlu` binário → `partTypeId`) enquanto o Claude escrevia código
  que gravava o formato antigo. Custou uma sessão inteira de integração.
  **A lição virou a regra `solo` do WORK_PROTOCOL.**
- O PDF já foi `window.print()`. Hoje é jsPDF real, com quebra de página tratada
  (`ensureSpace`). Não voltar ao print do browser.
- As 25 fotos já foram reprocessadas (upscale 2x Lanczos + nitidez) mantendo o
  enquadramento exato. Não mexer sem pedido.

## Pendências que dependem de pessoas, não de código

- Conta Supabase do dono (bloqueia metade da fila)
- NIF da empresa, para o rodapé legal da política de privacidade
- Taxa horária real praticada (o código assume 45 €/h)
- Decisão "preço fixo ou preço/hora"
- O repositório está **público** e devia ser privado
- Há um token do GitHub em texto limpo em `GITHUB_TOKEN_REGENERATE.md` (ignorado pelo
  git, mas por revogar)
