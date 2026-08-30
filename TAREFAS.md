# WD PDR — Backlog de implementação

Documento de trabalho. Cada tarefa abaixo é um briefing autossuficiente: pode ser entregue
isolada a um agente de IA sem contexto prévio do projeto.

---

## Contexto do projeto (ler antes de qualquer tarefa)

App de orçamento de PDR (martelinho de ouro / reparo de granizo) para a oficina **WD PDR**, em Leiria, Portugal.
O cliente final marca os amassados numa foto real do carro e recebe um preço na hora; `/oficina` é o painel interno do dono.

- **Stack**: Vite + React 19 + TypeScript + Tailwind v4 + Radix + lucide-react + Framer Motion + jsPDF
- **Rotas atuais** (`src/App.tsx`): `/` (fluxo público), `/privacidade`, `/oficina/*` (painel, navegação por estado interno, não por rota)
- **Persistência atual**: 100% `localStorage`, via `src/hooks/use-local-collection.ts`. Não há backend.
- **i18n**: sistema próprio em `src/i18n/translations.ts` — 5 idiomas completos (pt, en, de, fr, es), tipados por `TranslationShape`.
  **Toda string nova visível ao utilizador tem de ser adicionada nos 5 idiomas**, senão o TypeScript quebra o build.
- **Deploy**: GitHub `luucasrod/wd-pdr-quote` → Vercel, auto-deploy no push para `main`. Produção: `wd-pdr-quote-gmf8.vercel.app`
- **Motor de preço** (`src/lib/pricing.ts`): agrupa marcadores por peça → determina severidade predominante →
  consulta a tabela WKO por faixa de quantidade → soma prep (0.2 AW/peça, teto 1 AW), acabamento e 2 agravamentos de 25% →
  multiplica pela taxa horária.

### Regras de execução (valem para todas as tarefas)

1. **Não superengenheirar.** O dono do projeto pediu explicitamente entregas "básicas, sem ser nada demais".
   Resolver o problema descrito, não construir abstrações para problemas futuros.
2. **Seguir os padrões do repo**: componentes funcionais, `cn()` de `src/lib/utils.ts` para classes,
   tokens CSS (`var(--color-ink-950)`, `var(--color-amber-500)`, `var(--radius-md)`) em vez de cores literais,
   ficheiros em kebab-case, imports com alias `@/`.
3. **Commit de checkpoint antes de mexer em algo arriscado**, para permitir reverter isoladamente.
4. **Verificar sempre no fim**: `npm run build` (tem de passar) e `npm run lint`
   (só são aceitáveis os 3 warnings pré-existentes de `only-export-components`).
5. **Não tocar nas fotos dos veículos nem no posicionamento delas** sem pedido explícito — é área sensível já ajustada à mão.
6. Português de **Portugal** em todo o texto de UI em `pt` (matrícula, contacto, orçamento, ecrã).

### Ordem de execução recomendada

`T0` → `T3` → `T6` → `T1` → `T4` → `T5` → `T2` → `T7`

Motivo: o modelo de dados (T3) tem de estar fechado antes de desenhar o schema do banco (T6);
a autenticação (T1) precisa do Supabase já de pé; T2, T4, T5 e T7 são independentes e podem ir em paralelo no fim.

---

# T0 — Provisionar as contas e chaves (tarefa do Lucas, com apoio da IA)

**Porquê existe esta tarefa**: metade das outras tarefas está bloqueada por coisas que só uma pessoa com cartão
e acesso a email pode criar. Nada disto pode ser feito por um agente sozinho. A IA aqui serve para **guiar passo a passo,
validar que ficou certo e escrever os ficheiros de configuração** — não para criar as contas.

### O que precisa ser criado

**1. Projeto Supabase** (grátis, obrigatório para T1 e T6)
- Criar conta em supabase.com e um projeto novo, região **Europa (eu-west-1 / eu-central-1)** — os dados são de cidadãos da UE, RGPD.
- Nome sugerido: `wd-pdr`.
- Guardar de imediato: **Project URL**, **anon/publishable key** e **service_role key** (esta última nunca vai para o frontend).
- **Decisão pendente**: criar na conta do Lucas ou do dono da oficina. Recomendação: criar na conta do Lucas agora
  (destrava o trabalho) e transferir por *Organization transfer* quando o dono tiver conta — está previsto no Supabase e não perde dados.

**2. Utilizador do dono da oficina**
- Depois do projeto criado: Supabase Dashboard → Authentication → Users → *Add user* → email do dono + password provisória.
- Não usar signup público — a app **não** vai ter registo aberto (ver T1).

**3. Serviço de email transacional** (para a notificação de novo pedido, dentro de T6)
- Opção recomendada: **Resend** (grátis até 3.000 emails/mês).
- ⚠️ **Limitação real a antecipar**: sem domínio próprio verificado, o Resend só deixa enviar para o email
  da própria conta. Como o objetivo é notificar `wd.pdr@gmail.com`, há três saídas:
  - (a) registar um domínio para a oficina (ex.: `wdpdr.pt`) e verificá-lo no Resend — melhor solução, resolve também o email profissional;
  - (b) criar a conta Resend **com** o `wd.pdr@gmail.com` como email do dono da conta — funciona para este caso único, sem domínio;
  - (c) adiar o email e confiar só na notificação dentro do painel (T6 entrega ambas; o email pode ficar desligado por env var).
