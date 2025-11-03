import { Request, Response } from 'express';
import GetNews from '../../routes/serve_news';
import { mockRequest, mockResponse, mockDatabase } from '../mocks';

describe('GetNews Route', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = mockRequest({ db: mockDatabase });
    res = mockResponse();
    jest.clearAllMocks();
  });

  it('should return articles successfully', async () => {
    const mockArticles = [
      {
        id: 1,
        title: 'Test Article',
        content: 'Test content',
        url: 'https://example.com',
        source: 'Test Source',
        region: 'US',
        published_date: '2024-01-01',
        image: 'https://example.com/image.jpg',
      },
    ];

    mockDatabase.fetchTopKArticles.mockResolvedValue(mockArticles);

    await GetNews(req as Request, res as Response);

    expect(mockDatabase.fetchTopKArticles).toHaveBeenCalledWith(15);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockArticles);
  });

  it('should return 404 if no articles found', async () => {
    mockDatabase.fetchTopKArticles.mockResolvedValue([]);

    await GetNews(req as Request, res as Response);

    expect(mockDatabase.fetchTopKArticles).toHaveBeenCalledWith(15);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: 'article database is empty' });
  });

  it('should handle database errors', async () => {
    const error = new Error('Database connection failed');
    mockDatabase.fetchTopKArticles.mockRejectedValue(error);

    await GetNews(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal server error',
      details: 'Database connection failed',
    });
  });

  it('should handle empty articles array', async () => {
    mockDatabase.fetchTopKArticles.mockResolvedValue([]);

    await GetNews(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: 'article database is empty' });
  });
});

