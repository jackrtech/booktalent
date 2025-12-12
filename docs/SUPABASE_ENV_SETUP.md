# Supabase Environment Variables Setup

## Required Environment Variables

Add these to your Vercel project (and GitHub Secrets if using GitHub Actions):

### 1. SUPABASE_URL
- **Where to find:** Supabase Dashboard → Settings → API
- **Format:** `https://your-project-ref.supabase.co`
- **Usage:** Public URL for Supabase API

### 2. SUPABASE_ANON_KEY
- **Where to find:** Supabase Dashboard → Settings → API → Project API keys → `anon` `public`
- **Format:** Long string starting with `eyJ...`
- **Usage:** Public anonymous key (safe for client-side)

### 3. SUPABASE_SERVICE_ROLE_KEY (NEW - Required for Signup)
- **Where to find:** Supabase Dashboard → Settings → API → Project API keys → `service_role` `secret`
- **Format:** Long string starting with `eyJ...`
- **Usage:** Admin key that bypasses RLS (server-side only, NEVER expose to client)
- **Why needed:** To create profiles during signup (bypasses RLS policies)

### 4. NEXT_PUBLIC_SITE_URL
- **Value:** Your production/staging URL
- **Example:** `https://your-app.vercel.app`
- **Usage:** Email confirmation redirects

## Adding to Vercel

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add each variable above
4. Select environments: Production, Preview, Development
5. Click "Save"

## Adding to GitHub Secrets (for Actions)

1. GitHub repo → Settings → Secrets and variables → Actions
2. Add:
   - `SUPABASE_SERVICE_ROLE_KEY` (for migrations)
   - Others already added

## Security Notes

- **NEVER commit `SUPABASE_SERVICE_ROLE_KEY` to code**
- **NEVER expose it to the client**
- Only use in server actions and API routes
- It has full admin access to your database
