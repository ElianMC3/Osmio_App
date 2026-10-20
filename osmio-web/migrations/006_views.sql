-- 006_views.sql
-- Vistas de análisis con `security_invoker = true`.
--
-- MOTIVO DE SEGURIDAD: por defecto las vistas se ejecutan con los privilegios
-- de su dueño (postgres), que salta RLS. Con la anon key y SIN sesión se podían
-- leer los datos de todos los usuarios desde /rest/v1/<vista>. Con
-- `security_invoker = true` la vista respeta las políticas RLS de quien consulta.
--
-- Idempotente: `create or replace view` mantiene columnas y tipos, y solo
-- cambia la opción de seguridad.

create or replace view public.strength_volume_by_week
with (security_invoker = true) as
select
  s.user_id,
  to_char(date_trunc('week', s.date::timestamptz), 'IYYY-"W"IW') as week,
  sum(se.weight * se.reps) as load
from public.strength_sessions s
join public.set_entries se on se.session_id = s.id
group by s.user_id, date_trunc('week', s.date::timestamptz);

create or replace view public.strength_prs
with (security_invoker = true) as
select distinct on (s.user_id, s.exercise_name)
  s.user_id,
  s.exercise_name as exercise,
  se.weight::text as weight,
  s.date::text as date
from public.strength_sessions s
join public.set_entries se on se.session_id = s.id
order by s.user_id, s.exercise_name, se.weight desc, s.date desc;

create or replace view public.combat_rounds_by_week
with (security_invoker = true) as
select
  user_id,
  to_char(date_trunc('week', date::timestamptz), 'IYYY-"W"IW') as week,
  sum(rounds) filter (where type = 'striking') as striking,
  sum(rounds) filter (where type = 'grappling') as grappling
from public.combat_sessions
group by user_id, date_trunc('week', date::timestamptz);

create or replace view public.combat_total_rounds
with (security_invoker = true) as
select
  user_id,
  coalesce(sum(rounds) filter (where type = 'striking'), 0) as striking,
  coalesce(sum(rounds) filter (where type = 'grappling'), 0) as grappling
from public.combat_sessions
group by user_id;

create or replace view public.training_consistency
with (security_invoker = true) as
select user_id, date, true as active
from (
  select user_id, date from public.strength_sessions
  union
  select user_id, date from public.combat_sessions
) t
order by user_id, date;

create or replace view public.daily_nutrition_totals
with (security_invoker = true) as
select
  user_id,
  date(logged_at) as date,
  sum(calories) as calories,
  sum(protein) as protein,
  sum(carbs) as carbs,
  sum(fat) as fat
from public.meals
group by user_id, date(logged_at);

-- Defensa en profundidad: el rol anónimo no necesita leer estas vistas.
revoke all on public.strength_volume_by_week from anon;
revoke all on public.strength_prs from anon;
revoke all on public.combat_rounds_by_week from anon;
revoke all on public.combat_total_rounds from anon;
revoke all on public.training_consistency from anon;
revoke all on public.daily_nutrition_totals from anon;

grant select on public.strength_volume_by_week to authenticated;
grant select on public.strength_prs to authenticated;
grant select on public.combat_rounds_by_week to authenticated;
grant select on public.combat_total_rounds to authenticated;
grant select on public.training_consistency to authenticated;
grant select on public.daily_nutrition_totals to authenticated;
