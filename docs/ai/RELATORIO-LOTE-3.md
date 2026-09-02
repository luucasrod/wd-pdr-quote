# Relatório — Lote 3

Data: 2 de setembro de 2026  
Papel: CODEX — BUILDER  
Worktree: `A:\CLIENTES\APPS-WEBSITE\WD\wd-pdr-quote-codex-builder`  
Branch: `codex/lote-3`

## Fase 1 — Correções

### #24 — feita

As coleções passaram a reler o valor mais recente do `localStorage` antes de cada mutação, a notificar outras instâncias do hook no mesmo documento e a ouvir `storage` entre abas. Criação, atualização e remoção deixam de partir do snapshot React potencialmente antigo. Teste automatizado reproduz duas escritas a partir de snapshots concorrentes e confirma `[B, A]`, sem perder A. Build, testes e lint passaram. Não foi possível repetir visualmente em duas abas porque o browser da sessão estava indisponível.

Commit: `390e913`.

### #27 — feita

`lerJson` valida o shape das três coleções, tabela horária, tipos de peça, idioma e valores primitivos. JSON inválido ou com shape errado cai no fallback da chave afetada, sem limpar o resto do storage. Texto simples legado só é aceite para idiomas reconhecidos. Testes cobrem JSON inválido e shape errado em todas as chaves estruturadas conhecidas. Build, 25 testes e lint passaram.

Commit: `394c85c`.

### #23 — feita

O fluxo público guarda passo, veículo, vista, marcações, contacto e consentimento num rascunho local e restaura-o após recarregar. O rascunho expira 24 horas após a última alteração e é removido ao submeter ou iniciar “Novo pedido”. O formulário passou a ser controlado pela página para permitir restauração sem confundir o rascunho com um pedido enviado. Testes cobrem restauração, expiração e descarte de shape inválido. Build, 27 testes e lint passaram. A restauração visual não foi testada por indisponibilidade do browser.

Commit: `06f6dfe`.

### #26 — feita, com limitação de verificação

Os dois pontos de download de PDF mostram erro traduzido e transformam o botão em tentativa novamente quando a geração falha. Imagens de veículos mostram placeholder traduzido e botão de repetição após `onError`. As novas mensagens existem nos cinco idiomas. Build, testes existentes e lint passaram. Não foi possível forçar visualmente falha de chunk/rede ou erro de imagem, e não foi acrescentado teste de componente para estes estados; devem ser confirmados na revisão.

Commit: `5e2aad4`.

### #28 — feita

Foi criado um lock síncrono independente do estado React. No fluxo público fica adquirido durante a submissão e só é libertado em “Novo pedido”; no painel bloqueia gravações duplicadas no mesmo tick. O botão público continua desativado pelo estado `submitting`. Teste chama a mesma intenção duas vezes no mesmo tick e observa uma única escrita. Build, 28 testes e lint passaram.

Idempotência persistida na futura RPC Supabase não foi implementada porque não existe backend ligado neste lote; o lock resolve apenas o gesto duplicado no frontend pedido agora.

Commit: `76d5564`.

### #25 — feita no frontend; SQL escrito mas não executado

O frontend valida telefone plausível (caracteres permitidos e 9–15 algarismos), mantém validação nativa de email e impõe os limites de nome, telefone, email, matrícula e notas. As mensagens de telefone existem nos cinco idiomas. O pedido local passou também a guardar `markersByView` e o breakdown calculado, mantendo payload e contagens coerentes.

A migration `20260902210000_validar_submissao.sql` substitui a RPC com validação de comprimentos, telefone, email, tipo de veículo, shape/contagem de marcadores, breakdown, totais e tamanho. Não havia projeto Supabase ligado: a migration **não foi aplicada nem testada contra PostgreSQL/Supabase real** e precisa de revisão/execução antes de produção. Os testes frontend de telefone, build e lint passaram.

Commit: `9495f27`.

### #30 — feita apenas na parte factual autorizada

A secção 4 da política diz agora que os dados ficam no navegador do próprio cliente e não são enviados automaticamente à equipa, servidor ou base de dados. A data de atualização foi corrigida. Não foram inventados NIF, prazo de conservação ou processo de apagamento; continuam bloqueados por decisão do dono em H3. Build, testes e lint passaram; `/privacidade` respondeu HTTP 200.

