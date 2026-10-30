import { sessionsRemote } from '@/services/api/sessions.remote'
import type { CombatSession, StrengthSession } from '@/shared/types/session.types'
import { clearEntries, deleteEntry, getAllEntries, getEntry, putEntry } from './idb'

const STORE = 'session-outbox'

/**
 * Cola de sesiones pendientes de subir (outbox).
 *
 * Cada sesión se crea con un UUID en el cliente y se guarda aquí antes de
 * intentar el envío. Así el id es el mismo en el dispositivo y en Supabase:
 * reintentar nunca duplica (el remoto trata el 23505 como "ya estaba").
 */
export interface QueuedSession {
  id: string
  kind: 'strength' | 'combat'
  payload: StrengthSession | CombatSession
  createdAt: number
  attempts: number
}

export interface FlushResult {
  synced: number
  failed: number
}

function isOnline(): boolean {
  return typeof navigator === 'undefined' || navigator.onLine !== false
}

async function upload(entry: QueuedSession): Promise<void> {
  if (entry.kind === 'strength') {
    await sessionsRemote.createStrengthSession(entry.payload as StrengthSession)
    return
  }
  await sessionsRemote.createCombatSession(entry.payload as CombatSession)
}

async function listPending(): Promise<QueuedSession[]> {
  const entries = await getAllEntries<QueuedSession>(STORE)
  return entries.sort((a, b) => a.createdAt - b.createdAt)
}

async function runFlush(): Promise<FlushResult> {
  const entries = await listPending()
  if (entries.length === 0) return { synced: 0, failed: 0 }
  // Sin red no tiene sentido disparar N peticiones que van a fallar.
  if (!isOnline()) return { synced: 0, failed: entries.length }

  let synced = 0
  let failed = 0

  for (const entry of entries) {
    try {
      await upload(entry)
      await deleteEntry(STORE, entry.id)
      synced += 1
    } catch {
      await putEntry<QueuedSession>(STORE, { ...entry, attempts: entry.attempts + 1 })
      failed += 1
    }
  }

  return { synced, failed }
}

let inFlight: Promise<FlushResult> | null = null

export const sessionQueue = {
  async enqueueStrength(session: StrengthSession): Promise<void> {
    await putEntry<QueuedSession>(STORE, {
      id: session.id,
      kind: 'strength',
      payload: session,
      createdAt: Date.now(),
      attempts: 0,
    })
  },

  async enqueueCombat(session: CombatSession): Promise<void> {
    await putEntry<QueuedSession>(STORE, {
      id: session.id,
      kind: 'combat',
      payload: session,
      createdAt: Date.now(),
      attempts: 0,
    })
  },

  pending: listPending,

  async count(): Promise<number> {
    return (await getAllEntries<QueuedSession>(STORE)).length
  },

  /** Intenta subir una sola entrada. `true` si ya está en el servidor. */
  async flushOne(id: string): Promise<boolean> {
    const entry = await getEntry<QueuedSession>(STORE, id)
    if (!entry) return true
    if (!isOnline()) return false

    try {
      await upload(entry)
      await deleteEntry(STORE, id)
      return true
    } catch {
      await putEntry<QueuedSession>(STORE, { ...entry, attempts: entry.attempts + 1 })
      return false
    }
  },

  /** Sube todo lo pendiente. Si ya hay un flush en curso, comparte esa promesa. */
  async flush(): Promise<FlushResult> {
    if (inFlight) return inFlight
    inFlight = runFlush().finally(() => {
      inFlight = null
    })
    return inFlight
  },

  clear: () => clearEntries(STORE),
}
