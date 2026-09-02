És o CODEX no projeto WD PDR. Lote autónomo: ninguém está a ver, ninguém responde a perguntas. Trabalha até acabares o possível e deixa relatório.

Este lote tem DUAS FASES com regras diferentes. Não as misturas.

ONDE: confirma com "pwd" e "git worktree list" que estás em A:\CLIENTES\APPS-WEBSITE\WD\wd-pdr-quote-codex-builder, no ramo codex/lote-3. Nunca trabalhes em WD-PDR-Quote, que é a pasta de integração.

LÊ PRIMEIRO, por esta ordem: AGENTS.md, docs/ai/CONTEXT.md, docs/ai/WORK_PROTOCOL.md (com atenção à secção 4b, a regra das auditorias). O CONTEXT tem as armadilhas que já custaram tempo real neste projeto. Não saltes.

Estas issues saíram das tuas próprias auditorias do lote 2 — cada uma traz reprodução e evidência que tu mesmo registaste. Lê com "gh issue view <n>" antes de começar. Não redescubras o que já está documentado.

═══ FASE 1 — CORREÇÕES (alteras código) ═══

Issues, por ordem de gravidade: #24 → #27 → #23 → #26 → #28 → #25 → #30 → #22

Por cada issue:
1. gh issue edit <n> --add-assignee @me
2. Implementa só o âmbito dessa issue.
3. "npm run build", "npm run test" e "npm run lint" têm de passar. Só são aceitáveis os 3 warnings pré-existentes de only-export-components.
4. Verifica os critérios de aceite À MÃO, na app a correr ("npm run dev"). Não te fies no build.
5. UM commit por issue, com "Closes #<n>" na mensagem.
6. Segue para a próxima sem parar para perguntar.

Notas por issue:

#24 — perda de dados entre abas. É a mais grave: gravar numa aba pode apagar o trabalho da outra. Mexe nos hooks de dados, que são o coração da persistência — pelo WORK_PROTOCOL isto é tarefa SOLO, portanto fá-la primeiro e sozinha, antes de tudo o resto. Provável solução: ouvir o evento "storage" e partilhar o estado num contexto único em vez de cada componente ter a sua cópia.

#27 — storage corrompido bloqueia a app para sempre. Já existe src/lib/storage.ts do lote 2; o buraco é o JSON válido mas com o shape errado (ex.: a chave devia ser array e é string). Validar o shape, não só o parse, e cair no default em vez de partir.

#23 — perda do pedido em preenchimento. Guardar rascunho do fluxo do cliente. Cuidado: são dados pessoais de outra pessoa no dispositivo dela — decidir e escrever no PR quanto tempo o rascunho sobrevive e quando é limpo. Não deixar lá o nome e o telefone de um cliente para sempre.

#26 — falhas de PDF e imagens sem mensagem. O import dinâmico do jsPDF pode falhar com rede fraca; hoje não diz nada ao utilizador.

#28 — submissão duplicada no mesmo gesto. Lock síncrono, não só o estado "submitting" do React, que pode não repintar a tempo num toque duplo rápido.

#25 — validação de formato e coerência. A parte do frontend é para fazer agora. A parte da RPC do Supabase não é testável (não há projeto ligado): escreve o SQL na migration se fizer sentido, mas diz claramente no relatório que não foi executado contra uma base real.

#30 — política de privacidade. FAZ SÓ A PARTE FACTUAL: a política diz que o pedido fica no navegador da equipa da oficina, quando fica no navegador do próprio cliente. Isso é falso e corrige-se já. NÃO inventes prazos de conservação nem processo de apagamento, e não inventes o NIF — são decisões do dono, estão bloqueadas em H3. Lê o comentário na issue.

#22 — confirmar o telefone antes de enviar. "Corrigir número" não pode perder nada: nem os outros campos, nem as amolgadelas marcadas.

═══ FASE 2 — AUDITORIA (NÃO alteras código) ═══

Só começas depois de a fase 1 estar fechada.

⚠️ A partir daqui não mexes numa linha de src/. Descobrir, provar, documentar. Encontraste um defeito? ABRES UMA ISSUE. Não o corriges.

Issue: #18 — compatibilidade mobile completa.

Ficou de fora do lote 2 de propósito, porque a #9 (zoom e arrasto) ia reescrever exatamente essa superfície. Agora a #9 já está integrada em main, portanto a auditoria passa a fazer sentido.

Presta atenção especial a:
- Paisagem, que nunca foi testada. O contentor do veículo deriva a altura da proporção da imagem; num telemóvel deitado o ecrã é baixo.
- Teclado aberto no formulário de contacto: o campo fica tapado?
- A busca do painel está escondida no telemóvel ("hidden lg:flex" no header.tsx) e o dono usa o telemóvel na oficina.
- Barra de navegação inferior vs. área segura do iPhone.
- O zoom novo da #9 com toque real, não com rato encolhido.

No lote 2 não tiveste browser disponível e por isso nenhuma verificação visual foi feita. Se voltar a acontecer, diz isso em vez de dar por testado — e faz o que der por HTTP e por comandos, como fizeste da última vez, que foi o correto.

═══ REGRAS DURAS (valem nas duas fases) ═══

- NÃO faças merge nem push para main. O main faz deploy automático para o site que o cliente usa.
- Se uma issue da fase 1 não chegar a build verde, REVERTE-A e passa à seguinte. Repo meio partido envenena tudo o que vem depois.
- Não cries contas, não compres nada, não mexas em definições do Supabase ou do Vercel, não tornes o repositório privado.
- Não faças testes destrutivos contra infraestrutura externa.
- Não toques no projeto Argos (A:\Argos\argos).
- Nada de segredos em código, nada de commitar .env*.
- Não alargues o âmbito. Outro problema? Abre issue nova e segue.
- Toda string nova visível ao utilizador vai nos 5 idiomas (pt, en, de, fr, es), senão o build parte.
- A issue #29 (offline/PWA) NÃO é deste lote. Salta-a.

No fim de tudo: git push -u origin codex/lote-3. Nada mais.

RELATÓRIO: escreve docs/ai/RELATORIO-LOTE-3.md no último commit, com as duas fases separadas.
Fase 1, por issue: feita (o que mudou, como verificaste), falhada (o que tentaste, onde parou, o que reverteste) ou saltada (porquê).
Fase 2: o que testaste, o que encontraste, o que NÃO era aplicável e porquê, e as issues que abriste.
No fim: estado do build, testes e lint, tamanho do bundle, e as decisões que tomaste sozinho e que uma pessoa devia rever.

Sê honesto, como foste no lote 2. O relatório desse lote foi bom precisamente por dizer o que não tinhas conseguido testar — isso poupou tempo a quem reviu. Não escrevas que testaste o que não testaste.
