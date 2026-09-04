-- Dados adicionais usados pela oficina e impressos no PDF.
-- Todas as colunas sao opcionais para manter registos antigos compativeis.

alter table public.clients
  add column if not exists city text check (length(city) <= 120),
  add column if not exists postal_code text check (length(postal_code) <= 24),
  add column if not exists country text check (length(country) <= 120);

alter table public.quotes
  add column if not exists vehicle_brand text check (length(vehicle_brand) <= 120),
  add column if not exists vehicle_model text check (length(vehicle_model) <= 120),
  add column if not exists vehicle_color text check (length(vehicle_color) <= 80);
