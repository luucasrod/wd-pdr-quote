# FILA — WD PDR

A fila de trabalho, em ordem de dependência. **Ler o [WORK_PROTOCOL](WORK_PROTOCOL.md)
antes de pegar em qualquer coisa**, sobretudo a secção 4 (tarefas SOLO).

Marcar aqui o estado **antes** de começar, commitar e empurrar de imediato.

Estados: `pronta` · `em-curso — <agente>` · `em-revisao` · `bloqueada` · `requer-humano`

> ## ⚠️ Hoje a fila é toda do CODEX
> Por decisão do Lucas (31/08/2026), **o Claude não está a ser usado nesta fila** (limite de
> tokens). Todas as tarefas são do Codex, executadas **uma de cada vez, em série**. Sem
> disputa de claim e sem ensaio de merge contra outra branch — não há outra branch.
>
> As marcações `SOLO` ficam na mesma: valem para quando houver dois agentes outra vez, e
> assinalam as tarefas que mexem no modelo partilhado.
>
> **A revisão continua a existir**: uma sessão implementa, **outra sessão** (papel REVIEWER,
> worktree diferente) revê. Quem escreveu não aprova — mesmo sendo o mesmo modelo.

---

## Ordem de execução

Com um agente só, tudo corre em série, por esta ordem:

```
FEITAS: F1 · F2 · F3 · F4 · F5 · F14
A FAZER: F15 → F16 → F17 → F18 → F13 → [espera H1] → F6 (SOLO) → F7 (SOLO) → F8 → F9 → F10 → F11
```

**As issues estão agora no GitHub** (`gh issue list`), que passa a ser a fila real.
Este ficheiro mantém o contexto e a ordem; o estado de cada tarefa vive na issue.

Se o Codex voltar, os grupos que podem correr em paralelo são `F2·F3·F4·F5·F14` e,
depois de F7, `F8·F9·F10·F11`.

> **F1 primeiro, e sozinha.** Ela parte o `translations.ts`, que foi a origem de 6 dos 9
> conflitos da Phase 1. Fazer F1 antes de tudo é o que torna o paralelismo seguro depois.

---

# BLOCO A — dá para fazer já, sem Supabase

## F1 — Partir o `translations.ts` em ficheiros por área
**`SOLO`** · estado: `feita` · sem dependências

**Problema.** `src/i18n/translations.ts` tem ~1400 linhas e concentra os 5 idiomas num só
ficheiro. Qualquer tarefa que acrescente texto passa por ele. Na Phase 1 isso gerou 6 dos
9 conflitos entre os dois agentes.

**O que fazer.** Partir em `src/i18n/<idioma>/<area>.ts` (`common`, `nav`, `quotes`,
`customer`, `settings`, `clients`, `insurers`, `auth`, `errors`), com um `index.ts` por
idioma a compor o objeto e o `TranslationShape` a manter-se como está. **Zero mudanças
visíveis na app** — nenhuma string alterada, nenhum componente tocado.

**Aceite.** `npm run build` passa · a app mostra exatamente o mesmo texto nos 5 idiomas ·
`git diff --stat` não mostra alterações em `src/components/` nem em `src/pages/`.

---

## F2 — Testes ao motor de preço
estado: `feita` · sem dependências · pode correr em paralelo

**Problema.** `src/lib/pricing.ts` calcula dinheiro e nunca foi verificado automaticamente.

**O que fazer.** Instalar `vitest`, criar `src/lib/pricing.test.ts`. Cobrir: faixas da
tabela WKO (fronteiras 0/1, 2/3, 700+) · severidade predominante com empates ·
percentagem do tipo de peça · teto de 1 AW da preparação · os dois agravamentos de 25% ·
tipo de peça inexistente cair para 0% sem rebentar. Acrescentar `"test": "vitest run"`
aos scripts.

**Aceite.** `npm run test` passa · pelo menos um teste falharia se o teto da preparação
fosse removido (verificar removendo-o à mão e voltando a pôr).

---

## F3 — Carregar o jsPDF só quando é preciso
estado: `feita` · sem dependências · pode correr em paralelo

**Problema.** O bundle principal tem 976 kB. jsPDF + html2canvas (~380 kB) entram nele mas
só são usados quando alguém carrega em "Baixar PDF". Todo o cliente final paga esse peso
para ver a primeira página, muitas vezes em dados móveis na rua.

**O que fazer.** `import()` dinâmico em `src/lib/generate-quote-pdf.ts`. Manter o estado de
`downloading` a cobrir também o tempo de carregamento do módulo.

