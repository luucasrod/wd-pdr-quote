-- WD PDR — politicas de acesso (RLS)
--
-- LEIA ISTO ANTES DE ALTERAR.
--
-- A chave "anon" do Supabase vai dentro do JavaScript publico. Qualquer pessoa a
-- consegue ler. Portanto tudo o que estas politicas permitirem ao papel `anon`,
-- permitem ao mundo inteiro. A unica coisa que separa a base de clientes da
-- oficina da internet e este ficheiro.
--
-- A regra, em uma frase:
--   o publico ESCREVE o seu proprio pedido e LE os precos. Nao le mais nada.

alter table public.shop_settings enable row level security;
alter table public.clients       enable row level security;
alter table public.insurers      enable row level security;
alter table public.quotes        enable row level security;

-- ---------------------------------------------------------------------------
-- shop_settings — leitura publica (o site do cliente precisa dos precos),
-- escrita so para quem tem sessao iniciada.
-- ---------------------------------------------------------------------------
create policy "precos visiveis para todos"
  on public.shop_settings for select
  to anon, authenticated
  using (true);

create policy "so o dono altera precos"
  on public.shop_settings for update
  to authenticated
  using (true) with check (true);

-- ---------------------------------------------------------------------------
-- clients — o visitante cria o SEU registo ao submeter o pedido, e mais nada.
-- Sem politica de select para `anon`: sem ela, um select devolve zero linhas.
-- E o que impede a lista de clientes da oficina de ser descarregavel.
-- ---------------------------------------------------------------------------
create policy "visitante regista-se a si proprio"
  on public.clients for insert
  to anon
  with check (
    length(trim(name)) > 0
    -- o visitante nao preenche estes campos; sao do CRM interno
    and coalesce(nif, '') = ''
    and coalesce(address, '') = ''
    and legacy_id is null
  );

create policy "o dono ve e gere os clientes"
  on public.clients for all
  to authenticated
  using (true) with check (true);

-- ---------------------------------------------------------------------------
-- insurers — nada disto e publico.
-- ---------------------------------------------------------------------------
create policy "seguradoras so para o dono"
  on public.insurers for all
  to authenticated
  using (true) with check (true);

-- ---------------------------------------------------------------------------
-- quotes — o visitante submete um pedido e nunca mais lhe toca nem o le.
-- O `with check` prende o que ele consegue escrever: so um pedido de cliente,
-- com estado 'enviado', por ver, sem se poder fazer passar por um orcamento
-- interno nem por um ja aprovado.
-- ---------------------------------------------------------------------------
create policy "visitante submete o seu pedido"
  on public.quotes for insert
  to anon
  with check (
    source = 'customer'
    and status = 'sent'
    and seen_at is null
    and legacy_id is null
    and insurer_id is null
    and marker_count between 1 and 2000
  );

create policy "o dono ve e gere os orcamentos"
  on public.quotes for all
  to authenticated
  using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Como confirmar que isto ficou certo (fazer sempre depois de aplicar):
--
--   1. No SQL Editor do Supabase, correr:
--        set role anon;
--        select count(*) from public.quotes;    -- tem de dar 0
--        select count(*) from public.clients;   -- tem de dar 0
--        select count(*) from public.insurers;  -- tem de dar 0
--        select count(*) from public.shop_settings; -- tem de dar 1
--        reset role;
--
--   2. Se algum dos tres primeiros devolver linhas, PARAR e corrigir antes de
--      publicar seja o que for. Significa que a base de clientes esta aberta.
-- ---------------------------------------------------------------------------
