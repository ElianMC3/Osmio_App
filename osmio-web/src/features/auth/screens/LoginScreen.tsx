import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../shared/hooks/useAuth'
import CyberBackground from '../../../shared/components/CyberBackground'

export default function LoginScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/dashboard'
  const { login, register } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (isRegister) {
        await register(email, password)
        setError('Revisa tu email para confirmar el registro.')
        return
      }
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.message || 'Error de autenticación')
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
              {isRegister ? 'CREAR CUENTA' : 'The best way to grow up'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-label-caps text-xs text-text-muted block mb-2 tracking-[1px] uppercase">
                Email
              </label>
              <input
                type="email"
                placeholder="Example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-panel border border-green/20 rounded-lg py-3.5 px-4 font-body-lg text-base text-text-green placeholder:text-text-muted/30 focus:outline-none focus:border-green/60 transition-colors"
              />
            </div>
            <div>
              <label className="font-label-caps text-xs text-text-muted block mb-2 tracking-[1px] uppercase">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-panel border border-green/20 rounded-lg py-3.5 px-4 font-body-lg text-base text-text-green placeholder:text-text-muted/30 focus:outline-none focus:border-green/60 transition-colors"
              />
            </div>

            {error && (
              <p className="font-label-caps text-xs text-error-container text-center leading-relaxed">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-on-primary font-label-caps uppercase tracking-[1.5px] text-sm py-3.5 rounded-lg hover:brightness-110 active:scale-[0.97] transition-all disabled:opacity-50 cursor-pointer mt-2"
            >
              {submitting ? '…' : isRegister ? 'CREAR CUENTA' : 'LOG-IN'}
            </button>
          </form>

          <button
            onClick={() => { setIsRegister(!isRegister); setError('') }}
            className="w-full mt-6 text-center font-label-caps text-xs text-text-muted hover:text-text-green transition-colors cursor-pointer uppercase tracking-[1.5px]"
          >
            {isRegister ? '¿YA TIENES CUENTA? INICIA SESIÓN' : '¿NO TIENES CUENTA? REGÍSTRATE'}
          </button>
        </div>
      </div>
    </div>
  )
}
