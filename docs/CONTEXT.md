# 📋 CONTEXT — WD PDR Quote App

**Data**: 2026-08-30  
**Status**: Phase 1 em andamento — 2/7 issues concluídas, 5 restantes

---

## 🎯 Projeto

**Nome**: WD PDR Quote  
**Objetivo**: App público para orçamento de reparo de vidro + CRM admin  
**Tech**: React + TypeScript + Vite (web + Expo native)  
**Armazenamento**: localStorage (sem backend)

---

## 🔴 P0 — BLOQUEADORES

1. **Pedido nunca chega à oficina** → handleSubmit grava só em localStorage. Dono nunca vê.
2. **Preço sempre errado** → Cliente vê tabela de fábrica (45 €/h), ignora config do dono
3. **/oficina sem autenticação** → Qualquer link expõe CRM inteiro (RGPD risk)
4. **Sem 404** → URLs inválidas = página branca

---

## 🟡 P1 — FUNCIONALIDADE INCOMPLETA

5. **SavedQuote não guarda marcadores** → Bloqueia reabrir/editar/PDF detalhado
6. **Tipos de peça incompletos** → Só alumínio ligado, agravamentos ignorados
7. **Tabela fixa inativa** → Completar ou remover?
8. **Busca decorativa** → Remover ou implementar?

---

## 🚀 Phase 1 (SEM BACKEND) — Em Andamento

**✅ Concluídas:**
- **#1**: Passcode em /oficina (Claude) — `d3ad713` → `claude-builder-main`
  - Hook `use-oficina-auth`, componente gate, i18n, env var
  - Smoke test passou (gate → reject → unlock → persist)
  
- **#2**: Rota 404 (Codex) — `82f4db4` → `codex-builder-main`
  - Rota catch-all `*`, página 404 pública, ErrorBoundary global

**📋 Pendentes:**
- **#3**: Guardar marcadores em SavedQuote (Claude)
- **#4**: Ligar tipos de peça (Codex)
- **#5**: Tabela fixa (Claude)
- **#6**: Corrigir texto "oficina já recebeu" (Codex)
- **#7**: Remover/implementar busca (Claude)

Depois: Supabase (Phase 2)

---

## 📁 Workflow Atual

**Branches remotas:**
- `origin/main` — docs/CONTEXT.md, sem code
- `origin/claude-builder-main` — Issues #1, #3, #5, #7
- `origin/codex-builder-main` — Issues #2, #4, #6

**Worktrees locais:**
- `A:\CLIENTES\APPS-WEBSITE\WD\wd-pdr-quote-claude-builder/` → claude-builder-main
- `A:\CLIENTES\APPS-WEBSITE\WD\wd-pdr-quote-codex-builder/` → codex-builder-main
- `A:\CLIENTES\APPS-WEBSITE\WD\WD-PDR-Quote/` → main (docs only)

**Setup:**
- Claude connected via Claude for VS Code extension
- Codex connected via GitHub Copilot (OpenAI)
- Cada builder trabalha isolado, push automático após commit
