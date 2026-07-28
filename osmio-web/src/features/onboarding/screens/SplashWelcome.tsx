import { useNavigate } from 'react-router-dom'
import { Button } from '../../../design-system/components/Button'

export default function SplashWelcome() {
  const navigate = useNavigate()

  return (
    <div className="fixed inset-0 w-full h-full bg-surface-dim flex flex-col overflow-hidden">
      {/* Tactical grid background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Scanline overlay */}
      <div className="scanline absolute inset-0 z-10 pointer-events-none" />

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 z-30 pointer-events-none">
        <div className="w-8 h-8 border-t-2 border-l-2 border-primary-fixed/50" />
      </div>
      <div className="absolute top-6 right-6 z-30 pointer-events-none">
        <div className="w-8 h-8 border-t-2 border-r-2 border-primary-fixed/50" />
      </div>
      <div className="absolute bottom-6 left-6 z-30 pointer-events-none">
        <div className="w-8 h-8 border-b-2 border-l-2 border-primary-fixed/50" />
      </div>
      <div className="absolute bottom-6 right-6 z-30 pointer-events-none">
        <div className="w-8 h-8 border-b-2 border-r-2 border-primary-fixed/50" />
      </div>

      {/* Top status bar */}
      <header className="relative z-20 w-full flex justify-between items-center px-8 py-4 border-b border-outline-variant/20 flex-shrink-0">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-xs text-primary-fixed tracking-widest uppercase font-bold">
            OSMIO COMBAT OS v2.4
          </span>
          <span className="font-mono text-[11px] text-on-surface-variant opacity-60">SYSTEM STATUS: ONLINE</span>
        </div>
        <div className="text-right hidden sm:flex flex-col gap-0.5">
          <span className="font-mono text-xs text-on-surface-variant uppercase">BIOMETRIC INTEL</span>
          <span className="font-mono text-[11px] text-primary-fixed opacity-80">READY FOR LINK</span>
        </div>
      </header>

      {/* Main Hero — takes all remaining vertical space, only logo + brand */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-6 gap-8 overflow-hidden">
        {/* Ambient glow behind logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-fixed/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Animated Brand Emblem */}
        <div className="relative group flex-shrink-0">
          <div className="absolute -inset-8 bg-primary-fixed/15 blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 rounded-full border-2 border-primary-fixed/40 bg-surface-container/50 backdrop-blur-xl flex items-center justify-center relative shadow-2xl">
            <span className="text-7xl sm:text-8xl lg:text-9xl font-extrabold text-primary-fixed tracking-tighter neon-glow flicker select-none">
              O
            </span>
          </div>
        </div>

        {/* Brand title + tagline only */}
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-none">
            OSMIO
          </h1>
          <p className="font-mono text-sm sm:text-base text-primary-fixed tracking-[0.3em] uppercase font-semibold whitespace-nowrap">
            Fighter Intelligence System
          </p>
        </div>
      </main>

      {/* CTA Footer — quote + buttons + metadata */}
      <footer className="relative z-20 w-full flex-shrink-0 flex flex-col items-center border-t border-outline-variant/20 px-8 pt-6 pb-8 gap-5">
        {/* Single unified column, wide enough to not word-wrap */}
        <div className="w-full max-w-xl flex flex-col gap-5">
          {/* Quote */}
          <p className="text-sm sm:text-base leading-relaxed border-l-2 border-primary-fixed pl-4 text-left italic text-on-surface-variant opacity-85">
            "El cuaderno de un peleador, con esteroides tecnológicos."
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              fullWidth
              size="lg"
              onClick={() => navigate('/setup')}
              className="rounded-none justify-center gap-2 font-mono uppercase tracking-wider text-sm py-4"
            >
              EMPEZAR CONFIGURACIÓN
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Button>

            <button
              onClick={() => navigate('/dashboard')}
              aria-label="Ir directamente al Dashboard"
              className="w-full bg-surface-container-high/60 text-primary-fixed font-mono text-xs uppercase tracking-[0.2em] py-3.5 flex items-center justify-center gap-2 border border-primary-fixed/30 hover:border-primary-fixed hover:bg-primary-fixed/10 transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              IR AL DASHBOARD
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-col items-center gap-1.5 opacity-40">
          <div className="w-16 h-px bg-outline-variant" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant whitespace-nowrap">
            Tactical Minimal UI • Build 2026
          </span>
        </div>
      </footer>

      <style>{`
        .neon-glow {
          filter: drop-shadow(0 0 24px var(--color-primary-fixed)) drop-shadow(0 0 60px var(--color-primary-fixed));
          opacity: 0.9;
        }
        .scanline {
          background: linear-gradient(to bottom, transparent 40%, rgba(200,230,0,0.04) 50%, transparent 60%);
          animation: scanline 8s linear infinite;
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .flicker {
          animation: flicker 4s linear infinite;
        }
        @keyframes flicker {
          0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% { opacity: 1; }
          20%, 21.999%, 63%, 63.999%, 65%, 69.999% { opacity: 0.85; }
        }
      `}</style>
    </div>
  )
}