Commit: `8bf5a5d`.

### #22 — feita

Depois do contacto há um ecrã dedicado que apresenta o telefone em grande, agrupado, e pede confirmação. “Corrigir número” regressa ao mesmo formulário controlado, preservando todos os campos, consentimento, veículo e amolgadelas. O passo de confirmação também entra no rascunho. Textos existem nos cinco idiomas e o agrupamento tem teste automatizado. Optei por não confirmar o email: a issue deixava essa ponderação aberta e a confirmação adicional acrescentaria atrito sem resolver o objetivo principal. Build, 36 testes e lint passaram. Não foi possível testar num telemóvel real.

Commit: `fa5c245`.

## Fase 2 — Auditoria #18

Nenhuma linha de `src/` foi alterada nesta fase.

### Testado

- Servidor Vite local em execução.
- `/`, `/oficina` e `/privacidade`: HTTP 200.
- Inspeção das regras responsivas do cabeçalho, navegação inferior, contentor do veículo, formulário, modais e viewport.
- Área segura: `BottomNav` usa `padding-bottom: env(safe-area-inset-bottom)` e o conteúdo do painel reserva `pb-28`.
- Paisagem por estrutura: o veículo usa `aspect-ratio` e não existe contentor de viewport com altura fixa; a página mantém scroll documental. Isto não substitui um teste visual.

### Encontrado

- A pesquisa global do painel é a única pesquisa por nome, telefone, email, matrícula, id e veículo, mas o contentor usa `hidden lg:flex`. Abaixo de 1024 px não há campo nem alternativa na navegação inferior. Aberta a issue **#36 — Disponibilizar pesquisa global do painel em telemóvel e tablet**, gravidade média, com reprodução e critérios de aceite.

### Não testado

O browser da sessão devolveu literalmente `No browser is available`. Não havia iPhone, Android ou outro dispositivo físico. Por isso não foram dados como aprovados:

- Safari real de iPhone e Chrome real de Android;
- retrato/paisagem visual, cortes e comportamento de scroll;
- teclado aberto e reposicionamento dos campos;
- pinch zoom, pan e marcação com toque real após a #9;
- zoom do navegador;
- modais e botões junto às bordas;
- fluxo visual completo até ao envio.

Estes cenários são aplicáveis, mas ficaram **não testados** — não são “sem problemas encontrados”. A área segura foi confirmada apenas no código, não num iPhone com indicador Home.

### Não aplicável

- Testes de rede/backend durante o envio: a submissão publicada ainda é 100% `localStorage`, sem endpoint ligado.
- Idempotência RPC real: não existe projeto Supabase ligado neste lote.

O resultado e as limitações foram registados num comentário da #18.

## Estado final

- Build: passou.
- Testes: 9 ficheiros, 36 testes, todos passaram.
- Lint: passou apenas com os 3 warnings pré-existentes de `react(only-export-components)` (`badge.tsx`, `button.tsx`, `language-context.tsx`).
- Bundle principal: 605,08 kB minificado / 189,53 kB gzip.
- Chunk jsPDF: 399,17 kB / 129,62 kB gzip; `html2canvas`: 199,49 kB / 46,77 kB gzip; `index.es`: 151,44 kB / 48,91 kB gzip.
- Aviso Vite: chunk principal acima de 500 kB; já existente, não pertence ao âmbito deste lote.
- Verificação HTTP local: três rotas principais responderam 200.
- Ensaio de merge cruzado: não aplicável segundo o modo atual do protocolo e a indicação do lote de que não havia outro builder ativo.

## Decisões autónomas a rever por uma pessoa

1. Prazo do rascunho: 24 horas desde a última alteração. Rever se o risco de dados pessoais em dispositivo partilhado pede um prazo menor.
2. #22: confirmar apenas telefone, não email, para evitar um segundo passo de atrito.
3. Regex de telefone: aceita formatos internacionais plausíveis com 9–15 algarismos, não valida se o número existe.
4. Migration SQL da #25: precisa obrigatoriamente de revisão e testes reais no Supabase antes de ser aplicada.
5. #26: estados de erro precisam de teste visual e idealmente testes de componente que simulem rejeição do import e `onError` da imagem.
6. #24: a estratégia relê o storage imediatamente antes de cada mutação e sincroniza eventos; confirmar em duas abas reais sob interação rápida quando houver browser disponível.
