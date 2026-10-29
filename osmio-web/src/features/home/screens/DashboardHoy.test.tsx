import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import type { DailyNutrition } from '@/shared/types/nutrition.types'
import type { CombatSession, StrengthSession } from '@/shared/types/session.types'
import { toLocalDateString } from '@/shared/utils/dateHelpers'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  getSessionsByDate: vi.fn(),
  getCombatAnalytics: vi.fn(),
  getConsistency: vi.fn(),
  getDayNutrition: vi.fn(),
  getProfile: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  }
})

vi.mock('@/services/api/sessions.api', () => ({
  sessionsApi: { getSessionsByDate: mocks.getSessionsByDate },
}))

vi.mock('@/services/api/analytics.api', () => ({
  analyticsApi: {
    getCombatAnalytics: mocks.getCombatAnalytics,
    getConsistency: mocks.getConsistency,
  },
}))

vi.mock('@/services/api/nutrition.api', () => ({
  nutritionApi: { getDayNutrition: mocks.getDayNutrition },
}))

vi.mock('@/services/api/profiles.api', () => ({
  profilesApi: { getProfile: mocks.getProfile },
}))

import DashboardHoy from './DashboardHoy'

const today = toLocalDateString()
const yesterday = toLocalDateString(new Date(Date.now() - 24 * 60 * 60 * 1000))

const emptyNutrition: DailyNutrition = {
  date: today,
  meals: [],
  totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  goal: { calories: 2400, protein: 180, carbs: 280, fat: 75 },
}

const strengthSession: StrengthSession = {
  id: 'strength-1',
  date: today,
  exerciseId: 1,
  exerciseName: 'Sentadilla',
  sets: [
    { reps: 5, weight: 100, rpe: 8 },
    { reps: 5, weight: 100, rpe: 8 },
  ],
  notes: '',
}

const combatSession: CombatSession = {
  id: 'combat-1',
  date: today,
  type: 'striking',
  rounds: 6,
  durationMinutes: 45,
  rpe: 8,
  positions: [],
  notes: '',
}

function renderDashboard() {
  return render(
    <MemoryRouter>
      <DashboardHoy />
    </MemoryRouter>,
  )
}

/**
 * Bklit mide el ancho del contenedor con ResizeObserver. jsdom no calcula
 * layout, así que sin este stub el heatmap recibe `width: 0` y no pinta celdas.
 */
function stubHeatmapSize(width = 640, height = 240) {
  const original = window.ResizeObserver

  class MeasuredResizeObserver {
    private readonly callback: ResizeObserverCallback

    constructor(callback: ResizeObserverCallback) {
      this.callback = callback
    }

    observe(target: Element) {
      const rect = {
        x: 0,
        y: 0,
        width,
        height,
        top: 0,
        right: width,
        bottom: height,
        left: 0,
        toJSON: () => ({}),
      }
      this.callback(
        [{ target, contentRect: rect } as unknown as ResizeObserverEntry],
        this as unknown as ResizeObserver,
      )
    }

    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = MeasuredResizeObserver as unknown as typeof ResizeObserver
  return () => {
    window.ResizeObserver = original
  }
}

describe('DashboardHoy', () => {
  let restoreResizeObserver: () => void

  beforeEach(() => {
    vi.clearAllMocks()
    restoreResizeObserver = stubHeatmapSize()
    mocks.getSessionsByDate.mockResolvedValue([])
    mocks.getCombatAnalytics.mockResolvedValue({
      roundsByWeek: [],
      totalRounds: { striking: 0, grappling: 0 },
    })
    mocks.getConsistency.mockResolvedValue([])
    mocks.getDayNutrition.mockResolvedValue(emptyNutrition)
    mocks.getProfile.mockResolvedValue({ name: 'Elian' })
  })

  afterEach(() => {
    restoreResizeObserver()
  })

  it('muestra el estado vacío y permite registrar una sesión', async () => {
    const user = userEvent.setup()
    renderDashboard()

    expect(await screen.findByText('Sin sesiones registradas')).toBeInTheDocument()
    expect(screen.getAllByText('Panel de').length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: /Registrar sesión/i }))
    expect(mocks.navigate).toHaveBeenCalledWith('/logging')
  })

  it('muestra sesiones, nutrición y consistencia con datos reales', async () => {
    mocks.getSessionsByDate.mockResolvedValue([strengthSession, combatSession])
    mocks.getDayNutrition.mockResolvedValue({
      ...emptyNutrition,
      meals: [
        { id: '1', name: 'Avena', calories: 400, protein: 20, carbs: 50, fat: 10, timestamp: today },
        { id: '2', name: 'Pollo', calories: 500, protein: 45, carbs: 20, fat: 15, timestamp: today },
      ],
      totals: { calories: 900, protein: 65, carbs: 70, fat: 25 },
    })
    mocks.getConsistency.mockResolvedValue([
      { date: today, active: true },
      { date: yesterday, active: true },
    ])

    renderDashboard()

    expect(await screen.findByText('Sentadilla')).toBeInTheDocument()
    const row = screen.getByText('Sentadilla').closest('li') as HTMLElement

    expect(screen.getByText('striking training')).toBeInTheDocument()
    expect(row).toHaveTextContent('2 series')
    expect(row).toHaveTextContent(/1[.,]?000 kg/)
    expect(screen.getByText('6 rounds · 45 min')).toBeInTheDocument()

    const nutritionCard = screen.getByText('kcal restantes').parentElement
    expect(nutritionCard).toHaveTextContent(/1[.,]?500/)
    expect(screen.getByText('65 / 180 g')).toBeInTheDocument()
    expect(screen.getByText('900 kcal consumidas · 2 comidas')).toBeInTheDocument()

    const streak = screen.getByText('Racha actual').parentElement
    expect(within(streak as HTMLElement).getByText('2')).toBeInTheDocument()

    await waitFor(() => {
      expect(
        document.querySelectorAll('rect[fill="var(--chart-scale-02)"]').length,
      ).toBeGreaterThan(0)
    })
  })

  it('muestra un aviso cuando falla la carga', async () => {
    mocks.getSessionsByDate.mockRejectedValue(new Error('offline'))

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    renderDashboard()

    expect(
      await screen.findByText('No se pudieron cargar los datos del panel.'),
    ).toBeInTheDocument()
    consoleError.mockRestore()
  })
})
