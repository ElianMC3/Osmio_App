import { type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Redirect } from './Redirect'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-label-caps text-sm text-text-muted animate-pulse">Cargando…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
