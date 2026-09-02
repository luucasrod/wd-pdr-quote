# Relatório — Lote 2

Data: 2 de setembro de 2026  
Branch: `codex/lote-2`  
Worktree: `A:\CLIENTES\APPS-WEBSITE\WD\wd-pdr-quote-codex-builder`

## Limitação transversal de verificação

A app foi iniciada em `http://127.0.0.1:5173` e os endpoints/artefactos foram testados por HTTP e comandos executáveis. A capacidade de browser não disponibilizou nenhuma instância (`browsers.list()` devolveu `[]`). Por isso, não foram feitos testes manuais de toque, duas abas, modo offline, download ou debugadores sociais. O relatório distingue explicitamente testes executados de verificações estruturais; nenhum teste visual foi inventado.

# Fase 1 — correções

## #8 — feita: localStorage bloqueado

- Criado `src/lib/storage.ts`, ponto único para leituras/escritas protegidas.
- Migradas todas as chamadas diretas em idioma, autenticação, coleções, preços e taxa horária.
- A falha mantém estado em memória e emite um aviso único no painel, traduzido nos cinco idiomas.
- Testes cobrem leitura e escrita a lançar erro. `rg` confirma que `getItem/setItem` só existem dentro do wrapper e de `try/catch`.
- Verificação: 15 testes, build e lint passaram no commit.
- Não verificado manualmente: fluxo completo em Safari privado, pela indisponibilidade de browser.

## #11 — feita: eliminação, desfazer e backup

- Os quatro `confirm()` nativos foram substituídos por diálogo Radix/Modal com nome do registo.
- A remoção fica pendente durante 5 segundos: desaparece da vista, mas só chega ao storage quando o prazo termina. “Desfazer” cancela o temporizador.
- No detalhe do orçamento, a página só navega para trás depois da remoção efetiva, para não perder o temporizador ao desmontar.
- Adicionado “Exportar tudo (JSON)” com orçamentos, clientes, seguradoras, tabela horária, tipos de peça e taxa horária.
- Todas as strings novas existem em pt/en/de/fr/es. `rg` confirmou zero `confirm()`.
- Verificação: testes, build e lint passaram.
- Não verificado manualmente: diálogo, contagem real dos 5 segundos, undo e download do JSON.

## #10 — feita: metadados sociais

- Adicionados description, canonical, Open Graph completo, `pt_PT` e Twitter large card.
- Criada `public/og-wd-pdr.png`, RGB PNG exatamente 1200×630, em fundo claro.
- A imagem foi gerada com a capacidade integrada de imagem e composta usando o logo como referência. Prompt final: banner automóvel claro, carro branco à direita, logo WD PDR e os textos “Reparação de amolgadelas sem pintura” e “Orçamento rápido em Leiria” à esquerda, sem fundo escuro ou watermark.
- Verificação: dimensões por Pillow, inspeção visual local, tags por `rg`, build/test/lint verdes.
- Não verificado: Facebook Sharing Debugger, Twitter Card Validator e WhatsApp, pois a branch local não tem URL pública de preview.

## #9 — feita com ressalva: zoom móvel

- Adicionado zoom 1×–4× por pinch e botões, arrasto quando ampliado e reset.
- Imagem e overlay recebem a mesma transformação. O ponto é normalizado contra o retângulo já transformado.
- Alvos dos marcadores e controlos têm 44×44 px; o ponto visual mantém o tamanho anterior.
- Testes cobrem coordenada normalizada sem zoom e após transformação 2×/arrasto.
- Verificação: 17 testes, build e lint passaram.
- Ressalva importante: não foi executado toque físico num dispositivo de 375 px nem aberto um orçamento antigo no browser. A compatibilidade é sustentada pelo modelo de coordenadas/testes, mas precisa de revisão manual antes de integrar.

# Fase 2 — auditorias sem alterações a src/

## #12 — segurança do painel

- Testado: `/oficina` HTTP 200; passcode aparece uma vez no bundle de 597.555 bytes; só existe `api/keep-alive.ts`; único fetch da app é o logo do PDF.
- Encontrado: painel e lógica/preços são públicos; risco atual médio. Não há via de rede para ler CRM de outra pessoa, porque cada perfil só vê o próprio localStorage.
- Não aplicável: sessão servidor, autorização de endpoints e rate limit, pois não existem.
- Issues abertas: nenhuma; Auth/RLS já estão planeados.

## #14 — persistência e perda de dados

- Testado: serialização real de 700 marcadores = 69.577 bytes; aproximadamente 75 orçamentos desse tamanho num limite nominal de 5 MiB. Testes do storage bloqueado passaram.
- Encontrado: refresh antes do submit perde todo o preenchimento; limpar storage perde CRM; outro browser/dispositivo começa vazio.
- Não testado manualmente: fecho/limpeza real do browser.
- Issue aberta: #23 — guardar/restaurar rascunho.

