-- 004_routine_dropset.sql
-- Drop set en rutina: marca el ejercicio para terminar con un set descendente
-- de peso. `dropset_percent` indica el % del peso del último set de trabajo.
-- Ejecutar en Supabase > SQL Editor (después de 002).

alter table public.routine_exercises
  add column if not exists dropset boolean not null default false,
  add column if not exists dropset_percent numeric(5,1) not null default 50;
