import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

// Mock the route components
vi.mock('@/components/login/page', () => ({
  default: () => <div>Login Page</div>,
}))

vi.mock('@/components/homepage/page', () => ({
  default: () => <div>Home Page</div>,
}))

vi.mock('@/components/auth/EmailConfirmation', () => ({
  default: () => <div>Email Confirmation</div>,
}))

vi.mock('@/components/auth/ProtectedRoute', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/components/auth/PublicRoute', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/layouts/generalLayout', () => ({
  default: () => (
    <div>
      <div>General Layout</div>
      <div>Outlet Content</div>
    </div>
  ),
}))

describe('App', () => {
  it('should render login page at /login route', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('should render email confirmation page at /auth/email-confirmation route', () => {
    render(
      <MemoryRouter initialEntries={['/auth/email-confirmation']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText('Email Confirmation')).toBeInTheDocument()
  })

  it('should render layout at / route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText('General Layout')).toBeInTheDocument()
    expect(screen.getByText('Outlet Content')).toBeInTheDocument()
  })

  it('should render layout at /home route', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText('General Layout')).toBeInTheDocument()
    expect(screen.getByText('Outlet Content')).toBeInTheDocument()
  })
})

