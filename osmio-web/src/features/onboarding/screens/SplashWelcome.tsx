import { useNavigate } from 'react-router-dom'
import { Button } from '../../../design-system/components/Button'

export default function SplashWelcome() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen bg-surface-dim flex items-center justify-center overflow-hidden">
      {/* Tactical grid background */}
      <div
        className="fixed inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(var(--color-outline-variant) / 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(var(--color-outline-variant) / 0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Scanline overlay */}
      <div className="scanline absolute inset-0 z-10 pointer-events-none" />

      {/* Corner decorations (desktop) */}
      <div className="fixed top-8 left-8 hidden lg:block z-30">
        <div className="w-8 h-8 border-t border-l border-primary-fixed/40" />
      </div>
      <div className="fixed top-8 right-8 hidden lg:block z-30">
        <div className="w-8 h-8 border-t border-r border-primary-fixed/40" />
      </div>
      <div className="fixed bottom-8 left-8 hidden lg:block z-30">
        <div className="w-8 h-8 border-b border-l border-primary-fixed/40" />
      </div>
      <div className="fixed bottom-8 right-8 hidden lg:block z-30">
        <div className="w-8 h-8 border-b border-r border-primary-fixed/40" />
      </div>

      <main className="relative z-20 w-full max-w-[1440px] px-5 h-full flex flex-col items-center justify-between py-10 lg:py-40">
        {/* Identity Header (Desktop) */}
        <div className="hidden lg:flex w-full justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-primary-fixed tracking-widest uppercase">
              Combat OS v2.4
            </span>
            <span className="font-mono text-sm text-white opacity-40">SYSTEM: ONLINE</span>
          </div>
          <div className="text-right flex flex-col gap-1">
            <span className="font-mono text-xs text-on-surface-variant uppercase">
              Biometric Link
            </span>
            <span className="font-mono text-sm text-white opacity-40">WAITING...</span>
          </div>
        </div>

        {/* Central Branding */}
        <div className="flex flex-col items-center text-center max-w-2xl">
          {/* Logo */}
          <div className="relative mb-8 group">
            <div className="absolute -inset-4 bg-primary-fixed/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="w-48 h-48 lg:w-64 lg:h-64 flex items-center justify-center relative">
              <span className="text-8xl lg:text-9xl font-extrabold text-primary-fixed tracking-tighter neon-glow flicker select-none">
                O
              </span>
            </div>
          </div>

          {/* Tagline */}
          <div className="space-y-4">
            <h1 className="text-[24px] leading-[1.2] font-bold lg:text-[32px] lg:leading-[1.2] lg:tracking-[-0.02em] text-white tracking-tight">
              OSMIO
            </h1>
            <p className="text-base leading-relaxed max-w-md mx-auto border-l-2 border-primary-fixed pl-4 text-left italic opacity-80 text-on-surface-variant">
              "El cuaderno de un peleador, con esteroides tecnológicos"
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full max-w-xs flex flex-col gap-4">
          <Button
            fullWidth
            size="lg"
            onClick={() => navigate('/setup')}
            className="rounded-none justify-center gap-2"
          >
            EMPEZAR
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Button>
          <button
            onClick={() => navigate('/setup')}
            aria-label="Ya tengo cuenta, iniciar sesión"
            className="w-full bg-transparent text-primary-fixed font-mono text-xs uppercase tracking-[0.2em] py-4 flex items-center justify-center gap-2 border border-primary-fixed/30 hover:border-primary-fixed hover:bg-primary-fixed/5 transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            YA TENGO CUENTA
          </button>

          {/* Metadata Footer */}
          <div className="mt-8 flex flex-col items-center gap-2 opacity-30">
            <div className="w-12 h-px bg-on-surface-variant" />
            <span className="font-mono text-[11px] leading-none uppercase tracking-widest text-on-surface-variant">
              Tactical Minimalism UI
            </span>
          </div>
        </div>
      </main>

      <style>{`
        .neon-glow {
          filter: drop-shadow(0 0 10px var(--color-primary-fixed));
          opacity: 0.4;
        }
        .scanline {
          background: linear-gradient(to bottom, transparent, var(--color-primary-fixed), transparent);
          opacity: 0.03;
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
          20%, 21.999%, 63%, 63.999%, 65%, 69.999% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
