import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/services/supabase/client'
import { useAuth } from '@/shared/hooks/useAuth'
import CyberBackground from '@/shared/components/CyberBackground'

type Status = 'checking' | 'ready' | 'invalid'

const MIN_PASSWORD_LENGTH = 6

export default function ResetPasswordScreen() {
  const navigate = useNavigate()
  const { updatePassword } = useAuth()

  const [status, setStatus] = useState<Status>('checking')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let active = true

    // El enlace del email trae una sesión temporal de recuperación. getSession()
    // espera al intercambio del código en la URL antes de resolver.
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return
      if (event === 'PASSWORD_RECOVERY' || session) setStatus('ready')
    })

    supabase.auth
      .getSession()
      .then(({ data: sessionData }) => {
        if (!active) return
        setStatus((prev) => (prev === 'ready' ? prev : sessionData.session ? 'ready' : 'invalid'))
      })
      .catch(() => {
        if (active) setStatus('invalid')
      })

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`)
      return
    }
    if (password !== confirmation) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setSubmitting(true)
    try {
      await updatePassword(password)
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar la contraseña')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-surface overflow-hidden">
      <CyberBackground />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md glass-panel rounded-2xl p-8">
          <div className="text-center mb-10">
            <h1 className="font-headline-md text-4xl text-green mb-3 tracking-tight">OSMIO</h1>
            <p className="font-label-caps text-xs text-text-muted uppercase tracking-[3px]">
              NUEVA CONTRASEÑA
            </p>
          </div>

          {status === 'checking' && (
            <p className="font-label-caps text-sm text-text-muted text-center animate-pulse">
              Comprobando el enlace…
            </p>
          )}

          {status === 'invalid' && (
            <div className="space-y-6">
              <p className="font-label-caps text-xs text-error text-center leading-relaxed">
                El enlace no es válido o ha caducado. Pide uno nuevo desde la pantalla de acceso.
              </p>
              <Link
                to="/login"
                className="block w-full text-center bg-gradient-to-r from-primary via-green to-acid text-on-primary font-label-caps uppercase tracking-[1.5px] text-sm py-3.5 rounded-[10px] hover:brightness-110 transition-all"
              >
                VOLVER AL LOGIN
              </Link>
            </div>
          )}

          {status === 'ready' && !done && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="new-password"
                  className="font-label-caps text-xs text-text-muted block mb-2 tracking-[1px] uppercase"
                >
                  Nueva contraseña
                </label>
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                  className="w-full bg-panel border border-green/20 rounded-lg py-3.5 px-4 font-body-lg text-base text-text-green placeholder:text-text-muted/30 focus:outline-none focus:border-green/60 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="font-label-caps text-xs text-text-muted block mb-2 tracking-[1px] uppercase"
                >
                  Repite la contraseña
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                  className="w-full bg-panel border border-green/20 rounded-lg py-3.5 px-4 font-body-lg text-base text-text-green placeholder:text-text-muted/30 focus:outline-none focus:border-green/60 transition-colors"
                />
              </div>

              <div aria-live="polite">
                {error && (
                  <p className="font-label-caps text-xs text-error text-center leading-relaxed">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-primary via-green to-acid text-on-primary font-label-caps uppercase tracking-[1.5px] text-sm py-3.5 rounded-[10px] hover:brightness-110 hover:shadow-[0_0_24px_color-mix(in_srgb,var(--green)_35%,transparent)] active:scale-[0.97] transition-all disabled:opacity-50 cursor-pointer mt-2"
              >
                {submitting ? '…' : 'GUARDAR CONTRASEÑA'}
              </button>
            </form>
          )}

          {status === 'ready' && done && (
            <div className="space-y-6">
              <p className="font-label-caps text-xs text-primary-fixed text-center leading-relaxed">
                Contraseña actualizada. Hemos cerrado el resto de sesiones abiertas.
              </p>
              <button
                onClick={() => navigate('/dashboard', { replace: true })}
                className="w-full bg-gradient-to-r from-primary via-green to-acid text-on-primary font-label-caps uppercase tracking-[1.5px] text-sm py-3.5 rounded-[10px] hover:brightness-110 transition-all cursor-pointer"
              >
                IR AL DASHBOARD
              </button>
            </div>
          )}

          {status === 'ready' && !done && (
            <Link
              to="/login"
              className="block w-full mt-6 text-center font-label-caps text-xs text-text-muted hover:text-text-green transition-colors uppercase tracking-[1.5px]"
            >
              VOLVER AL LOGIN
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
