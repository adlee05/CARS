# CARS - Curated Automated Recommendation System

An intelligent AI-powered news aggregator and recommendation platform that delivers personalized news from multiple global sources.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

CARS (Curated Automated Recommendation System) is a full-stack news aggregation and recommendation platform that combines web scraping, natural language processing, and machine learning to deliver personalized news experiences. The system aggregates news from diverse global sources across multiple categories and regions, then uses AI to recommend articles tailored to individual user preferences.

### What Makes CARS Different?

- **AI-Powered Recommendations**: Uses deep learning models (ONNX) to understand user preferences and recommend relevant articles
- **Multi-Region Support**: Covers 10+ global regions including US, EU, India, Asia, Africa, Latin America, and Middle East
- **Category Diversity**: Aggregates news across Technology, Science, Sports, Entertainment, Arts, and more
- **Smart Content Processing**: Extracts and cleans article content using NLP techniques
- **User Engagement Tracking**: Learns from user interactions to improve recommendations over time

## ✨ Features

### Core Features
- 🤖 **AI-Powered Recommendations** - Machine learning models analyze reading patterns and suggest personalized content
- 🌍 **Multi-Region News Aggregation** - Fetch news from 10+ regions worldwide
- 📰 **Category-Based Browsing** - Filter by Technology, Science, Sports, Entertainment, Arts, and more
- 🔍 **Similar Article Discovery** - Find related articles using content similarity algorithms
- 🔖 **Bookmarking System** - Save articles for later reading
- 👤 **User Authentication** - Secure login with email verification via Supabase
- 📱 **Responsive Design** - Modern UI built with React and TailwindCSS
- 🌙 **Theme Support** - Light and dark mode options

### Technical Features
- RSS feed aggregation from major news sources (BBC, The Guardian, Times of India, Wired, etc.)
- Content extraction and cleaning using newspaper3k
- ONNX-based neural network inference for recommendations
- PostgreSQL database for article storage and user data
- RESTful API architecture
- Comprehensive test coverage (Vitest, Jest)

## 🏗 Architecture

CARS follows a three-tier architecture:

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (React)                    │
│  - Vite + TypeScript + React Router                 │
│  - TailwindCSS + Radix UI Components                │
│  - Supabase Auth Integration                        │
└────────────────┬────────────────────────────────────┘
                 │
                 │ HTTP/REST API
                 │
┌────────────────▼────────────────────────────────────┐
│              SERVER - API (Express)                  │
│  - JWT Authentication                                │
│  - ONNX ML Inference Engine                         │
│  - PostgreSQL Database Interface                    │
│  - Article Recommendation Logic                     │
└────────────────┬────────────────────────────────────┘
                 │
                 │ Database Queries
                 │
┌────────────────▼────────────────────────────────────┐
│          DATABASE (PostgreSQL/Supabase)              │
│  - Articles Table                                    │
│  - Users Table (via Supabase Auth)                  │
│  - Interactions/Bookmarks                           │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│          SERVER - SCRAPER (Python)                   │
│  - RSS Feed Parser (feedparser)                     │
│  - Article Extraction (newspaper3k)                 │
│  - Content Cleaning (BeautifulSoup, NLTK)          │
│  - Multi-region scraping                            │
└─────────────────────────────────────────────────────┘
```

### Component Overview

1. **Client (`/client`)** - React-based frontend
   - Modern SPA with React Router for navigation
   - Supabase client for authentication
   - API service layer for backend communication
   - Responsive UI with TailwindCSS

2. **Server - API (`/server/api`)** - Express.js backend
   - RESTful API endpoints
   - JWT-based authentication
   - ML inference using ONNX Runtime
   - PostgreSQL database operations

3. **Server - Scraper (`/server/scraper`)** - Python web scraper
   - Fetches articles from RSS feeds
   - Extracts full article content
   - Cleans and processes text
   - Outputs structured JSON

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Styling**: TailwindCSS 4.x
- **UI Components**: Radix UI (accessible primitives)
- **Animations**: GSAP
- **Authentication**: Supabase Auth
- **Testing**: Vitest + React Testing Library

### Backend - API
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5
- **Database**: PostgreSQL (via `pg` driver)
- **Authentication**: Supabase + JWT
- **ML Inference**: ONNX Runtime for Node.js
- **NLP**: Hugging Face Transformers
- **Testing**: Jest + Supertest

### Backend - Scraper
- **Language**: Python 3.x
- **RSS Parsing**: feedparser
- **Web Scraping**: newspaper3k, BeautifulSoup4
- **NLP**: NLTK
- **HTTP Requests**: requests library
- **Configuration**: PyYAML

### Database & Infrastructure
- **Database**: PostgreSQL
- **Authentication Provider**: Supabase
- **Containerization**: Docker (Dockerfile in API)

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **Python** >= 3.8
- **PostgreSQL** >= 14
- **npm** or **yarn**
- **Supabase Account** (for authentication)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/adlee05/CARS.git
cd CARS
```

