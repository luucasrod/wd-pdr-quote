# Passar o Supabase para a conta da oficina

Cinco minutos, e precisa do Wan Diego ao lado (ou ao telefone) uma vez só.
Depois disto, os dados dos clientes ficam na conta dele, como deve ser — e liberta
o lugar que o Argos precisa de volta na conta do Lucas.

**Estado agora**: o projeto **WD PDR** existe, está configurado e testado, e vive na
organização `Cashy` do Lucas. O `argos-assistant` está pausado à espera deste lugar.

---

## Parte 1 — o Wan Diego faz (2 minutos)

1. Ir a **supabase.com** → *Start your project* → criar conta com **wd.pdr@gmail.com**.
   Pode entrar com o Google, é a mesma conta do email dele.
2. O Supabase cria logo uma organização. Deixar no plano **Free**.
   **Não é preciso criar projeto nenhum** — o projeto já existe e vai ser movido para lá.
3. Na organização: **Settings → Team → Invite member**, convidar o email do Lucas,
   com a função **Owner** (Administrator também serve).

> Se ele não estiver à vontade com isto, o Lucas pode fazer os passos 1 a 3 com ele ao telefone —
> só é preciso que o email de confirmação chegue à caixa dele.

## Parte 2 — o Lucas faz (2 minutos)

4. Aceitar o convite que chega ao email do Lucas.
5. No Supabase, abrir o projeto **WD PDR** → **Settings → General** → *Transfer project*.
6. Escolher a organização nova (a do Wan Diego) e confirmar.

## Parte 3 — a seguir (1 minuto)

7. Confirmar que o projeto abre na organização nova e que os dados continuam lá
   (as definições de preço têm de continuar a mostrar a taxa de 45 €/h e os 4 tipos de peça).
8. Despausar o **argos-assistant**: Dashboard → argos-assistant → *Resume project*.
   Agora há lugar, porque o WD PDR saiu da conta do Lucas.
9. Criar o utilizador do dono para entrar no painel:
   **Authentication → Users → Add user** → email do Wan Diego + password provisória.

---

## Coisas que dão erro se não se souberem de antemão

- **A ordem não é negociável.** O Supabase recusa despausar o Argos enquanto o Lucas tiver
  2 projetos ativos. O limite de 2 projetos grátis é **por pessoa**, contado em todas as
  organizações onde ela é Owner ou Administrator — não é por organização.
- **O URL e as chaves não mudam** com a transferência. Não é preciso mexer no `.env.local`
  nem nas variáveis do Vercel.
- **Não ligar a integração GitHub do Supabase antes de transferir.** O Supabase recusa
  transferir projetos com essa integração ativa. (Hoje não está ligada — não ligar.)
- **Se o Argos ficar urgente antes de haver conta do dono**: dá para inverter, pausando
  temporariamente o WD PDR e despausando o Argos. Nada se perde, o schema está todo em
  `supabase/migrations/` e volta a aplicar-se em segundos.
- **Prazo do Argos**: um projeto pausado só pode ser restaurado durante 90 dias, ou seja
  até por volta de **28 de novembro de 2026**. As tabelas dele estão vazias, mas os
  utilizadores de autenticação não — não deixar passar essa data.

## Enquanto isto não acontece

O trabalho de código do WD PDR não está bloqueado: o projeto Supabase está de pé e a
funcionar na conta do Lucas. Dá para escrever e testar tudo. O que fica à espera é só
o Argos voltar.
