export type ThemeMode = 'dark' | 'light'
export type ThemeAccent = 'lime' | 'cyan' | 'violet' | 'amber'

export interface ThemeSettings {
  mode: ThemeMode
  accent: ThemeAccent
}

export const THEME_MODES: ThemeMode[] = ['dark', 'light']
export const THEME_ACCENTS: ThemeAccent[] = ['lime', 'cyan', 'violet', 'amber']

const STORAGE_KEY = 'osmio.theme'
const DEFAULT_THEME: ThemeSettings = { mode: 'dark', accent: 'lime' }

export function isThemeAccent(value: unknown): value is ThemeAccent {
  return typeof value === 'string' && (THEME_ACCENTS as string[]).includes(value)
}

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'dark' || value === 'light'
}

export function readThemeSettings(): ThemeSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ThemeSettings>
      return {
        mode: isThemeMode(parsed.mode) ? parsed.mode : DEFAULT_THEME.mode,
        accent: isThemeAccent(parsed.accent) ? parsed.accent : DEFAULT_THEME.accent,
      }
    }
  } catch {
    // fallthrough to default
  }
  return DEFAULT_THEME
}

export function writeThemeSettings(settings: ThemeSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // storage may be unavailable
  }
}

const SURFACE_BY_MODE: Record<ThemeMode, string> = {
  dark: '#0f0e0e',
  light: '#f7f7f0',
}

export function applyTheme(settings: ThemeSettings) {
  const root = document.documentElement
  root.dataset.theme = settings.mode
  root.dataset.accent = settings.accent
  // Convención Tailwind: las librerías de terceros (boneyard, shadcn, etc.)
  // detectan el modo oscuro por la clase `.dark` en <html>.
  root.classList.toggle('dark', settings.mode === 'dark')
  // El chrome del navegador (status bar) sigue al tema de la app, que se cambia
  // por clase y no por la preferencia del sistema.
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', SURFACE_BY_MODE[settings.mode])
  // Listeners externos (Toaster de Sonner) reaccionan al cambio de tema.
  window.dispatchEvent(new CustomEvent('osmio:themechange', { detail: settings }))
}

export function initTheme() {
  const settings = readThemeSettings()
  applyTheme(settings)
  return settings
}