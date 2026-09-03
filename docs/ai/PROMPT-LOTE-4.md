És o CODEX no projeto WD PDR. Lote autónomo: ninguém está a ver, ninguém responde a perguntas.

⚠️ ANTES DE COMEÇAR: confirma que o lote 3 já foi integrado. Corre "git log --oneline -5" no main e verifica que lá estão os commits das issues #22 a #30. Se não estiverem, PARA e não faças nada — este lote assenta em cima desse trabalho.

ONDE: confirma com "pwd" e "git worktree list" que estás em A:\CLIENTES\APPS-WEBSITE\WD\wd-pdr-quote-codex-builder. Cria o ramo a partir do main atualizado:

  git fetch origin && git checkout -B codex/lote-4 origin/main

Nunca trabalhes em WD-PDR-Quote, que é a pasta de integração.

LÊ PRIMEIRO: AGENTS.md, docs/ai/CONTEXT.md, docs/ai/WORK_PROTOCOL.md.

═══ O QUE ESTE LOTE É, E PORQUE É DIFERENTE ═══

Vais escrever a camada que liga a app ao Supabase. Issues: #31 → #34 → #32 → #33 → #35 → #36

A #36 (pesquisa do painel escondida no telemovel) nao tem nada a ver com Supabase e nao depende de nada. Fica no fim como tarefa independente: se as outras correrem mal, esta ainda entrega valor.

NÃO HÁ PROJETO SUPABASE LIGADO. A conta do dono da oficina ainda não existe (bloqueio H1). Estás a escrever código que não podes executar contra uma base de dados real, e isso é intencional: quando a conta existir, o trabalho passa a ser ligar e verificar em vez de começar do zero.

Isto muda três coisas:

1. NÃO INVENTES o schema. Ele já existe, já foi aplicado e já foi verificado num projeto a sério. Está em supabase/migrations/. Lê os três ficheiros antes de escrever uma linha. As tabelas são shop_settings, clients, insurers e quotes, e existe a função public.submeter_pedido. Não inventes nomes de colunas.

2. TUDO TEM DE FUNCIONAR SEM CREDENCIAIS. Enquanto não houver VITE_SUPABASE_URL definida, a app comporta-se exatamente como hoje, com localStorage. É isto que permite integrar este lote em main sem partir nada e sem esperar por ninguém. Se a app deixar de arrancar sem variáveis de ambiente, falhaste a tarefa.

3. NÃO ESCREVAS QUE VERIFICASTE O QUE NÃO PODIAS VERIFICAR. Diz no relatório, por cada issue, o que foi testado de facto e o que fica por confirmar contra uma base real. No lote 2 fizeste exatamente isto e foi o que tornou o relatório útil.

═══ A ORDEM IMPORTA ═══

#31 primeiro: é a fundação (cliente Supabase + mappers).

#34 ANTES da #32, e isto não é negociável. A #34 é a autenticação real. Hoje o passcode é fraco mas quase não importa, porque quem entra no painel vê-o vazio — não há dados. No momento em que a #32 ligar dados reais, aquela porta passa a ter algo atrás dela. Ligar o banco antes de ter login a sério seria abrir a base de clientes ao mundo.

#32 é SOLO pelo WORK_PROTOCOL: mexe nos hooks de dados. Nota que a #24 do lote 3 acabou de mexer nesses mesmos ficheiros para sincronizar entre abas — lê o que ela fez e reconcilia, não desfaças.

#33 e #35 dependem da #32.

#36 e independente de tudo. Toca so em src/components/layout/header.tsx e no BottomNav. Saiu da auditoria mobile do lote 3: a busca esta com "hidden lg:flex" e o dono usa o telemovel na oficina.

═══ ARMADILHAS JÁ CONHECIDAS ═══

- NUNCA "insert ... returning" a partir do site público. Já foi tentado e falha sempre: RETURNING exige política de leitura, que o visitante não tem nem pode ter, e o erro que aparece aponta para o sítio errado. É por isso que a função submeter_pedido existe.
- Sem signup público. O utilizador do dono é criado à mão no dashboard. Não deve existir nenhuma chamada a supabase.auth.signUp no código.
- O logo em fundo claro, sempre. O traço preto é ilegível em fundo escuro.
- Toda string nova vai nos 5 idiomas (pt, en, de, fr, es), senão o build parte.

═══ CICLO POR ISSUE ═══

1. gh issue edit <n> --add-assignee @me
2. Lê a issue toda com "gh issue view <n>".
3. Implementa só o âmbito dessa issue.
4. "npm run build", "npm run test" e "npm run lint" têm de passar. Só são aceitáveis os 3 warnings pré-existentes de only-export-components.
5. Verifica À MÃO, na app a correr sem credenciais, que nada regrediu: fluxo do cliente, painel, gravar e reabrir um orçamento.
6. UM commit por issue, com "Closes #<n>".
7. Segue para a próxima sem parar para perguntar.

No fim: git push -u origin codex/lote-4. Nada mais.

═══ REGRAS DURAS ═══

- NÃO faças merge nem push para main. O main faz deploy automático para o site que o cliente usa.
- Se uma issue não chegar a build verde, REVERTE-A e passa à seguinte.
- NÃO cries conta Supabase, não cries projeto, não mexas em definições do Supabase ou do Vercel, não tornes o repositório privado. Isso é trabalho de pessoas e está bloqueado em H1.
- Não faças testes destrutivos contra infraestrutura externa.
- Não toques no projeto Argos (A:\Argos\argos).
- Nada de segredos em código, nada de commitar .env*.
- Não alargues o âmbito. Outro problema? Abre issue nova e segue.

RELATÓRIO: docs/ai/RELATORIO-LOTE-4.md no último commit. Por issue: o que mudou, o que testaste sem credenciais, e — separadamente e de forma explícita — O QUE FICA POR VERIFICAR CONTRA UMA BASE REAL. Essa última lista é a parte mais valiosa deste relatório: vai ser a checklist de quem ligar a conta.

No fim: build, testes, lint, tamanho do bundle, e as decisões que tomaste sozinho e que uma pessoa devia rever.

Sê honesto. Este lote inteiro é código por confirmar; um relatório que finja o contrário é pior do que inútil.
