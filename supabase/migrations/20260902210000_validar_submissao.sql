-- Endurece a porta publica antes de ligar o frontend ao Supabase.
create or replace function public.submeter_pedido(
  p_nome text, p_telefone text, p_email text, p_matricula text, p_notas text,
  p_tipo_veiculo text, p_markers jsonb, p_breakdown jsonb, p_totals jsonb,
  p_part_count integer, p_marker_count integer
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_client uuid;
  v_quote uuid;
  v_actual_markers integer;
begin
  if length(trim(coalesce(p_nome, ''))) not between 1 and 200 then
    raise exception 'nome_invalido' using errcode = '22023';
  end if;
  if length(coalesce(p_telefone, '')) > 40
    or coalesce(p_telefone, '') !~ '^\+?[0-9[:space:]().-]+$'
    or length(regexp_replace(coalesce(p_telefone, ''), '[^0-9]', '', 'g')) not between 9 and 15 then
    raise exception 'telefone_invalido' using errcode = '22023';
  end if;
  if length(coalesce(p_email, '')) > 200
    or (length(trim(coalesce(p_email, ''))) > 0 and p_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$') then
    raise exception 'email_invalido' using errcode = '22023';
  end if;
  if length(coalesce(p_matricula, '')) > 20 or length(coalesce(p_notas, '')) > 2000 then
    raise exception 'texto_demasiado_longo' using errcode = '22023';
  end if;
  if p_tipo_veiculo not in ('sedan', 'suv', 'wagon', 'compact', 'van') then
    raise exception 'tipo_veiculo_invalido' using errcode = '22023';
  end if;
  if jsonb_typeof(p_markers) <> 'object'
    or exists (select 1 from jsonb_each(p_markers) entry where jsonb_typeof(entry.value) <> 'array') then
    raise exception 'markers_invalidos' using errcode = '22023';
  end if;
  select coalesce(sum(jsonb_array_length(entry.value)), 0) into v_actual_markers from jsonb_each(p_markers) entry;
  if p_marker_count not between 1 and 2000 or p_marker_count <> v_actual_markers then
    raise exception 'numero_de_danos_invalido' using errcode = '22023';
  end if;
  if exists (
    select 1 from jsonb_each(p_markers) view_entry, jsonb_array_elements(view_entry.value) marker
    where jsonb_typeof(marker) <> 'object'
      or jsonb_typeof(marker->'x') <> 'number' or jsonb_typeof(marker->'y') <> 'number'
      or jsonb_typeof(marker->'size') <> 'number'
      or marker->>'severity' not in ('minor', 'medium', 'severe')
      or not (marker ?& array['id', 'partId'])
  ) then raise exception 'marker_invalido' using errcode = '22023'; end if;
  if jsonb_typeof(p_breakdown) <> 'array' or p_part_count <> jsonb_array_length(p_breakdown)
    or p_part_count not between 0 and 64 then
    raise exception 'breakdown_invalido' using errcode = '22023';
  end if;
  if jsonb_typeof(p_totals) <> 'object'
    or not (p_totals ?& array['subtotalHours','prepHours','finishHours','surchargeHours','totalHours','hourlyRate','totalPrice'])
    or exists (select 1 from jsonb_each(p_totals) total where total.key = any(array['subtotalHours','prepHours','finishHours','surchargeHours','totalHours','hourlyRate','totalPrice']) and jsonb_typeof(total.value) <> 'number') then
    raise exception 'totals_invalidos' using errcode = '22023';
  end if;
  if pg_column_size(p_markers) + pg_column_size(p_breakdown) > 400000 then
    raise exception 'pedido_demasiado_grande' using errcode = '22023';
  end if;

  insert into public.clients (name, phone, email)
  values (trim(p_nome), p_telefone, coalesce(p_email, '')) returning id into v_client;
  insert into public.quotes (
    source, status, client_id, vehicle_type, plate, notes, markers_by_view,
    part_breakdown, totals, part_count, marker_count
  ) values (
    'customer', 'sent', v_client, p_tipo_veiculo::public.vehicle_type,
    coalesce(p_matricula, ''), coalesce(p_notas, ''), p_markers,
    p_breakdown, p_totals, p_part_count, p_marker_count
  ) returning id into v_quote;
  return v_quote;
end;
$$;

revoke all on function public.submeter_pedido(text,text,text,text,text,text,jsonb,jsonb,jsonb,integer,integer) from public;
grant execute on function public.submeter_pedido(text,text,text,text,text,text,jsonb,jsonb,jsonb,integer,integer) to anon, authenticated;
