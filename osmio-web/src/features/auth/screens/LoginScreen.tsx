import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../shared/hooks/useAuth'
import CyberBackground from '../../../shared/components/CyberBackground'

type Mode = 'login' | 'register' | 'forgot'

interface RedirectState {
  from?: { pathname?: string }
}

const SUBTITLE: Record<Mode, string> = {
  login: 'The best way to grow up',
  register: 'CREAR CUENTA',
  forgot: 'RECUPERAR CONTRASEÑA',
}

const SUBMIT_LABEL: Record<Mode, string> = {
  login: 'LOG-IN',
  register: 'CREAR CUENTA',
  forgot: 'ENVIAR ENLACE',
}

export default function LoginScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as RedirectState | null)?.from?.pathname ?? '/dashboard'
  const { login, register, resetPassword } = useAuth()

  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const switchMode = (next: Mode) => {
    setMode(next)
    setError('')
    setNotice('')
    setPassword('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setNotice('')
    setSubmitting(true)
    try {
      if (mode === 'forgot') {
        await resetPassword(email)
        setNotice('Si existe una cuenta con ese email, te hemos enviado un enlace para restablecer la contraseña.')
        return
      }
      if (mode === 'register') {
        await register(email, password)
        setNotice('Revisa tu email para confirmar el registro.')
        setPassword('')
        setMode('login')
        return
      }
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-dvh bg-surface overflow-hidden">
      <CyberBackground />
      <div className="relative z-10 min-h-dvh flex items-center justify-center p-6">
        <div className="w-full max-w-md glass-panel rounded-2xl p-8">
          <div className="text-center mb-10">
            <h1 className="font-headline-md text-4xl text-green mb-3 tracking-tight">OSMIO</h1>
            <p className="font-label-caps text-xs text-text-muted uppercase tracking-[3px]">
              {SUBTITLE[mode]}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="auth-email"
                className="font-label-caps text-xs text-text-muted block mb-2 tracking-[1px] uppercase"
              >
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                placeholder="Example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-panel border border-green/20 rounded-lg py-3.5 px-4 font-body-lg text-base text-text-green placeholder:text-text-muted/30 focus:outline-none focus:border-green/60 transition-colors"
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <label
                  htmlFor="auth-password"
                  className="font-label-caps text-xs text-text-muted block mb-2 tracking-[1px] uppercase"
                >
                  Password
                </label>
                <input
                  id="auth-password"
                  type="password"
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-panel border border-green/20 rounded-lg py-3.5 px-4 font-body-lg text-base text-text-green placeholder:text-text-muted/30 focus:outline-none focus:border-green/60 transition-colors"
                />
              </div>
            )}

            <div aria-live="polite" className="space-y-2">
              {error && (
                <p className="font-label-caps text-xs text-error text-center leading-relaxed">{error}</p>
              )}
              {notice && (
                <p className="font-label-caps text-xs text-primary-fixed text-center leading-relaxed">
                  {notice}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-primary via-green to-acid text-on-primary font-label-caps uppercase tracking-[1.5px] text-sm py-3.5 rounded-[10px] hover:brightness-110 hover:shadow-[0_0_24px_color-mix(in_srgb,var(--green)_35%,transparent)] active:scale-[0.97] transition-all disabled:opacity-50 cursor-pointer mt-2"
            >
              {submitting ? '…' : SUBMIT_LABEL[mode]}
            </button>
          </form>

          {mode === 'login' && (
            <button
              onClick={() => switchMode('forgot')}
              className="w-full mt-4 text-center font-label-caps text-xs text-text-muted hover:text-text-green transition-colors cursor-pointer uppercase tracking-[1.5px]"
            >
              ¿OLVIDASTE TU CONTRASEÑA?
            </button>
          )}

          <button
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            className="w-full mt-6 text-center font-label-caps text-xs text-text-muted hover:text-text-green transition-colors cursor-pointer uppercase tracking-[1.5px]"
          >
            {mode === 'register'
              ? '¿YA TIENES CUENTA? INICIA SESIÓN'
              : mode === 'forgot'
                ? 'VOLVER AL LOGIN'
                : '¿NO TIENES CUENTA? REGÍSTRATE'}
          </button>
        </div>
      </div>
    </div>
  )
}
