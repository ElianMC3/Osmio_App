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

  return {
    user: state.user,
    loading: state.loading,
    isAuthenticated: !!state.user,
    login,
    register,
    logout,
  }
}
