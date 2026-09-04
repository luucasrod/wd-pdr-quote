És o CODEX no projeto WD PDR. Lote autónomo: ninguém está a ver, ninguém responde a perguntas.

ONDE: confirma com "pwd" e "git worktree list" que estás em A:\CLIENTES\APPS-WEBSITE\WD\wd-pdr-quote-codex-builder, no ramo codex/lote-5. Nunca trabalhes em WD-PDR-Quote, que é a pasta de integração.

LÊ PRIMEIRO: AGENTS.md, docs/ai/CONTEXT.md, docs/ai/WORK_PROTOCOL.md.

═══ CONTEXTO NOVO E IMPORTANTE ═══

Chegaram as tabelas oficiais e gravações de ecrã da app antiga do dono. Estão em docs/referencia/. Duas conclusões que já foram verificadas e que NÃO precisas de repetir:

1. A tabela WKO tem TRÊS tamanhos (leicht 0-20mm, mittel 20-30mm, stark 30-45mm) e os valores em DEFAULT_HOURLY_TABLE batem exatamente com a oficial. O motor de cálculo está correto — foi validado ao cêntimo contra a app antiga dele (mesma tabela × 50 €/h).

2. O dono NÃO tem uma taxa horária fixa. Tem vários preços e define o valor por país e por carro, na hora. Isso inverte o produto: a app calcula HORAS, e ele decide o preço. É a issue #44 e é a base de tudo neste lote.

Issues, nesta ordem: #44 → #42 → #40 → #43 → #45

Lê cada uma com "gh issue view <n>" antes de começar. Trazem as provas e as medições.

═══ #44 — LÊ ISTO COM ATENÇÃO, TEM UMA PARTE PROIBIDA ═══

A #44 tem duas metades. Neste lote fazes UMA.

FAZES — o lado do painel e do PDF:
- as horas passam a ser o resultado em destaque, não um número intermédio
- a taxa horária sai das Definições e passa a ser um campo do próprio orçamento, que ele preenche conforme o país e o carro
- a taxa fica gravada com o orçamento e ao reabrir mostra a que foi usada, não a global
- a definição global fica só como valor de partida para um orçamento novo

NÃO FAZES — a página pública:
A página promete "receba o valor na hora". Sem taxa definida, o cliente final não pode ver um valor. Há duas saídas possíveis e SÃO DOIS PRODUTOS DIFERENTES: ou existe uma taxa por omissão por país para dar um valor indicativo, ou a página deixa de prometer preço e passa a prometer contacto.

Essa decisão é do dono e ainda não foi tomada. NÃO MEXAS em src/pages/customer-quote-page.tsx nem nos textos da página pública por causa da #44. Se te parecer que a alteração do painel afeta o que o cliente vê, PARA, escreve no relatório o que encontraste, e segue para a issue seguinte.

Os orçamentos já gravados têm de continuar a mostrar exatamente o mesmo valor. Isto mexe em dinheiro.

═══ NOTAS POR ISSUE ═══

#42 — IVA e desconto. Depende da #44 estar feita: o subtotal só existe depois de haver taxa. O IVA aparece como LINHA PRÓPRIA, para se ver o valor sem imposto e o imposto em separado — pedido explícito do dono. A taxa de IVA é configurável, NÃO fixes 23% no código: ele trabalha em vários países. Ordem no resumo: subtotal → acréscimos → desconto → imposto → total. O desconto é em valor absoluto, não percentagem.

#40 — as 16 linhas extrapoladas da tabela. Não as apagues: um orçamento a meio deixaria de calcular. Marca-as visivelmente nas Definições e avisa quando um cálculo cai numa delas. Regista em CONTEXT.md até onde a WKO chega.

#43 — dados do veículo e do cliente. Marca, modelo e cor no orçamento; cidade, código postal e país no cliente. E reformatar a tabela do PDF para as colunas que ele já conhece: Peça | Pequeno | Médio | Grande | Valor.

#45 — seletor de marca. Lista ESTÁTICA no repositório, sem chamada a API externa em runtime. Verifica a licença da fonte antes de a usar; se não for clara, escreve à mão as marcas que circulam na Europa. Se o modelo der trabalho, deixa campo de texto livre — a marca é o que interessa. Tem de funcionar bem num telemóvel de 375 px.

═══ CICLO POR ISSUE ═══

1. gh issue edit <n> --add-assignee @me
2. Implementa só o âmbito dessa issue.
3. "npm run build", "npm run test" e "npm run lint" têm de passar. Só são aceitáveis os 3 warnings pré-existentes de only-export-components.
4. Verifica À MÃO, na app a correr: cria um orçamento, grava, reabre, confirma que o valor não mudou.
5. UM commit por issue, com "Closes #<n>".
6. Segue para a próxima sem parar para perguntar.

No fim: git push -u origin codex/lote-5. Nada mais.

═══ REGRAS DURAS ═══

- NÃO faças merge nem push para main. O main faz deploy automático para o site que o cliente usa.
- NÃO mexas na página pública por causa da #44 (ver acima).
- Se uma issue não chegar a build verde, REVERTE-A e passa à seguinte.
- Não cries contas, não compres nada, não mexas em definições do Supabase ou do Vercel, não tornes o repositório privado.
- Não toques no projeto Argos (A:\Argos\argos).
- Nada de segredos em código, nada de commitar .env*.
- Não alargues o âmbito. Outro problema? Abre issue nova e segue.
- Toda string nova vai nos 5 idiomas (pt, en, de, fr, es), senão o build parte.
- Não inventes valores de tabela. Se faltar um número, deixa o campo editável e vazio, e di-lo no relatório.

RELATÓRIO: docs/ai/RELATORIO-LOTE-5.md no último commit. Por issue: o que mudou, como verificaste, o que ficou por fazer. E uma secção separada com as decisões que tomaste sozinho e que uma pessoa devia rever — sobretudo tudo o que toque em cálculo de dinheiro.

Sê honesto, como nos lotes anteriores. Os teus relatórios têm sido bons precisamente por dizerem o que não foi testado. Não escrevas que testaste o que não testaste.
