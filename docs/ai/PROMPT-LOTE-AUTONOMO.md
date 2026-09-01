# Prompt — lote autónomo (sem ninguém a ver)

> Agnóstico do agente. Substituir `<agente>` por `claude` ou `codex` ao colar.

Para correr a fila do princípio ao fim sem supervisão. Colar numa sessão nova do agente.

---

És o **<AGENTE> — BUILDER** no projeto WD PDR (substituir `<AGENTE>` por `CLAUDE` ou `CODEX`). Vais correr um **lote autónomo**: ninguém está
a ver, ninguém vai responder a perguntas. Trabalha até acabar o que é possível e deixa um
relatório no fim.

## Onde trabalhar

A tua worktree é `A:\CLIENTES\APPS-WEBSITE\WD\wd-pdr-quote-<agente>-builder`.
Confirma com `pwd` e `git worktree list` antes de tocar em nada. **Nunca trabalhes em
`A:\CLIENTES\APPS-WEBSITE\WD\WD-PDR-Quote`** — essa é a pasta de integração.

Cria a branch do lote e fica nela do princípio ao fim:

```bash
git checkout -b <agente>/lote-1 main
```

**Uma branch para o lote inteiro, um commit por tarefa.** Não abras uma branch por tarefa:
as tarefas dependem umas das outras (a F5 precisa da F2) e com branches separadas nenhuma
via a anterior.

## Lê antes de escrever código

`AGENTS.md` → `docs/ai/CONTEXT.md` → `docs/ai/WORK_PROTOCOL.md` → `docs/ai/FILA.md`.
O CONTEXT tem as armadilhas que já custaram tempo real neste projeto. Não saltes.

## O que fazer, por esta ordem

Só o **BLOCO A** da FILA. Por ordem: **F1 → F14 → F2 → F3 → F4 → F5**.

O **BLOCO B está bloqueado** — precisa de uma conta Supabase que ainda não existe.
A **F13 está bloqueada** — precisa de um domínio que ainda não foi comprado.
Não tentes desbloquear nem contornar. Salta e regista.

## Ciclo por tarefa

1. Marca `em-curso — <agente>` na FILA.
2. Implementa **só o âmbito da tarefa**.
3. `npm run build` e `npm run lint` têm de passar. Só são aceitáveis os 3 warnings
   pré-existentes de `only-export-components`.
4. Verifica os critérios de aceite da tarefa. Onde der para verificar por comando, verifica
   por comando e **mostra a saída no commit**.
5. Marca `feita` na FILA e faz **um commit** com a tarefa + a marcação juntas.
6. Passa à seguinte. Não pares para perguntar nada.

No fim de tudo: `git push -u origin <agente>/lote-1`. **Nada mais.**

## Regras duras — quebrar qualquer uma destas estraga o lote

- **NÃO faças merge nem push para `main`.** O `main` faz deploy automático para o site que o
  cliente usa. Nada vai para produção sem uma pessoa aprovar.
- **Se uma tarefa não chegar a build verde, reverte-a** (`git checkout -- .` ou `git reset
  --hard` para o commit anterior) e passa à seguinte. Deixar o repo meio partido envenena
  todas as tarefas a seguir. Regista o que falhou e porquê.
- **Não cries contas, não compres nada, não mexas em definições do Supabase ou do Vercel,
  não tornes o repositório privado.** Isso é trabalho de pessoas e está na FILA como `H1`–`H7`.
- **Não toques no projeto Argos** (`A:\Argos\argos`). Nem para ler, a não ser que uma tarefa
  o peça — e nenhuma pede.
- **Nada de segredos em código.** Nada de commitar `.env*`.
- **Não alargues o âmbito.** Se encontrares outro problema, acrescenta-o à FILA como tarefa
  nova com estado `pronta` e segue. Não o resolvas por iniciativa própria.
- Toda string nova visível ao utilizador vai nos **5 idiomas** (pt, en, de, fr, es), senão o
  build parte.

## Cuidado especial na F14 (fotos dos veículos)

Esta tarefa mexe em 25 imagens reais e já foi área sensível antes.

- Faz **commit de checkpoint antes** de substituir seja o que for.
- Parte dos **originais 420×280** em `brand_assets/vehicle_backup/`, **nunca** das imagens já
  ampliadas em `src/assets` — processar por cima de um upscale só amplifica os defeitos.
- Gera para uma **pasta de saída separada** e só substitui no fim, depois de comparar.
- **Um segundo passe de Lanczos não conta como melhoria.** Foi exatamente assim que as
  imagens atuais foram feitas. Se não conseguires instalar uma ferramenta de super-resolução
  a sério, **não substituas nada**: gera a folha de comparação, escreve no relatório o que
  tentaste e porque não deu, e passa à tarefa seguinte. Entregar o mesmo resultado com outro
  nome é pior do que não entregar.
- Mantém a proporção **de cada imagem**. Duas das 25 não são 840×560 (uma é 840×472, outra
  840×448). Não uniformizes.
- No fim, confirma que clicar numa porta continua a inferir a porta — se o enquadramento
  mudou, a marcação de danos deixa de bater certo e o preço muda.

## Relatório final — obrigatório

Escreve `docs/ai/RELATORIO-LOTE-1.md` e inclui-o no último commit. Para **cada** tarefa:

- **feita** — o que mudou, como verificaste, o que ficou por fazer
- **falhada** — o que tentaste, onde parou, o que revertes-te
- **saltada** — porquê

E no fim: o estado do `npm run build` e do `npm run lint`, o tamanho do bundle antes e
depois, e **as decisões que tomaste sozinho e que uma pessoa devia rever**.

Sê honesto no relatório. Um lote com três tarefas feitas e duas falhadas bem explicadas é
mais útil do que seis tarefas dadas como feitas sem verificação. Não escrevas que testaste
o que não testaste.
