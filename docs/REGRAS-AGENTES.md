# Regras para trabalho paralelo de dois agentes

Escrito depois da Phase 1, onde o Claude e o Codex trabalharam ao mesmo tempo e o resultado
não compilava quando junto. Isto existe para isso não voltar a acontecer.

---

## O que correu mal (para não repetir)

Não foi por terem mexido nas mesmas *pastas*. Foi por duas razões diferentes:

1. **Ficheiros partilhados.** `src/i18n/translations.ts` e `src/pages/owner-app.tsx` são tocados por
   quase todas as tarefas. Os dois agentes adicionaram coisas legítimas no mesmo sítio → conflito de merge.
2. **Modelo de dados partilhado.** O Codex mudou `PartBreakdown` (de `isAlu` binário para `partTypeId`).
   O Claude, em paralelo, escreveu código que gravava o formato antigo. Cada branch compilava sozinha;
   juntas, não. **Regra de pastas nenhuma teria evitado isto** — é dependência de tipos, não de ficheiros.

A conclusão prática: dividir por agente não chega. Tem de se dividir **por dependência**.

---

## Regra 1 — Congelar o modelo antes de paralelizar

Se duas tarefas tocam nos mesmos tipos (`src/types/*.ts`, `src/lib/pricing.ts`, `src/data/pricing/*`),
**não** vão para agentes diferentes ao mesmo tempo.

Sequência obrigatória:

1. Um agente (ou o Lucas) faz **só** a alteração de tipos, sozinho, e faz merge em `main`.
2. Os dois agentes criam as suas branches **a partir desse `main` já atualizado**.
3. Só então trabalham em paralelo.

Ficheiros que obrigam a esta regra — a lista de "modelo":

```
src/types/crm.ts
src/types/vehicle.ts
src/types/nav.ts
src/lib/pricing.ts
src/data/pricing/pricing-config.ts
src/data/pricing/parts.ts
```

## Regra 2 — Dono declarado por ficheiro

Cada tarefa declara, no briefing, a lista exata de ficheiros que pode escrever.
Um agente **nunca** escreve num ficheiro que não está na sua lista, mesmo que seja "só uma linha".

Se duas tarefas precisam do mesmo ficheiro de código, uma das duas está mal desenhada:
ou se juntam numa só tarefa, ou se separam em série (uma depois da outra).

## Regra 3 — Ficheiros quentes têm tratamento especial

Há ficheiros que toda a gente precisa. Para esses, dono exclusivo não funciona:

| Ficheiro | Porquê é quente | Como tratar |
|---|---|---|
| `src/i18n/translations.ts` | toda a string nova passa por aqui, nos 5 idiomas | ver "Dívida a pagar" em baixo |
| `src/pages/owner-app.tsx` | é o estado do painel inteiro | uma tarefa de cada vez, nunca duas em paralelo |
| `src/App.tsx` | rotas | acrescentar sempre **no fim** do `<Routes>` |
| `src/main.tsx` | providers | acrescentar sempre **por fora** dos existentes |

Enquanto `translations.ts` for um ficheiro único, quem lá mexe acrescenta o seu bloco
**no fim de cada objeto de idioma**, nunca no meio. Reduz o conflito a uma linha em vez de vinte.

## Regra 4 — Protocolo de pausa (o agente nunca fica bloqueado)

Se um agente precisa de mexer num ficheiro que não lhe pertence, ou depende de trabalho que outro
ainda não entregou:

1. **Não edita o ficheiro.** Não "faz só um bocadinho".
2. Escreve uma entrada em `docs/BLOQUEIOS.md`:
   ```
   ## [T4] precisa de src/types/crm.ts (dono: T3)
   Motivo: gravar partTypeId no orcamento.
   O que faz falta: campo partTypeByPart em SavedQuote.
   Estado: à espera. Retomado quando T3 estiver em main.
   ```
3. **Passa à tarefa seguinte da sua fila que não tenha dependências.** Não fica parado à espera.
4. Volta à tarefa pausada só quando a dependência estiver em `main`, e refaz `git rebase main` antes.

Por isso é que a fila de cada agente tem de ter sempre 2–3 tarefas independentes,
e não uma só. Um agente com uma tarefa bloqueada e nada mais para fazer é tempo perdido.

## Regra 5 — Cada agente na sua worktree

Já é assim e funciona bem. Manter:

```
WD-PDR-Quote/                    → main, integração
wd-pdr-quote-claude-builder/     → branch claude-builder-main
wd-pdr-quote-codex-builder/      → branch codex-builder-main
```

Cada worktree tem os seus `node_modules` e o seu servidor de dev numa porta diferente.
Nenhum agente faz `git checkout` de outra branch dentro da worktree do outro.

## Regra 6 — Definição de "concluído"

Uma tarefa **não** está pronta só porque o agente disse que está e fez commit. Exige-se, por esta ordem:

1. `npm run build` passa
2. `npm run lint` sem warnings novos (os 3 de `only-export-components` são pré-existentes)
3. **Ensaio de merge contra a branch do outro agente**:
   ```
   git merge-tree --write-tree --name-only <a-minha-branch> <a-branch-do-outro>
   ```
   Se aparecer `CONFLICT`, a tarefa **não** está pronta — o agente reporta o conflito antes de fechar.
4. Os critérios de aceite do briefing, testados à mão na app a correr
5. Push da branch

O passo 3 é o que teria apanhado o problema desta vez, no dia em que aconteceu.

## Regra 7 — A integração é uma tarefa, com dono único

Ninguém faz merge da sua própria branch para `main` sem passar por aqui.
Quem integra: **um só** — agente ou pessoa, mas sempre o mesmo, e nunca em paralelo com outro merge.

Ordem: **primeiro entra quem mexeu no modelo de dados**, depois os outros por cima.
O contrário obriga a resolver o mesmo conflito várias vezes.

---

## Dívida a pagar (torna as regras quase desnecessárias)

**Partir `src/i18n/translations.ts`** (hoje ~1400 linhas, um único objeto por idioma) em ficheiros por
área — `src/i18n/pt/quotes.ts`, `src/i18n/pt/customer.ts`, `src/i18n/pt/settings.ts`… — com um `index.ts`
que os junta. Cada tarefa passa a mexer no seu ficheiro e o conflito estrutural desaparece.

Foi a origem de 6 dos 9 conflitos da Phase 1. É a mudança com melhor retorno para trabalho paralelo,
e não altera nada visível na app.
