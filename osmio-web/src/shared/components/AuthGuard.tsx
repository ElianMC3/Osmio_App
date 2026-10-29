import { type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Skeleton } from 'boneyard-js/react'
import { useAuth } from '../hooks/useAuth'
import { Redirect } from './Redirect'
import { AppShellSkeleton } from '@/design-system/skeletons/fixtures'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <Skeleton
        name="app-shell"
        loading
        select="viewport"
        transition={180}
        className="block"
        fixture={<AppShellSkeleton />}
        fallback={<AppShellSkeleton />}
      >
        {null}
      </Skeleton>
    )
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
