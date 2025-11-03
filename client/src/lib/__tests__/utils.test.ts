import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('foo', 'bar')
    expect(result).toContain('foo')
    expect(result).toContain('bar')
  })

  it('should handle conditional class names', () => {
    const result = cn('foo', false && 'bar', 'baz')
    expect(result).toContain('foo')
    expect(result).not.toContain('bar')
    expect(result).toContain('baz')
  })

  it('should merge conflicting Tailwind classes', () => {
    // Tailwind merge should keep the last conflicting class
    const result = cn('px-2', 'px-4')
    expect(result).not.toContain('px-2')
    expect(result).toContain('px-4')
  })

  it('should handle empty strings and null/undefined', () => {
    const result = cn('foo', '', null, undefined, 'bar')
    expect(result).toContain('foo')
    expect(result).toContain('bar')
  })

  it('should handle arrays of class names', () => {
    const result = cn(['foo', 'bar'], 'baz')
    expect(result).toContain('foo')
    expect(result).toContain('bar')
    expect(result).toContain('baz')
  })

  it('should handle objects with boolean values', () => {
    const result = cn({
      'foo': true,
      'bar': false,
      'baz': true,
    })
    expect(result).toContain('foo')
    expect(result).not.toContain('bar')
    expect(result).toContain('baz')
  })
})

