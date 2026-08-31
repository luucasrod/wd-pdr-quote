# Pôr o Supabase do WD PDR na conta da oficina

**Estado atual (31/08/2026)**

| Projeto | Estado | Porquê |
|---|---|---|
| APP Cashy | ativo | — |
| argos-assistant | **ativo** | o Argos precisa dele a funcionar (usa-o para autenticação) |
| WD PDR | **pausado** | cedeu o lugar ao Argos; o WD ainda está em construção |

O plano grátis do Supabase dá **2 projetos ativos por pessoa** — contados em todas as
organizações onde essa pessoa é Owner ou Administrator, não por organização. Com três
projetos e dois lugares, há sempre um de fora. A saída definitiva é o WD PDR deixar de
viver na conta do Lucas.

**Nada se perdeu ao pausar o WD PDR.** A base estava vazia (os dados de teste foram
apagados) e o schema inteiro está em `supabase/migrations/`, aplicado e verificado.

---

## O caminho recomendado: recriar na conta do dono (10 minutos, sem nós)

Como o projeto WD PDR não tem dados nenhuns, **é mais simples recriá-lo na conta certa
do que transferi-lo**. Evita o problema circular explicado mais abaixo.

### O Wan Diego faz (3 minutos)
1. **supabase.com** → *Start your project* → criar conta com **wd.pdr@gmail.com**
   (pode entrar com o Google, é a mesma conta do email dele). Plano **Free**.
2. Na organização criada: **Settings → Team → Invite member** → convidar o email do
   Lucas com a função **Owner**.

### O Lucas faz (2 minutos)
3. Aceitar o convite que chega ao email.
4. Dizer ao Claude: *"a conta do dono está pronta"*. Ele cria o projeto **WD PDR** nessa
   organização (região **eu-west-1**, Irlanda — UE, por causa do RGPD) e volta a aplicar
   as três migrações de `supabase/migrations/`. São dois minutos e fica igual ao que já
   estava testado.
5. **Authentication → Users → Add user** → email do Wan Diego + password provisória.
   Não vai haver registo aberto na app.
6. Apagar o projeto WD PDR antigo, o que está pausado na conta do Lucas
   (*Settings → General → Delete project*), para não ficar lixo a ocupar espaço mental.

### Depois disto
7. Pôr as duas variáveis novas no Vercel (**Production e Preview**) e no `.env.local`.
   ⚠️ **O URL e a chave mudam** neste caminho, ao contrário da transferência.
   O Claude entrega os valores certos assim que criar o projeto.

---

## O caminho alternativo: transferir mesmo o projeto

Só vale a pena se, entretanto, já houver dados a sério no WD PDR que não se queiram perder.
Tem um nó a conhecer de antemão:

> Para transferir, o projeto tem de estar **ativo**. Mas para o ativar, é preciso um lugar
> livre — e os dois lugares vão estar ocupados pelo Cashy e pelo Argos. Ou seja, é preciso
> pausar o Argos por alguns minutos, restaurar o WD PDR, transferi-lo para a organização do
> dono, e só depois despausar o Argos.

Se for por aqui: o URL e as chaves **não** mudam, e não é preciso mexer no Vercel.

**Pré-requisito que estraga tudo se for esquecido**: o Supabase recusa transferir projetos
com a integração GitHub do Supabase ativa. Hoje não está ligada — não ligar antes de transferir.

---

## Prazos e riscos

- **Projeto pausado só se restaura durante 90 dias.** Para o WD PDR isso é até por volta de
  **29 de novembro de 2026**. Não é grave — não tem dados e recria-se das migrações — mas
  não deixar arrastar sem decidir.
- **Enquanto o WD PDR estiver pausado**, a app em produção continua a funcionar normalmente,
  porque ainda não fala com o Supabase. O que fica parado é só o trabalho da T6 (envio real
  do pedido do cliente para a oficina) poder ser **testado**. O código pode ser escrito na mesma.

## Verificar que o Argos voltou bem

O Argos usa este Supabase para autenticação (`api/chat.ts` → `supabase.auth.getUser`).
Depois de restaurado, confirmar que uma interação real de voz continua a autenticar —
não basta o projeto aparecer verde no painel.
