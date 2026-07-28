import { useState, useCallback } from 'react'

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const WEEKDAY_LABELS = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM']
const MONTH_DAYS = [
  [0, 0, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, 31, 0, 0],
]

const LOGGED_DAYS = [1, 2, 3, 6, 7, 8, 10, 13, 14, 15]

const HEATMAP_DATA = [
  [0.1, 0.3, 0.2, 1, 0.5, 0.1, 0.4, 0.2, 0.1, 0, 0, 0],
  [0.2, 0.6, 0.4, 0.8, 0.3, 0.2, 0.5, 0.3, 0.2, 0.1, 0, 0],
  [0.3, 0.7, 0.5, 0.9, 0.6, 0.3, 0.6, 0.4, 0.3, 0.2, 0.1, 0],
  [0.4, 0.8, 0.6, 1, 0.7, 0.4, 0.7, 0.5, 0.4, 0.3, 0.2, 0.1],
  [0.2, 0.5, 0.3, 0.7, 0.4, 0.2, 0.3, 0.2, 0.1, 0, 0, 0],
]

const STRIKING_BARS = [1, 1, 1, 0.4, 0, 0, 0]
const GRAPPLING_BARS = [1, 1, 0, 0, 0, 0, 0]

const GRAPH_PATH = 'M0,80 L50,75 L100,85 L150,60 L200,65 L250,55 L300,50 L350,45 L400,30'
const GRAPH_FILL = 'M0,80 L50,75 L100,85 L150,60 L200,65 L250,55 L300,50 L350,45 L400,30 L400,100 L0,100 Z'

