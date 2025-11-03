import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Homepage from '../page'
import { fetchNews } from '@/services/api'
import type { Article } from '@/types/article'

// Mock the API service
vi.mock('@/services/api', () => ({
  fetchNews: vi.fn(),
}))

// Mock the Blog02Page component
vi.mock('../cardTest', () => ({
  default: ({ articles }: { articles: Article[] }) => (
    <div data-testid="blog-page">
      {articles.map((article) => (
        <div key={article.id} data-testid={`article-${article.id}`}>
          {article.title}
        </div>
      ))}
    </div>
  ),
}))

describe('Homepage', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'test-token')
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should render loading state initially', () => {
    vi.mocked(fetchNews).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    )

    expect(screen.getByText('Loading articles...')).toBeInTheDocument()
  })

  it('should render articles when loaded successfully', async () => {
    const mockArticles: Article[] = [
      {
        id: 1,
        title: 'Test Article 1',
        content: 'Content 1',
        url: 'https://example.com/1',
        source: 'Test Source',
        image: 'https://example.com/image1.jpg',
        region: 'US',
        published_date: '2024-01-01',
      },
      {
        id: 2,
        title: 'Test Article 2',
        content: 'Content 2',
        url: 'https://example.com/2',
        source: 'Test Source',
        image: 'https://example.com/image2.jpg',
        region: 'US',
        published_date: '2024-01-02',
      },
    ]

    vi.mocked(fetchNews).mockResolvedValue(mockArticles)

    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.queryByText('Loading articles...')).not.toBeInTheDocument()
    })

    expect(screen.getByTestId('blog-page')).toBeInTheDocument()
    expect(screen.getByTestId('article-1')).toBeInTheDocument()
    expect(screen.getByTestId('article-2')).toBeInTheDocument()
    expect(screen.getByText('Test Article 1')).toBeInTheDocument()
    expect(screen.getByText('Test Article 2')).toBeInTheDocument()
  })

  it('should render error message when fetch fails', async () => {
    const errorMessage = 'Failed to fetch articles'
    vi.mocked(fetchNews).mockRejectedValue(new Error(errorMessage))

    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.queryByText('Loading articles...')).not.toBeInTheDocument()
    })

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
    expect(screen.queryByTestId('blog-page')).not.toBeInTheDocument()
  })

  it('should handle non-Error exceptions', async () => {
    vi.mocked(fetchNews).mockRejectedValue('String error')

    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.queryByText('Loading articles...')).not.toBeInTheDocument()
    })

    expect(screen.getByText('Error: Failed to load articles')).toBeInTheDocument()
  })

  it('should call fetchNews on mount', async () => {
    const mockArticles: Article[] = []
    vi.mocked(fetchNews).mockResolvedValue(mockArticles)

    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(fetchNews).toHaveBeenCalledTimes(1)
    })
  })

  it('should render empty articles list', async () => {
    vi.mocked(fetchNews).mockResolvedValue([])

    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.queryByText('Loading articles...')).not.toBeInTheDocument()
    })

    expect(screen.getByTestId('blog-page')).toBeInTheDocument()
    expect(screen.queryByTestId(/article-/)).not.toBeInTheDocument()
  })
})