- Guardar a **API key** do Resend.

**4. Variáveis de ambiente no Vercel** (Project Settings → Environment Variables, ambientes Production + Preview)

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

E, no Supabase (Edge Functions → Secrets), **não no Vercel**:

```
RESEND_API_KEY=...
NOTIFY_EMAIL_TO=wd.pdr@gmail.com
NOTIFY_EMAIL_FROM=...
```

Criar também `.env.local` na raiz do repo com as duas `VITE_*` para desenvolvimento.
Confirmar que `.env.local` está no `.gitignore` (**está** — verificar mesmo assim).

**5. Limpeza pendente**
- Apagar o projeto Vercel órfão `wd-pdr-quote` (sem ligação ao GitHub, sobra do fluxo antigo de upload manual).
  Dashboard → projeto `wd-pdr-quote` → Settings → Delete Project. **Não confundir** com o real, `wd-pdr-quote-gmf8`.

**6. Dados que só o dono da oficina tem**
- **NIF / número de contribuinte da empresa** — falta para o rodapé legal da Política de Privacidade (`src/pages/privacy-policy-page.tsx`).
- **Taxa horária real** praticada hoje (o código assume 45 €/h como default).
- **Decisão sobre a Tabela de Preço Fixo** — ver T5, precisa de resposta antes de a tarefa poder ser executada.

### Critérios de aceite
- [ ] `npm run dev` arranca e a app liga ao Supabase sem erro de credenciais
- [ ] Existe um utilizador do dono criado no Supabase Auth
- [ ] Variáveis presentes no Vercel (Production **e** Preview) e em `.env.local` local
- [ ] Projeto Vercel órfão apagado
- [ ] As três decisões pendentes (conta Supabase, email, tabela fixa) estão respondidas por escrito

---

# T1 — Autenticação real no `/oficina`

**Problema.** Hoje `/oficina` não tem nenhuma proteção. Quem tiver o link vê nomes, telefones e emails de todos os
clientes, o histórico de orçamentos e a tabela de preços — **e pode editar a tabela de preços**. Isto é uma exposição
de dados pessoais sob RGPD e uma exposição comercial direta à concorrência.

**Objetivo.** Só o dono entra no painel, com sessão persistente, sem registo público.

**Depende de**: T0 (projeto Supabase + utilizador criado), T6 (cliente Supabase já configurado no código).

### O que fazer

1. **Criar `src/lib/supabase.ts`** (se T6 ainda não o criou) exportando um cliente único
   `createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)`
   com `auth: { persistSession: true, autoRefreshToken: true }`.

2. **Criar `src/auth/auth-context.tsx`** — Provider com `{ session, user, loading, signIn(email, password), signOut() }`,
   inicializado por `supabase.auth.getSession()` e mantido por `supabase.auth.onAuthStateChange`.
   Envolver a app em `src/main.tsx`, **por dentro** do `BrowserRouter` e a par do `LanguageProvider`.

3. **Criar `src/pages/owner-login-page.tsx`** — ecrã simples e alinhado à identidade: logo em fundo claro
   (o traço preto do logo é ilegível em fundo escuro — restrição real da marca), campos email + password,
   botão `variant="accent"`, mensagem de erro inline. Reutilizar `Input`/`FormField` de `src/components/ui/form.tsx`
   e `Card`. **Sem link de "criar conta"** e **sem** `supabase.auth.signUp` em lado nenhum do código.

4. **Proteger a rota** em `src/App.tsx`: componente `<RequireAuth>` que envolve `<OwnerApp />`.
   - `loading` → spinner centrado (evitar o flash de login em quem já tem sessão)
   - sem sessão → renderizar o login
   - com sessão → `<OwnerApp />`

5. **Ligar o logout**: o botão redondo "WD" no canto direito do `src/components/layout/header.tsx` (linha ~75)
   está morto hoje — não tem `onClick`. Transformar num menu (`@radix-ui/react-dropdown-menu`, ou um popover simples
   se não quiser dependência nova) com o email do utilizador e "Terminar sessão".

6. **Recuperação de password**: não construir ecrã. O dono é um único utilizador — se perder a password,
   reset pelo Supabase Dashboard. Documentar isso no README.

7. Strings novas nos 5 idiomas: `auth.title`, `auth.subtitle`, `auth.emailLabel`, `auth.passwordLabel`,
   `auth.signIn`, `auth.signOut`, `auth.invalidCredentials`, `auth.genericError`.

### Critérios de aceite
- [ ] Aceder `/oficina` sem sessão mostra o login e **nenhum** dado do CRM chega ao browser
- [ ] Login correto entra no painel; recarregar a página mantém a sessão
- [ ] Password errada mostra erro traduzido, não uma exceção na consola
- [ ] "Terminar sessão" volta ao login e limpa a sessão
- [ ] Não existe nenhuma chamada a `signUp` no código
- [ ] `/` e `/privacidade` continuam **públicas** e não pedem login

### Fora do escopo
Múltiplos utilizadores, papéis/permissões, 2FA, recuperação de password na app.

---

# T2 — Rota 404 e blindagem contra ecrã branco

**Problema.** `src/App.tsx` declara três rotas. Qualquer outro URL — um typo, um link antigo, `/oficina` mal escrito —
cai fora do `<Routes>` e **renderiza uma página completamente branca**, sem cabeçalho, sem mensagem, sem caminho de volta.
O mesmo acontece se qualquer componente lançar um erro em runtime: React desmonta a árvore e sobra o `<div id="root">` vazio.

