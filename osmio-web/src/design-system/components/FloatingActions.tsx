import { useNavigate } from 'react-router-dom'

/**
 * Acciones flotantes de móvil (< lg): configuración y perfil en una cápsula
 * glass, espejo visual de la tab bar inferior. La barra superior completa
 * solo existe en desktop.
 */
export function FloatingActions() {
  const navigate = useNavigate()

  return (
    <div
      className="lg:hidden fixed z-30 right-4 top-[calc(0.75rem+env(safe-area-inset-top,0px))] flex items-center gap-1 rounded-full border border-outline-variant/30 bg-surface-container/60 backdrop-blur-2xl backdrop-saturate-150 p-1.5 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.45)]"
    >
      {/* Luz del vidrio: borde luminoso superior */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <button
        onClick={() => navigate('/settings')}
        aria-label="Configuración"
        title="Configuración"
        className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high/70 transition-colors duration-200 active:scale-[0.94] cursor-pointer"
      >
        <span className="material-symbols-outlined text-[20px]">settings</span>
      </button>
      <button
        onClick={() => navigate('/profile')}
        aria-label="Perfil de Usuario"
        title="Perfil"
        className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high/70 transition-colors duration-200 active:scale-[0.94] cursor-pointer"
      >
        <span className="material-symbols-outlined text-[20px]">person</span>
      </button>
    </div>
  )
}