export default function DashboardHoy() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const light = document.getElementById('dashLight')
    if (light) {
      const rect = e.currentTarget.getBoundingClientRect()
      light.style.left = `${e.clientX - rect.left}px`
      light.style.top = `${e.clientY - rect.top}px`
    }
  }, [])

  return (
    <div className="dash-root min-h-screen" onMouseMove={handleMouseMove}>
      <style>{`
        .dash-root {
          background: #050705;
          color: #e9eddc;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .dash-grain {
          position: fixed;
          inset: 0;
          z-index: 9999;
          pointer-events: none;
          opacity: 0.12;
          background-image: url("https://www.transparenttextures.com/patterns/asfalt-dark.png");
          mix-blend-mode: screen;
        }

        .dash-light {
          width: 280px;
          height: 280px;
          position: fixed;
          left: 50%;
          top: 50%;
          z-index: 0;
          pointer-events: none;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(199,217,136,0.18), transparent 70%);
          transform: translate(-50%,-50%);
          transition: 0.06s linear;
        }

        .dash-wrap {
          display: flex;
          gap: 0;
          max-width: 1140px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          min-height: 100vh;
        }

        .dash-main {
          flex: 1;
          min-width: 0;
          padding: 20px;
          position: relative;
          overflow: hidden;
          border-right: 1px solid rgba(199,217,136,0.2);
        }

        .dash-main::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(90deg, transparent 49%, rgba(233,237,220,0.06) 50%, transparent 51%),
            linear-gradient(0deg, transparent 49%, rgba(233,237,220,0.06) 50%, transparent 51%);
          background-size: 36px 36px;
        }

        .dash-scroll {
          position: relative;
          z-index: 1;
          height: 100%;
          overflow-y: auto;
          padding-right: 8px;
          scrollbar-width: thin;
          scrollbar-color: #5f6f38 rgba(5,7,5,0.32);
        }

        .dash-scroll::-webkit-scrollbar { width: 8px; }
        .dash-scroll::-webkit-scrollbar-track {
          border-radius: 999px;
          background: rgba(5,7,5,0.32);
        }
        .dash-scroll::-webkit-scrollbar-thumb {
          border: 2px solid rgba(5,7,5,0.72);
          border-radius: 999px;
          background: linear-gradient(180deg, #c7d988, #5f6f38, #050705, #9faf62);
        }

        .dash-side {
          width: 320px;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          border-top-right-radius: 16px;
          border-top-left-radius: 16px;
          background:
            radial-gradient(circle at 50% 12%, rgba(215,220,197,0.48), transparent 26%),
            radial-gradient(circle at 50% 56%, rgba(199,217,136,0.18), transparent 34%),
            linear-gradient(180deg, #aeb899, #050705 39%);
        }

        .dash-side::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(90deg, transparent 49%, rgba(233,237,220,0.06) 50%, transparent 51%),
            linear-gradient(0deg, transparent 49%, rgba(233,237,220,0.06) 50%, transparent 51%);
          background-size: 36px 36px;
        }

        .dash-card {
          background: rgba(16,21,14,0.7);
          border: 1px solid rgba(199,217,136,0.25);
          border-radius: 22px;
          padding: 20px;
          backdrop-filter: blur(8px);
          transition: 0.35s ease;
        }

        .dash-card:hover {
          border-color: rgba(199,217,136,0.5);
          background: rgba(199,217,136,0.06);
        }

        .dash-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #aab497;
        }

        .dash-green {
          color: #c7d988;
        }

        .dash-title {
          font-family: 'Inter', sans-serif;
          font-size: 20px;
          line-height: 1.2;
          color: #c7d988;
        }

        .dash-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 24px;
          color: #e9eddc;
        }

        .dash-muted {
          color: #aab497;
          font-size: 11px;
        }

        .dash-faint {
          color: rgba(233,237,220,0.58);
        }

        .dash-bar {
          height: 8px;
          border-radius: 0;
        }

        .dash-bg-panel {
          background: #10150e;
        }

        .dash-bg-panel2 {
          background: #182012;
        }

        .dash-border {
          border-color: rgba(199,217,136,0.35);
        }

        .dash-scan {
          position: absolute;
          left: 0;
          right: 0;
          top: -60px;
          height: 50px;
          z-index: 4;
          pointer-events: none;
          background: linear-gradient(180deg, transparent, rgba(199,217,136,0.28), transparent);
          animation: dashScanMove 4s infinite linear;
        }

        @keyframes dashScanMove {
          from { top: -60px; }
          to { top: 100%; }
        }

        .side-title {
          position: relative;
          z-index: 2;
          padding: 24px 20px;
          text-align: center;
        }

        .side-title small {
          display: block;
          font: 9px 'JetBrains Mono', monospace;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          color: rgba(17,20,15,0.62);
        }

        .side-title strong {
          display: block;
          margin: 6px 0 4px;
          font-family: 'Inter', sans-serif;
          font-size: 28px;
          line-height: 0.95;
          color: #11140f;
          letter-spacing: -1px;
          text-transform: uppercase;
        }

        .side-title span {
          display: block;
          font: 9px 'JetBrains Mono', monospace;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          color: rgba(17,20,15,0.62);
        }

        .side-capsule {
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 16px;
          height: 62%;
          overflow: hidden;
          border: 6px solid #050705;
          border-radius: 120px 120px 28px 28px;
          background: #050705;
          box-shadow:
            inset 0 0 0 1px rgba(199,217,136,0.18),
            inset 0 0 42px rgba(199,217,136,0.08);
        }

        .side-capsule > img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          filter: grayscale(0.2) contrast(1.42) saturate(0.55) brightness(0.62);
          animation: sidePulse 5.8s infinite ease-in-out;
        }

        @keyframes sidePulse {
          0%,100% { filter: grayscale(0.2) contrast(1.42) saturate(0.55) brightness(0.58); transform: scale(1); }
          42% { filter: grayscale(0.08) contrast(1.55) saturate(0.72) brightness(0.78); }
          70% { filter: grayscale(0.24) contrast(1.32) saturate(0.46) brightness(0.5); }
        }

        .side-capsule::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            radial-gradient(circle at 50% 50%, transparent 0 24%, rgba(5,7,5,0.08) 30%, rgba(5,7,5,0.76) 72%),
            linear-gradient(180deg, rgba(5,7,5,0.08), rgba(199,217,136,0.18) 48%, rgba(5,7,5,0.72)),
            repeating-linear-gradient(0deg, rgba(255,255,255,0.055) 0 1px, transparent 1px 7px),
            repeating-linear-gradient(90deg, rgba(199,217,136,0.04) 0 1px, transparent 1px 19px);
          mix-blend-mode: multiply;
        }

        .side-capsule::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background:
            radial-gradient(circle at 50% 52%, rgba(199,217,136,0.24), transparent 29%),
            linear-gradient(90deg, transparent 0 48%, rgba(215,255,160,0.16) 50%, transparent 52%),
            linear-gradient(180deg, transparent 0 35%, rgba(217,255,133,0.08) 48%, transparent 60%);
        }

        .side-capsule .side-scan {
          position: absolute;
          left: 0;
          right: 0;
          top: -80px;
          height: 80px;
          z-index: 3;
          pointer-events: none;
          background:
            linear-gradient(180deg, transparent, rgba(217,255,133,0.28), rgba(199,217,136,0.06), transparent);
          mix-blend-mode: screen;
          animation: sideScanMove 4.6s infinite linear;
        }

        @keyframes sideScanMove {
          from { top: -80px; }
          to { top: 105%; }
        }

        .side-capsule .side-flicker {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          background:
            linear-gradient(110deg, transparent 0 36%, rgba(233,237,220,0.12) 39%, transparent 43% 100%);
          mix-blend-mode: screen;
          opacity: 0;
          animation: sideFlicker 3.4s infinite steps(1,end);
        }

        @keyframes sideFlicker {
          0%,68%,74%,100% { opacity: 0; }
          69% { opacity: 0.45; }
          71% { opacity: 0.14; }
          73% { opacity: 0.35; }
        }

        .side-target {
          position: absolute;
          left: 50%;
          top: 48%;
          z-index: 4;
          width: 110px;
          height: 110px;
          overflow: visible;
          border-radius: 50%;
          background: #050705;
          transform: translate(-50%, -50%);
        }

        .side-target::before {
          content: "";
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          opacity: 0.82;
          filter: blur(0.5px);
          background:
            conic-gradient(from 20deg,
              transparent 0 12%,
              #c7d988 13% 22%,
              transparent 23% 38%,
              #5f6f38 39% 47%,
              transparent 48% 70%,
              #d9ff85 71% 77%,
              transparent 78% 100%);
          animation: spin 7s linear infinite;
        }

        .side-target::after {
          content: "";
          position: absolute;
          inset: -16px;
          border: 1px solid rgba(199,217,136,0.46);
          border-radius: 50%;
          pointer-events: none;
          box-shadow:
            0 0 18px rgba(199,217,136,0.42),
            0 0 42px rgba(157,190,91,0.28),
            inset 0 0 18px rgba(199,217,136,0.22);
        }

        .side-target img {
          position: relative;
          z-index: 3;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border: 2px solid rgba(233,237,220,0.48);
          border-radius: 50%;
          opacity: 0.96;
          filter: grayscale(0.18) contrast(1.32) saturate(0.88);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .dash-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          border: 1px solid rgba(199,217,136,0.35);
          background: transparent;
          color: #e9eddc;
          padding: 10px 16px;
          cursor: pointer;
          transition: 0.35s ease;
        }

        .dash-btn:hover {
          background: rgba(199,217,136,0.1);
          color: #c7d988;
          border-color: #c7d988;
        }

        .dash-btn:active {
          transform: scale(0.97);
        }

        .dash-fab {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 50;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #c7d988;
          color: #050705;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          box-shadow: 0 0 30px rgba(199,217,136,0.3);
          transition: 0.25s ease;
        }

        .dash-fab:hover {
          transform: scale(1.05);
          box-shadow: 0 0 40px rgba(199,217,136,0.5);
        }

        .dash-fab:active {
          transform: scale(0.95);
        }

        .dash-alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-left: 4px solid #d9ff85;
          background: rgba(199,217,136,0.06);
        }

        .dash-meter {
          margin-bottom: 8px;
        }

        .dash-meter label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          font: 10px 'JetBrains Mono', monospace;
          color: #aab497;
        }

        .dash-track {
          height: 6px;
          background: rgba(5,7,5,0.4);
          position: relative;
        }

        .dash-track-fill {
          height: 100%;
          background: #c7d988;
          transition: width 0.5s ease;
        }

        .dash-heat-cell {
          opacity: var(--cell-opacity);
          background: #c7d988;
        }

        .dash-heat-cell.empty {
          border: 1px solid rgba(199,217,136,0.2);
          background: transparent;
        }

        .dash-grid-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(90deg, transparent 49%, rgba(233,237,220,0.06) 50%, transparent 51%),
            linear-gradient(0deg, transparent 49%, rgba(233,237,220,0.06) 50%, transparent 51%);
          background-size: 36px 36px;
        }
      `}</style>

      <div className="dash-grain" />
      <div className="dash-light" id="dashLight" />

      <div className="dash-wrap">
        <main className="dash-main">
          <div className="dash-scroll">
            <div className="space-y-6 pb-10">

              {/* Hero */}
              <section>
                <div className="dash-card relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 opacity-8 rotate-12">
                    <span className="material-symbols-outlined text-[160px]" style={{color: '#c7d988'}}>
                      sports_kabaddi
                    </span>
                  </div>
                  <span className="dash-scan" />

                  <header className="mb-5 flex justify-between items-start relative z-10">
                    <div>
                      <span className="dash-label" style={{color: '#c7d988'}}>
                        Hoy • 10 Jul
                      </span>
                      <h2 className="dash-title mt-1 uppercase" style={{fontSize: '20px'}}>
                        QUÉ TOCA HOY
                      </h2>
                    </div>
                    <div style={{
                      background: 'rgba(199,217,136,0.1)',
                      border: '1px solid rgba(199,217,136,0.25)',
                      padding: '4px 10px'
                    }}>
                      <span className="dash-label" style={{color: '#c7d988', fontSize: '10px'}}>INTENSIDAD: ALTA</span>
                    </div>
                  </header>

                  <div className="grid md:grid-cols-2 gap-5 items-end relative z-10">
                    <div className="space-y-4">
                      <div className="flex gap-4 items-center group cursor-pointer">
                        <div style={{
                          width: 44, height: 44,
                          background: '#182012',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: '1px solid rgba(199,217,136,0.2)'
                        }}>
                          <span className="material-symbols-outlined" style={{color: '#c7d988'}}>fitness_center</span>
                        </div>
                        <div>
                          <h3 style={{fontSize: '16px', fontWeight: 600, color: '#e9eddc', fontFamily: "'Inter',sans-serif"}}>
                            Striking Technical
                          </h3>
                          <p className="dash-muted" style={{marginTop: 2}}>
                            09:30 - 11:00 • Black House Gym
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center group cursor-pointer">
                        <div style={{
                          width: 44, height: 44,
                          background: '#182012',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: '1px solid rgba(199,217,136,0.2)'
                        }}>
                          <span className="material-symbols-outlined" style={{color: '#c7d988'}}>pending</span>
                        </div>
                        <div>
                          <h3 style={{fontSize: '16px', fontWeight: 600, color: '#e9eddc', fontFamily: "'Inter',sans-serif"}}>
                            Strength & Power
                          </h3>
                          <p className="dash-muted" style={{marginTop: 2}}>
                            17:00 - 18:30 • High Performance Zone
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between">
                        <span className="dash-muted">Fatiga Acumulada</span>
                        <span style={{color: '#c7d988', fontSize: 11, fontFamily: "'JetBrains Mono',monospace"}}>68%</span>
                      </div>
                      <div className="dash-track">
                        <div className="dash-track-fill" style={{width: '68%'}} />
                      </div>
                      <button className="dash-btn" style={{marginTop: 12, width: '100%'}}>
                        VER DETALLE SESIÓN
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Alert */}
              <section className="dash-alert">
                <span className="material-symbols-outlined" style={{color: '#d9ff85'}}>warning</span>
                <p className="dash-muted" style={{fontSize: '12px', lineHeight: 1.42, margin: 0}}>
                  INSIGHT: Llevas 2 días sin grappling. Tu volumen proyectado de suelo está un 12% por
                  debajo del objetivo semanal.
                </p>
              </section>

              {/* Weekly Summary + Nutrition */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-7 dash-card">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="dash-label">RESUMEN SEMANAL</h3>
                    <span className="material-symbols-outlined" style={{color: '#aab497', fontSize: 18}}>more_horiz</span>
                  </div>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="dash-label" style={{fontSize: '10px'}}>STRIKING</span>
                        <span className="dash-muted">4.5 / 6.0 hrs</span>
                      </div>
                      <div className="flex gap-1" style={{height: 20}}>
                        {STRIKING_BARS.map((v, i) => (
                          <div key={i} className="flex-1" style={{
                            background: v === 1 ? '#c7d988' : v > 0 ? 'rgba(199,217,136,0.4)' : '#182012'
                          }} />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="dash-label" style={{fontSize: '10px'}}>GRAPPLING</span>
                        <span className="dash-muted">2.0 / 5.0 hrs</span>
                      </div>
                      <div className="flex gap-1" style={{height: 20}}>
                        {GRAPPLING_BARS.map((v, i) => (
                          <div key={i} className="flex-1" style={{
                            background: v === 1 ? '#9faf62' : '#182012'
                          }} />
                        ))}
                      </div>
                    </div>
                    <div style={{paddingTop: 8}}>
                      <span className="dash-label" style={{fontSize: '10px', display: 'block', marginBottom: 8}}>
                        ACTIVIDAD ANUAL
                      </span>
                      <div className="grid grid-cols-12 gap-1" style={{height: 40}}>
                        {HEATMAP_DATA.flat().map((opacity, i) => (
                          <div key={i}
                            className={opacity === 0 ? 'dash-heat-cell empty' : 'dash-heat-cell'}
                            style={{ '--cell-opacity': opacity } as React.CSSProperties}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 flex flex-col gap-5">
                  <div className="dash-card flex-1">
                    <h3 className="dash-label" style={{marginBottom: 16}}>NUTRICIÓN</h3>
                    <div style={{textAlign: 'center', marginBottom: 16}}>
                      <span className="dash-value">1,840</span>
                      <span className="dash-muted" style={{display: 'block', textTransform: 'uppercase'}}>
                        Kcal Restantes
                      </span>
                    </div>
                    <div className="space-y-3">
                      <MacroRow label="Proteína" current="120g" target="210g" pct={57} />
                      <MacroRow label="Carbos" current="180g" target="400g" pct={45} />
                      <MacroRow label="Grasas" current="55g" target="85g" pct={64} />
                    </div>
                  </div>

                  <div className="dash-card">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined" style={{color: '#c7d988'}}>water_drop</span>
                      <div>
                        <span className="dash-label" style={{display: 'block'}}>HIDRATACIÓN</span>
                        <span style={{fontSize: '14px', color: '#e9eddc', fontFamily: "'JetBrains Mono',monospace"}}>2.5L / 4.0L</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recovery Trend */}
              <section className="dash-card">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="dash-label">TENDENCIA RECUPERACIÓN (VFC)</h3>
                  <span style={{
                    padding: '3px 10px',
                    border: '1px solid rgba(199,217,136,0.25)',
                    fontSize: '10px',
                    color: '#c7d988',
                    textTransform: 'uppercase',
                    fontFamily: "'JetBrains Mono',monospace",
                    letterSpacing: '0.5px'
                  }}>
                    OPTIMAL ZONE
                  </span>
                </div>
                <div style={{position: 'relative', height: 180, width: '100%', borderBottom: '1px solid #182012', borderLeft: '1px solid #182012', display: 'flex', alignItems: 'flex-end'}}>
                  <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 400 100">
                    <defs>
                      <linearGradient id="graphG" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#c7d988" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                    <path d={GRAPH_PATH} fill="none" stroke="#c7d988" strokeWidth="1.5" />
                    <path d={GRAPH_FILL} fill="url(#graphG)" opacity="0.2" />
                    <rect fill="#c7d988" height="4" width="4" x="-2" y="78" />
                    <rect fill="#c7d988" height="4" width="4" x="148" y="58" />
                    <rect fill="#d9ff85" height="4" width="4" x="398" y="28" />
                  </svg>
                  <div className="flex w-full justify-between px-2 pb-2" style={{fontSize: '10px', color: '#aab497', fontFamily: "'JetBrains Mono',monospace", position: 'relative', zIndex: 1}}>
                    {WEEKDAY_LABELS.map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Calendar */}
              <section className="dash-card">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="dash-label">JULIO 2026</h3>
                  <span className="dash-muted">{LOGGED_DAYS.length} días registrados</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {WEEKDAYS.map((d) => (
                    <div key={d} className="text-center dash-label" style={{fontSize: '9px', paddingBottom: 8}}>
                      {d}
                    </div>
                  ))}
                  {MONTH_DAYS.flat().map((day, i) => {
                    const isLogged = day > 0 && LOGGED_DAYS.includes(day)
                    const isSelected = selectedDay === day
                    return (
                      <div
                        key={i}
                        onClick={() => day > 0 && setSelectedDay(isSelected ? null : day)}
                        style={{
                          aspectRatio: '1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '13px',
                          fontFamily: "'JetBrains Mono',monospace",
                          cursor: day > 0 ? 'pointer' : 'default',
                          background: isSelected ? 'rgba(199,217,136,0.15)' : isLogged ? 'rgba(199,217,136,0.1)' : 'transparent',
                          color: isLogged ? '#c7d988' : day === 0 ? 'transparent' : '#aab497',
                          border: isLogged ? '1px solid rgba(199,217,136,0.25)' : isSelected ? '1px solid rgba(199,217,136,0.5)' : '1px solid transparent',
                          transition: '0.2s'
                        }}
                        onMouseEnter={(e) => { if (day > 0 && !isLogged) e.currentTarget.style.background = 'rgba(199,217,136,0.06)' }}
                        onMouseLeave={(e) => { if (day > 0 && !isLogged && !isSelected) e.currentTarget.style.background = 'transparent' }}
                      >
                        {day > 0 ? day : ''}
                      </div>
                    )
                  })}
                </div>
              </section>

              {/* Streak */}
              <section className="dash-card">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined" style={{color: '#c7d988', fontSize: 36}}>
                    local_fire_department
                  </span>
                  <div className="flex-1">
                    <h3 className="dash-label">RACHA DE ENTRENAMIENTO</h3>
                    <div className="flex gap-6" style={{marginTop: 8}}>
                      <div>
                        <span className="dash-value">12</span>
                        <span className="dash-muted" style={{display: 'block'}}>días actual</span>
                      </div>
                      <div>
                        <span className="dash-value" style={{color: '#c7d988'}}>21</span>
                        <span className="dash-muted" style={{display: 'block'}}>mejor racha</span>
                      </div>
                      <div>
                        <span className="dash-value">87%</span>
                        <span className="dash-muted" style={{display: 'block'}}>consistencia</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </main>

        <aside className="dash-side">
          <div className="side-title">
            <small>DISTRICT.012 // DANGEROUS</small>
            <strong>Veyra Noct</strong>
            <span>lorem ipsum dolor</span>
          </div>

          <div className="side-capsule">
            <img
              src="https://i.pinimg.com/736x/86/51/8d/86518da3148ee4882cd9c15804f52458.jpg"
              alt="Veyra Noct"
            />
            <span className="side-scan" />
            <span className="side-flicker" />
            <div className="side-target">
              <img
                src="https://media.tenor.com/RkTw7AIbIWkAAAAM/effy-stonem.gif"
                alt="Profile"
              />
            </div>
          </div>
        </aside>
      </div>

      <button className="dash-fab" aria-label="Agregar nueva sesión">
        <span className="material-symbols-outlined" style={{fontSize: 26}}>add</span>
      </button>
    </div>
  )
}

function MacroRow({ label, current, target, pct }: { label: string; current: string; target: string; pct: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between" style={{fontSize: '11px'}}>
        <span className="dash-muted" style={{textTransform: 'uppercase'}}>{label}</span>
        <span style={{color: '#e9eddc', fontFamily: "'JetBrains Mono',monospace"}}>
          {current} / {target}
        </span>
      </div>
      <div className="dash-track">
        <div className="dash-track-fill" style={{width: `${pct}%`}} />
      </div>
    </div>
  )
}