#### 2. Set Up the Frontend (Client)
```bash
cd client
npm install
```

#### 3. Set Up the Backend API
```bash
cd ../server/api
npm install
```

#### 4. Set Up the Scraper
```bash
cd ../scraper
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### 5. Download NLTK Data (for scraper)
```bash
python -c "import nltk; nltk.download('punkt')"
```

### Configuration

#### Client Configuration (`/client/.env`)
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:3000
```

#### API Server Configuration (`/server/api/.env`)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cars

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Server
PORT=3000
CLIENT_URL=http://localhost:5173
```

#### Scraper Configuration (`/server/scraper/.env`)
No environment variables required. Configure RSS feeds in `config.yaml`.

#### Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Get your project URL and keys from Settings → API
3. Configure redirect URLs in Authentication → URL Configuration:
   - Development: `http://localhost:5173/auth/email-confirmation`
   - Production: `https://yourdomain.com/auth/email-confirmation`

#### Database Setup

Run migrations to create required tables:
```sql
-- Articles table
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  source TEXT,
  region TEXT,
  top_image TEXT,
  published_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User interactions/bookmarks
CREATE TABLE bookmarks (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  article_id INTEGER REFERENCES articles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- Indexes for performance
CREATE INDEX idx_articles_region ON articles(region);
CREATE INDEX idx_articles_published ON articles(published_date);
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
```

## 📖 Usage

### Running the Application

#### 1. Start the Scraper (First Time)
```bash
cd server/scraper
source venv/bin/activate
python src/scraper.py
```
This will fetch and process articles, saving them to `articles.json`.

#### 2. Start the API Server
```bash
cd server/api
npm run dev  # Development mode with auto-reload
# OR
npm run build && npm start  # Production mode
```
API will run on `http://localhost:3000`

#### 3. Start the Frontend
```bash
cd client
npm run dev
```
Frontend will run on `http://localhost:5173`

#### 4. Access the Application
Open your browser to `http://localhost:5173`

### User Workflow

1. **Register** - Create an account with email/password
2. **Email Verification** - Check email and click confirmation link
3. **Browse News** - View articles from different regions and categories
4. **Get Recommendations** - AI suggests articles based on your reading history
5. **Bookmark Articles** - Save interesting articles for later
6. **Find Similar** - Discover related content

## 📁 Project Structure

```
CARS/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── homepage/    # Main feed page
│   │   │   ├── article/     # Article detail page
│   │   │   ├── profile/     # User profile
│   │   │   └── ui/          # Reusable UI components
│   │   ├── layouts/         # Layout components
│   │   ├── services/        # API service layer
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript type definitions
│   │   └── __tests__/       # Frontend tests
│   ├── public/              # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   ├── TESTING.md          # Frontend testing guide
│   └── EMAIL_CONFIRMATION.md
│
├── server/
│   ├── api/                 # Express.js API server
│   │   ├── src/
│   │   │   ├── routes/     # API route handlers
│   │   │   │   ├── auth.ts              # Login/Register
│   │   │   │   ├── serve_news.ts        # News feed
│   │   │   │   ├── news4u.ts            # Recommendations
│   │   │   │   ├── find_similar.ts      # Similar articles
│   │   │   │   ├── article_redirect.ts  # Click tracking
│   │   │   │   ├── get_article.ts       # Article details
│   │   │   │   └── bookmarks.ts         # Bookmark CRUD
│   │   │   ├── utils/      # Utilities
│   │   │   │   ├── db.ts                # Database operations
│   │   │   │   ├── inference.ts         # ML inference service
│   │   │   │   ├── crypt.ts             # Password hashing
│   │   │   │   └── supabase.ts          # Supabase client
│   │   │   ├── models/     # ONNX ML models
│   │   │   ├── types/      # TypeScript types
│   │   │   └── __tests__/  # Backend tests
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── Dockerfile
│   │   └── README.md
│   │
│   └── scraper/             # Python news scraper
│       ├── src/
│       │   ├── scraper.py           # Main scraper logic
│       │   ├── article_processor.py # Content extraction
│       │   └── utils.py             # Helper functions
│       ├── config.yaml      # RSS feed configuration
│       ├── requirements.txt
│       └── README.txt
│
├── LICENSE                  # MIT License
└── README.md               # This file
```

