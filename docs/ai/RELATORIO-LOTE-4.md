# Relatório — Lote 4

Branch: `codex/lote-4`  
Data: 03/09/2026  
Condição do lote: implementação sem projeto Supabase ligado. Nenhuma afirmação abaixo substitui a validação contra a base real.

## #31 — Camada base

### Alterado

- Adicionado `@supabase/supabase-js`, cliente único opcional e tipos do schema existente.
- Criados mappers centralizados para clientes, seguradoras, orçamentos e preços.
- O cliente só é criado quando URL e chave publicável existem.

### Testado sem credenciais

- Testes unitários dos mappers nos dois sentidos.
- Build sem variáveis Supabase.
- Ausência de segredos no diff.

### Por verificar contra uma base real

- Inicialização com URL/chave reais e leitura da linha `shop_settings.default`.
- Compatibilidade integral dos tipos manuais com as respostas reais do PostgREST.

## #34 — Autenticação

### Alterado

- Substituído o passcode por email/password do Supabase Auth, com persistência e renovação de sessão.
- Adicionado `RequireAuth`; nenhuma chamada `signUp` existe.
- O botão WD mostra o email e permite terminar sessão.
- Documentado no README que criação e recuperação do único utilizador são feitas no dashboard.

### Testado sem credenciais

- `/oficina` mantém o modo local e as rotas públicas continuam no bundle/build.
- Pesquisa estática confirmou a remoção de `VITE_OFICINA_PASSCODE`, passcode e `signUp`.

### Por verificar contra uma base real

- Login válido e inválido, persistência após reload, renovação e logout.
- Confirmar no separador Network que nenhum pedido às tabelas CRM ocorre antes da sessão.
- Confirmar configuração de URL de redirecionamento no Supabase.

## #32 — Hooks de dados

### Alterado

- `useQuotes`, `useClients`, `useInsurers` e `usePricingConfig` escolhem Supabase quando configurado e `localStorage` caso contrário.
- Mantidas as operações públicas existentes; acrescentados `loading` e `error`.
- As páginas mostram estado de carregamento/erro em vez de lista vazia.
- A taxa horária passou a vir de `shop_settings` juntamente com tabelas e tipos de peça.

### Testado sem credenciais

- Suite, build e lint em modo local.
- As chaves locais e o mecanismo de sincronização entre abas da #24 foram preservados.

### Por verificar contra uma base real

- CRUD completo das quatro fontes, incluindo permissões RLS autenticadas.
- Propagação entre múltiplas instâncias dos hooks e múltiplas abas.
- Valores `numeric/jsonb`, erros de rede, sessão expirada e estados vazios.
- Escrita e leitura da taxa horária e configuração pública no browser anónimo.

## #33 — Submissão pública

### Alterado

- Com Supabase, o cliente chama exclusivamente `rpc('submeter_pedido')`.
- Falha mantém o rascunho e as marcações, regressa ao formulário, mostra erro traduzido e permite repetir.
- Sem Supabase, mantém a gravação local anterior.

### Testado sem credenciais

- Caminho local compilado e coberto pela suite existente.
- Pesquisa confirmou que a página pública não faz inserts diretos em `clients` ou `quotes`.

### Por verificar contra uma base real

- Pedido criado com `source='customer'`, cliente associado e payload completo.
- Falha real de rede/RLS e repetição sem duplicação no mesmo gesto.
- Validações da migration mais recente e limites de payload.
- Só depois desta validação deve ser alterado o texto final para afirmar que a oficina recebeu o pedido.

## #35 — Novos pedidos e importação

### Alterado

- Subscrição Realtime de inserts `customer`, badge no header/BottomNav e etiqueta na lista.
- Abrir o detalhe grava `seen_at`.
- Importação autenticada de todas as chaves locais; `legacy_id` evita duplicação e preserva relações cliente/seguradora.
- Resultado apresenta contagens; exportação JSON existente permanece disponível.

### Testado sem credenciais

- Build, suite e lint; botão de importação fica oculto no modo local sem Supabase.
- Fluxo e nomes de colunas comparados com as quatro migrations versionadas.

### Por verificar contra uma base real

- Realtime habilitado para `quotes` e entrega efetiva do evento filtrado.
- Contagem e desaparecimento do badge ao abrir.
- Importar uma cópia real duas vezes e confirmar zero duplicados na segunda.
- Relações, datas, configurações, registos parcialmente importados e recuperação após erro intermédio.

## #36 — Pesquisa móvel

### Alterado

- Adicionado controlo abaixo de `lg`, com os mesmos resultados/campos do desktop.
- Resultados têm alvo tátil de 48 px e lista limitada a `45svh`, com scroll próprio para não ficar tapada pelo teclado.

### Testado de facto

- Build e lint.
- Não foi possível executar a verificação visual: a sessão não tinha browser ligado (a ferramenta devolveu uma lista vazia).

### Por verificar manualmente

- Viewports 320, 390 e 768 px.
- Android Chrome e iPhone Safari com teclado aberto.
- Seleção por toque, fecho da pesquisa e abertura do orçamento correto.

## Verificação final

- `npm run test`: 10 ficheiros, 39 testes aprovados.
- `npm run build`: aprovado.
- `npm run lint`: apenas os 3 warnings pré-existentes de `react/only-export-components`.
- Bundle principal: 612,93 kB minificado / 191,66 kB gzip. Chunks PDF continuam separados: jsPDF 399,17 kB; html2canvas 199,49 kB.
- Nenhuma fotografia de veículo nem posicionamento foi alterado.
- Nenhuma base real, conta, configuração Supabase/Vercel ou infraestrutura externa foi tocada.

## Decisões para revisão humana

- Sem credenciais, `RequireAuth` deixa `/oficina` em modo local para cumprir o fallback do lote; em produção com variáveis, exige sessão.
- IDs criados pelo painel em modo Supabase usam `crypto.randomUUID()` para manter retornos síncronos compatíveis com a UI atual.
- Os tipos do schema são manuais; o cliente PostgREST não usa o genérico desses tipos porque as estruturas JSON ricas do domínio não satisfazem diretamente as restrições `Json` do SDK. Rever depois de ser possível gerar tipos do projeto real.
- A importação é sequencial para preservar relações e tornar falhas localizáveis; uma falha intermédia pode deixar importação parcial, mas repetir retoma pelos `legacy_id`.
