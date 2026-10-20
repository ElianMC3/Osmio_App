-- 005_profile_age.sql
-- Añade `profiles.age`, que profiles.api.ts ya intenta guardar pero la columna
-- no existía. Hasta ahora el código lo tapaba con un reintento sin `age`
-- (ver services/api/profiles.api.ts), así que la edad nunca se persistía.
--
-- Idempotente: seguro de ejecutar sobre la base actual.

alter table public.profiles
  add column if not exists age integer;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_age_check'
  ) then
    alter table public.profiles
      add constraint profiles_age_check
      check (age is null or (age between 10 and 120));
  end if;
end $$;
