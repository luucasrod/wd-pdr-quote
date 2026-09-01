# Relatório — Lote 1 (Codex Builder)

Data: 1 de setembro de 2026  
Branch: `codex/lote-1`  
Worktree: `A:\CLIENTES\APPS-WEBSITE\WD\wd-pdr-quote-codex-builder`

## F1 — feita

- O que mudou: `translations.ts` ficou com `Language`, `LANGUAGE_META`, `TranslationShape` e a composição final. As traduções foram separadas em `src/i18n/<idioma>/` nas áreas `common`, `nav`, `quotes`, `customer`, `settings`, `clients`, `insurers`, `auth` e `errors`, com um `index.ts` por idioma.
- Verificação: TypeScript validou os cinco objetos contra `TranslationShape`; `npm run build` passou; `npm run lint` apresentou apenas os três warnings pré-existentes; `git diff -- src/components src/pages` ficou vazio.
- Ficou por fazer: não foi feita uma comparação visual manual dos cinco idiomas no browser. As strings foram movidas sem edição, mas essa equivalência não foi testada por interação humana.

## F14 — falhada

- O que tentei: procurei `brand_assets/vehicle_backup/`, `brand_assets/make_compare.py` e `brand_assets/upscale_vehicles.py` no filesystem e no `HEAD` (`rg --files` e `git ls-tree`).
- Onde parou: nenhum desses originais ou scripts existe nesta branch. Só estão disponíveis as 25 imagens já ampliadas em `src/assets/vehicles/`. Python tem Pillow, mas não tem Torch nem Real-ESRGAN.
- O que reverti: nada precisou de ser revertido; nenhuma imagem foi processada ou substituída. Não foi criado checkpoint porque a fase de substituição nunca começou. Também não foi gerada folha de comparação, pois não havia um resultado de super-resolução válido para comparar.
- Ficou por fazer: recuperar os originais 420×280 ou, de preferência, os ficheiros de alta resolução do dono (H6); depois instalar e avaliar uma ferramenta real de super-resolução numa pasta separada.

## F2 — feita

- O que mudou: Vitest foi adicionado, com script `npm run test` e testes para fronteiras WKO 0/1, 2/3 e 700+, desempates de severidade, percentagem do tipo de peça, fallback de tipo inexistente, teto de preparação e ambos os agravamentos de 25%.
- Verificação: 6 testes passaram ao fechar a tarefa. Foi removido temporariamente o `Math.min` do teto; o teste respetivo falhou com `1.2000000000000002` em vez de `1`. O código foi restaurado e os testes voltaram a passar.
- Ficou por fazer: nada dentro do âmbito descrito.

## F3 — feita

- O que mudou: o import estático de jsPDF foi substituído por `await import("jspdf")` dentro de `downloadQuotePdf`.
- Verificação: o build passou e produziu um chunk separado `jspdf.es.min` de 399,17 kB. O chunk principal desceu de 986,93 kB para 587,63 kB. Nos dois pontos de chamada, `downloading` é ativado antes do `await downloadQuotePdf`, portanto inclui o tempo de carregamento do módulo.
- Ficou por fazer: não foi executado um download manual de PDF no detalhe do orçamento nem no ecrã final do cliente. O build confirma a integração e os handlers foram inspecionados, mas o comportamento do browser não foi testado nesta sessão.

## F4 — feita

- O que mudou: o detalhe do orçamento apresenta uma miniatura por vista com marcadores, reutilizando `VehicleImageView` e `DamageMarkerLayer`. Os callbacks tornaram-se opcionais; em leitura, o overlay não aceita eventos e os marcadores ficam desativados.
- Verificação: a secção é derivada apenas das entradas de `markersByView` com pelo menos um marcador. Ausência de `markersByView` resulta em lista vazia e nenhuma secção. Build, lint e testes passaram.
- Ficou por fazer: não foi criada uma fixture no `localStorage` nem feita verificação visual/interativa no browser. As posições usam as mesmas coordenadas normalizadas e o mesmo componente da edição.

## F5 — feita

- O que mudou: `inferPartId` recebe agora `VehicleType` e usa fronteiras normalizadas por tipo para vistas laterais, frente, traseira e topo. Os dois fluxos de criação de marcadores passam o tipo do veículo. As fronteiras laterais seguem cavas das rodas, juntas das portas, linha do tejadilho e soleira; na van, o painel de carga ocupa intencionalmente uma faixa traseira maior.
- Verificação: foram inspecionadas as 25 imagens existentes. Há testes nas fronteiras laterais dos cinco tipos, testes verticais e um caso explícito em que o mesmo ponto é `doorFrontRight` no sedan e `doorRearRight` na van. No fecho do lote passaram 13 testes em 2 ficheiros.
- Ficou por fazer: as fronteiras são uma aproximação visual e devem ser revistas por uma pessoa na app, clicando em todas as juntas de painéis. Não foi realizado esse ensaio interativo completo.

## Tarefas saltadas

- F13: saltada porque está bloqueada por H7 (domínio ainda não comprado). Não houve tentativa de contornar nem alterações no Vercel.
- Bloco B (F6–F11): saltado porque está bloqueado por H1 (conta/projeto Supabase do dono inexistente). Não foram criadas contas nem alteradas definições externas.
- F12 e Bloco C: fora do lote e requerem intervenção humana.

## Estado final e métricas

- `npm run test`: 2 ficheiros, 13 testes, todos passaram.
- `npm run build`: passou.
- `npm run lint`: passou com apenas os 3 warnings pré-existentes de `react(only-export-components)` em `button.tsx`, `badge.tsx` e `language-context.tsx`.
- Bundle principal antes: 986,93 kB (314,52 kB gzip).
- Bundle principal depois: 589,16 kB (184,60 kB gzip).
- Diferença final: -397,77 kB (-129,92 kB gzip), com jsPDF separado num chunk de 399,17 kB (129,63 kB gzip).

## Decisões autónomas a rever por uma pessoa

1. Na F1, `dashboard` ficou em `common`; `quotePage` e `pricing` ficaram em `quotes`. A divisão respeita as nove áreas pedidas, mas a equipa pode preferir outra propriedade semântica.
2. Na F4, o modo só-leitura foi implementado tornando callbacks opcionais nos componentes partilhados, em vez de criar componentes duplicados.
3. Na F5, todas as fronteiras foram estimadas visualmente sobre as imagens atuais. Estas decisões afetam agrupamento e preço e, por isso, precisam de validação humana especialmente nas vistas de topo, traseira e nos painéis longos de wagon/van.
4. A F14 foi encerrada como falhada, sem tentar instalar super-resolução, porque a única fonte disponível era precisamente o upscale que as regras proibiam reutilizar.
