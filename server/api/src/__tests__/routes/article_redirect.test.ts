import { Request, Response } from 'express';
import ArticleRedirect from '../../routes/article_redirect';
import { mockRequest, mockResponse, mockDatabase } from '../mocks';

describe('ArticleRedirect Route', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = mockRequest({
      db: mockDatabase,
      user: { id: 'test-user-id', aud: 'authenticated' },
    });
    res = mockResponse();
    jest.clearAllMocks();
  });

  it('should redirect successfully and record interaction', async () => {
    const articleId = 123;
    const mockArticle = {
      id: articleId,
      title: 'Test Article',
      url: 'https://example.com/article',
    };

    req.body = { article_id: articleId.toString() };
    (mockDatabase.fetchArticle as jest.Mock).mockResolvedValue(mockArticle);
    (mockDatabase.recordInteraction as jest.Mock).mockResolvedValue(undefined);

    await ArticleRedirect(req as Request, res as Response);

    expect(mockDatabase.fetchArticle).toHaveBeenCalledWith(articleId);
    expect(mockDatabase.recordInteraction).toHaveBeenCalledWith(
      'test-user-id',
      articleId,
      'click'
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ url: mockArticle.url });
  });

  it('should return 400 if article_id is missing', async () => {
    req.body = {};

    await ArticleRedirect(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Valid article_id is required',
    });
  });

  it('should return 400 if article_id is not a valid number', async () => {
    req.body = { article_id: 'invalid' };

    await ArticleRedirect(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Valid article_id is required',
    });
  });

  it('should return 404 if article not found', async () => {
    req.body = { article_id: '999' };
    (mockDatabase.fetchArticle as jest.Mock).mockResolvedValue(null);

    await ArticleRedirect(req as Request, res as Response);

    expect(mockDatabase.fetchArticle).toHaveBeenCalledWith(999);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Article not found' });
  });

  it('should handle database errors', async () => {
    req.body = { article_id: '123' };
    const error = new Error('Database error');
    (mockDatabase.fetchArticle as jest.Mock).mockRejectedValue(error);

    await ArticleRedirect(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal server error',
      details: 'Database error',
    });
  });
});

