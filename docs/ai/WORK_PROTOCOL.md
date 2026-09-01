# WORK_PROTOCOL — como os agentes trabalham neste repo

Regras partilhadas por **Claude** e **Codex**. Quem abre sessão aqui lê isto antes de
tocar em qualquer ficheiro.

---

> ## ⚠️ Modo atual: só o Claude (31/08/2026)
> O Codex não está a ser usado. **Uma tarefa de cada vez, em série**, pelo Claude.
> Isto simplifica três coisas: não há disputa de claim (secção 3.1), não há ensaio de merge
> contra outra branch (secção 6, ponto 3), e a distinção SOLO deixa de ser crítica — mas
> mantém-se marcada na fila, para quando o Codex voltar.
>
> **O que NÃO muda**: quem implementa não aprova o próprio trabalho. A revisão é feita por
> **outra sessão** do Claude, em papel REVIEWER e worktree diferente, que só vê o diff.

## 1. Papéis

| Papel | Faz |
|---|---|
| **BUILDER** | implementa uma tarefa de cada vez, isolado na sua worktree |
| **REVIEWER** | revê a entrega do **outro** builder |

Regra dura: **quem implementa não aprova o próprio trabalho.** Claude revê Codex,
Codex revê Claude.

## 2. Fonte de verdade

- **[FILA.md](FILA.md)** — a fila: o que fazer, em que ordem, quem pode pegar.
- **Git / PR** — o que mudou.
- **`main` + [CONTEXT.md](CONTEXT.md)** — decisão técnica oficial. Alteração ao CONTEXT
  dentro de uma branch **não vale** antes do merge.

Estado da tarefa, marcado na própria FILA.md:

```
pronta        elegível, ninguém pegou
em-curso      alguém reivindicou (o nome do agente fica ao lado)
em-revisao    PR aberto, à espera do revisor cruzado
bloqueada     dependência por fechar, ou espera por uma pessoa
requer-humano NÃO é elegível para agente (precisa de conta, cartão, telemóvel, decisão do dono)
```

## 3. O ciclo

### 3.1 Reivindicar

Ler a FILA, escolher a primeira tarefa `pronta` que o teu papel possa fazer. Ignorar
`bloqueada`, `requer-humano`, e qualquer uma cuja dependência ainda não esteja fechada.

Editar a FILA marcando a tarefa como `em-curso — <teu nome>`, **commitar e empurrar essa
alteração imediatamente**, e só depois começar. Voltar a ler a FILA a seguir ao push:
se outro agente marcou a mesma tarefa, **perdeste a disputa** — larga e escolhe outra.
Sem discussão, sem "eu peguei primeiro".

### 3.2 Isolar

```bash
git worktree add ../wd-pdr-quote-<agente>-builder -b <agente>/<id>-<slug> origin/main
```

Uma branch por tarefa. **Nunca dois builders na mesma branch. Nunca duas sessões na
mesma worktree.**

### 3.3 Implementar

O âmbito da tarefa e só. Nada de refactor gigante não pedido, nada de segredos em código,
nada de mexer nas fotos dos veículos.

### 3.4 Entregar

```bash
npm run build && npm run lint
git push -u origin <branch>
```

Abrir PR em draft contra `main`, descrevendo: **o que mudou / porquê / como testar /
o que foi testado / riscos**. Marcar a tarefa `em-revisao` na FILA.

---

## 4. Tarefas SOLO — a regra mais importante deste ficheiro

Uma tarefa marcada **`SOLO`** corre **sozinha**: enquanto ela estiver `em-curso`,
**o outro agente não pega em nada**. Espera, ou trabalha noutro projeto.

### Porque existe

Na Phase 1 as sete tarefas foram divididas pelos dois agentes ao mesmo tempo. Duas delas
mexeram no mesmo modelo de dados sem saber uma da outra: o Codex trocou o tipo de peça de
um booleano (`isAlu`) para um identificador (`partTypeId`), enquanto o Claude escrevia o
código que gravava o formato antigo em disco.

Cada branch compilava sozinha. **Juntas, não compilavam.** Custou uma sessão inteira a
desfazer. Nenhuma regra de "cada um na sua pasta" teria evitado — não era conflito de
ficheiro, era conflito de *modelo*.

### O que torna uma tarefa SOLO

Qualquer uma destas, e a tarefa é solo:

1. Mexe em `src/types/*.ts`, `src/lib/pricing.ts` ou `src/data/pricing/*`
   (o modelo de dados partilhado).
2. Mexe em `src/i18n/translations.ts` de forma estrutural (mover, partir, renomear
   secções — acrescentar chaves no fim de cada idioma **não** é solo).
3. Mexe em `src/pages/owner-app.tsx`, que concentra o estado do painel inteiro.
4. Reescreve os hooks de dados (`src/hooks/use-*.ts`) — é o coração da persistência.

### Ficheiros quentes (mesmo fora de tarefas solo)

Toda a gente precisa deles. Quem lá mexe segue estas regras:

| Ficheiro | Regra |
|---|---|
| `src/i18n/translations.ts` | acrescentar o bloco novo **no fim** de cada objeto de idioma, nunca no meio |
| `src/App.tsx` | rotas novas **no fim** do `<Routes>` |
| `src/main.tsx` | providers novos **por fora** dos existentes |
| `docs/ai/FILA.md` | commitar e empurrar a marcação de imediato, antes de começar a tarefa |

---

## 5. Protocolo de pausa — o agente nunca fica parado à espera

Se precisares de um ficheiro que não é do teu âmbito, ou dependeres de trabalho que outro
ainda não entregou:

1. **Não editas o ficheiro.** Não "só um bocadinho".
2. Registas em `docs/ai/BLOQUEIOS.md`:
   ```
   ## [F7] precisa de src/lib/supabase.ts (dono: F5)
   Motivo: o auth-context precisa do cliente Supabase já criado.
   Estado: à espera. Retomar quando F5 estiver em main.
   ```
3. **Passas à tarefa seguinte da fila que não tenha dependências.** Não ficas à espera.
4. Voltas à tarefa pausada quando a dependência estiver em `main`, e fazes
   `git rebase main` antes de continuar.

Por isso a fila tem sempre mais do que uma tarefa elegível — um agente bloqueado sem
alternativa é tempo deitado fora.

---

## 6. Definição de "concluído"

Uma tarefa não está pronta porque o agente diz que está. Exige-se, por esta ordem:

1. `npm run build` passa
2. `npm run lint` sem warnings novos (os 3 de `only-export-components` são pré-existentes)
3. **Ensaio de merge contra a branch do outro agente**, se houver uma ativa:
   ```bash
   git merge-tree --write-tree --name-only <a-minha-branch> <a-branch-do-outro>
   ```
   Se aparecer `CONFLICT`, a tarefa **não** está pronta — reportar antes de fechar.
   *Este passo teria apanhado o problema da Phase 1 no próprio dia.*
4. Os critérios de aceite da tarefa, testados à mão na app a correr
5. PR em draft aberto e tarefa marcada `em-revisao`

## 7. Revisão cruzada

O revisor lê o diff, corre o build, testa os critérios de aceite e responde no PR com
uma de três: **aprovado**, **aprovado com ressalvas** (lista o que fica para depois), ou
**devolvido** (diz exatamente o que falta). Não reescreve o código do outro — devolve.

## 8. Integração

Merge para `main` tem **dono único**: uma pessoa ou um agente, sempre o mesmo, nunca dois
merges em paralelo. Ordem: **primeiro entra quem mexeu no modelo de dados**, o resto por cima.
