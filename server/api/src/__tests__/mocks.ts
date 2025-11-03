import Database from '../utils/db';
import { Client } from 'pg';

export const mockSupabase = {
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    getUser: jest.fn(),
  },
};

// Create a mock Client
const mockClient = {
  query: jest.fn().mockResolvedValue({ rows: [] }),
  connect: jest.fn(),
  end: jest.fn(),
} as unknown as Client;

// Create properly typed mock database with Jest mock functions
// Using a type that preserves both Database interface and Jest mock capabilities
export const mockDatabase = {
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn().mockResolvedValue(undefined),
  fetchArticle: jest.fn(),
  fetchTopKArticles: jest.fn(),
  fetchSimilarArticles: jest.fn(),
  getArticleEmbedding: jest.fn(),
  getArticleEmbeddings: jest.fn(),
  getClickedArticleEmbeddings: jest.fn(),
  getLastClickedArticleEmbedding: jest.fn(),
  getClickedArticleIds: jest.fn(),
  registerUser: jest.fn(),
  recordInteraction: jest.fn(),
  getUserPasswordHash: jest.fn(),
  resetSchema: jest.fn(),
  client: mockClient,
} as Database & {
  connect: jest.MockedFunction<() => Promise<void>>;
  disconnect: jest.MockedFunction<() => Promise<void>>;
  fetchArticle: jest.MockedFunction<(articleId: number) => Promise<any>>;
  fetchTopKArticles: jest.MockedFunction<(k: number) => Promise<any[]>>;
  fetchSimilarArticles: jest.MockedFunction<(queryEmbedding: number[], k?: number) => Promise<any[]>>;
  getArticleEmbedding: jest.MockedFunction<(articleId: number) => Promise<number[] | null>>;
  getArticleEmbeddings: jest.MockedFunction<(articleIds: number[]) => Promise<Map<number, number[]>>>;
  getClickedArticleEmbeddings: jest.MockedFunction<(userId: string) => Promise<Map<number, number[]>>>;
  getLastClickedArticleEmbedding: jest.MockedFunction<(userId: string) => Promise<number[] | null>>;
  getClickedArticleIds: jest.MockedFunction<(userId: string) => Promise<number[]>>;
  registerUser: jest.MockedFunction<(id: string, email: string, role: string, username: string) => Promise<void>>;
  recordInteraction: jest.MockedFunction<(userId: string, articleId: number, interactionType: string) => Promise<void>>;
  getUserPasswordHash: jest.MockedFunction<(userId: string) => Promise<string | null>>;
  resetSchema: jest.MockedFunction<(schema_sql: string) => Promise<void>>;
};

export const mockInferenceService = {
  initialize: jest.fn().mockResolvedValue(undefined),
  inferNews: jest.fn(),
  inferUser: jest.fn(),
  newsEncoder: {} as any,
  userEncoder: {} as any,
} as any;


export const mockRequest = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  user: { id: 'test-user-id', aud: 'authenticated' },
  db: mockDatabase,
  service: mockInferenceService,
  header: jest.fn(),
  ...overrides,
});

export const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
};

export const mockNext = jest.fn();