## #19 — consistência e dashboard

- Testado: dois snapshots independentes; A grava `[quote-A]`, B grava `[quote-B]`; resultado final perde A. Confirmadas múltiplas instâncias de `useQuotes` e zero listener `storage`.
- Gravidade: alta, perda silenciosa entre abas.
- Issue aberta: #24 — sincronizar coleções/componentes/abas.

## #17 — validação e extremos

- Testado: testes WKO passaram; 700 marcadores ficam abaixo de 400 KB; atributos do formulário e validações da migration foram enumerados.
- Encontrado: `type=tel` não valida formato; RPC aceita telefone `abc`, email inválido, contagem incoerente com JSON e totais arbitrários. Sem limites de texto no frontend.
- Não aplicável: chamada real à RPC, pois Supabase não está ligado.
- Issue aberta: #25 — validar formatos, shapes e coerência.

## #20 — erros e fallbacks

- Testado: `lerJson` com valor literal `lixo` e fallback array devolve string; `.filter` fica indefinido. CSS real do Google Fonts contém `font-display: swap`.
- Encontrado: storage corrompido impede recuperar; PDF rejeitado e imagem falhada não mostram erro/retry.
- Não aplicável: requests remotos do envio.
- Issues abertas: #26 — erros de PDF/imagem; #27 — recuperar storage corrompido.

## #16 — envio duplicado

- Testado: sequência do submit e batching. Não existe lock síncrono; dois eventos antes do rerender criam IDs/clientes/orçamentos diferentes.
- Gravidade: média atual, alta futura com backend.
- Não aplicável: timeout/retry de rede.
- Issue aberta: #28 — lock/idempotência.

## #13 — isolamento entre orçamentos

- Testado: zero endpoints/requests CRM; IDs não aparecem no URL; `quoteId` é estado React interno.
- Encontrado: nenhum acesso a dados de outra pessoa; isolamento total por arquitetura local, não por autorização.
- Não aplicável: RLS e testes multiutilizador até existir Supabase real.
- Issues abertas: nenhuma.

## #15 — queda de internet

- Testado: zero service worker/manifest/listeners offline; fotos = 2.639.479 bytes; chunk jsPDF = 399.176 bytes.
- Encontrado: abertura offline não é garantida; import do PDF e imagem falhada não têm recuperação.
- Não aplicável: queda durante envio, pois submit é local.
- Issues abertas: #29 — shell/estado offline; #26 já cobre PDF/imagens.

## #21 — privacidade e RGPD

- Testado: `/privacidade` HTTP 200; conteúdo, URLs, logs e filename PDF.
- Encontrado: política diz incorretamente que o pedido fica no navegador da equipa, quando fica no navegador do cliente; sem prazo de conservação/workflow de direitos; Google Fonts não é descrito; NIF continua em falta.
- PDF usa apenas 8 chars do ID no filename, sem nome ou matrícula. Não foram encontrados logs/URLs com PII.
- Não aplicável: armazenamento Supabase até à migração.
- Issue aberta: #30 — corrigir política e definir conservação/apagamento.

# Problemas por gravidade

## Alta

- #24 — perda concorrente entre componentes/abas.
- #27 — JSON/shape corrompido pode bloquear a app indefinidamente.
- #30 — política de privacidade materialmente inexata.
- #25 — validação insuficiente será alta quando a RPC entrar em produção.

## Média

- #23 — perda do pedido em preenchimento.
- #26 — falhas de PDF/imagens sem mensagem/retry.
- #28 — submissão duplicada; alta futura com rede.
- #29 — ausência de shell/estado offline.

# Estado final

- `npm run test`: 4 ficheiros, 17 testes, todos passaram.
- `npm run build`: passou.
- `npm run lint`: apenas os três warnings pré-existentes de `react(only-export-components)`.
- Bundle principal final: 597,55 kB (187,26 kB gzip).
- jsPDF separado: 399,17 kB (129,62 kB gzip).
- Nenhuma alteração a `src/` durante a Fase 2; o último commit contém apenas este relatório.

# Decisões autónomas a rever

1. O aviso de storage é global e persistente durante a sessão, sem botão de fechar.
2. O prazo de desfazer foi fixado em 5 segundos e a remoção pendente fica apenas no estado do componente.
3. O export JSON inclui valores brutos locais e data ISO, sem schema/versionamento.
4. As URLs sociais usam o domínio Vercel atual; devem mudar quando H7 fornecer o domínio definitivo.
5. A imagem social usa uma composição gerada; embora o logo tenha sido fornecido como referência e esteja legível, uma pessoa deve confirmar fidelidade de marca.
6. O zoom/arrasto foi implementado sem biblioteca externa; requer ensaio físico em iOS/Android e com orçamentos antigos antes do merge.
7. As gravidades futuras (#25/#28) foram separadas das atuais para não exagerar riscos de um backend inexistente.