**Aceite.** O bundle principal desce visivelmente (registar o antes/depois no PR) · o
download do PDF continua a funcionar no detalhe do orçamento e no ecrã final do cliente.

---

## F4 — Mostrar os danos no detalhe do orçamento
estado: `feita` · sem dependências · pode correr em paralelo

**Problema.** O orçamento já guarda os marcadores (Phase 1), mas o detalhe só mostra números.
O dono vê "27 amassados, 1.240 €" sem ver **onde**, o que torna o valor indefensável
frente a um cliente ou a uma seguradora.

**O que fazer.** Em `src/components/quote/quote-detail-view.tsx`, reaproveitar
`VehicleImageView` + `DamageMarkerLayer` em modo só-leitura (sem `onAddMarker` nem
`onCycleMarker`), uma miniatura por vista que tenha marcadores. Esconder quando o
orçamento for antigo e não tiver `markersByView`.

**Aceite.** Um orçamento gravado mostra as vistas com os pontos nas posições exatas ·
um orçamento antigo abre sem rebentar e sem secção vazia · não é possível editar a partir daqui.

---

## F5 — Inferência de peça por tipo de veículo
estado: `feita` · sem dependências · pode correr em paralelo · **exige F2 feita antes**

**Problema.** `src/lib/part-inference.ts` usa as mesmas faixas de coordenada para os
5 veículos. Uma van e um compacto têm proporções muito diferentes, e a peça inferida
errada muda o agrupamento — logo, **muda o preço**.

**O que fazer.** Passar as faixas a depender de `VehicleType`. Ajustar contra as fotos reais
de cada tipo. Documentar no PR como foram escolhidas as fronteiras.

**Aceite.** Testes cobrindo os 5 tipos nas fronteiras · um clique no mesmo sítio da foto de
uma van e de um sedan pode dar peças diferentes, e isso é intencional e está justificado.

---

## F14 — Melhorar a qualidade das 25 fotos dos veículos
estado: **`feita`** — 02/09/2026, sessão principal do Claude

**O bloqueio do lote 1 foi resolvido.** `brand_assets/` estava inteiro no `.gitignore`, portanto
os originais não existiam em worktree nenhuma. Agora `brand_assets/vehicle_backup/` (as 25 fontes
420×280) e os scripts estão versionados. Qualquer agente lhes chega.

**O problema, medido.** As fotos publicadas são 840×560, obtidas por upscale 2× (Lanczos + nitidez)
de originais de **420×280 com ~8 KB**. Reexportar com mais qualidade de JPEG não resolve — a
pixelização está gravada na origem, e o Lanczos amplia sem inventar detalhe.

**Decisão tomada (Lucas, 02/09/2026): super-resolução com `realesrgan-ncnn-vulkan`.**
Binário autónomo das releases oficiais do Real-ESRGAN (v0.2.5.0, ~43 MB), sem Python nem PyTorch.
Modelo **`realesrgan-x4plus`** — o de fotografia. **Não usar o `-anime`**, que é o predefinido do
executável e destrói fotografia real.

```
realesrgan-ncnn-vulkan.exe -i <entrada> -o <saida> -n realesrgan-x4plus -m models -s 4 -f png
```

**Restrições, que não se negoceiam**: mesmo carro, mesma cor, mesmo enquadramento, mesmo ângulo.
Partir sempre dos originais 420×280, **nunca** das imagens já ampliadas em `src/assets/vehicles/`.

**Cuidados.**
- Commit de checkpoint antes de substituir.
- Escala 4× dá 1680×1120 — adequado para ecrãs de alta densidade, já que a área de exibição ronda
  os 530 px de largura. O componente dimensiona por `max-width`/`max-height`, portanto imagens
  maiores não desalinham nada.
- Guardar como **JPEG com o mesmo nome de ficheiro**, para não ser preciso mexer em
  `src/data/vehicle/vehicle-images.ts`.
- Duas das 25 não são 3:2. Como o upscale é uma escala pura, a proporção mantém-se sozinha —
  **confirmar mesmo assim**.
- Folha de comparação antes/depois no PR (`brand_assets/make_compare.py`).

**Aceite.** As 25 visivelmente mais nítidas · mesmo carro, cor, ângulo e enquadramento ·
proporção de cada uma preservada · peso total documentado · a marcação de danos continua a cair
no sítio certo (clicar na porta continua a inferir a porta).

---

