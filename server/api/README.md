# CARS API Server

Express.js API server for the CARS (Curated Automated Recommendation System) application.

## Environment Variables

Create a `.env` file in this directory with the following variables:

```env
JWT_SECRET=your_jwt_secret_key_here
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CLIENT_URL=http://localhost:5173
PORT=3000
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`

3. Build the project:
```bash
npm run build
```

4. Run the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /login` - Login with email/password
- `POST /register` - Register new user with email/password

### News
- `GET /news` - Get top K news articles
- `POST /article-redirect` - Get article URL and track clicks
- `GET /recommend` - Get personalized recommendations
- `GET /find-similar-article/:id` - Find similar articles

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Supabase Setup

This application uses Supabase for user authentication. You'll need to:

1. Create a Supabase project at https://supabase.com
2. Get your project URL and service role key
3. Add them to your `.env` file

The service role key is needed for server-side operations.

## Email Confirmation

When users register, they will receive an email confirmation link. The redirect URL is configured via the `CLIENT_URL` environment variable. 

Make sure to add the following URL to your Supabase project's allowed redirect URLs:
- Development: `http://localhost:5173/auth/email-confirmation`
- Production: `https://yourdomain.com/auth/email-confirmation`

This can be configured in Supabase Dashboard → Authentication → URL Configuration.

