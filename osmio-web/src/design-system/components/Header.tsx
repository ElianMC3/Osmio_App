import { useNavigate } from 'react-router-dom'

export function Header() {
  const navigate = useNavigate()
  const todayStr = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).toUpperCase()

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/20 lg:pl-64 transition-all duration-200">
      <div className="h-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Brand / Title & Status */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/dashboard')}>
          <div className="w-9 h-9 bg-primary-fixed/10 border border-primary-fixed/30 flex items-center justify-center rounded-lg group-hover:border-primary-fixed transition-colors">
            <span className="font-mono text-base font-extrabold text-primary-fixed tracking-tighter">O</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-bold text-on-surface tracking-tighter uppercase leading-none group-hover:text-primary-fixed transition-colors">
              OSMIO
            </span>
            <span className="font-mono text-[10px] text-on-surface-variant opacity-70 tracking-widest mt-0.5">
              COMBAT INTEL • {todayStr}
            </span>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => navigate('/history')}
            aria-label="Calendario de Historial"
            title="Calendario"
            className="p-2 text-on-surface-variant hover:text-primary-fixed hover:bg-surface-container-high rounded-lg transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            <span className="font-label-caps text-[10px] hidden sm:inline text-on-surface-variant">Historial</span>
          </button>

          <button
            onClick={() => navigate('/profile')}
            aria-label="Configuración de Perfil"
            title="Configuración"
            className="p-2 text-on-surface-variant hover:text-primary-fixed hover:bg-surface-container-high rounded-lg transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>

          <div
            onClick={() => navigate('/profile')}
            aria-label="Perfil de Usuario"
            title="Perfil"
            className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant/40 bg-surface-container-high hover:border-primary-fixed flex items-center justify-center cursor-pointer transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
              person
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
