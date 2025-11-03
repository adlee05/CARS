import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from '../page'

// Mock the SplitText component
vi.mock('@/components/SplitText', () => ({
  default: ({ text }: { text: string }) => <div data-testid="split-text">{text}</div>,
}))

// Mock the FlickeringGrid component
vi.mock('@/components/ui/shadcn-io/flickering-grid/index', () => ({
  FlickeringGrid: ({ className }: { className?: string }) => (
    <div data-testid="flickering-grid" className={className} />
  ),
}))

// Mock the TabsComp component
vi.mock('../tabs', () => ({
  TabsComp: () => <div data-testid="login-tabs">Login Tabs</div>,
}))

describe('Login', () => {
  it('should render the login page with title', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    expect(screen.getByTestId('split-text')).toBeInTheDocument()
    expect(screen.getByText('Curatr')).toBeInTheDocument()
  })

  it('should render the tagline', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    expect(screen.getByText('Intelligent News for the Informed Mind.')).toBeInTheDocument()
  })

  it('should render the flickering grid background', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const grid = screen.getByTestId('flickering-grid')
    expect(grid).toBeInTheDocument()
    expect(grid).toHaveClass('absolute', '-z-10', 'inset-0')
  })

  it('should render the login tabs component', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    expect(screen.getByTestId('login-tabs')).toBeInTheDocument()
  })

  it('should have proper layout structure', () => {
    const { container } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const mainDiv = container.querySelector('.flex.flex-col.items-center.justify-center')
    expect(mainDiv).toBeInTheDocument()
  })
})

