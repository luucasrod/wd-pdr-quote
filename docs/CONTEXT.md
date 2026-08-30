# 📋 CONTEXT — WD PDR Quote App

**Data**: 2026-08-29  
**Status**: P0 bloqueadores identificados — app não funciona como negócio hoje

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

## 🚀 Phase 1 (SEM BACKEND)

Destrava a app em 1 dia:
- #1: Passcode em /oficina
- #2: Rota 404
- #3: Guardar marcadores em SavedQuote
- #4: Ligar tipos de peça
- #5: Tabela fixa (decidir)
- #6: Corrigir texto "oficina já recebeu"
- #7: Remover/implementar busca

Depois: Supabase (fora Phase 1)

---

**Worktrees**: 
- wd-pdr-quote-claude-builder/ → Claude trabalha aqui
- wd-pdr-quote-codex-builder/ → Codex trabalha aqui
