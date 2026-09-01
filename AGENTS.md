# WD PDR — instruções para agentes

## Leia primeiro

1. **[docs/ai/CONTEXT.md](docs/ai/CONTEXT.md)** — verdade técnica: arquitetura, motor
   de preço, o que já foi tentado e falhou, armadilhas que quebram em silêncio.
   **Leia antes de escrever código.**
2. **[docs/ai/WORK_PROTOCOL.md](docs/ai/WORK_PROTOCOL.md)** — como trabalhar: papéis,
   claim, worktree, tarefas **solo**, PR, revisão cruzada.
3. **[docs/ai/FILA.md](docs/ai/FILA.md)** — a fila de trabalho, em ordem de dependência.

Fonte de verdade: fila = `docs/ai/FILA.md` (ou GitHub Issues, quando existirem);
alterações = PR; decisão técnica = `docs/ai/CONTEXT.md` na branch integrada.

## Ao abrir a sessão

Declare o papel — `CLAUDE — BUILDER`, `CODEX — BUILDER`, `CLAUDE — REVIEWER` ou
`CODEX — REVIEWER` — e confirme repo, branch e worktree antes de começar.
Nunca assuma que está na worktree certa.

**Quem implementa não aprova o próprio trabalho.** Claude revisa Codex, Codex revisa Claude.

## Quatro regras que quebram este projeto em silêncio

Estão detalhadas no CONTEXT, mas custaram tempo real e ficam repetidas aqui.

1. **Toda string nova vai nos 5 idiomas.** `src/i18n/translations.ts` é tipado por
   `TranslationShape`. Faltar um idioma **quebra o build**, não dá aviso simpático.

2. **`insert ... returning` a partir do site público FALHA SEMPRE.** No Supabase,
   `RETURNING` exige política de **leitura**, que o visitante não tem nem pode ter.
   O erro que aparece — *"new row violates row-level security policy"* — aponta para o
   sítio errado e faz perder horas. O site público escreve **só** pela função
   `public.submeter_pedido(...)`. Nunca por `insert` direto.

3. **Duas tarefas nunca mexem no mesmo modelo de dados em paralelo.** Foi assim que a
   Phase 1 produziu duas branches que compilavam sozinhas e não compilavam juntas.
   Tarefas que tocam em `src/types/*`, `src/lib/pricing.ts` ou `src/data/pricing/*`
   são **solo** — ver WORK_PROTOCOL secção 4.

4. **Não tocar nas fotos dos veículos nem no posicionamento delas** sem pedido
   explícito. São 25 imagens já ajustadas à mão, e o enquadramento é sensível.

## Verificação obrigatória antes de entregar

```bash
npm run build     # tem de passar
npm run lint      # só os 3 warnings pré-existentes de only-export-components
```

E, se houver outro builder ativo, o ensaio de merge da secção 6 do WORK_PROTOCOL.
