import { isNetworkError } from '@/services/offline/network'
import { sessionQueue } from '@/services/offline/sessionQueue'
import type { CombatSession, Session, StrengthSession } from '../../shared/types/session.types'
import { sessionsRemote } from './sessions.remote'

/**
 * API pública de sesiones para las pantallas.
 *
 * Escrituras: van primero a la cola de IndexedDB y luego se intenta subir. Si
 * no hay red (o falla), la sesión queda pendiente y se sincroniza sola al
 * volver la conexión. Lecturas: se mezclan el servidor y las pendientes, así lo
 * que acabas de guardar offline aparece igual en el dashboard y el historial.
 */

export interface SaveResult<T> {
  session: T
  /** `true` si quedó en la cola esperando conexión. */
  pending: boolean
}

function newSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Contextos no seguros (http sin localhost) no exponen randomUUID.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0
    const value = char === 'x' ? random : (random & 0x3) | 0x8
    return value.toString(16)
  })
}

function isStrength(session: Session): session is StrengthSession {
  return 'sets' in session
}

/**
 * Combina la respuesta del servidor con las sesiones pendientes. Si la red
 * falla pero hay algo pendiente que mostrar, se devuelve eso en vez de romper
 * la pantalla; si no hay nada pendiente, el error se propaga.
 */
async function mergePending<T extends Session>(
  loadRemote: () => Promise<T[]>,
  keep: (session: Session) => boolean,
): Promise<T[]> {
  // Si IndexedDB no está disponible, la app debe seguir funcionando online:
  // la cola es una mejora, no un requisito para leer.
  const pending = await sessionQueue
    .pending()
    .then((entries) => entries.map((entry) => entry.payload).filter(keep))
    .catch(() => [] as Session[])

  let remote: T[] = []
  try {
    remote = await loadRemote()
  } catch (error) {
    if (pending.length === 0 || !isNetworkError(error)) throw error
  }

  const byId = new Map<string, Session>()
  for (const session of remote) byId.set(session.id, session)
  for (const session of pending) byId.set(session.id, session)

  return [...byId.values()] as T[]
}

export const sessionsApi = {
  getExercises: sessionsRemote.getExercises,

  getExercise: sessionsRemote.getExercise,

  getSessionsByExercise: (exerciseId: number): Promise<StrengthSession[]> =>
    mergePending(
      () => sessionsRemote.getSessionsByExercise(exerciseId),
      (session) => isStrength(session) && session.exerciseId === exerciseId,
    ),

  getStrengthSessions: (): Promise<StrengthSession[]> =>
    mergePending(() => sessionsRemote.getStrengthSessions(), isStrength),

  getCombatSessions: (): Promise<CombatSession[]> =>
    mergePending(() => sessionsRemote.getCombatSessions(), (session) => !isStrength(session)),

  getSessionsByDate: (date: string): Promise<Session[]> =>
    mergePending(() => sessionsRemote.getSessionsByDate(date), (session) => session.date === date),

  async createStrengthSession(input: Omit<StrengthSession, 'id'>): Promise<SaveResult<StrengthSession>> {
    const session: StrengthSession = { ...input, id: newSessionId() }
    await sessionQueue.enqueueStrength(session)
    const synced = await sessionQueue.flushOne(session.id)
    return { session, pending: !synced }
  },

  async createCombatSession(input: Omit<CombatSession, 'id'>): Promise<SaveResult<CombatSession>> {
    const session: CombatSession = { ...input, id: newSessionId() }
    await sessionQueue.enqueueCombat(session)
    const synced = await sessionQueue.flushOne(session.id)
    return { session, pending: !synced }
  },
}
