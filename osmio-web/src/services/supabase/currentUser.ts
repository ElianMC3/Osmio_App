import type { Session, User } from '@supabase/supabase-js'
import { supabase } from './client'

/**
 * Usuario actual leído del almacenamiento local, no del servidor.
 *
 * `auth.getUser()` siempre hace una petición de red: sin conexión devuelve
 * error y la app te echaba al login. `auth.getSession()` lee localStorage, pero
 * si el token ha caducado intenta refrescarlo (también red). Para poder abrir la
 * app en el gimnasio sin cobertura leemos la sesión guardada tal cual: si el
 * token está caducado las consultas fallarán con 401 y las capas de caché
 * entran en juego, pero el usuario sigue dentro y puede entrenar.
 */

/** Clave por defecto de supabase-js: `sb-<project-ref>-auth-token`. */
function authStorageKey(): string {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const projectRef = url ? new URL(url).hostname.split('.')[0] : 'local'
  return `sb-${projectRef}-auth-token`
}

function readStoredSession(): Session | null {
  try {
    const raw = localStorage.getItem(authStorageKey())
    if (!raw) return null
    const session = JSON.parse(raw) as Session
    return session?.user?.id ? session : null
  } catch {
    // JSON corrupto o almacenamiento bloqueado: se trata como "sin sesión".
    return null
  }
}

/** Sesión local: primero la de Supabase (puede refrescar) y, si falla, la guardada. */
export async function getCurrentSession(): Promise<Session | null> {
  try {
    const { data } = await supabase.auth.getSession()
    if (data.session) return data.session
  } catch {
    // Sin red y con el token caducado el refresco falla; seguimos con la copia.
  }
  return readStoredSession()
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getCurrentSession()
  return session?.user ?? null
}

/** Id del usuario actual. Lanza si de verdad no hay sesión (no por falta de red). */
export async function getCurrentUserId(): Promise<string> {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not authenticated')
  return user.id
}
