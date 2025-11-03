# Frontend Testing Guide

This document provides information about the testing setup and how to run tests for the frontend client.

## Testing Stack

- **Vitest**: Fast unit test framework
- **React Testing Library**: React component testing utilities
- **jsdom**: DOM simulation for browser environment
- **@testing-library/jest-dom**: Custom Jest DOM matchers

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test
```
(Vitest runs in watch mode by default)

### Run tests once
```bash
npm test -- --run
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run a specific test file
```bash
npm test -- src/lib/__tests__/utils.test.ts
```

## Test Structure

Tests are organized in `__tests__` directories next to the files they test:

```
src/
├── lib/
│   ├── __tests__/
│   │   └── utils.test.ts          # Utility function tests
│   └── utils.ts
├── services/
│   ├── __tests__/
│   │   └── api.test.ts            # API service tests
│   └── api.ts
├── components/
│   ├── auth/
│   │   ├── __tests__/
│   │   │   ├── ProtectedRoute.test.tsx
│   │   │   └── PublicRoute.test.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── PublicRoute.tsx
│   ├── ui/
│   │   ├── __tests__/
│   │   │   └── button.test.tsx
│   │   └── button.tsx
│   └── ...
└── __tests__/
    └── App.test.tsx               # App component tests
```

## Test Files

### Utility Tests (`src/lib/__tests__/utils.test.ts`)
- Tests for the `cn()` class name utility function
- Validates class merging, conditional classes, and Tailwind conflict resolution

### API Service Tests (`src/services/__tests__/api.test.ts`)
- Tests for `fetchNews()` function
- Tests for `redirectToArticle()` function
- Covers success cases, error handling, and authentication token validation

### Component Tests

#### ProtectedRoute (`src/components/auth/__tests__/ProtectedRoute.test.tsx`)
- Tests authentication-based route protection
- Validates redirect behavior for unauthenticated users
- Tests rendering of protected content for authenticated users

#### PublicRoute (`src/components/auth/__tests__/PublicRoute.test.tsx`)
- Tests public route behavior
- Validates redirect for authenticated users
- Tests rendering for unauthenticated users

#### Button (`src/components/ui/__tests__/button.test.tsx`)
- Tests all button variants (default, destructive, outline, secondary, ghost, link)
- Tests all button sizes (default, sm, lg, icon)
- Tests disabled state
- Tests click events
- Tests custom className merging

#### Homepage (`src/components/homepage/__tests__/page.test.tsx`)
- Tests loading state
- Tests successful article fetching
- Tests error handling
- Tests empty article list handling

#### Login (`src/components/login/__tests__/page.test.tsx`)
- Tests rendering of login page components
- Tests layout structure
- Tests background and UI elements

#### App (`src/__tests__/App.test.tsx`)
- Tests route rendering
- Tests navigation structure
- Tests protected and public routes

## Writing New Tests

### Example Test Structure

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import YourComponent from '../YourComponent'

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### Mocking

Mock external dependencies and services:

```typescript
import { vi } from 'vitest'

vi.mock('@/services/api', () => ({
  fetchNews: vi.fn(),
}))
```

### Testing with React Router

Use `MemoryRouter` for routing tests:

```typescript
import { MemoryRouter } from 'react-router-dom'

render(
  <MemoryRouter initialEntries={['/path']}>
    <YourComponent />
  </MemoryRouter>
)
```

### Testing Async Behavior

Use `waitFor` for asynchronous operations:

```typescript
import { waitFor } from '@testing-library/react'

await waitFor(() => {
  expect(screen.getByText('Async Content')).toBeInTheDocument()
})
```

## Setup File

The test setup file (`src/test/setup.ts`) includes:
- Jest DOM matchers import
- Cleanup after each test
- Mock implementations for browser APIs (matchMedia, IntersectionObserver, ResizeObserver)
- localStorage clearing

## Notes

- Tests use `jsdom` environment to simulate browser APIs
- localStorage is automatically cleared between tests
- Mocks are reset after each test
- CSS imports are supported (for testing styled components)

