import { useState, useCallback, useEffect } from 'react'
import { sessionsApi } from '@/services/api/sessions.api'
import { nutritionApi } from '@/services/api/nutrition.api'
import { analyticsApi } from '@/services/api/analytics.api'
import type { StrengthSession, CombatSession } from '@/shared/types/session.types'

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const WEEKDAY_LABELS = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM']

const GRAPH_PATH = 'M0,80 L50,75 L100,85 L150,60 L200,65 L250,55 L300,50 L350,45 L400,30'
const GRAPH_FILL = 'M0,80 L50,75 L100,85 L150,60 L200,65 L250,55 L300,50 L350,45 L400,30 L400,100 L0,100 Z'

const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth()
const currentDay = now.getDate()

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

function generateMonthGrid(year: number, month: number) {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const grid: number[][] = []
  let row: number[] = []
  for (let i = 0; i < firstDay; i++) row.push(0)
  for (let d = 1; d <= daysInMonth; d++) {
    row.push(d)
    if (row.length === 7) {
      grid.push(row)
      row = []
    }
  }
  if (row.length > 0) {
    while (row.length < 7) row.push(0)
    grid.push(row)
  }
  return grid
}

export default function DashboardHoy() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const [sessions, setSessions] = useState<(StrengthSession | CombatSession)[]>([])
  const [combatAnalytics, setCombatAnalytics] = useState<{ roundsByWeek: { week: string; striking: number; grappling: number }[]; totalRounds: { striking: number; grappling: number } }>({ roundsByWeek: [], totalRounds: { striking: 0, grappling: 0 } })
  const [consistencyData, setConsistencyData] = useState<{ date: string; active: boolean }[]>([])
  const [nutrition, setNutrition] = useState<{ meals: any[]; totals: { calories: number; protein: number; carbs: number; fat: number }; goal: { calories: number; protein: number; carbs: number; fat: number } }>({ meals: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }, goal: { calories: 2400, protein: 180, carbs: 280, fat: 75 } })

  useEffect(() => {
    async function fetchData() {
      try {
        const today = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`
        const [allSessions, combat, consistency, dayNutrition] = await Promise.all([
          sessionsApi.getSessionsByDate(today),
          analyticsApi.getCombatAnalytics(),
          analyticsApi.getConsistency(),
          nutritionApi.getDayNutrition(today),
        ])
        setSessions(allSessions)
        setCombatAnalytics(combat)
        setConsistencyData(consistency)
        setNutrition(dayNutrition)
      } catch (e) {
        console.error('Dashboard load error:', e)
      }
    }
    fetchData()
  }, [])

  const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`

  const loggedDays = consistencyData
    .filter((c) => c.date.startsWith(monthKey) && c.active)
    .map((c) => new Date(c.date).getDate())

  const weekRounds = combatAnalytics.roundsByWeek.slice(-7)
  const strikingBars = weekRounds.map((w) => Math.min(w.striking / 6, 1))
  const grapplingBars = weekRounds.map((w) => Math.min(w.grappling / 6, 1))
  while (strikingBars.length < 7) strikingBars.push(0)
  while (grapplingBars.length < 7) grapplingBars.push(0)

  const activeTracked = consistencyData.filter((c) => c.active).length
  const totalTracked = consistencyData.length || 1
  const consistencyPct = Math.round((activeTracked / Math.min(totalTracked, 90)) * 100)

  let streak = 0
  let bestStreak = 0
  let currentStreak = 0
  for (const c of consistencyData) {
    if (c.active) {
      currentStreak++
      bestStreak = Math.max(bestStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }
  streak = currentStreak
  if (streak === 0 && consistencyData.length > 0 && consistencyData[0].active) {
    streak = currentStreak
  }

  const todaySessions = sessions

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const light = document.getElementById('dashLight')
    if (light) {
      const rect = e.currentTarget.getBoundingClientRect()
      light.style.left = `${e.clientX - rect.left}px`
      light.style.top = `${e.clientY - rect.top}px`
    }
  }, [])

  const monthGrid = generateMonthGrid(currentYear, currentMonth)

  // Heatmap from consistency (last 12 weeks)
  const heatmapRows = 5
  const heatmapCols = 12
  // approximate with real data: use last N entries grouped
  const heatMapValues = consistencyData.slice(-heatmapRows * heatmapCols).map((c) => c.active ? 0.6 + Math.random() * 0.4 : 0)
  const paddedHeat = Array.from({ length: heatmapRows * heatmapCols }, (_, i) => heatMapValues[i] || 0)

  return (
    <div className="dash-root min-h-screen" onMouseMove={handleMouseMove}>
      <style>{`
        .dash-root {
          background: var(--panel2);
          color: var(--text-green);
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
          background: radial-gradient(circle, color-mix(in srgb, var(--green) 18%, transparent), transparent 70%);
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
          border-right: 1px solid color-mix(in srgb, var(--green) 20%, transparent);
        }

        .dash-main::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(90deg, transparent 49%, color-mix(in srgb, var(--text-green) 6%, transparent) 50%, transparent 51%),
            linear-gradient(0deg, transparent 49%, color-mix(in srgb, var(--text-green) 6%, transparent) 50%, transparent 51%);
          background-size: 36px 36px;
        }

        .dash-scroll {
          position: relative;
          z-index: 1;
          height: 100%;
          overflow-y: auto;
          padding-right: 8px;
          scrollbar-width: thin;
          scrollbar-color: var(--green-dark) color-mix(in srgb, var(--panel2) 32%, transparent);
        }

        .dash-scroll::-webkit-scrollbar { width: 8px; }
        .dash-scroll::-webkit-scrollbar-track {
          border-radius: 999px;
          background: color-mix(in srgb, var(--panel2) 32%, transparent);
        }
        .dash-scroll::-webkit-scrollbar-thumb {
          border: 2px solid color-mix(in srgb, var(--panel2) 72%, transparent);
          border-radius: 999px;
          background: linear-gradient(180deg, var(--green), var(--green-dark), var(--panel2), var(--green-dim));
        }

        .dash-side {
          width: 320px;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          border-top-right-radius: 16px;
          border-top-left-radius: 16px;
          background:
            radial-gradient(circle at 50% 12%, color-mix(in srgb, var(--paper) 48%, transparent), transparent 26%),
            radial-gradient(circle at 50% 56%, color-mix(in srgb, var(--green) 18%, transparent), transparent 34%),
            linear-gradient(180deg, var(--green-dim), var(--panel2) 39%);
        }

        .dash-side::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(90deg, transparent 49%, color-mix(in srgb, var(--text-green) 6%, transparent) 50%, transparent 51%),
            linear-gradient(0deg, transparent 49%, color-mix(in srgb, var(--text-green) 6%, transparent) 50%, transparent 51%);
          background-size: 36px 36px;
        }

        .dash-card {
          background: color-mix(in srgb, var(--panel) 70%, transparent);
          border: 1px solid color-mix(in srgb, var(--green) 25%, transparent);
          border-radius: 22px;
          padding: 20px;
          backdrop-filter: blur(8px);
          transition: 0.35s ease;
        }

        .dash-card:hover {
          border-color: color-mix(in srgb, var(--green) 50%, transparent);
          background: color-mix(in srgb, var(--green) 6%, transparent);
        }

        .dash-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .dash-green {
          color: var(--green);
        }

        .dash-title {
          font-family: 'Inter', sans-serif;
          font-size: 20px;
          line-height: 1.2;
          color: var(--green);
        }

        .dash-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 24px;
          color: var(--text-green);
        }

        .dash-muted {
          color: var(--text-muted);
          font-size: 11px;
        }

        .dash-faint {
          color: color-mix(in srgb, var(--text-green) 57%, transparent);
        }

        .dash-bar {
          height: 8px;
          border-radius: 0;
        }

        .dash-bg-panel {
          background: var(--panel);
        }

        .dash-bg-panel2 {
          background: var(--panel2);
        }

        .dash-border {
          border-color: color-mix(in srgb, var(--green) 35%, transparent);
        }

        .dash-scan {
          position: absolute;
          left: 0;
          right: 0;
          top: -60px;
          height: 50px;
          z-index: 4;
          pointer-events: none;
          background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--green) 28%, transparent), transparent);
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
          color: color-mix(in srgb, var(--panel2) 62%, transparent);
        }

        .side-title strong {
          display: block;
          margin: 6px 0 4px;
          font-family: 'Inter', sans-serif;
          font-size: 28px;
          line-height: 0.95;
          color: var(--panel2);
          letter-spacing: -1px;
          text-transform: uppercase;
        }

        .side-title span {
          display: block;
          font: 9px 'JetBrains Mono', monospace;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          color: color-mix(in srgb, var(--panel2) 62%, transparent);
        }

        .side-capsule {
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 16px;
          height: 62%;
          overflow: hidden;
          border: 6px solid var(--panel2);
          border-radius: 120px 120px 28px 28px;
          background: var(--panel2);
          box-shadow:
            inset 0 0 0 1px color-mix(in srgb, var(--green) 18%, transparent),
            inset 0 0 42px color-mix(in srgb, var(--green) 8%, transparent);
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
            radial-gradient(circle at 50% 50%, transparent 0 24%, color-mix(in srgb, var(--panel2) 8%, transparent) 30%, color-mix(in srgb, var(--panel2) 76%, transparent) 72%),
            linear-gradient(180deg, color-mix(in srgb, var(--panel2) 8%, transparent), color-mix(in srgb, var(--green) 18%, transparent) 48%, color-mix(in srgb, var(--panel2) 72%, transparent)),
            repeating-linear-gradient(0deg, rgba(255,255,255,0.055) 0 1px, transparent 1px 7px),
            repeating-linear-gradient(90deg, color-mix(in srgb, var(--green) 4%, transparent) 0 1px, transparent 1px 19px);
          mix-blend-mode: multiply;
        }

        .side-capsule::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background:
            radial-gradient(circle at 50% 52%, color-mix(in srgb, var(--green) 24%, transparent), transparent 29%),
            linear-gradient(90deg, transparent 0 48%, color-mix(in srgb, var(--acid) 16%, transparent) 50%, transparent 52%),
            linear-gradient(180deg, transparent 0 35%, color-mix(in srgb, var(--acid) 8%, transparent) 48%, transparent 60%);
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
            linear-gradient(180deg, transparent, color-mix(in srgb, var(--acid) 28%, transparent), color-mix(in srgb, var(--green) 6%, transparent), transparent);
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
            linear-gradient(110deg, transparent 0 36%, color-mix(in srgb, var(--text-green) 12%, transparent) 39%, transparent 43% 100%);
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
          background: var(--panel2);
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
              var(--green) 13% 22%,
              transparent 23% 38%,
              var(--green-dark) 39% 47%,
              transparent 48% 70%,
              var(--acid) 71% 77%,
              transparent 78% 100%);
          animation: spin 7s linear infinite;
        }

        .side-target::after {
          content: "";
          position: absolute;
          inset: -16px;
          border: 1px solid color-mix(in srgb, var(--green) 46%, transparent);
          border-radius: 50%;
          pointer-events: none;
          box-shadow:
            0 0 18px color-mix(in srgb, var(--green) 42%, transparent),
            0 0 42px color-mix(in srgb, var(--green-dim) 28%, transparent),
            inset 0 0 18px color-mix(in srgb, var(--green) 22%, transparent);
        }

        .side-target img {
          position: relative;
          z-index: 3;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border: 2px solid color-mix(in srgb, var(--text-green) 48%, transparent);
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
          border: 1px solid color-mix(in srgb, var(--green) 35%, transparent);
          background: transparent;
          color: var(--text-green);
          padding: 10px 16px;
          cursor: pointer;
          transition: 0.35s ease;
        }

        .dash-btn:hover {
          background: color-mix(in srgb, var(--green) 10%, transparent);
          color: var(--green);
          border-color: var(--green);
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
          background: var(--green);
          color: var(--panel2);
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          box-shadow: 0 0 30px color-mix(in srgb, var(--green) 30%, transparent);
          transition: 0.25s ease;
        }

        .dash-fab:hover {
          transform: scale(1.05);
          box-shadow: 0 0 40px color-mix(in srgb, var(--green) 50%, transparent);
        }

        .dash-fab:active {
          transform: scale(0.95);
        }

        .dash-alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-left: 4px solid var(--acid);
          background: color-mix(in srgb, var(--green) 6%, transparent);
        }

        .dash-meter {
          margin-bottom: 8px;
        }

        .dash-meter label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          font: 10px 'JetBrains Mono', monospace;
          color: var(--text-muted);
        }

        .dash-track {
          height: 6px;
          background: color-mix(in srgb, var(--panel2) 40%, transparent);
          position: relative;
        }

        .dash-track-fill {
          height: 100%;
          background: var(--green);
          transition: width 0.5s ease;
        }

        .dash-heat-cell {
          opacity: var(--cell-opacity);
          background: var(--green);
        }

        .dash-heat-cell.empty {
          border: 1px solid color-mix(in srgb, var(--green) 20%, transparent);
          background: transparent;
        }

        .dash-grid-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(90deg, transparent 49%, color-mix(in srgb, var(--text-green) 6%, transparent) 50%, transparent 51%),
            linear-gradient(0deg, transparent 49%, color-mix(in srgb, var(--text-green) 6%, transparent) 50%, transparent 51%);
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
                    <span className="material-symbols-outlined text-[160px]" style={{color: 'var(--green)'}}>
                      sports_kabaddi
                    </span>
                  </div>
                  <span className="dash-scan" />

                  <header className="mb-5 flex justify-between items-start relative z-10">
                    <div>
                      <span className="dash-label" style={{color: 'var(--green)'}}>
                        Hoy • {currentDay} {formatDate(now)}
                      </span>
                      <h2 className="dash-title mt-1 uppercase" style={{fontSize: '20px'}}>
                        QUÉ TOCA HOY
                      </h2>
                    </div>
                    <div style={{
                      background: 'color-mix(in srgb, var(--green) 10%, transparent)',
                      border: '1px solid color-mix(in srgb, var(--green) 25%, transparent)',
                      padding: '4px 10px'
                    }}>
                      <span className="dash-label" style={{color: 'var(--green)', fontSize: '10px'}}>SESIONES: {todaySessions.length}</span>
                    </div>
                  </header>

                  <div className="grid md:grid-cols-2 gap-5 items-end relative z-10">
                    <div className="space-y-4">
                      {todaySessions.length > 0 ? todaySessions.map((s, i) => (
                        <div key={i} className="flex gap-4 items-center group cursor-pointer">
                          <div style={{
                            width: 44, height: 44,
                            background: 'var(--panel2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid color-mix(in srgb, var(--green) 20%, transparent)'
                          }}>
                            <span className="material-symbols-outlined" style={{color: 'var(--green)'}}>
                              {'exerciseId' in s ? 'fitness_center' : 'sports_kabaddi'}
                            </span>
                          </div>
                          <div>
                            <h3 style={{fontSize: '16px', fontWeight: 600, color: 'var(--text-green)', fontFamily: "'Inter',sans-serif"}}>
                              {'exerciseName' in s ? s.exerciseName : s.type}
                            </h3>
                            <p className="dash-muted" style={{marginTop: 2}}>
                              {'sets' in s ? `${s.sets.length} sets` : `${s.rounds} rounds`} • {s.notes || ''}
                            </p>
                          </div>
                        </div>
                      )) : (
                        <div className="flex gap-4 items-center">
                          <div style={{
                            width: 44, height: 44,
                            background: 'var(--panel2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid color-mix(in srgb, var(--green) 20%, transparent)'
                          }}>
                            <span className="material-symbols-outlined" style={{color: 'var(--text-muted)'}}>rest</span>
                          </div>
                          <div>
                            <h3 style={{fontSize: '16px', fontWeight: 600, color: 'var(--text-muted)', fontFamily: "'Inter',sans-serif"}}>
                              Sin sesiones registradas
                            </h3>
                            <p className="dash-muted" style={{marginTop: 2}}>
                              Registra tu primer entrenamiento del día
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between">
                        <span className="dash-muted">Fatiga Acumulada</span>
                        <span style={{color: 'var(--green)', fontSize: 11, fontFamily: "'JetBrains Mono',monospace"}}>{Math.min(100, todaySessions.length * 25 + 20)}%</span>
                      </div>
                      <div className="dash-track">
                        <div className="dash-track-fill" style={{width: `${Math.min(100, todaySessions.length * 25 + 20)}%`}} />
                      </div>
                      <button className="dash-btn" style={{marginTop: 12, width: '100%'}}>
                        VER DETALLE SESIÓN
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Alert */}
              {todaySessions.length === 0 && (
                <section className="dash-alert">
                  <span className="material-symbols-outlined" style={{color: 'var(--acid)'}}>info</span>
                  <p className="dash-muted" style={{fontSize: '12px', lineHeight: 1.42, margin: 0}}>
                    No hay sesiones registradas hoy. ¡Empieza tu entrenamiento!
                  </p>
                </section>
              )}

              {/* Weekly Summary + Nutrition */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-7 dash-card">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="dash-label">RESUMEN SEMANAL</h3>
                    <span className="material-symbols-outlined" style={{color: 'var(--text-muted)', fontSize: 18}}>more_horiz</span>
                  </div>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="dash-label" style={{fontSize: '10px'}}>STRIKING</span>
                        <span className="dash-muted">{combatAnalytics.totalRounds.striking} rounds</span>
                      </div>
                      <div className="flex gap-1" style={{height: 20}}>
                        {strikingBars.map((v, i) => (
                          <div key={i} className="flex-1" style={{
                            background: v >= 0.8 ? 'var(--green)' : v > 0 ? 'color-mix(in srgb, var(--green) 40%, transparent)' : 'var(--panel2)'
                          }} />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="dash-label" style={{fontSize: '10px'}}>GRAPPLING</span>
                        <span className="dash-muted">{combatAnalytics.totalRounds.grappling} rounds</span>
                      </div>
                      <div className="flex gap-1" style={{height: 20}}>
                        {grapplingBars.map((v, i) => (
                          <div key={i} className="flex-1" style={{
                            background: v >= 0.8 ? 'var(--green-dim)' : v > 0 ? 'color-mix(in srgb, var(--green-dim) 40%, transparent)' : 'var(--panel2)'
                          }} />
                        ))}
                      </div>
                    </div>
                    <div style={{paddingTop: 8}}>
                      <span className="dash-label" style={{fontSize: '10px', display: 'block', marginBottom: 8}}>
                        ACTIVIDAD ANUAL
                      </span>
                      <div className="grid grid-cols-12 gap-1" style={{height: 40}}>
                        {paddedHeat.map((opacity, i) => (
                          <div key={i}
                            className={opacity === 0 ? 'dash-heat-cell empty' : 'dash-heat-cell'}
                            style={{ '--cell-opacity': Math.max(0.15, opacity) } as React.CSSProperties}
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
                      <span className="dash-value">{(nutrition.goal.calories - nutrition.totals.calories).toLocaleString()}</span>
                      <span className="dash-muted" style={{display: 'block', textTransform: 'uppercase'}}>
                        Kcal Restantes
                      </span>
                    </div>
                    <div className="space-y-3">
                      <MacroRow label="Proteína" current={`${nutrition.totals.protein}g`} target={`${nutrition.goal.protein}g`} pct={nutrition.goal.protein ? Math.round((nutrition.totals.protein / nutrition.goal.protein) * 100) : 0} />
                      <MacroRow label="Carbos" current={`${nutrition.totals.carbs}g`} target={`${nutrition.goal.carbs}g`} pct={nutrition.goal.carbs ? Math.round((nutrition.totals.carbs / nutrition.goal.carbs) * 100) : 0} />
                      <MacroRow label="Grasas" current={`${nutrition.totals.fat}g`} target={`${nutrition.goal.fat}g`} pct={nutrition.goal.fat ? Math.round((nutrition.totals.fat / nutrition.goal.fat) * 100) : 0} />
                    </div>
                  </div>

                  <div className="dash-card">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined" style={{color: 'var(--green)'}}>water_drop</span>
                      <div>
                        <span className="dash-label" style={{display: 'block'}}>HIDRATACIÓN</span>
                        <span style={{fontSize: '14px', color: 'var(--text-green)', fontFamily: "'JetBrains Mono',monospace"}}>{nutrition.totals.calories > 0 ? `${Math.round(nutrition.totals.calories / 1000)}L` : '—'} / 4.0L</span>
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
                    border: '1px solid color-mix(in srgb, var(--green) 25%, transparent)',
                    fontSize: '10px',
                    color: 'var(--green)',
                    textTransform: 'uppercase',
                    fontFamily: "'JetBrains Mono',monospace",
                    letterSpacing: '0.5px'
                  }}>
                    {consistencyPct > 70 ? 'OPTIMAL ZONE' : consistencyPct > 40 ? 'MODERATE' : 'NEED REST'}
                  </span>
                </div>
                <div style={{position: 'relative', height: 180, width: '100%', borderBottom: '1px solid var(--panel2)', borderLeft: '1px solid var(--panel2)', display: 'flex', alignItems: 'flex-end'}}>
                  <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 400 100">
                    <defs>
                      <linearGradient id="graphG" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="var(--green)" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                    <path d={GRAPH_PATH} fill="none" stroke="var(--green)" strokeWidth="1.5" />
                    <path d={GRAPH_FILL} fill="url(#graphG)" opacity="0.2" />
                    <rect fill="var(--green)" height="4" width="4" x="-2" y="78" />
                    <rect fill="var(--green)" height="4" width="4" x="148" y="58" />
                    <rect fill="var(--acid)" height="4" width="4" x="398" y="28" />
                  </svg>
                  <div className="flex w-full justify-between px-2 pb-2" style={{fontSize: '10px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace", position: 'relative', zIndex: 1}}>
                    {WEEKDAY_LABELS.map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Calendar */}
              <section className="dash-card">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="dash-label">{new Date(currentYear, currentMonth).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}</h3>
                  <span className="dash-muted">{loggedDays.length} días registrados</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {WEEKDAYS.map((d) => (
                    <div key={d} className="text-center dash-label" style={{fontSize: '9px', paddingBottom: 8}}>
                      {d}
                    </div>
                  ))}
                  {monthGrid.flat().map((day, i) => {
                    const isLogged = day > 0 && loggedDays.includes(day)
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
                          background: isSelected ? 'color-mix(in srgb, var(--green) 15%, transparent)' : isLogged ? 'color-mix(in srgb, var(--green) 10%, transparent)' : 'transparent',
                          color: isLogged ? 'var(--green)' : day === 0 ? 'transparent' : 'var(--text-muted)',
                          border: isLogged ? '1px solid color-mix(in srgb, var(--green) 25%, transparent)' : isSelected ? '1px solid color-mix(in srgb, var(--green) 50%, transparent)' : '1px solid transparent',
                          transition: '0.2s'
                        }}
                        onMouseEnter={(e) => { if (day > 0 && !isLogged) e.currentTarget.style.background = 'color-mix(in srgb, var(--green) 6%, transparent)' }}
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
                  <span className="material-symbols-outlined" style={{color: 'var(--green)', fontSize: 36}}>
                    local_fire_department
                  </span>
                  <div className="flex-1">
                    <h3 className="dash-label">RACHA DE ENTRENAMIENTO</h3>
                    <div className="flex gap-6" style={{marginTop: 8}}>
                      <div>
                        <span className="dash-value">{streak}</span>
                        <span className="dash-muted" style={{display: 'block'}}>días actual</span>
                      </div>
                      <div>
                        <span className="dash-value" style={{color: 'var(--green)'}}>{bestStreak}</span>
                        <span className="dash-muted" style={{display: 'block'}}>mejor racha</span>
                      </div>
                      <div>
                        <span className="dash-value">{consistencyPct}%</span>
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
            <strong>Bienvenido</strong>
            <span>Elian MC</span>
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
                src="https://media1.tenor.com/m/2EKSglynYpIAAAAd/higuruma-jjk.gif"
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
        <span style={{color: 'var(--text-green)', fontFamily: "'JetBrains Mono',monospace"}}>
          {current} / {target}
        </span>
      </div>
      <div className="dash-track">
        <div className="dash-track-fill" style={{width: `${pct}%`}} />
      </div>
    </div>
  )
}