**Objetivo.** Nunca mostrar ecrã branco a um cliente final.

**Depende de**: nada. Pode ser feita já.

### O que fazer

1. **Criar `src/pages/not-found-page.tsx`** — usar o `CustomerHeader` (é o cabeçalho público, não expõe o painel),
   código 404 grande, mensagem traduzida e dois botões: "Voltar ao início" (`Link` para `/`) e o contacto da oficina
   (+351 936 077 121). Nada de link para `/oficina` — não anunciar a existência do painel.

2. **Registar em `src/App.tsx`**: `<Route path="*" element={<NotFoundPage />} />` como última rota.

3. **Criar `src/components/error-boundary.tsx`** — class component com `componentDidCatch`, guardando o erro em estado.
   No fallback: mesmo layout do 404, texto "Algo correu mal", botão "Recarregar" (`window.location.reload()`).
   Fazer `console.error` do erro para ficar visível nos logs do browser.

4. **Envolver em `src/main.tsx`**: `<ErrorBoundary>` por fora do `<BrowserRouter>`.

5. Strings novas nos 5 idiomas: `notFound.code`, `notFound.title`, `notFound.subtitle`, `notFound.backHome`,
   `errorBoundary.title`, `errorBoundary.subtitle`, `errorBoundary.reload`.

6. **Verificar o rewrite do Vercel**: `vercel.json` já reescreve tudo para `/index.html`, portanto o 404 é
   resolvido no cliente e não pelo Vercel — é o comportamento pretendido para uma SPA. Não alterar.

### Opcional (só se sobrar tempo, marcar como tal no commit)
Converter a navegação interna do `/oficina` — hoje um `useState<Page>` em `src/pages/owner-app.tsx` — em rotas
aninhadas reais (`/oficina/orcamentos`, `/oficina/clientes`, `/oficina/orcamentos/:id`…). Isto dá URLs partilháveis
e faz o botão "voltar" do browser funcionar dentro do painel, que hoje sai da app inteira. É refactor de médio porte:
`Page` (`src/types/nav.ts`), `AppShell`, `Header` e `BottomNav` passam a usar `useNavigate`/`useLocation`.

### Critérios de aceite
- [ ] `/qualquer-coisa` mostra o 404 traduzido, não uma página branca
- [ ] Um erro forçado num componente mostra o fallback, não uma página branca
- [ ] O 404 não revela a existência de `/oficina`
- [ ] Build e lint passam

---

# T3 — Guardar os danos no orçamento (marcadores + detalhe por peça)

**Problema.** `SavedQuote` (`src/types/crm.ts:32`) guarda apenas os totais, `partCount` e `markerCount`.
Os marcadores e o breakdown por peça — calculados em `computePartBreakdown` — são **deitados fora** no momento de gravar.
Consequências reais, todas hoje:

- Um orçamento gravado **não pode ser reaberto nem editado**. Se o cliente pedir uma alteração, refaz-se do zero.
- O dono vê "27 amassados, 1.240 €" mas **não vê em que peças**, o que torna o número indefensável frente a um cliente ou seguradora.
- O PDF enviado ao cliente não tem qualquer detalhe do dano — é só um total.
- Se a tabela de preços mudar, não há como recalcular um orçamento antigo.

Esta é a tarefa que mais destrava as outras: sem ela, o pedido do cliente que chegar pelo T6 continua a ser
um número sem conteúdo, e a app não tem como mostrar ao dono *o que* o cliente marcou.

**Objetivo.** O orçamento passa a ser um registo completo e reabrível.

**Depende de**: nada. **Deve ser feita antes de T6** (o schema do banco tem de já nascer com estes campos).

### O que fazer

1. **Estender `src/types/crm.ts`**:

```ts
export interface SavedPartBreakdown {
  partId: PartId
  countMinor: number
  countMedium: number
  countSevere: number
  totalCount: number
  predominantSeverity: DamageSeverity
  partTypeId: string     // ver T4; até lá, "standard" | "aluminum"
  baseHours: number
  hours: number
}

export interface SavedQuoteInputs {
  hourlyRate: number
  finishHours: number
  surcharge1: boolean
  surcharge2: boolean
}
```

   E acrescentar a `SavedQuote`:

```ts
  schemaVersion: number            // começar em 2
  markersByView: ViewMarkers       // marcadores completos, por vista
  partBreakdown: SavedPartBreakdown[]
  inputs: SavedQuoteInputs
```

   `markersByView` e `partBreakdown` guardam o que foi efetivamente cobrado; `inputs` permite reabrir e recalcular.
   **Não** guardar uma cópia da tabela de preços inteira — é peso desnecessário e o breakdown já preserva os valores resolvidos.

2. **Compatibilidade com o que já está gravado.** Há orçamentos reais no localStorage do dono, sem estes campos.
   Criar `src/lib/quote-migration.ts` com `normalizeQuote(raw: unknown): SavedQuote` que preenche
   `schemaVersion: 1`, `markersByView: {}`, `partBreakdown: []` e `inputs` derivados de `totals`.
   Aplicar na leitura, em `src/hooks/use-local-collection.ts` (`load<T>`). Um orçamento v1 continua a abrir e a imprimir,
   apenas sem a secção de detalhe e **sem** botão de editar (ver ponto 4).

