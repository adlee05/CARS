# Email Confirmation Setup

This document describes how email confirmation works in the CARS application.

## Overview

The application uses Supabase authentication with email confirmation. When users register, they receive an email with a confirmation link that verifies their email address.

## Flow

1. **User Registration**: User fills out the registration form with email and password
2. **Email Sent**: Supabase sends a confirmation email to the user's email address
3. **User Clicks Link**: User clicks the confirmation link in their email
4. **Redirect**: User is redirected to `/auth/email-confirmation` with verification tokens
5. **Verification**: The application verifies the email using Supabase's verification API
6. **Auto-Login**: If successful, the user is automatically logged in and redirected to the home page

## Environment Variables Required

### Client (.env)
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:3000
```

### Server (.env)
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
PORT=3000
```

## Supabase Configuration

In your Supabase project settings, set the redirect URL to:
```
http://localhost:5173/auth/email-confirmation
```

For production:
```
https://yourdomain.com/auth/email-confirmation
```

## Files

- `client/src/components/auth/EmailConfirmation.tsx` - Handles the email confirmation flow
- `client/src/utils/supabase.ts` - Supabase client configuration
- `server/api/src/index.ts` - Registration endpoint that includes email confirmation
- `client/src/components/login/tabs.tsx` - Updated to show success message when email confirmation is required

## Testing

1. Register a new user
2. Check the email inbox for the confirmation email
3. Click the confirmation link
4. You should be automatically logged in and redirected to the home page

## Troubleshooting

- **Email not received**: Check Supabase project settings and ensure email is enabled
- **Redirect not working**: Verify the redirect URL in Supabase settings matches your application
- **Verification fails**: Check browser console and Supabase logs for error messages

