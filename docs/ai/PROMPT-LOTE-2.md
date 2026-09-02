És o CODEX no projeto WD PDR. Lote autónomo: ninguém está a ver, ninguém responde a perguntas. Trabalha até acabares o possível e deixa relatório.

Este lote tem DUAS FASES com regras diferentes. Não as misturas.

ONDE: confirma com "pwd" e "git worktree list" que estás em A:\CLIENTES\APPS-WEBSITE\WD\wd-pdr-quote-codex-builder, no ramo codex/lote-2. Nunca trabalhes em WD-PDR-Quote, que é a pasta de integração.

LÊ PRIMEIRO, por esta ordem: AGENTS.md, docs/ai/CONTEXT.md, docs/ai/WORK_PROTOCOL.md (com atenção à secção 4b, que é a regra das auditorias). O CONTEXT tem as armadilhas que já custaram tempo real neste projeto. Não saltes.

═══ FASE 1 — CORREÇÕES (alteras código) ═══

Issues, nesta ordem: #8 → #11 → #10 → #9
Lê cada uma com "gh issue view <n>". Trazem medições e passos de reprodução — parte do trabalho já está feita, não redescubras.

Por cada issue:
1. gh issue edit <n> --add-assignee @me
2. Implementa só o âmbito dessa issue.
3. "npm run build", "npm run test" e "npm run lint" têm de passar. Só são aceitáveis os 3 warnings pré-existentes de only-export-components.
4. Verifica os critérios de aceite À MÃO, na app a correr ("npm run dev"). Não te fies no build.
5. UM commit por issue, com "Closes #<n>" na mensagem.
6. Segue para a próxima sem parar para perguntar.

Notas por issue:
#8 — seis sítios escrevem no localStorage. Cria um wrapper único em src/lib/storage.ts. O ciclo infinito nasce do useEffect em language-context.tsx.
#11 — já existe @radix-ui/react-dialog e o componente Modal. O "desfazer" é o que resolve o problema a sério, não uma confirmação mais bonita.
#10 — é index.html mais uma imagem 1200x630 em public/. O logo tem de ficar em FUNDO CLARO: o traço preto é ilegível em fundo escuro.
#9 — a maior e a mais delicada. As coordenadas dos danos são normalizadas 0..1 sobre a imagem; se o zoom não converter certo, os danos ficam gravados no sítio errado, isso MUDA O PREÇO e estraga orçamentos já guardados. Antes de fechar, abre um orçamento antigo e confirma que os danos continuam nas posições certas.

═══ FASE 2 — AUDITORIAS (NÃO alteras código) ═══

Só começas depois de a fase 1 estar fechada.

⚠️ A partir daqui não mexes numa linha de src/. O trabalho é descobrir se os problemas existem, prová-los e documentá-los. Encontraste um defeito? ABRES UMA ISSUE. Não o corriges.

Issues, nesta ordem: #12 → #14 → #19 → #17 → #20 → #16 → #13 → #15 → #21
CADA UMA TRAZ UMA SECÇÃO "ESTADO ATUAL" com o que já se sabe e o que ainda não existe no projeto. Lê-a antes de começar, senão gastas a sessão a redescobrir o que já está documentado, ou a procurar endpoints que não existem.

A issue #18 (compatibilidade mobile) NÃO é deste lote. Salta-a: só faz sentido depois da #9 estar integrada em main.

Por cada auditoria:
1. gh issue edit <n> --add-assignee @me
2. TESTA a correr a app, não a ler o código. Ler serve para formar hipóteses; provar exige executar.
3. Tenta reproduzir uma falha REAL. Uma suspeita não chega.
4. Documenta como reproduzir, com comandos e números exatos.
5. Classifica a gravidade.
6. Se houver defeito: "gh issue create" com título, reprodução, evidência e gravidade, a referenciar a auditoria.
7. Comenta na issue de auditoria o que encontraste e fecha-a.

Duas regras que valem ouro:
- "Não aplicável" NÃO é "sem problemas encontrados". Se um cenário testa algo que ainda não existe (endpoints, chamadas de rede no envio), diz isso claramente. Dar por seguro o que nunca foi testado é pior do que não testar.
- Não inventes gravidade. Um problema que só acontece em condições absurdas é baixo, mesmo que pareça grave no papel.

═══ REGRAS DURAS (valem nas duas fases) ═══

- NÃO faças merge nem push para main. O main faz deploy automático para o site que o cliente usa.
- Se uma issue da fase 1 não chegar a build verde, REVERTE-A e passa à seguinte. Repo meio partido envenena tudo o que vem depois.
- Não cries contas, não compres nada, não mexas em definições do Supabase ou do Vercel, não tornes o repositório privado.
- Não faças testes destrutivos contra infraestrutura externa. Não ataques o Vercel nem o Supabase.
- Não toques no projeto Argos (A:\Argos\argos).
- Nada de segredos em código, nada de commitar .env*.
- Não alargues o âmbito. Outro problema? Abre issue nova e segue.
- Toda string nova visível ao utilizador vai nos 5 idiomas (pt, en, de, fr, es), senão o build parte.

No fim de tudo: git push -u origin codex/lote-2. Nada mais.

RELATÓRIO: escreve docs/ai/RELATORIO-LOTE-2.md no último commit, com as duas fases separadas.
Fase 1, por issue: feita (o que mudou, como verificaste), falhada (o que tentaste, onde parou, o que reverteste) ou saltada (porquê).
Fase 2, por auditoria: o que testaste, o que encontraste, o que NÃO era aplicável e porquê, e as issues que abriste.
No fim: estado do build, testes e lint, tamanho do bundle, lista dos problemas por gravidade, e as decisões que tomaste sozinho e que uma pessoa devia rever.

Sê honesto. Um lote com três coisas feitas e duas falhadas bem explicadas vale mais do que nove dadas como feitas sem verificação. Não escrevas que testaste o que não testaste.
