-- WD PDR — schema inicial
--
-- Espelha exatamente os tipos em src/types/crm.ts tal como estao depois da Phase 1.
-- Nomes em snake_case aqui, camelCase no TypeScript: a conversao vive num sitio so,
-- em src/lib/mappers.ts (ver T6 em TAREFAS.md).
--
-- As politicas de acesso NAO estao neste ficheiro. Estao na migracao seguinte,
-- 20260830120100_rls.sql, de proposito: sao a parte perigosa e merecem ser lidas a parte.

-- ---------------------------------------------------------------------------
-- Definicoes da oficina: uma unica linha, legivel publicamente.
-- E o que corrige o bug de o site publico mostrar sempre 45 EUR/h e a tabela de
-- fabrica: o preco passa a vir daqui em vez do localStorage de quem visita.
-- ---------------------------------------------------------------------------
create table public.shop_settings (
  id           text primary key default 'default',
  hourly_table jsonb   not null,
  part_types   jsonb   not null,
  hourly_rate  numeric not null default 45 check (hourly_rate > 0),
  updated_at   timestamptz not null default now(),
  constraint shop_settings_linha_unica check (id = 'default')
);

comment on table public.shop_settings is
  'Configuracao de preco da oficina. Linha unica. Leitura publica: o site do cliente precisa dela para calcular o preco.';

-- ---------------------------------------------------------------------------
-- Pessoas
-- ---------------------------------------------------------------------------
create table public.clients (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (length(trim(name)) between 1 and 200),
  phone      text check (length(phone) <= 40),
  email      text check (length(email) <= 200),
  nif        text check (length(nif) <= 20),
  address    text check (length(address) <= 300),
  -- id do registo equivalente no localStorage antigo, para a importacao nao duplicar
  legacy_id  text unique,
  created_at timestamptz not null default now()
);

create table public.insurers (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (length(trim(name)) between 1 and 200),
  phone      text check (length(phone) <= 40),
  email      text check (length(email) <= 200),
  notes      text check (length(notes) <= 2000),
  legacy_id  text unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Orcamentos
-- ---------------------------------------------------------------------------
create type public.quote_status as enum ('draft', 'sent', 'approved', 'rejected');
create type public.quote_source as enum ('owner', 'customer');
create type public.vehicle_type as enum ('sedan', 'suv', 'wagon', 'compact', 'van');

create table public.quotes (
  id           uuid primary key default gen_random_uuid(),
  status       public.quote_status not null default 'draft',
  source       public.quote_source not null default 'owner',
  client_id    uuid references public.clients(id)  on delete set null,
  insurer_id   uuid references public.insurers(id) on delete set null,
  vehicle_type public.vehicle_type not null,
  plate        text check (length(plate) <= 20),
  notes        text check (length(notes) <= 2000),

  -- Estado do dano, para reabrir e editar o orcamento (issue #3 da Phase 1)
  markers_by_view    jsonb not null default '{}'::jsonb,
  part_type_by_part  jsonb not null default '{}'::jsonb,
  part_breakdown     jsonb not null default '[]'::jsonb,
  finish_hours       numeric not null default 0 check (finish_hours >= 0),
  surcharge1         boolean not null default false,
  surcharge2         boolean not null default false,

  totals       jsonb not null,
  part_count   integer not null default 0 check (part_count   between 0 and 64),
  marker_count integer not null default 0 check (marker_count between 0 and 2000),

  -- null enquanto o dono ainda nao abriu o pedido; serve para a etiqueta "Novo pedido"
  seen_at    timestamptz,
  legacy_id  text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Travao de tamanho: o insert de quotes e publico, e um jsonb sem limite e um
  -- convite a que alguem encha a base de dados. 400 KB cobre com folga um granizo
  -- severo com centenas de marcadores.
  constraint quotes_payload_com_limite check (
    pg_column_size(markers_by_view) + pg_column_size(part_breakdown) < 400000
  )
);

create index quotes_created_at_idx on public.quotes (created_at desc);
create index quotes_por_rever_idx  on public.quotes (created_at desc)
  where source = 'customer' and seen_at is null;

comment on column public.quotes.seen_at is
  'Quando o dono abriu este pedido pela primeira vez. Null = ainda nao visto.';

-- ---------------------------------------------------------------------------
-- updated_at automatico
-- ---------------------------------------------------------------------------
create or replace function public.tocar_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger quotes_updated_at
  before update on public.quotes
  for each row execute function public.tocar_updated_at();

create trigger shop_settings_updated_at
  before update on public.shop_settings
  for each row execute function public.tocar_updated_at();
