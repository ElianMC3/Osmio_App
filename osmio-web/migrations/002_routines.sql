-- 002_routines.sql
-- Rutinas por usuario: `routines` + `routine_exercises` con RLS owner-only.
-- Ejecutar en Supabase > SQL Editor (después de 001 y antes del seed 003).

-- Asegura primary key en exercises.id (requerida por el FK de routine_exercises).
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.exercises'::regclass and contype = 'p'
  ) then
    alter table public.exercises add primary key (id);
  end if;
end $$;

create table if not exists public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.routine_exercises (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines(id) on delete cascade,
  exercise_id integer not null references public.exercises(id) on delete cascade,
  position integer not null default 0,
  target_sets integer not null default 3,
  target_reps_min integer not null default 8,
  target_reps_max integer not null default 12,
  current_weight numeric(6,1) not null default 0,
  rest_seconds integer not null default 180,
  notes text not null default '',
  unique (routine_id, exercise_id)
);

alter table public.routines enable row level security;
alter table public.routine_exercises enable row level security;

create policy "routines_select_own" on public.routines
  for select using (auth.uid() = user_id);
create policy "routines_insert_own" on public.routines
  for insert with check (auth.uid() = user_id);
create policy "routines_update_own" on public.routines
  for update using (auth.uid() = user_id);
create policy "routines_delete_own" on public.routines
  for delete using (auth.uid() = user_id);

create policy "routine_ex_select_own" on public.routine_exercises
  for select using (
    exists (select 1 from public.routines r where r.id = routine_id and r.user_id = auth.uid())
  );
create policy "routine_ex_insert_own" on public.routine_exercises
  for insert with check (
    exists (select 1 from public.routines r where r.id = routine_id and r.user_id = auth.uid())
  );
create policy "routine_ex_update_own" on public.routine_exercises
  for update using (
    exists (select 1 from public.routines r where r.id = routine_id and r.user_id = auth.uid())
  );
create policy "routine_ex_delete_own" on public.routine_exercises
  for delete using (
    exists (select 1 from public.routines r where r.id = routine_id and r.user_id = auth.uid())
  );
