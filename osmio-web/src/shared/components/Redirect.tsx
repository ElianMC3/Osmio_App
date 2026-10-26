import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface RedirectProps {
  to: string
  replace?: boolean
  state?: unknown
}

/**
 * Redirect de un solo disparo.
 *
 * `<Navigate>` de React Router vuelve a navegar en cada render. Dentro del
 * árbol que AnimatePresence mantiene montado durante su animación de salida,
 * eso dispara un bucle de renders ("Maximum update depth exceeded").
 */
export function Redirect({ to, replace = false, state }: RedirectProps) {
  const navigate = useNavigate()
  const navigated = useRef(false)

  useEffect(() => {
    if (navigated.current) return
    navigated.current = true
    navigate(to, { replace, state })
  }, [navigate, to, replace, state])

  return null
}
