import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ getSession: vi.fn() }))

vi.mock('@/services/supabase/client', () => ({
  supabase: { auth: { getSession: mocks.getSession } },
}))

import { getCurrentSession, getCurrentUser, getCurrentUserId } from './currentUser'

// Misma convención que supabase-js: `sb-<project-ref>-auth-token`.
const PROJECT_REF = new URL(import.meta.env.VITE_SUPABASE_URL ?? 'https://local.test').hostname.split('.')[0]
const STORAGE_KEY = `sb-${PROJECT_REF}-auth-token`

function storedSession(id: string, email = 'ana@osmio.app') {
  return { access_token: 'token', refresh_token: 'refresh', user: { id, email } }
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

describe('getCurrentSession', () => {
  it('usa la sesión de Supabase cuando está disponible', async () => {
    const session = storedSession('user-1')
    mocks.getSession.mockResolvedValue({ data: { session }, error: null })

    await expect(getCurrentSession()).resolves.toBe(session)
  })

  it('cae a la copia local si el refresco falla sin red', async () => {
    const session = storedSession('user-1')
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    mocks.getSession.mockRejectedValue(new Error('Failed to fetch'))

    const result = await getCurrentSession()

    expect(result?.user.id).toBe('user-1')
  })

  it('cae a la copia local si Supabase devuelve sesión nula (token caducado)', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedSession('user-1')))
    mocks.getSession.mockResolvedValue({ data: { session: null }, error: null })

    const result = await getCurrentSession()

    expect(result?.user.id).toBe('user-1')
  })

  it('devuelve null si no hay sesión ni copia guardada', async () => {
    mocks.getSession.mockResolvedValue({ data: { session: null }, error: null })

    await expect(getCurrentSession()).resolves.toBeNull()
  })

  it('ignora una copia local corrupta en vez de romper el arranque', async () => {
    localStorage.setItem(STORAGE_KEY, '{no-es-json')
    mocks.getSession.mockResolvedValue({ data: { session: null }, error: null })

    await expect(getCurrentSession()).resolves.toBeNull()
  })

  it('ignora una copia local sin usuario', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ access_token: 'token' }))
    mocks.getSession.mockResolvedValue({ data: { session: null }, error: null })

    await expect(getCurrentSession()).resolves.toBeNull()
  })
})

describe('getCurrentUser / getCurrentUserId', () => {
  it('expone el usuario guardado sin tocar la red', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedSession('user-7', 'leo@osmio.app')))
    mocks.getSession.mockRejectedValue(new Error('Failed to fetch'))

    const user = await getCurrentUser()

    expect(user?.id).toBe('user-7')
    expect(user?.email).toBe('leo@osmio.app')
    await expect(getCurrentUserId()).resolves.toBe('user-7')
  })

  it('lanza Not authenticated solo cuando de verdad no hay sesión', async () => {
    mocks.getSession.mockResolvedValue({ data: { session: null }, error: null })

    await expect(getCurrentUserId()).rejects.toThrow('Not authenticated')
  })
})