3. **Gravar os campos novos**:
   - `src/pages/owner-app.tsx` → `handleSaveQuote()`: passar `markersByView`, `totals.parts` (mapeado para `SavedPartBreakdown`) e `inputs`.
   - `src/pages/customer-quote-page.tsx` → `handleSubmit()`: o mesmo (com `inputs` de valores neutros: sem acabamento nem agravamentos).

4. **Reabrir e editar** (`src/pages/owner-app.tsx`):
   - Criar `handleEditQuote(id)`: lê o orçamento, repõe `vehicleType`, `markersByView`, `aluParts`/tipos de peça,
     `finishHours`, `surcharge1/2`, `hourlyRate`, `clientId`, `insurerId`, `plate`, `notes`, e navega para `page = "quote"`.
   - Introduzir `editingQuoteId: string | null`. Quando preenchido, `handleSaveQuote` chama `updateQuote(id, …)`
     em vez de `createQuote`, e o botão diz "Guardar alterações" em vez de "Guardar orçamento".
   - `resetQuoteState()` tem de limpar `editingQuoteId` — caso contrário "Novo orçamento" sobrescreve o anterior.
     **Este é o bug mais provável desta tarefa; testar explicitamente.**
   - `markerCounter` (o `useRef`) tem de ser reposto acima do maior id existente ao reabrir, senão os ids colidem
     e o React repete keys.

5. **Mostrar o detalhe** (`src/components/quote/quote-detail-view.tsx`):
   - Tabela de breakdown: peça (`t.parts[partId]`), nº de amassados por severidade, tipo de peça, AW.
   - Pré-visualização das vistas com danos: reutilizar `VehicleImageView` + `DamageMarkerLayer` em modo só-leitura
     (sem `onAddMarker`/`onCycleMarker`), uma miniatura por vista que tenha marcadores.
   - Botão "Editar orçamento" → `onEdit(quote.id)`, oculto quando `schemaVersion < 2`.

6. **Detalhe no PDF** (`src/lib/generate-quote-pdf.ts`):
   - Inserir uma secção "Detalhe por peça" entre o bloco cliente/veículo e as linhas de totais.
   - Cabeçalho: Peça · Ligeiras · Médias · Severas · AW. Uma linha por entrada de `partBreakdown`, ordenada por AW desc.
   - **Tratar quebra de página**: um granizo pode ter 14+ peças. Antes de cada linha, se `y > pageHeight - 120`,
     `doc.addPage()`, repor `y = 56` e repetir o cabeçalho da tabela. O ficheiro atual assume uma página só —
     é preciso mexer nisso com cuidado, incluindo o rodapé, que hoje é escrito uma única vez no fim.
   - Orçamentos v1 (sem breakdown) saltam a secção inteira.

7. Strings novas nos 5 idiomas: `quoteDetail.breakdownTitle`, `quoteDetail.colPart`, `quoteDetail.colMinor`,
   `quoteDetail.colMedium`, `quoteDetail.colSevere`, `quoteDetail.colHours`, `quoteDetail.edit`,
   `quoteDetail.damageViews`, `quoteMeta.saveChanges`.

### Critérios de aceite
- [ ] Gravar → sair → reabrir → **os marcadores aparecem exatamente nas mesmas posições**
- [ ] Editar um orçamento e guardar **altera** o existente, não cria um duplicado
- [ ] "Novo orçamento" logo a seguir a editar cria um registo novo
- [ ] Um orçamento antigo (v1) abre, imprime e não rebenta
- [ ] PDF com 14+ peças danificadas pagina corretamente e mantém o rodapé em todas as páginas
- [ ] O total do orçamento reaberto é idêntico ao gravado

### Fora do escopo
Histórico de versões do orçamento, duplicar orçamento, comparar revisões.

---

# T4 — Ligar todos os tipos de peça ao cálculo

**Problema.** As Definições deixam o dono criar e editar tipos de peça com percentagem
(`DEFAULT_PART_TYPES` em `src/data/pricing/pricing-config.ts`: Padrão 0%, Alumínio +20%,
Difícil Acesso / Zona de Garra +25%, Pré-empurrar +25%). Mas o cálculo só conhece o alumínio:
`src/pages/owner-app.tsx:69` procura literalmente `p.id === "aluminum"` e `computePartBreakdown` recebe
um único `aluSurchargePercent` com um `Set<PartId>` binário.

Resultado: **"Difícil Acesso" e "Pré-empurrar" são editáveis e completamente ignorados no preço**, e um tipo novo
criado pelo dono não faz absolutamente nada. É uma funcionalidade que aparenta funcionar e não funciona —
o pior tipo de bug num sistema que gera valores monetários.

**Objetivo.** Cada peça danificada pode receber qualquer um dos tipos configurados, e a percentagem desse tipo entra no preço.

**Depende de**: T3 (o `partTypeId` tem de ser gravado no orçamento).

### O que fazer

1. **Trocar o modelo binário por um mapa** em `src/lib/pricing.ts`:
   - `computePartBreakdown(markers, partTypeByPart: Record<PartId, string>, hourlyTable, partTypes: PartTypeDef[])`
   - Para cada peça: `const type = partTypes.find(p => p.id === (partTypeByPart[partId] ?? "standard"))`,
     `hours = baseHours * (1 + (type?.percent ?? 0) / 100)`.
   - `PartBreakdown.isAlu` sai; entra `partTypeId: string` e `partTypePercent: number`.
   - Se o tipo referenciado já não existir (o dono apagou-o), cair para 0% e **não** rebentar.
