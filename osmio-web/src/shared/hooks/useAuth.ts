import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../services/supabase/client'
import { getCurrentSession } from '../../services/supabase/currentUser'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, loading: true })

  useEffect(() => {
    let active = true

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return
      if (event === 'SIGNED_OUT') {
        setState({ user: null, loading: false })
        return
      }
      // Un evento sin sesión (p. ej. token caducado sin red) no debe borrar al
      // usuario que ya estaba cargado: solo un SIGNED_OUT cierra sesión.
      setState((prev) => ({ user: session?.user ?? prev.user ?? null, loading: false }))
    })

    // La sesión local evita depender de la red al arrancar (gimnasio sin
    // cobertura). `getUser()` hacía una petición y dejaba `user: null`.
    getCurrentSession()
      .then((session) => {
        if (!active) return
        setState((prev) => ({ user: session?.user ?? prev.user ?? null, loading: false }))
      })
      .catch(() => {
        if (active) setState((prev) => ({ user: prev.user, loading: false }))
      })

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    const user = data.user
    if (user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ id: user.id, name: '', email: user.email ?? email }, { onConflict: 'id' })
      if (profileError) console.error('Error creating profile:', profileError)
    }
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    // Supabase no distingue si el email existe: no hay enumeración de cuentas.
    if (error) throw error
  }, [])

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
    try {
      // Si la cuenta estaba comprometida, invalida el resto de sesiones.
      await supabase.auth.signOut({ scope: 'others' })
    } catch {
      // Best effort: el cambio de contraseña ya se aplicó.
    }
  }, [])

  return {
    user: state.user,
    loading: state.loading,
    isAuthenticated: !!state.user,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
  }
}
