-- 001_exercises_extend.sql
-- Extiende la tabla `exercises` con los campos del dataset Gym Visual (1.324 ejercicios).
-- Ejecutar en Supabase > SQL Editor.

alter table public.exercises
  add column if not exists body_part text,
  add column if not exists equipment text,
  add column if not exists muscle_group text,
  add column if not exists target text,
  add column if not exists secondary_muscles jsonb not null default '[]'::jsonb,
  add column if not exists instructions jsonb not null default '{}'::jsonb,
  add column if not exists image text,
  add column if not exists gif_url text,
  add column if not exists attribution text;