## F13 — Separar as duas faces por domínio e subdomínio
estado: `bloqueada` (espera **H7**, comprar o domínio) · sem dependências de código

**Situação atual, verificada.** As duas faces **já estão online**, na mesma aplicação:
`wd-pdr-quote-gmf8.vercel.app/` é o cliente e `/oficina` é o painel (confirmado, HTTP 200).
Não há nada partido — o que falta é a separação por domínio.

**Objetivo.** `wdpdr.pt` → face do cliente. `oficina.wdpdr.pt` → painel.
Quem entra no domínio principal não chega ao painel, e vice-versa.

**Como fazer — decidir entre dois desenhos, e explicar a escolha no PR:**

- **(a) Uma app, dois domínios.** Adicionar os dois domínios ao mesmo projeto Vercel e a app
  decide o que mostrar pelo `hostname`. Simples, um só build, um só deploy.
  ⚠️ **Não é separação real**: o JavaScript servido continua a conter as duas faces, e quem
  souber procurar encontra o painel no bundle.
- **(b) Dois projetos Vercel do mesmo repositório**, com uma variável de build
  (`VITE_APP_FACE=client` ou `oficina`) que exclui a outra face do bundle.
  Mais trabalho de configuração, mas o site do cliente **não contém sequer o código do painel**.

**Recomendação: (b)**, precisamente porque o cliente final e o painel têm públicos
diferentes e não há razão para o público carregar o painel.

**⚠️ Ler isto antes de prometer segurança a alguém.** Separar por subdomínio é organização
e higiene, **não é segurança**. O que protege os dados da oficina é a autenticação real
(F9) e as políticas RLS no Supabase. Um painel num subdomínio sem login continua aberto a
quem souber o endereço. **F13 não substitui F9.**

**Aceite.** `wdpdr.pt` abre o fluxo do cliente e não dá acesso ao painel · `oficina.wdpdr.pt`
abre o painel · os dois com HTTPS e certificado válido · o link antigo `.vercel.app` continua
a funcionar ou redireciona · no desenho (b), `grep` ao bundle do cliente não encontra código do painel.

---

# A FILA VIVE NO GITHUB

`gh issue list` é a fonte de verdade. Este ficheiro guarda o contexto e a ordem.

## Correções comprovadas (fazer primeiro)

