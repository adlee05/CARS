# CARS (Curatr)

CARS is a full-stack news platform that combines regional news aggregation with personalized recommendations.

## What’s in this repository

- **client/**: React + Vite frontend (TypeScript, Tailwind, Vitest)
- **server/api/**: Express + TypeScript API with Supabase auth and recommendation endpoints
- **server/scraper/**: Python RSS scraper for collecting and processing articles

## Core features

- Email/password auth via Supabase
- Email confirmation flow
- Personalized and region-based news feeds
- Article detail and redirect tracking
- Bookmark management
- Automated ingestion pipeline via RSS scraper

## Tech stack

- **Frontend**: React 19, Vite, TypeScript, React Router, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, PostgreSQL (`pg`), Supabase
- **ML/Recommendation**: ONNX Runtime + transformer-based embeddings
- **Scraper**: Python, `newspaper3k`, `feedparser`, `BeautifulSoup`

## Repository structure

```text
CARS/
├── client/
│   ├── src/
│   └── package.json
├── server/
│   ├── api/
│   │   ├── src/
│   │   └── package.json
│   └── scraper/
│       ├── src/
│       ├── config.yaml
│       └── requirements.txt
└── README.md
```

## Prerequisites

- Node.js 20+ and npm
- Python 3.10+ (for scraper)
- PostgreSQL database (used by API through `pg`)
- Supabase project (auth and bookmarks)

## Environment setup

Create these files manually (there is no checked-in `.env.example`):

### `client/.env`

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:3000
```

### `server/api/.env`

```env
JWT_SECRET=your_jwt_secret_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CLIENT_URL=http://localhost:5173
PORT=3000
```

> Also provide your PostgreSQL connection settings as environment variables accepted by `pg` (for example `DATABASE_URL` or `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT`).

## Local development

Install dependencies:

```bash
# Frontend
cd /home/runner/work/CARS/CARS/client
npm install

# API
cd /home/runner/work/CARS/CARS/server/api
npm install
```

Start the frontend:

```bash
cd /home/runner/work/CARS/CARS/client
npm run dev
```

Start the API:

```bash
cd /home/runner/work/CARS/CARS/server/api
npm run dev
```

Frontend runs on `http://localhost:5173` and API on `http://localhost:3000` by default.

## Scraper setup and run

```bash
cd /home/runner/work/CARS/CARS/server/scraper
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python src/scraper.py
```

Update `server/scraper/config.yaml` to customize region/category RSS sources.

## Key API routes

### Auth
- `POST /register`
- `POST /login`

### News and recommendations
- `GET /news` (general feed)
- `GET /news4u?region=<REGION>` (personalized/region-aware feed)
- `GET /article/:id`
- `GET /find-similar-article/:id`
- `POST /article-redirect`

### Bookmarks
- `GET /bookmarks`
- `POST /bookmarks`
- `DELETE /bookmarks/:id`

Most routes require an `Authorization` header with a Supabase access token.

## Testing

### Frontend (`client/`)

```bash
npm test
npm run test:coverage
```

### API (`server/api/`)

```bash
npm test
npm run test:coverage
```

## Additional docs

- `client/EMAIL_CONFIRMATION.md`
- `client/TESTING.md`
- `server/api/README.md`
- `server/scraper/README.txt`

## License

This project is licensed under the terms of the `LICENSE` file in this repository.
