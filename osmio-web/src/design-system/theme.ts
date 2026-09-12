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

export function applyTheme(settings: ThemeSettings) {
  const root = document.documentElement
  root.dataset.theme = settings.mode
  root.dataset.accent = settings.accent
}

export function initTheme() {
  const settings = readThemeSettings()
  applyTheme(settings)
  return settings
}