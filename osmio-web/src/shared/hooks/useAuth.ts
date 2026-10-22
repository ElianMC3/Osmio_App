import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../services/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, loading: true })

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ user: session?.user ?? null, loading: false })
    })

    supabase.auth.getUser().then(({ data }) => {
      setState({ user: data.user, loading: false })
    })

    return () => data.subscription.unsubscribe()
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
