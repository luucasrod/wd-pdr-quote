# Relatório — Lote 5

Branch: `codex/lote-5`.

## #44 — horas e taxa por orçamento

### O que mudou

- AW é agora o resultado destacado no painel, detalhe e PDF; o preço ficou secundário.
- A taxa deixou de alterar a configuração global durante o orçamento. Um orçamento novo recebe
  o valor global inicial e um orçamento reaberto restaura `totals.hourlyRate`.
- A página pública não foi alterada.

### Verificação e pendências

- Build, 39 testes e lint passaram nesse ponto.
- Não executei o fluxo manual de guardar/reabrir: a app arrancou, mas não havia browser controlável.
- Continua pendente a decisão do dono sobre preço indicativo ou contacto na página pública.

## #42 — IVA e desconto

### O que mudou

- Desconto absoluto, IVA ligável e taxa de IVA livre por orçamento.
- Ordem: subtotal sem agravamentos, acréscimos, desconto, IVA e total.
- Painel, detalhe, snapshot e PDF mostram as linhas separadas; dados antigos têm fallbacks.

### Verificação e pendências

- Testes confirmam desconto antes do IVA, neutralidade com IVA desligado e
  `1522 × 1,23 = 1872,06`. Build, 41 testes e lint passaram.
- Validação visual/manual não executada por indisponibilidade de browser controlável.

## #40 — faixas extrapoladas

### O que mudou

- Mantidas as 16 linhas. Limites oficiais: 400 ligeiras/médias e 200 severas.
- Linhas extrapoladas destacadas nas Definições; aviso no cálculo, detalhe e PDF.
- O limite oficial já está registado em `CONTEXT.md`.

### Verificação e pendências

- Testes contam exatamente 16 linhas e confirmam aviso a partir de 201 danos severos.
- Build, 43 testes e lint passaram. Validação visual não executada.
- O dono ainda deve decidir os valores reais acima dos limites oficiais.

## #43 — veículo, cliente e tabela do PDF

### O que mudou

- Marca, modelo e cor opcionais no orçamento; cidade, código postal e país no cliente.
- Tipos, mapeadores e importador mantêm compatibilidade com registos antigos.
- Migração adiciona colunas anuláveis.
- PDF identifica veículo/país e usa `Peça | Pequeno | Médio | Grande | Valor`.

### Verificação e pendências

- Build, 43 testes e lint passaram, incluindo round-trip dos mapeadores.
- Migração criada, mas não aplicada ao Supabase. PDF não foi inspecionado manualmente.
- O NIF real da empresa continua por fornecer.

## #45 — seletor de marca

### O que mudou

- Lista estática manual com 61 marcas comuns na Europa, sem chamadas externas.
- Pesquisa por substring sem acentos; `mer` encontra `Mercedes-Benz`.
- Dez resultados no máximo, lista rolável e alvos táteis de 44 px.
- Marca obrigatória; modelo e cor continuam texto livre. Cinco idiomas atualizados.

### Verificação e pendências

- Build, 43 testes e lint passaram; nenhuma integração externa foi adicionada.
- Teste visual a 375 px e com teclado real não executado por indisponibilidade de browser.

## Decisões autónomas a rever

1. O subtotal monetário inclui peças, preparação e acabamento; os agravamentos ficam em linha
   separada antes do desconto.
2. O valor tributável é limitado a zero, evitando total e IVA negativos.
3. IVA começa desligado e em 0%, pois não há taxa padrão segura para todos os países.
4. `Valor` por peça no PDF é `AW da peça × taxa guardada`; custos gerais não são rateados.
5. A lista de marcas foi escrita à mão para eliminar incerteza de licença; modelo ficou livre.
6. Campos novos são opcionais/anuláveis e o total histórico guardado nunca é recalculado.

## Verificação final

- `npm run build`: passou.
- `npm run test`: 43 testes passaram.
- `npm run lint`: apenas os 3 warnings preexistentes de `only-export-components`.
- Nenhum `.env*` adicionado; `src/pages/customer-quote-page.tsx` inalterado.
- Sem merge ou push para `main`.
