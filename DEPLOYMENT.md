# FlashDev Tech Academy deployment

## Supabase
Use the dedicated FlashDev Tech Academy Supabase project. The production schema has already been provisioned. The migration in supabase/migrations/0001_initial.sql documents the schema for reproducible environments.

## Vercel environment variables
Set these in Project Settings → Environment Variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (server-side only)
- NEXT_PUBLIC_APP_URL
- ADMIN_EMAILS
- PISTON_URL (optional)

Never expose SUPABASE_SERVICE_ROLE_KEY to client code or commit it to GitHub.

## Build
Vercel detects Next.js automatically. Use npm install and next build.
