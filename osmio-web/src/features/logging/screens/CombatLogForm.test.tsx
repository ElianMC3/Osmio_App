import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  createCombatSession: vi.fn(),
  info: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mocks.navigate }
})

vi.mock('@/services/api/sessions.api', () => ({
  sessionsApi: { createCombatSession: mocks.createCombatSession },
}))

vi.mock('@/design-system/toast', () => ({ toast: { info: mocks.info } }))

import CombatLogForm from './CombatLogForm'

function renderForm() {
  return render(
    <MemoryRouter
      initialEntries={[{ pathname: '/logging/combat', state: { discipline: 'striking', trainingType: 'tecnica' } }]}
    >
      <CombatLogForm />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('CombatLogForm al guardar', () => {
  it('avisa que quedó pendiente cuando no hay red', async () => {
    mocks.createCombatSession.mockResolvedValue({ pending: true, session: { id: 'local-1' } })

    renderForm()
    await userEvent.click(screen.getByRole('button', { name: /guardar registro/i }))

    await waitFor(() => expect(mocks.info).toHaveBeenCalledTimes(1))
    expect(mocks.info).toHaveBeenCalledWith(
      'Guardada sin conexión',
      'La sesión se sincronizará sola al volver la red.',
    )
    expect(mocks.navigate).toHaveBeenCalledWith(-1)
  })

  it('no muestra el aviso si la sesión subió al servidor', async () => {
    mocks.createCombatSession.mockResolvedValue({ pending: false, session: { id: 'remote-1' } })

    renderForm()
    await userEvent.click(screen.getByRole('button', { name: /guardar registro/i }))

    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith(-1))
    expect(mocks.info).not.toHaveBeenCalled()
  })

  it('envía la disciplina y el resultado elegidos', async () => {
    mocks.createCombatSession.mockResolvedValue({ pending: false, session: { id: 'remote-1' } })

    renderForm()
    await userEvent.click(screen.getByRole('button', { name: /guardar registro/i }))

    await waitFor(() => expect(mocks.createCombatSession).toHaveBeenCalled())
    expect(mocks.createCombatSession).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'striking', rounds: 3, durationMinutes: 3, rpe: 8 }),
    )
  })
})
