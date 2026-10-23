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

vi.mock('../../../shared/components/CyberBackground', () => ({
  default: () => null,
}))

const mockResetPassword = vi.fn()
const mockLogin = vi.fn()
const mockRegister = vi.fn()

vi.mock('../../../shared/hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    register: mockRegister,
    resetPassword: mockResetPassword,
  }),
}))

import LoginScreen from './LoginScreen'

describe('LoginScreen - recuperación de contraseña', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockResetPassword.mockResolvedValue(undefined)
  })

  it('pasa a modo "forgot" al pulsar "¿OLVIDASTE TU CONTRASEÑA?"', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>
    )

    await user.click(screen.getByText('¿OLVIDASTE TU CONTRASEÑA?'))

    expect(screen.getByText('RECUPERAR CONTRASEÑA')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ENVIAR ENLACE/ })).toBeInTheDocument()
    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument()
  })

  it('envía resetPassword con el email y muestra mensaje genérico', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>
    )

    await user.click(screen.getByText('¿OLVIDASTE TU CONTRASEÑA?'))
    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /ENVIAR ENLACE/ }))

    await waitFor(() => expect(mockResetPassword).toHaveBeenCalledWith('test@example.com'))
    expect(await screen.findByText(/Si existe una cuenta con ese email/)).toBeInTheDocument()
    expect(screen.queryByText(/Password/i)).not.toBeInTheDocument()
  })

  it('muestra error si resetPassword falla', async () => {
    mockResetPassword.mockRejectedValue(new Error('Error de red'))
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>
    )

    await user.click(screen.getByText('¿OLVIDASTE TU CONTRASEÑA?'))
    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /ENVIAR ENLACE/ }))

    expect(await screen.findByText(/Error de red/)).toBeInTheDocument()
  })

  it('vuelve a modo login desde forgot', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>
    )

    await user.click(screen.getByText('¿OLVIDASTE TU CONTRASEÑA?'))
    expect(screen.getByText('RECUPERAR CONTRASEÑA')).toBeInTheDocument()

    await user.click(screen.getByText('VOLVER AL LOGIN'))
    expect(screen.getByText('The best way to grow up')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })
})
