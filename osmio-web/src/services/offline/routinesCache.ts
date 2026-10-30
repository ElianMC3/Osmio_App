import type { Routine } from '@/shared/types/session.types'
import { deleteEntry, getEntry, putEntry } from './idb'

/**
 * Última copia buena de las rutinas del usuario.
 *
 * Sirve para **empezar** a entrenar sin red: la pantalla de sesión activa pide
 * la rutina al arrancar, y sin esta caché caía a los ejercicios por defecto y
 * perdía la rutina real. Se guarda por usuario para que cerrar sesión en un
 * dispositivo compartido no deje las rutinas de otra cuenta a la vista.
 */

const STORE = 'routines-cache'

interface CachedRoutines {
  id: string
  routines: Routine[]
  updatedAt: number
}

export const routinesCache = {
  async save(userId: string, routines: Routine[]): Promise<void> {
    await putEntry<CachedRoutines>(STORE, { id: userId, routines, updatedAt: Date.now() })
  },

  async get(userId: string): Promise<Routine[] | null> {
    const cached = await getEntry<CachedRoutines>(STORE, userId)
    return cached?.routines ?? null
  },

  async clear(userId: string): Promise<void> {
    await deleteEntry(STORE, userId)
  },
}