## 📡 API Documentation

### Base URL
```
Development: http://localhost:3000
Production: https://your-api-domain.com
```

### Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### Authentication
- **POST** `/register` - Register new user
  - Body: `{ email, password, name }`
  - Returns: Success message

- **POST** `/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ token, user }`

#### News
- **GET** `/news?region=GLOBAL&limit=20` - Get news articles
  - Query params: `region` (optional), `limit` (optional, default: 20)
  - Returns: Array of articles

- **GET** `/news4u?limit=20` - Get personalized recommendations
  - Query params: `limit` (optional, default: 20)
  - Requires: Authentication
  - Returns: Array of recommended articles

- **GET** `/article/:id` - Get single article details
  - Params: `id` (article ID)
  - Returns: Article object

- **GET** `/find-similar-article/:id` - Find similar articles
  - Params: `id` (article ID)
  - Returns: Array of similar articles

- **POST** `/article-redirect` - Track click and get article URL
  - Body: `{ articleId }`
  - Returns: `{ url }`

#### Bookmarks
- **GET** `/bookmarks` - Get user's bookmarks
  - Requires: Authentication
  - Returns: Array of bookmarked articles

- **POST** `/bookmarks` - Add bookmark
  - Body: `{ articleId }`
  - Requires: Authentication
  - Returns: Success message

- **DELETE** `/bookmarks/:id` - Remove bookmark
  - Params: `id` (article ID)
  - Requires: Authentication
  - Returns: Success message

## 🧪 Testing

### Frontend Tests
```bash
cd client

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui
```

See [client/TESTING.md](client/TESTING.md) for detailed testing documentation.

### Backend Tests
```bash
cd server/api

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

See [server/api/src/__tests__/README.md](server/api/src/__tests__/README.md) for test documentation.

## 🔧 Development

### Running in Development Mode

#### With Auto-Reload
```bash
# Terminal 1 - API Server
cd server/api
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev

# Terminal 3 - Scraper (when needed)
cd server/scraper
source venv/bin/activate
python src/scraper.py
```

### Code Style and Linting

#### Frontend
```bash
cd client
npm run lint  # Check for issues
```

#### Backend
```bash
cd server/api
npm run lint  # If configured
```

### Building for Production

#### Frontend
```bash
cd client
npm run build
# Output in dist/
```

#### Backend
```bash
cd server/api
npm run build
# Output in dist/
npm run serve
```

### Docker Deployment (API)
```bash
cd server/api
docker build -t cars-api .
docker run -p 3000:3000 --env-file .env cars-api
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation
4. **Run tests**
   ```bash
   npm test  # Both client and server
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Write clear commit messages
- Add tests for new features
- Update README if needed
- Follow TypeScript/Python best practices
- Ensure all tests pass before submitting PR
- Keep changes focused and atomic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Vaddi Rahul

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Authentication and database hosting
- [Hugging Face](https://huggingface.co) - Transformers library for NLP
- [ONNX Runtime](https://onnxruntime.ai) - ML model inference
- [newspaper3k](https://newspaper.readthedocs.io) - Article extraction
- RSS feed providers: BBC, The Guardian, Times of India, Wired, and more

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check existing documentation in `/client` and `/server/api` directories

---

**Built with ❤️ using React, Express, and Python**
