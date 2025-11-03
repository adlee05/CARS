import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button, buttonVariants } from '../button'

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should handle click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByText('Click me'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    
    const button = screen.getByText('Disabled Button')
    expect(button).toBeDisabled()
  })

  it('should render with default variant', () => {
    const { container } = render(<Button>Default Button</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-primary')
  })

  it('should render with destructive variant', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-destructive')
  })

  it('should render with outline variant', () => {
    const { container } = render(<Button variant="outline">Outline</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('border')
  })

  it('should render with secondary variant', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-secondary')
  })

  it('should render with ghost variant', () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('hover:bg-accent')
  })

  it('should render with link variant', () => {
    const { container } = render(<Button variant="link">Link</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('text-primary')
  })

  it('should render with small size', () => {
    const { container } = render(<Button size="sm">Small</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('h-8')
  })

  it('should render with large size', () => {
    const { container } = render(<Button size="lg">Large</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('h-10')
  })

  it('should render with icon size', () => {
    const { container } = render(<Button size="icon">Icon</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('size-9')
  })

  it('should apply custom className', () => {
    const { container } = render(<Button className="custom-class">Custom</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should render as child when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    
    const link = screen.getByText('Link Button')
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/test')
  })

  it('should merge variant classes correctly', () => {
    const { container } = render(
      <Button variant="outline" className="custom-class">
        Merged
      </Button>
    )
    const button = container.querySelector('button')
    expect(button).toHaveClass('border')
    expect(button).toHaveClass('custom-class')
  })
})

describe('buttonVariants', () => {
  it('should generate correct class names for variants', () => {
    const defaultClasses = buttonVariants()
    expect(defaultClasses).toContain('inline-flex')
    
    const destructiveClasses = buttonVariants({ variant: 'destructive' })
    expect(destructiveClasses).toContain('bg-destructive')
    
    const outlineClasses = buttonVariants({ variant: 'outline' })
    expect(outlineClasses).toContain('border')
  })

  it('should generate correct class names for sizes', () => {
    const smallClasses = buttonVariants({ size: 'sm' })
    expect(smallClasses).toContain('h-8')
    
    const largeClasses = buttonVariants({ size: 'lg' })
    expect(largeClasses).toContain('h-10')
    
    const iconClasses = buttonVariants({ size: 'icon' })
    expect(iconClasses).toContain('size-9')
  })
})

