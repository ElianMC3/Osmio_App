import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'
import {
  THEME_ACCENTS,
  readThemeSettings,
  writeThemeSettings,
  applyTheme,
  type ThemeAccent,
  type ThemeMode,
  type ThemeSettings,
} from '@/design-system/theme'

type UnitSystem = 'metric' | 'imperial'
type Language = 'es' | 'en'

interface Preferences {
  units: UnitSystem
  language: Language
  haptic: boolean
  autoRest: boolean
  trainingReminders: boolean
  mealReminders: boolean
}

const DEFAULTS: Preferences = {
  units: 'metric',
  language: 'es',
  haptic: true,
  autoRest: true,
  trainingReminders: true,
  mealReminders: true,
}

const STORAGE_KEY = 'osmio.settings'

const ACCENT_LABELS: Record<ThemeAccent, string> = {
  lime: 'Lima',
  cyan: 'Cian',
  violet: 'Violeta',
  amber: 'Ámbar',
}

function loadPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

function accentSwatch(accent: ThemeAccent): string {
  switch (accent) {
    case 'lime': return '#cacb2b'
    case 'cyan': return '#35c8d4'
    case 'violet': return '#b39dff'
    case 'amber': return '#ffb64c'
  }
}

export default function SettingsScreen() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [prefs, setPrefs] = useState<Preferences>(loadPreferences)
  const [theme, setTheme] = useState<ThemeSettings>(readThemeSettings)
  const [signedOut, setSignedOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    } catch {
      // almacenamiento no disponible
    }
  }, [prefs])

  const update = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }))
  }

  const updateThemeMode = (mode: ThemeMode) => {
    const next = { ...theme, mode }
    setTheme(next)
    writeThemeSettings(next)
    applyTheme(next)
  }

  const updateThemeAccent = (accent: ThemeAccent) => {
    const next = { ...theme, accent }
    setTheme(next)
    writeThemeSettings(next)
    applyTheme(next)
  }

  const handleLogout = async () => {
    setError(null)
    try {
      await logout()
      setSignedOut(true)
      navigate('/login', { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cerrar sesión')
    }
  }

  const Switch = ({ checked, label, onToggle }: { checked: boolean; label: string; onToggle: () => void }) => (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
        checked ? 'bg-primary-fixed' : 'bg-outline-variant'
      }`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${
          checked ? 'left-6 bg-on-primary-fixed' : 'left-0.5 bg-surface-container'
        }`}
      />
    </button>
  )

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Page Title */}
      <div className="border-b border-outline-variant/30 pb-4">
        <h1 className="font-headline-md text-headline-md text-on-surface">Ajustes</h1>
        <p className="font-label-caps text-xs text-on-surface-variant opacity-70">
          Personaliza unidades, idioma y notificaciones de la aplicación
        </p>
      </div>

      {error && (
        <p className="font-label-sm text-sm text-error leading-relaxed">{error}</p>
      )}

      {/* Cuenta */}
      <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-5 space-y-4">
        <h3 className="font-label-caps text-sm text-on-surface font-bold flex items-center gap-2 border-b border-outline-variant/30 pb-3">
          <span className="material-symbols-outlined text-[18px] text-primary-fixed">account_circle</span>
          Cuenta
        </h3>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant text-[22px]">person</span>
            </div>
            <div className="min-w-0">
              <p className="font-label-caps text-sm text-on-surface font-bold truncate">
                {user?.email ?? 'Sesión iniciada'}
              </p>
              <p className="font-label-sm text-xs text-on-surface-variant">Supabase Auth</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="font-label-caps text-xs text-primary-fixed hover:underline active:scale-[0.98] transition-all cursor-pointer"
          >
            Ver Perfil
          </button>
        </div>
      </div>

      {/* Preferencias de pantalla */}
      <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-5 space-y-4">
        <h3 className="font-label-caps text-sm text-on-surface font-bold flex items-center gap-2 border-b border-outline-variant/30 pb-3">
          <span className="material-symbols-outlined text-[18px] text-primary-fixed">display_settings</span>
          Preferencias de Pantalla
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1.5 uppercase tracking-wider">Tema</label>
            <select
              value={theme.mode}
              onChange={(e) => updateThemeMode(e.target.value as ThemeMode)}
              className="w-full bg-surface-dim border border-outline-variant rounded-xl py-3 px-4 font-label-caps text-sm text-on-surface focus:outline-none focus:border-primary-fixed transition-all appearance-none cursor-pointer"
            >
              <option value="dark">Oscuro</option>
              <option value="light">Claro</option>
            </select>
          </div>

          <div>
            <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1.5 uppercase tracking-wider">Sistema de Unidades</label>
            <select
              value={prefs.units}
              onChange={(e) => update('units', e.target.value as UnitSystem)}
              className="w-full bg-surface-dim border border-outline-variant rounded-xl py-3 px-4 font-label-caps text-sm text-on-surface focus:outline-none focus:border-primary-fixed transition-all appearance-none cursor-pointer"
            >
              <option value="metric">Métrico (kg / cm)</option>
              <option value="imperial">Imperial (lb / in)</option>
            </select>
          </div>

          <div>
            <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1.5 uppercase tracking-wider">Idioma</label>
            <select
              value={prefs.language}
              onChange={(e) => update('language', e.target.value as Language)}
              className="w-full bg-surface-dim border border-outline-variant rounded-xl py-3 px-4 font-label-caps text-sm text-on-surface focus:outline-none focus:border-primary-fixed transition-all appearance-none cursor-pointer"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-label-caps text-[10px] text-on-surface-variant block mb-2 uppercase tracking-wider">Color de Acento</label>
          <div className="flex items-center gap-3">
            {THEME_ACCENTS.map((accent) => (
              <button
                key={accent}
                aria-label={`Acento ${ACCENT_LABELS[accent]}`}
                onClick={() => updateThemeAccent(accent)}
                className={`w-10 h-10 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                  theme.accent === accent
                    ? 'ring-2 ring-offset-2 ring-offset-background ring-primary-fixed scale-105'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: accentSwatch(accent) }}
              >
                {theme.accent === accent && (
                  <span className="material-symbols-outlined text-sm text-black">check</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comportamiento */}
      <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-5 space-y-4">
        <h3 className="font-label-caps text-sm text-on-surface font-bold flex items-center gap-2 border-b border-outline-variant/30 pb-3">
          <span className="material-symbols-outlined text-[18px] text-primary-fixed">smartphone</span>
          Comportamiento
        </h3>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">vibration</span>
              </div>
              <div>
                <p className="font-label-caps text-sm text-on-surface font-bold">Respuesta Háptica</p>
                <p className="font-label-sm text-xs text-on-surface-variant">Vibración al completar series</p>
              </div>
            </div>
            <Switch checked={prefs.haptic} label="Respuesta háptica" onToggle={() => update('haptic', !prefs.haptic)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">timer</span>
              </div>
              <div>
                <p className="font-label-caps text-sm text-on-surface font-bold">Descanso Automático</p>
                <p className="font-label-sm text-xs text-on-surface-variant">Inicia el temporizador tras cada serie</p>
              </div>
            </div>
            <Switch checked={prefs.autoRest} label="Descanso automático" onToggle={() => update('autoRest', !prefs.autoRest)} />
          </div>
        </div>
      </div>

      {/* Notificaciones */}
      <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-5 space-y-4">
        <h3 className="font-label-caps text-sm text-on-surface font-bold flex items-center gap-2 border-b border-outline-variant/30 pb-3">
          <span className="material-symbols-outlined text-[18px] text-primary-fixed">notifications</span>
          Notificaciones
        </h3>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">alarm</span>
              </div>
              <div>
                <p className="font-label-caps text-sm text-on-surface font-bold">Recordatorios de Entrenamiento</p>
                <p className="font-label-sm text-xs text-on-surface-variant">Aviso 30 min antes</p>
              </div>
            </div>
            <Switch
              checked={prefs.trainingReminders}
              label="Recordatorios de entrenamiento"
              onToggle={() => update('trainingReminders', !prefs.trainingReminders)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">restaurant</span>
              </div>
              <div>
                <p className="font-label-caps text-sm text-on-surface font-bold">Recordatorios de Comidas</p>
                <p className="font-label-sm text-xs text-on-surface-variant">Horarios de nutrición</p>
              </div>
            </div>
            <Switch
              checked={prefs.mealReminders}
              label="Recordatorios de comidas"
              onToggle={() => update('mealReminders', !prefs.mealReminders)}
            />
          </div>
        </div>
      </div>

      {/* Cerrar sesión */}
      <button
        onClick={handleLogout}
        disabled={signedOut}
        className="w-full bg-error-container text-on-error-container font-label-caps text-sm font-bold py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[20px]">logout</span>
        {signedOut ? 'CERRANDO SESIÓN…' : 'CERRAR SESIÓN'}
      </button>
    </div>
  )
}