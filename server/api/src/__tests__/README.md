# Server API Unit Tests

This directory contains comprehensive unit tests for the CARS API server.

## Test Structure

- `setup.ts` - Test configuration and environment setup
- `mocks.ts` - Shared mock objects for testing
- `routes/` - Tests for API route handlers
  - `auth.test.ts` - Login and Register endpoints
  - `serve_news.test.ts` - GetNews endpoint
  - `article_redirect.test.ts` - ArticleRedirect endpoint
  - `find_similar.test.ts` - FindSimilar endpoint
  - `recommend.test.ts` - FakeRecommend endpoint
- `utils/` - Tests for utility modules
  - `crypt.test.ts` - Password hashing utilities
  - `db.test.ts` - Database operations
  - `inference.test.ts` - ML inference service

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

The tests cover:
- ✅ Authentication routes (login, register)
- ✅ News fetching routes
- ✅ Article redirect and interaction tracking
- ✅ Similar article finding
- ✅ Recommendation system
- ✅ Database utility functions
- ✅ Password hashing
- ✅ ML inference service (mocked)

## Mocking

Tests use Jest mocks to isolate units:
- Database operations are mocked
- Supabase client is mocked
- Inference service is mocked
- Express request/response objects are mocked

## Writing New Tests

When adding new routes or utilities:
1. Create test file in the appropriate directory (`routes/` or `utils/`)
2. Import necessary mocks from `mocks.ts`
3. Follow existing test patterns
4. Ensure all error cases are covered
5. Run tests before committing

