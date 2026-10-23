import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@/shared/components/CyberBackground', () => ({
  default: () => null,
}))

const mockUpdatePassword = vi.fn()
const mockGetSession = vi.fn()
const mockOnAuthStateChange = vi.fn()

vi.mock('@/shared/hooks/useAuth', () => ({
  useAuth: () => ({
    updatePassword: mockUpdatePassword,
  }),
}))

vi.mock('@/services/supabase/client', () => ({
  supabase: {
    auth: {
      onAuthStateChange: (cb: (event: string, session: unknown) => void) => {
        mockOnAuthStateChange(cb)
        return { data: { subscription: { unsubscribe: vi.fn() } } }
      },
      getSession: () => mockGetSession(),
    },
  },
}))

import ResetPasswordScreen from './ResetPasswordScreen'

describe('ResetPasswordScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUpdatePassword.mockResolvedValue(undefined)
    mockGetSession.mockResolvedValue({ data: { session: null } })
  })

  it('muestra "Comprobando el enlace…" mientras espera la sesión', async () => {
    let resolveSession!: (value: { data: { session: null } }) => void
    mockGetSession.mockReturnValue(new Promise((resolve) => { resolveSession = resolve }))

    render(
      <MemoryRouter>
        <ResetPasswordScreen />
      </MemoryRouter>
    )

    expect(screen.getByText('Comprobando el enlace…')).toBeInTheDocument()
    resolveSession({ data: { session: null } })
    await waitFor(() => {
      expect(screen.getByText(/El enlace no es válido o ha caducado/)).toBeInTheDocument()
    })
  })

  it('pasa a ready cuando hay sesión', async () => {
    mockGetSession.mockResolvedValue({ data: { session: { access_token: 'x' } } })

    render(
      <MemoryRouter>
        <ResetPasswordScreen />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Nueva contraseña')).toBeInTheDocument()
      expect(screen.getByLabelText('Repite la contraseña')).toBeInTheDocument()
    })
  })

  it('pasa a ready con el evento PASSWORD_RECOVERY', async () => {
    let authCb!: (event: string, session: unknown) => void
    mockOnAuthStateChange.mockImplementation((cb) => { authCb = cb })

    render(
      <MemoryRouter>
        <ResetPasswordScreen />
      </MemoryRouter>
    )

    authCb('PASSWORD_RECOVERY', { access_token: 'x' })

    await waitFor(() => {
      expect(screen.getByLabelText('Nueva contraseña')).toBeInTheDocument()
    })
  })

  it('muestra error si la contraseña tiene menos de 6 caracteres', async () => {
    mockGetSession.mockResolvedValue({ data: { session: { access_token: 'x' } } })
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <ResetPasswordScreen />
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.getByLabelText('Nueva contraseña')).toBeInTheDocument())

    await user.type(screen.getByLabelText('Nueva contraseña'), '12345')
    await user.type(screen.getByLabelText('Repite la contraseña'), '12345')
    await user.click(screen.getByRole('button', { name: /GUARDAR CONTRASEÑA/ }))

    expect(await screen.findByText(/al menos 6 caracteres/)).toBeInTheDocument()
    expect(mockUpdatePassword).not.toHaveBeenCalled()
  })

  it('muestra error si las contraseñas no coinciden', async () => {
    mockGetSession.mockResolvedValue({ data: { session: { access_token: 'x' } } })
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <ResetPasswordScreen />
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.getByLabelText('Nueva contraseña')).toBeInTheDocument())

    await user.type(screen.getByLabelText('Nueva contraseña'), 'password123')
    await user.type(screen.getByLabelText('Repite la contraseña'), 'different')
    await user.click(screen.getByRole('button', { name: /GUARDAR CONTRASEÑA/ }))

    expect(await screen.findByText(/Las contraseñas no coinciden/)).toBeInTheDocument()
    expect(mockUpdatePassword).not.toHaveBeenCalled()
  })

  it('llama a updatePassword, muestra éxito y navega a /dashboard', async () => {
    mockGetSession.mockResolvedValue({ data: { session: { access_token: 'x' } } })
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <ResetPasswordScreen />
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.getByLabelText('Nueva contraseña')).toBeInTheDocument())

    await user.type(screen.getByLabelText('Nueva contraseña'), 'newpass123')
    await user.type(screen.getByLabelText('Repite la contraseña'), 'newpass123')
    await user.click(screen.getByRole('button', { name: /GUARDAR CONTRASEÑA/ }))

    await waitFor(() => expect(mockUpdatePassword).toHaveBeenCalledWith('newpass123'))
    expect(await screen.findByText(/Contraseña actualizada/)).toBeInTheDocument()
    expect(screen.getByText(/Hemos cerrado el resto de sesiones abiertas/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /IR AL DASHBOARD/ }))
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
  })

  it('muestra el error cuando updatePassword falla', async () => {
    mockGetSession.mockResolvedValue({ data: { session: { access_token: 'x' } } })
    mockUpdatePassword.mockRejectedValue(new Error('Token inválido'))
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <ResetPasswordScreen />
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.getByLabelText('Nueva contraseña')).toBeInTheDocument())

    await user.type(screen.getByLabelText('Nueva contraseña'), 'newpass123')
    await user.type(screen.getByLabelText('Repite la contraseña'), 'newpass123')
    await user.click(screen.getByRole('button', { name: /GUARDAR CONTRASEÑA/ }))

    expect(await screen.findByText(/Token inválido/)).toBeInTheDocument()
    expect(screen.queryByText(/Contraseña actualizada/)).not.toBeInTheDocument()
  })

  it('muestra estado inválido cuando no hay sesión y no llega evento', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } })

    render(
      <MemoryRouter>
        <ResetPasswordScreen />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/El enlace no es válido o ha caducado/)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /VOLVER AL LOGIN/ })).toHaveAttribute('href', '/login')
    })
  })
})
