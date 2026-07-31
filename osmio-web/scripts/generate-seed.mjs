#!/usr/bin/env node
// Genera migrations/003_seed_exercises.sql (completo, para psql) y versiones
// partidas migrations/003_seed_exercises_part_NN.sql para el SQL Editor de
// Supabase (que tiene un límite de tamaño por query).
// Uso: node scripts/generate-seed.mjs [ruta_a_exercises.json]

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const input =
  process.argv[2] ?? resolve(root, 'exercises-dataset/data/exercises.json')
const dir = resolve(root, 'migrations')
const output = resolve(dir, '003_seed_exercises.sql')
const MAX_PART_BYTES = 800 * 1024

const sqlEscape = (value) =>
  String(value).replace(/'/g, "''").replace(/\n+/g, '\n')

const jsonLiteral = (value) => {
  const json = JSON.stringify(value)
  return `'${sqlEscape(json)}'::jsonb`
}

const records = JSON.parse(readFileSync(input, 'utf-8'))
if (!Array.isArray(records) || records.length === 0) {
  console.error('No records found in', input)
  process.exit(1)
}

const rows = records.map((r) => {
  const id = Number.parseInt(r.id, 10)
  if (!Number.isFinite(id)) throw new Error(`Invalid id: ${r.id}`)
  const category = r.category ?? ''
  return {
    id,
    name: r.name ?? '',
    category,
    type: category.toLowerCase() === 'cardio' ? 'cardio' : 'strength',
    body_part: r.body_part ?? '',
    equipment: r.equipment ?? '',
    muscle_group: r.muscle_group ?? '',
    target: r.target ?? '',
    secondary_muscles: Array.isArray(r.secondary_muscles) ? r.secondary_muscles : [],
    instructions: r.instructions ?? {},
    image: r.image ?? '',
    gif_url: r.gif_url ?? '',
    attribution: r.attribution ?? '',
  }
})

const insertSQL = (chunk) => `insert into public.exercises
  (id, name, category, type, body_part, equipment, muscle_group, target, secondary_muscles, instructions, image, gif_url, attribution)
values
${chunk
  .map(
    (r) =>
      `(${r.id}, '${sqlEscape(r.name)}', '${sqlEscape(r.category)}', '${r.type}', ` +
      `'${sqlEscape(r.body_part)}', '${sqlEscape(r.equipment)}', ` +
      `'${sqlEscape(r.muscle_group)}', '${sqlEscape(r.target)}', ` +
      `${jsonLiteral(r.secondary_muscles)}, ${jsonLiteral(r.instructions)}, ` +
      `'${sqlEscape(r.image)}', '${sqlEscape(r.gif_url)}', '${sqlEscape(r.attribution)}')`
  )
  .join(',\n')}
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  type = excluded.type,
  body_part = excluded.body_part,
  equipment = excluded.equipment,
  muscle_group = excluded.muscle_group,
  target = excluded.target,
  secondary_muscles = excluded.secondary_muscles,
  instructions = excluded.instructions,
  image = excluded.image,
  gif_url = excluded.gif_url,
  attribution = excluded.attribution;
`

const header = `-- 003_seed_exercises.sql (generado por scripts/generate-seed.mjs)
-- Siembra los ${rows.length} ejercicios del dataset Gym Visual.
-- Ejecutar en Supabase > SQL Editor (después de 001 y 002).

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

-- Asegura una primary key en id (requerida por el ON CONFLICT de abajo).
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.exercises'::regclass and contype = 'p'
  ) then
    alter table public.exercises add primary key (id);
  end if;
end $$;

`

const footer = `-- Reinicia la secuencia del id serial para que el próximo INSERT sin id
-- (si algún día se hace desde el panel) no colisione con los ids sembrados.
select setval(
  pg_get_serial_sequence('public.exercises', 'id'),
  (select coalesce(max(id), 1) from public.exercises)
);

`

// --- Archivo completo (para psql -f) ---
let full = header
for (let i = 0; i < rows.length; i += 200) {
  full += insertSQL(rows.slice(i, i + 200)) + '\n'
}
full += footer
writeFileSync(output, full)

// --- Versiones partidas (para el SQL Editor) ---
const parts = []
let current = []
for (const row of rows) {
  const trial = insertSQL([...current, row])
  if (current.length > 0 && Buffer.byteLength(insertSQL(current) + trial) > MAX_PART_BYTES) {
    parts.push(current)
    current = []
  }
  current.push(row)
}
if (current.length > 0) parts.push(current)

parts.forEach((rowsPart, i) => {
  const isFirst = i === 0
  const isLast = i === parts.length - 1
  const name = resolve(dir, `003_seed_exercises_part_${String(i + 1).padStart(2, '0')}.sql`)
  const content = (isFirst ? header : '') + insertSQL(rowsPart) + (isLast ? footer : '')
  writeFileSync(name, content)
})

console.log(`OK: ${rows.length} exercises`)
console.log(`  completo -> ${output} (${(full.length / 1024).toFixed(0)} KB, para psql)`)
console.log(`  partidas -> ${parts.length} archivos (${(Buffer.byteLength(full) / 1024).toFixed(0)} KB total, para el SQL Editor)`)
