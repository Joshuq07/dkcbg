# MyApp — Next.js + Google Auth + Supabase

Multi-user web app with Google OAuth, deployable via GitHub → Vercel.

## Stack
| Layer       | Tool                     |
|-------------|--------------------------|
| Framework   | Next.js 14 (App Router)  |
| Auth        | NextAuth.js + Google     |
| Database    | Supabase (Postgres)      |
| Styling     | Tailwind CSS             |
| Hosting     | Vercel (GitHub-connected)|

---

## Local Setup

### 1. Clone & install
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
npm install
```

### 2. Create your env file
```bash
cp .env.example .env.local
```
Then fill in `.env.local` — see instructions inside that file.

### 3. Set up Google OAuth
1. Go to https://console.cloud.google.com
2. Create a project → APIs & Services → Credentials → OAuth 2.0 Client ID
3. Application type: **Web application**
4. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (local)
   - `https://your-app.vercel.app/api/auth/callback/google` (production)
5. Copy Client ID and Client Secret into `.env.local`

### 4. Set up Supabase
1. Create a free project at https://supabase.com
2. Go to SQL Editor → run the contents of `supabase-migration.sql`
3. Go to Settings → API → copy Project URL and anon key into `.env.local`

### 5. Run locally
```bash
npm run dev
# → http://localhost:3000
```

---

## GitHub → Vercel Deployment

### First time
1. Push this repo to GitHub
2. Go to https://vercel.com/new → Import your GitHub repo
3. Vercel auto-detects Next.js — no build config needed (`vercel.json` handles it)
4. Add all your `.env.local` variables in **Settings → Environment Variables**
5. Deploy!

### Every subsequent push
Push to `main` → Vercel automatically builds and deploys. That's it.

### Production env variables to set in Vercel
```
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXTAUTH_SECRET        ← same value as local
NEXTAUTH_URL           ← your Vercel URL, e.g. https://myapp.vercel.app
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## Adding Pages

### Plain HTML-style page (no interactivity needed)
Create `src/app/your-page/page.tsx` — write regular JSX markup, no hooks.
It gets a URL at `/your-page` automatically.

### Interactive React page
Add `'use client'` at the top and use hooks freely.

### Mixing both
Import client components into a static page (see `src/app/features/page.tsx` for an example).

---

## Project Structure
```
src/
  app/
    api/auth/[...nextauth]/route.ts  ← Google OAuth handler
    page.tsx                          ← Home / login page
    dashboard/page.tsx                ← Protected dashboard (React)
    about/page.tsx                    ← Static HTML-style page
    features/page.tsx                 ← Mixed: HTML + React component
    layout.tsx                        ← Root layout (shared Navbar)
    providers.tsx                     ← SessionProvider wrapper
  components/
    Navbar.tsx                        ← Shared nav with auth state
    SignInButton.tsx                  ← Reusable sign-in button
  lib/
    supabase.ts                       ← Supabase client
    useAuth.ts                        ← Auth hook for React components
```
