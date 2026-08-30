-- O visitante deixa de escrever diretamente nas tabelas.
-- Passa a submeter por esta funcao, que cria o cliente e o pedido de uma vez so.
--
-- PORQUE ISTO EXISTE (descoberto a testar, nao na teoria):
-- o plano original era o site fazer dois inserts, o primeiro com "returning id"
-- para apanhar o id do cliente. Isso FALHA. Um "insert ... returning" exige
-- politica de LEITURA sobre a tabela, e o visitante nao tem — nem pode ter, senao
-- descarrega a base de clientes inteira. O erro que aparece e
-- "new row violates row-level security policy", que aponta para o sitio errado e
-- teria custado horas a diagnosticar em producao.
--
-- A funcao resolve tres coisas de uma vez:
--   1. nao precisa de "returning" do lado do cliente;
--   2. cliente + pedido ficam na mesma transacao, sem clientes orfaos;
--   3. o papel anon deixa de ter permissao de escrita em tabela nenhuma.

drop policy if exists "visitante regista-se a si proprio" on public.clients;
drop policy if exists "visitante submete o seu pedido"   on public.quotes;

create or replace function public.submeter_pedido(
  p_nome         text,
  p_telefone     text,
  p_email        text,
  p_matricula    text,
  p_notas        text,
  p_tipo_veiculo text,
  p_markers      jsonb,
  p_breakdown    jsonb,
  p_totals       jsonb,
  p_part_count   integer,
  p_marker_count integer
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_client uuid;
  v_quote  uuid;
begin
  if length(trim(coalesce(p_nome, ''))) = 0 then
    raise exception 'nome_obrigatorio' using errcode = '22023';
  end if;
  if length(trim(coalesce(p_telefone, ''))) = 0 then
    raise exception 'telefone_obrigatorio' using errcode = '22023';
  end if;
  if p_tipo_veiculo not in ('sedan', 'suv', 'wagon', 'compact', 'van') then
    raise exception 'tipo_veiculo_invalido' using errcode = '22023';
  end if;
  if coalesce(p_marker_count, 0) < 1 or p_marker_count > 2000 then
    raise exception 'numero_de_danos_invalido' using errcode = '22023';
  end if;
  if pg_column_size(coalesce(p_markers, '{}'::jsonb))
   + pg_column_size(coalesce(p_breakdown, '[]'::jsonb)) > 400000 then
    raise exception 'pedido_demasiado_grande' using errcode = '22023';
  end if;

  insert into public.clients (name, phone, email)
  values (
    left(trim(p_nome), 200),
    left(coalesce(p_telefone, ''), 40),
    left(coalesce(p_email, ''), 200)
  )
  returning id into v_client;

  insert into public.quotes (
    source, status, client_id, vehicle_type, plate, notes,
    markers_by_view, part_breakdown, totals, part_count, marker_count
  )
  values (
    'customer', 'sent', v_client,
    p_tipo_veiculo::public.vehicle_type,
    left(coalesce(p_matricula, ''), 20),
    left(coalesce(p_notas, ''), 2000),
    coalesce(p_markers, '{}'::jsonb),
    coalesce(p_breakdown, '[]'::jsonb),
    p_totals,
    least(coalesce(p_part_count, 0), 64),
    p_marker_count
  )
  returning id into v_quote;

  return v_quote;
end;
$$;

comment on function public.submeter_pedido is
  'Unica porta de escrita do site publico. SECURITY DEFINER de proposito: valida e grava cliente + pedido numa transacao, sem dar ao anon permissao de escrita direta em tabela nenhuma.';

revoke all on function public.submeter_pedido(
  text, text, text, text, text, text, jsonb, jsonb, jsonb, integer, integer
) from public;

grant execute on function public.submeter_pedido(
  text, text, text, text, text, text, jsonb, jsonb, jsonb, integer, integer
) to anon, authenticated;

-- NOTA sobre o linter do Supabase:
-- esta funcao dispara dois avisos, "Public/Signed-In Users Can Execute SECURITY
-- DEFINER Function". Sao esperados e aceites: e literalmente o objetivo da funcao,
-- ser o endpoint publico de submissao. O que o linter nao pode saber e a intencao.
-- O que importa e o que esta a seguir: a funcao valida tudo o que recebe, corre com
-- search_path vazio, e nao devolve nada alem do id do pedido criado.
