import Database from '../../utils/db';
import { Client, QueryResult } from 'pg';

const mockQuery = jest.fn();
const mockConnect = jest.fn();
const mockEnd = jest.fn();

jest.mock('pg', () => {
  return {
    Client: jest.fn().mockImplementation(() => ({
      connect: mockConnect,
      end: mockEnd,
      query: mockQuery,
    })),
  };
});

describe('Database Utility', () => {
  let db: Database;

  beforeEach(() => {
    jest.clearAllMocks();
    db = new Database();
  });

  describe('connect', () => {
    it('should connect to the database', async () => {
      mockConnect.mockResolvedValue(undefined);

      await db.connect();

      expect(mockConnect).toHaveBeenCalled();
    });
  });

  describe('disconnect', () => {
    it('should disconnect from the database', async () => {
      mockEnd.mockResolvedValue(undefined);

      await db.disconnect();

      expect(mockEnd).toHaveBeenCalled();
    });
  });

  describe('fetchArticle', () => {
    it('should fetch an article by id', async () => {
      const articleId = 123;
      const mockRow = {
        id: articleId,
        title: 'Test Article',
        content: 'Test content',
        url: 'https://example.com',
        source: 'Test Source',
        region: 'US',
        published_date: '2024-01-01',
        top_image: 'https://example.com/image.jpg',
      };

      mockQuery.mockResolvedValue({
        rows: [mockRow],
      });

      const result = await db.fetchArticle(articleId);

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT id, title, content, url, source, region, published_date, top_image FROM articles WHERE id=$1;',
        [articleId]
      );
      expect(result).toEqual({
        id: articleId,
        title: mockRow.title,
        content: mockRow.content,
        url: mockRow.url,
        source: mockRow.source,
        region: mockRow.region,
        image: mockRow.top_image,
        published_date: mockRow.published_date,
      });
    });

    it('should return null if article not found', async () => {
      const articleId = 999;
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await db.fetchArticle(articleId);

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const articleId = 123;
      const error = new Error('Database error');
      mockQuery.mockRejectedValue(error);

      await expect(db.fetchArticle(articleId)).rejects.toThrow('Database error');
    });
  });

  describe('fetchTopKArticles', () => {
    it('should fetch top K articles', async () => {
      const k = 10;
      const mockRows = [
        {
          id: 1,
          title: 'Article 1',
          content: 'Content 1',
          url: 'https://example.com/1',
          source: 'Source 1',
          region: 'US',
          published_date: '2024-01-01',
          top_image: 'https://example.com/image1.jpg',
        },
      ];

      mockQuery.mockResolvedValue({ rows: mockRows });

      const result = await db.fetchTopKArticles(k);

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT id, title, content, url, source, region, published_date, top_image FROM articles ORDER BY published_date DESC LIMIT $1;',
        [k]
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: mockRows[0].id,
        title: mockRows[0].title,
        content: mockRows[0].content,
        url: mockRows[0].url,
        source: mockRows[0].source,
        region: mockRows[0].region,
        published_date: mockRows[0].published_date,
        image: mockRows[0].top_image,
      });
    });

    it('should return empty array if no articles found', async () => {
      const k = 10;
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await db.fetchTopKArticles(k);

      expect(result).toEqual([]);
    });
  });

  describe('getArticleEmbedding', () => {
    it('should fetch article embedding', async () => {
      const articleId = 123;
      const embeddingStr = '[0.1,0.2,0.3]';
      mockQuery.mockResolvedValue({
        rows: [{ embedding: embeddingStr }],
      });

      const result = await db.getArticleEmbedding(articleId);

      expect(result).toEqual([0.1, 0.2, 0.3]);
    });

    it('should return null if embedding not found', async () => {
      const articleId = 999;
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await db.getArticleEmbedding(articleId);

      expect(result).toBeNull();
    });
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const id = 'user-123';
      const email = 'test@example.com';
      const role = 'user';
      const username = 'testuser';

      mockQuery.mockResolvedValue({ rows: [] });

      await db.registerUser(id, email, role, username);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO public.user'),
        [id, email, role, username]
      );
    });
  });

  describe('recordInteraction', () => {
    it('should record user interaction', async () => {
      const userId = 'user-123';
      const articleId = 456;
      const interactionType = 'click';

      mockQuery.mockResolvedValue({ rows: [] });

      await db.recordInteraction(userId, articleId, interactionType);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO public.user_interactions'),
        [userId, articleId, interactionType]
      );
    });
  });

  describe('fetchSimilarArticles', () => {
    it('should fetch similar articles with embeddings', async () => {
      const queryEmbedding = [0.1, 0.2, 0.3];
      const k = 5;
      const mockRows = [
        {
          id: 1,
          title: 'Similar Article',
          url: 'https://example.com',
          source: 'Test',
          region: 'US',
          published_date: '2024-01-01',
          top_image: 'https://example.com/image.jpg',
          cosine_similarity: 0.95,
        },
      ];

      mockQuery.mockResolvedValue({ rows: mockRows });

      const result = await db.fetchSimilarArticles(queryEmbedding, k);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: mockRows[0].id,
        similarity: mockRows[0].cosine_similarity,
      });
    });

    it('should return empty array if embedding is empty', async () => {
      const result = await db.fetchSimilarArticles([]);

      expect(result).toEqual([]);
    });
  });
});