2. **Garantir um tipo neutro**: `standard` (0%) passa a ser não removível em `src/components/settings/part-type-table.tsx`
   (esconder o botão de apagar nessa linha). Sem isto, apagar o "Padrão" deixa peças órfãs.
   `addPartType()` em `src/hooks/use-pricing-config.ts` gera ids tipo `row-<timestamp>` — está bem, só não pode colidir com `standard`.
3. **Estado**: `aluParts: Set<PartId>` desaparece de `src/pages/owner-app.tsx` e dá lugar a
   `partTypeByPart: Record<PartId, string>`. `toggleAlu` passa a `setPartType(partId, typeId)`.
4. **UI**: em `src/components/quote/quote-pricing-panel.tsx`, o toggle de alumínio do `PartRow` passa a um `<Select>`
   compacto com os tipos configurados. Mostrar a percentagem aplicada ao lado das horas quando for ≠ 0 (ex.: `+25%`).
5. **Fluxo público** (`src/pages/customer-quote-page.tsx`): continua sem escolha de tipo de peça — passa `{}`,
   tudo resolve para `standard`. O cliente final não sabe o que é uma zona de garra; quem classifica é o dono.
6. **PDF**: mostrar o tipo na linha da peça sempre que for ≠ `standard`.

### Critérios de aceite
- [ ] Marcar uma peça como "Difícil Acesso" **aumenta** o total em 25% da parcela dessa peça
- [ ] Criar um tipo novo com 15% nas Definições e aplicá-lo altera o preço em conformidade
- [ ] Apagar um tipo em uso não rebenta a app nem os orçamentos gravados
- [ ] Um orçamento gravado com um tipo específico reabre com esse tipo selecionado
- [ ] O total continua idêntico ao anterior quando tudo é "Padrão" (não-regressão)

---

# T5 — Tabela de Preço Fixo: decidir e resolver

**Problema.** Existe uma segunda tabela completa (`DEFAULT_FIXED_TABLE`, € por faixa de amassados, semeada a partir
de capturas de ecrã da app antiga da oficina, estendida até 700 amassados), com UI de edição completa, guardada
em `localStorage` — e um aviso amarelo na própria interface a dizer que **não está ativa**.
`computeQuoteTotals` só aceita `hourlyTable`. É código morto visível ao utilizador.

**Bloqueio real: isto precisa de uma decisão do dono da oficina antes de ser executado.**
A app anterior dele trabalhava em € fixo por faixa; a atual trabalha em AW (horas) × taxa horária.
São duas lógicas de negócio diferentes e não há como adivinhar qual ele usa hoje. Pergunta a fazer, literalmente:
*"Quando dá um preço a um cliente, parte de um valor fixo por número de amassados, ou calcula horas de trabalho × valor/hora?"*

### Ramo A — Ativar (recomendado se ele responder "valor fixo" ou "os dois, depende")

1. Adicionar `pricingMode: "hourly" | "fixed"` às definições (`src/hooks/use-pricing-config.ts`, persistido;
   com T6, passa a viver no banco e vale para o fluxo público também).
2. `computeQuoteTotals` ganha o ramo fixo: preço da peça = `lookupPriceTable(fixedTable[severity], count)`,
   somado diretamente em €. Os agravamentos aplicam-se como % sobre o subtotal. **Não há AW neste modo** —
   prep e acabamento, que são medidos em horas, ou saem do cálculo ou passam a um valor € configurável. Confirmar com o dono.
3. UI condicional: `QuotePricingPanel`, `QuoteDetailView` e o PDF escondem as linhas de AW e a taxa horária em modo fixo.
   Este é o grosso do trabalho — hoje o "AW" está escrito à mão em vários sítios.
4. `SavedQuote` guarda o `pricingMode` usado (senão um orçamento antigo é reinterpretado com a lógica errada).
5. Seletor de modo nas Definições, com aviso de que só afeta orçamentos novos.
6. Remover o aviso `t.settingsPage.fixedNotActiveNotice` dos 5 idiomas.

### Ramo B — Remover (se ele responder "sempre horas")

1. Apagar a aba "fixed" de `src/components/settings/settings-page.tsx`, `fixedTable`/`fixedOps`/`resetFixed`
   de `src/hooks/use-pricing-config.ts` e `DEFAULT_FIXED_TABLE` de `src/data/pricing/pricing-config.ts`.
2. Limpar a chave `wd-pdr-price-table-fixed` do localStorage na primeira execução, para não deixar lixo.
3. Remover as strings `tabFixed`, `colFixedValue`, `fixedNotActiveNotice` dos 5 idiomas.

**Não executar nenhum dos ramos sem a resposta.** Se a tarefa chegar a uma IA sem essa resposta, o correto é parar e perguntar.

### Critérios de aceite (ramo A)
- [ ] Alternar o modo muda o preço e a apresentação de forma coerente em ecrã, detalhe e PDF
- [ ] Não sobra nenhuma menção a "AW" no modo fixo
- [ ] Orçamentos gravados em modo horário continuam a mostrar horas

---

# T6 — Envio real: o pedido do cliente tem de chegar à oficina

