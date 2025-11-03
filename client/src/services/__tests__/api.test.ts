import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchNews, redirectToArticle } from '../api'
import type { Article } from '@/types/article'

describe('API Service', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('fetchNews', () => {
    it('should fetch news successfully with valid token', async () => {
      const mockArticles: Article[] = [
        {
          id: 1,
          title: 'Test Article',
          content: 'Test content',
          url: 'https://example.com',
          source: 'Test Source',
          image: 'https://example.com/image.jpg',
          region: 'US',
          published_date: '2024-01-01',
        },
      ]

      localStorage.setItem('auth_token', 'test-token')

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockArticles,
      })

      const result = await fetchNews()

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/news'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          }),
        })
      )
      expect(result).toEqual(mockArticles)
    })

    it('should throw error when no token is found', async () => {
      localStorage.removeItem('auth_token')

      await expect(fetchNews()).rejects.toThrow(
        'No authentication token found in localStorage'
      )
    })

    it('should handle API errors', async () => {
      localStorage.setItem('auth_token', 'test-token')

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => 'Unauthorized',
      })

      await expect(fetchNews()).rejects.toThrow(
        'Failed to fetch news (401)'
      )
    })

    it('should handle network errors', async () => {
      localStorage.setItem('auth_token', 'test-token')

      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(fetchNews()).rejects.toThrow('Network error')
    })
  })

  describe('redirectToArticle', () => {
    it('should get article redirect URL successfully', async () => {
      const mockUrl = 'https://example.com/article'
      localStorage.setItem('auth_token', 'test-token')

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ url: mockUrl }),
      })

      const result = await redirectToArticle(1)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/article-redirect'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({ article_id: 1 }),
        })
      )
      expect(result).toBe(mockUrl)
    })

    it('should throw error when no token is found', async () => {
      localStorage.removeItem('auth_token')

      await expect(redirectToArticle(1)).rejects.toThrow(
        'No authentication token found in localStorage'
      )
    })

    it('should handle API errors', async () => {
      localStorage.setItem('auth_token', 'test-token')

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Article not found',
      })

      await expect(redirectToArticle(1)).rejects.toThrow(
        'Failed to get article URL (404)'
      )
    })

    it('should handle network errors', async () => {
      localStorage.setItem('auth_token', 'test-token')

      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(redirectToArticle(1)).rejects.toThrow('Network error')
    })
  })
})