| # | Tarefa | Prioridade |
|---|---|---|
| [#8](https://github.com/luucasrod/wd-pdr-quote/issues/8) | App rebenta com localStorage bloqueado | Crítica |
| [#9](https://github.com/luucasrod/wd-pdr-quote/issues/9) | Marcar amolgadelas impraticável no telemóvel | Crítica |
| [#10](https://github.com/luucasrod/wd-pdr-quote/issues/10) | Link partilhado não mostra preview | Média |
| [#11](https://github.com/luucasrod/wd-pdr-quote/issues/11) | Apagar é definitivo, sem desfazer | Alta |

## Auditorias — investigar, não implementar (ver WORK_PROTOCOL 4b)

| # | Tarefa | Nota |
|---|---|---|
| [#12](https://github.com/luucasrod/wd-pdr-quote/issues/12) | Segurança do painel | parte já conhecida, ler antes |
| [#13](https://github.com/luucasrod/wd-pdr-quote/issues/13) | Isolamento entre orçamentos | **sem backend, quase tudo espera** |
| [#14](https://github.com/luucasrod/wd-pdr-quote/issues/14) | Persistência e perda de dados | |
| [#15](https://github.com/luucasrod/wd-pdr-quote/issues/15) | Queda de internet | **o envio ainda não usa rede** |
| [#16](https://github.com/luucasrod/wd-pdr-quote/issues/16) | Envio duplicado | parcialmente testável |
| [#17](https://github.com/luucasrod/wd-pdr-quote/issues/17) | Validação e casos extremos | |
| [#18](https://github.com/luucasrod/wd-pdr-quote/issues/18) | Compatibilidade mobile | |
| [#19](https://github.com/luucasrod/wd-pdr-quote/issues/19) | Consistência do dashboard | pista concreta na issue |
| [#20](https://github.com/luucasrod/wd-pdr-quote/issues/20) | Tratamento de erros | |
| [#21](https://github.com/luucasrod/wd-pdr-quote/issues/21) | Privacidade e RGPD | |

## Melhoria independente

[#22](https://github.com/luucasrod/wd-pdr-quote/issues/22) — confirmar o telefone antes de enviar.

## Ordem recomendada

`#8 → #9 → #11 → #10`, e depois as auditorias por
`#12 → #13 → #14 → #15 → #16 → #17 → #18 → #20`. A #22 entra quando calhar.

Três auditorias estão marcadas `bloqueada-por-backend`: dão para fazer em parte, mas a maior
metade só passa a valer depois do Supabase. **Cada uma diz na própria issue o que é testável hoje.**

---

# BLOCO B — bloqueado até existir conta Supabase do dono (H1)

> Os briefings detalhados destas tarefas estão em **[../../TAREFAS.md](../../TAREFAS.md)**
> (T6 para dados, T1 para autenticação). Ler lá antes de começar.

## F6 — Camada base do Supabase
**`SOLO`** · estado: `bloqueada` (espera H1)

`src/lib/supabase.ts` (cliente único) + `src/lib/mappers.ts` (conversão snake_case ⇄
camelCase, num sítio só) + `@supabase/supabase-js` nas dependências.
Nada de lógica de negócio aqui — só a fundação.

**Aceite.** `npm run dev` liga sem erro de credenciais · um `select` de teste ao
`shop_settings` devolve a linha.

## F7 — Migrar os 4 hooks de dados para o Supabase
**`SOLO`** · estado: `bloqueada` (espera F6)

`use-quotes`, `use-clients`, `use-insurers`, `use-pricing-config` passam a ler/escrever no
banco, **mantendo exatamente a mesma assinatura pública**. Se as assinaturas se mantiverem,
nenhum componente precisa de ser tocado — é o que torna esta migração viável.
Acrescentar `loading` e `error`, e tratá-los nas páginas (esqueleto, não lista vazia).

**Resolve dois bugs de uma vez**: o preço do site público deixa de ser o de fábrica, e os
dados deixam de viver por navegador.

## F8 — Submissão real do pedido do cliente
estado: `bloqueada` (espera F7) · paralelo depois

`handleSubmit` passa a chamar `supabase.rpc('submeter_pedido', {...})`.
⚠️ **Nunca `insert ... returning`** — ver CONTEXT, regra 2.
Erro de rede mantém o utilizador no formulário **sem perder os danos marcados**.

## F9 — Autenticação real no `/oficina`
estado: `bloqueada` (espera F6) · paralelo depois

Substitui o passcode por Supabase Auth (email + password, sem registo público).
Ligar o botão "WD" do header a um menu com terminar sessão. Ver T1 em TAREFAS.md.

## F10 — Aviso de novo pedido no painel
estado: `bloqueada` (espera F7) · paralelo depois

Subscrição Realtime a `insert` em `quotes` com `source = 'customer'`. Badge no "Orçamentos",
etiqueta "Novo pedido" enquanto `seen_at` for nulo, e marcar como visto ao abrir.

## F11 — Importar e exportar dados
estado: `bloqueada` (espera F7) · paralelo depois

Nas Definições: "Importar dados deste navegador" (lê as chaves `wd-pdr-*` do localStorage,
sobe para o banco, **idempotente** via `legacy_id`) e "Exportar tudo (JSON)".
Sem isto, o dono perde o histórico dele na migração.

## F12 — Email de aviso de novo pedido
estado: `requer-humano` (precisa de chave Resend e decisão sobre domínio)

Edge Function disparada por webhook no `insert`. Ver T6 passo 6b em TAREFAS.md.

---

# BLOCO C — só pessoas podem fazer

| id | O quê | Quem | Bloqueia |
|---|---|---|---|
| **H1** | Wan Diego cria conta Supabase, cria o projeto (região `eu-west-1`) e convida o Lucas como **Developer** | Wan Diego + Lucas | o bloco B inteiro |
| **H2** | Tornar o repositório privado e revogar o token exposto | Lucas | nada, mas é urgente |
| **H3** | NIF da empresa · taxa horária real · decidir "preço fixo ou preço/hora" | Wan Diego | rodapé legal, preço correto, tabela fixa |
| **H4** | Confirmar que o cron `/api/keep-alive` corre em produção e que as variáveis estão no Vercel | Lucas | a app não adormecer |
| **H5** | Apagar o projeto Supabase "WD PDR" pausado da conta do Lucas, depois de H1 | Lucas | libertar a quota |
| **H6** | Pedir ao Wan Diego os **ficheiros originais** das 25 fotos dos veículos, em resolução alta | Lucas | torna a F14 trivial e perfeita |
| **H7** | Comprar o domínio da oficina (ex.: `wdpdr.pt`) e apontar ao Vercel | Lucas + Wan Diego | F13, e o email profissional do Resend |