**Problema — e é o que impede a app de ser usada.** No fim do fluxo público,
`handleSubmit` (`src/pages/customer-quote-page.tsx:95`) grava o orçamento e o cliente no `localStorage`
**do navegador do próprio cliente**. Não há rede, não há servidor, não há envio. O dono nunca vê nada.
E o ecrã final diz *"A oficina já recebeu o seu pedido e vai entrar em contacto em breve"* — uma afirmação falsa,
que deixa um cliente real à espera de um telefonema que não vai acontecer.

**Este é o único item da lista onde a solução não é mexer no texto. É construir o envio.**

Há um segundo bug com a mesma raiz e igualmente grave: o fluxo público chama `usePricingConfig()` e lê
`wd-pdr-hourly-rate`, ambos do `localStorage` **do visitante**, que está vazio. Ou seja, **o preço mostrado ao cliente
usa sempre a tabela de fábrica e 45 €/h**, ignorando por completo o que o dono configurou nas Definições.
A oficina está a anunciar preços que não são os dela. Ambos os problemas desaparecem quando os dados passam a ser partilhados.

**Objetivo.** O pedido do cliente aterra no painel do dono, com todo o detalhe do dano, em segundos —
e o preço que o cliente vê é o preço que o dono configurou.

**Depende de**: T0 (projeto Supabase e chaves), T3 (modelo de dados fechado).

### Arquitetura escolhida

**Supabase (Postgres + Auth + Realtime)**, e não um formulário de email. Motivo: o pedido não pode ser só uma
notificação — tem de entrar no CRM como registo consultável, editável e imprimível, e as definições de preço
têm de ser lidas pelo site público. Isso é um banco de dados. O email entra por cima, como aviso.

### Passo 1 — Schema (SQL, via migração no Supabase)

```sql
-- definições da oficina: linha única, legível publicamente
create table shop_settings (
  id            text primary key default 'default',
  hourly_table  jsonb not null,
  fixed_table   jsonb not null,
  part_types    jsonb not null,
  hourly_rate   numeric not null default 45,
  pricing_mode  text not null default 'hourly',
  updated_at    timestamptz not null default now()
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null, phone text, email text, nif text, address text,
  created_at timestamptz not null default now()
);

create table insurers (
  id uuid primary key default gen_random_uuid(),
  name text not null, phone text, email text, notes text,
  created_at timestamptz not null default now()
);

create table quotes (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'draft',      -- draft | sent | approved | rejected
  source text not null default 'owner',      -- owner | customer
  client_id uuid references clients(id) on delete set null,
  insurer_id uuid references insurers(id) on delete set null,
  vehicle_type text not null,
  plate text, notes text,
  markers_by_view jsonb not null default '{}'::jsonb,
  part_breakdown  jsonb not null default '[]'::jsonb,
  inputs          jsonb not null default '{}'::jsonb,
  totals          jsonb not null,
  part_count int not null default 0,
  marker_count int not null default 0,
  schema_version int not null default 2,
  seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index quotes_created_at_idx on quotes (created_at desc);
```

### Passo 2 — RLS (obrigatório, não opcional)

Ativar RLS nas quatro tabelas. Regra geral: **o público escreve pedidos e lê preços; só o autenticado lê pessoas.**

- `shop_settings`: `select` para `anon` e `authenticated`; `update` só `authenticated`.
- `quotes`: `insert` para `anon` **apenas** com `status = 'sent' and source = 'customer'` (usar `with check`);
  `select`/`update`/`delete` só `authenticated`.
- `clients`: `insert` para `anon`; `select`/`update`/`delete` só `authenticated`.
  (O cliente cria o seu próprio registo ao submeter, mas nunca consegue ler a lista.)
- `insurers`: tudo só `authenticated`.

**Verificar explicitamente**, com a chave anon, que um `select * from quotes` devolve zero linhas.
Uma RLS mal escrita aqui expõe a base de clientes inteira na internet — é o risco número um desta tarefa.

**Anti-spam** (o endpoint de insert é público): manter simples — validação no lado do servidor via
`check constraints` (nome não vazio, `marker_count between 1 and 2000`) e um limite de tamanho no `jsonb`.
Turnstile/hCaptcha fica como melhoria futura, só se aparecer spam a sério.

### Passo 3 — Camada de dados no frontend

- `src/lib/supabase.ts` — cliente único (partilhado com T1).
- `src/lib/mappers.ts` — conversão `snake_case` (banco) ⇄ `camelCase` (tipos de `src/types/crm.ts`). Manter num sítio só.
- Reescrever `src/hooks/use-quotes.ts`, `use-clients.ts`, `use-insurers.ts` e `use-pricing-config.ts` para
  ler/escrever no Supabase, **mantendo exatamente a mesma assinatura pública** (`{ quotes, createQuote, updateQuote, removeQuote, getQuoteById }`).
  Se as assinaturas se mantiverem, nenhum componente precisa de ser tocado — é o que torna esta migração viável.
  Acrescentar `loading` e `error` ao retorno e tratá-los nas páginas (esqueleto/spinner em vez de lista vazia,
  que hoje seria indistinguível de "não há orçamentos").
- `src/hooks/use-local-collection.ts` deixa de ser usado pelos três; manter o ficheiro só se ainda servir algo.

### Passo 4 — Preço correto no fluxo público

