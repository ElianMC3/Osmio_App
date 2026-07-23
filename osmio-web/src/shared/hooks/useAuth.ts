import { useState, useCallback } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface UseAuthReturn {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)

  const login = useCallback(async (email: string, _password: string) => {
    // Placeholder - implement actual auth
    setUser({ id: '1', name: 'Elite Warrior', email })
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return { user, isAuthenticated: !!user, login, logout }
}
