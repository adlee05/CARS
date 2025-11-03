import { Request, Response } from 'express';
import FindSimilar from '../../routes/find_similar';
import { mockRequest, mockResponse, mockDatabase } from '../mocks';

describe('FindSimilar Route', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = mockRequest({ db: mockDatabase });
    res = mockResponse();
    jest.clearAllMocks();
  });

  it('should find similar articles successfully', async () => {
    const articleId = 123;
    req.params = { id: articleId.toString() };
    const mockEmbedding = [0.1, 0.2, 0.3];
    const mockSimilarArticles = [
      {
        id: 124,
        title: 'Similar Article',
        url: 'https://example.com/similar',
        similarity: 0.95,
      },
    ];

    mockDatabase.getArticleEmbedding.mockResolvedValue(mockEmbedding);
    mockDatabase.fetchSimilarArticles.mockResolvedValue(mockSimilarArticles);

    await FindSimilar(req as Request, res as Response);

    expect(mockDatabase.getArticleEmbedding).toHaveBeenCalledWith(articleId);
    expect(mockDatabase.fetchSimilarArticles).toHaveBeenCalledWith(
      mockEmbedding
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockSimilarArticles);
  });

  it('should return 400 if id is missing', async () => {
    req.params = {};

    await FindSimilar(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      'Bad Request: ID should be a valid number'
    );
  });

  it('should return 404 if article not found', async () => {
    req.params = { id: '999' };
    mockDatabase.getArticleEmbedding.mockResolvedValue(null);

    await FindSimilar(req as Request, res as Response);

    expect(mockDatabase.getArticleEmbedding).toHaveBeenCalledWith(999);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'article with id 999 could not be found.',
    });
  });

  it('should handle database errors', async () => {
    req.params = { id: '123' };
    const error = new Error('Database error');
    mockDatabase.getArticleEmbedding.mockRejectedValue(error);

    await FindSimilar(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal server error',
      details: 'Database error',
    });
  });
});