`usePricingConfig` passa a ler `shop_settings` do banco. O fluxo público lê `hourly_rate` e `hourly_table`
do servidor, não do `localStorage`. Enquanto carrega, **não mostrar preço nenhum** — mostrar um esqueleto.
Mostrar 45 €/h enquanto carrega e depois saltar para outro valor é pior do que esperar meio segundo.

### Passo 5 — Submissão do cliente

`handleSubmit` passa a `async`:

1. `insert` em `clients` → devolve o `id`
2. `insert` em `quotes` com `source: 'customer'`, `status: 'sent'`, incluindo `markers_by_view` e `part_breakdown` (T3)
3. Só em caso de sucesso avançar para `step = "done"`
4. **Tratamento de erro real**: se falhar, manter o utilizador no formulário, mostrar mensagem traduzida,
   permitir tentar de novo **sem perder os marcadores** (o estado já vive no componente pai — confirmar que não é limpo).
   Um cliente que perde 40 amassados marcados por causa de uma falha de rede não volta.
5. `submitting` já existe e já desativa o botão — garantir que cobre a chamada de rede inteira (hoje é síncrono e inútil).

### Passo 6 — Notificação ao dono

**a) Dentro da app (essencial).** Subscrição Realtime do Supabase a `insert` em `quotes` com `source = 'customer'`.
Badge com contagem no item "Orçamentos" do `Header` e do `BottomNav`; toast ao chegar um pedido com o painel aberto.
Distinguir visualmente os pedidos vindos do cliente na lista (`src/components/quote/quotes-list-page.tsx`),
com uma etiqueta "Novo pedido" enquanto `seen_at` estiver vazio.

**b) Por email (importante — o dono não vai ter o painel aberto).**
Edge Function `notify-new-quote` no Supabase, disparada por *Database Webhook* no `insert` em `quotes`
(filtrar `source = 'customer'`), enviando via Resend para `NOTIFY_EMAIL_TO`.
Conteúdo: nome, telefone, email, matrícula, tipo de veículo, nº de amassados, total estimado e link direto
para o orçamento no painel. Secrets ficam nos secrets da Edge Function, **nunca** no frontend.
Ver as limitações de domínio do Resend descritas em T0 — se ainda não estiverem resolvidas, entregar a função
com um interruptor por env var e deixar o email desligado, sem bloquear o resto da tarefa.

### Passo 7 — Migrar os dados que já existem

O dono pode já ter clientes e orçamentos reais no localStorage do computador dele. Perder isso é inaceitável.
Criar, nas Definições, um botão único **"Importar dados deste navegador"**: lê as chaves
`wd-pdr-quotes`, `wd-pdr-clients`, `wd-pdr-insurers`, `wd-pdr-price-table-hourly`, `wd-pdr-price-table-fixed`,
`wd-pdr-part-types`, `wd-pdr-hourly-rate`, normaliza pelo `normalizeQuote` do T3 e faz upload.
Mostrar quantos registos foram importados. Idempotente: correr duas vezes não pode duplicar
(guardar `legacy_id` nas tabelas e ignorar os já existentes).
Acrescentar também **"Exportar tudo (JSON)"** — vale como backup e custa dez linhas.

### Passo 8 — Só agora, o texto

Com o envio a funcionar de verdade, `t.customer.doneSubtitle` ("A oficina já recebeu o seu pedido…")
passa a ser verdade e **fica como está**. Rever apenas se convém acrescentar um prazo indicativo de resposta —
perguntar ao dono antes de prometer "24 horas" em nome dele.

### Critérios de aceite
- [ ] Submeter um pedido no telemóvel faz o orçamento aparecer no painel **noutro computador**
- [ ] O pedido chega com os marcadores e o breakdown por peça, e abre no detalhe
- [ ] Com a chave anon, `select` em `quotes`, `clients` e `insurers` devolve **zero linhas**
- [ ] Alterar a taxa horária nas Definições muda o preço mostrado no site público (janela anónima, outro dispositivo)
- [ ] Falha de rede na submissão mostra erro e **não perde os danos marcados**
- [ ] Email de aviso chega a `wd.pdr@gmail.com` (ou está documentado por que está desligado)
- [ ] A importação corre duas vezes sem duplicar nada
- [ ] `npm run build` passa e nenhuma chave `service_role` aparece no bundle (`grep -r "service_role" dist/`)

### Fora do escopo
Portal do cliente para acompanhar o pedido, upload de fotos reais do carro pelo cliente, pagamentos, SMS.

---

# T7 — Busca funcional no painel

**Problema.** O campo de busca no `src/components/layout/header.tsx:53` é um `<input>` sem `value`, sem `onChange`
e sem qualquer handler. Não faz nada. O placeholder, traduzido nos 5 idiomas, promete
"Procurar orçamento, cliente ou matrícula…". É uma promessa vazia na barra superior do painel.

**Objetivo.** A busca cumpre exatamente o que o placeholder diz.

**Depende de**: nada (mas se T6 já estiver feito, a busca deve correr sobre os dados do servidor).

### O que fazer

1. Estado no `src/pages/owner-app.tsx` (`query`), passado ao `AppShell` → `Header`. Input controlado, com botão de limpar.
2. Componente `src/components/layout/global-search-results.tsx`: painel flutuante por baixo do input, aberto com
   `query.trim().length >= 2`, com três grupos — **Orçamentos** (matrícula, nome do cliente, id curto, tipo de veículo),
   **Clientes** (nome, telefone, email), **Seguradoras** (nome). Máximo 5 por grupo, com "ver todos".
3. Comparação sem acentos e sem maiúsculas: `.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()`
   dos dois lados. Sem isto, "orcamento" não encontra "orçamento" e a busca parece partida em português.
   Ignorar hífens e espaços na matrícula (`AA-00-AA` tem de ser encontrado por `aa00aa`).
4. Clicar num resultado navega e fecha o painel, limpando a query.
5. Teclado: `Esc` fecha, setas navegam, `Enter` abre o resultado ativo. Fechar ao clicar fora.
6. Estado vazio: "Sem resultados para «…»".
7. **Mobile**: o input está `hidden lg:flex` — no telemóvel a busca não existe. Ou adicionar um ícone de lupa
   que abre a busca em ecrã inteiro, ou deixar como está e assumir a decisão. Recomendação: ícone no `BottomNav`,
   já que o dono provavelmente usa o telemóvel na oficina.
8. Strings novas nos 5 idiomas: `search.groupQuotes`, `search.groupClients`, `search.groupInsurers`,
   `search.noResults`, `search.seeAll`, `search.clear`.

**Alternativa aceitável**: se a busca não for considerada prioritária, remover o input e as strings de placeholder.
O que não pode ficar é o campo morto — ensina o utilizador a desconfiar da interface.

### Critérios de aceite
- [ ] Escrever uma matrícula existente encontra o orçamento, com ou sem hífens
- [ ] "orcamento" encontra "orçamento" (sem acento)
- [ ] Clicar num resultado abre o registo certo
- [ ] `Esc` e clique fora fecham o painel
- [ ] Sem resultados mostra estado vazio, não um painel em branco

---

---

# ✅ PHASE 1 — CONCLUÍDA E INTEGRADA (2026-08-30)

As 7 issues foram executadas em paralelo pelo Claude (#1, #3, #5, #7) e pelo Codex (#2, #4, #6),
integradas na branch `integracao-phase1` e testadas de ponta a ponta no browser.

| Issue | Tarefa | Estado |
|---|---|---|
| #1 | Passcode em `/oficina` | ✅ entregue — **ver ressalva em baixo** |
| #2 | Rota 404 + error boundary | ✅ entregue e testado |
| #3 | Guardar marcadores no orçamento | ✅ entregue — reabrir e editar funcionam |
| #4 | Ligar tipos de peça ao cálculo | ✅ entregue — +25% confirmado no total |
| #5 | Tabela fixa | ⚠️ **removida** sem a decisão do dono — recuperável do histórico |
| #6 | Texto do ecrã final | ✅ passou a dizer a verdade (guardar + contactar), sem prometer contacto |
| #7 | Busca no header | ✅ entregue, depois corrigida para ignorar acentos e hífens |

**Ressalva do #1**: o passcode é uma variável `VITE_`, portanto **fica legível no ficheiro JavaScript
público** — qualquer pessoa o consegue ler. Serve como dissuasor, não como segurança. Hoje o risco
prático é baixo porque não há servidor: um visitante que entre vê o painel **vazio**, com os dados do
próprio navegador. Passa a ser risco a sério no dia em que existir Supabase — aí é obrigatório
substituir pela autenticação real da T1.

**Pendências herdadas da Phase 1**, para uma próxima leva:
- `SavedQuote` sem `schemaVersion` nem migração formal (há tolerância a campos ausentes, mas não versionamento)
- Detalhe do orçamento não mostra a pré-visualização das vistas com os danos marcados
- A chave `wd-pdr-price-table-fixed` fica órfã no localStorage de quem já usou a app
- `translations.ts` continua num único ficheiro — ver a dívida em `docs/REGRAS-AGENTES.md`

---

# 📌 PHASE 1 — repartição original (histórico)

Entrega de 1 dia. Sem Supabase, sem autenticação real, sem envio de pedidos — apenas localStorage + UI.

| Issue | Tarefa | Claude | Codex | Status |
|---|---|---|---|---|
| #1 | Passcode simples em /oficina | ✅ | — | T1 simplificado |
| #2 | Rota catch-all → 404 | — | ✅ | T2 |
| #3 | Guardar marcadores em SavedQuote | ✅ | — | T3 |
| #4 | Ligar tipos de peça restantes | — | ✅ | T4 |
| #5 | Tabela fixa: ativar ou remover? | ✅ | — | T5 (decisão: Lucas) |
| #6 | Corrigir texto 'oficina já recebeu' | — | ✅ | T6 simplificado |
| #7 | Remover/implementar busca no header | ✅ | — | T7 |

**Total**: 4 issues Claude, 3 issues Codex. **Entrada**: docs/CONTEXT.md com código-fonte + rota actual. **Saída**: PR com as 7 resolvidas.

---

## Resumo das dependências (Phase 1)

| Issue | Depende de | Bloqueada por |
|---|---|---|
| #1 Passcode | — | — |
| #2 404 | — | — |
| #3 SavedQuote | — | — |
| #4 Tipos peça | #3 (guardar `partTypeId`) | — |
| #5 Tabela fixa | #3 (guardar modo) | **Sim** — decisão do Lucas |
| #6 Texto | — | — |
| #7 Busca | — | — |

---

## PHASE 2: COM BACKEND (futuro — T0, T1 real, T6)

Bloqueada por Supabase. Reintroduz autenticação real, CRM completo, envio de pedidos, notificações.
