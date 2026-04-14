# Leitner Box — Claude Code Guide

## Project Overview

Leitner Box is a language learning app based on spaced repetition (Leitner method). Users add flashcards, review them on a schedule, and practice writing sentences with AI feedback.

## Architecture

Monorepo with two separate apps:

```
client/   ← React 19 + TypeScript + Vite (SPA)
server/   ← Bun + Express (REST API)
```

Run both with `bun run dev` from the root.

- Client: `http://localhost:5173`
- Server: `http://localhost:3000`
- Client proxies `/api` → server (configured in `vite.config.ts`)

## Tech Stack

### Backend (`server/`)
- **Runtime**: Bun (with `--hot` for dev)
- **Framework**: Express 5
- **Database**: PostgreSQL via Supabase + Prisma ORM
- **Auth**: Better Auth (`better-auth`) with Prisma adapter and email/password
- **AI**: Anthropic Claude API (`claude-haiku-4-5`) — server-side only

### Frontend (`client/`)
- **UI**: React 19 + TypeScript
- **Routing**: React Router v7
- **Server state**: TanStack Query
- **Client state**: Zustand (auth session)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` plugin) + shadcn/ui (default theme)
- **HTTP**: axios with `withCredentials: true`

## Frontend Conventions

- Use **axios** for all HTTP requests — no `fetch()`. Configure with `withCredentials: true` globally
- **Zustand** is used only for auth/session state — all other server state goes through TanStack Query
- Session is restored on app load by calling `GET /api/auth/get-session`

## Styling Conventions

- Tailwind v4 — configured via `@tailwindcss/vite` plugin in `vite.config.ts`, no `tailwind.config.*` file
- shadcn/ui — initialized with default theme; components live in `src/components/ui/`
- Path alias `@/` maps to `src/` (configured in `tsconfig.app.json` and `vite.config.ts`)
- Theme CSS variables (oklch) and base styles are in `src/index.css`
- No custom CSS — use Tailwind utility classes and shadcn components only
- Use `aria-invalid={!!error}` on `<Input>` to trigger the built-in red-border error state

## Form Conventions

- Use `react-hook-form` with `zod` for all forms (`@hookform/resolvers/zod`)
- Define the schema with `z.object(...)` above the component
- Derive the form type with `z.infer<typeof schema>`
- Pass `aria-invalid={!!errors.field}` to `<Input>` to show the red-border error state

## Key Conventions

- All API routes are prefixed with `/api`
- Authentication via `authenticate` middleware that reads session cookie
- Leitner rules live in `server/src/lib/leitner.ts` as pure functions
- AI calls only happen in `server/src/services/aiService.ts`
- Prisma client is a singleton in `server/src/lib/db.ts`

## Authentication

Auth is handled by **Better Auth** (`better-auth`) on the server — not a custom implementation.

### How it works
- Better Auth is configured in `server/src/lib/auth.ts` with the Prisma adapter and `emailAndPassword` enabled
- All `/api/auth/*` requests are handled by Better Auth's node handler, mounted **before** `express.json()` in `index.ts`
- Sessions are stored in the database (via Prisma) and identified by a cookie Better Auth manages automatically
- The `authenticate` middleware (`server/src/middleware/authenticate.ts`) calls `auth.api.getSession()` and attaches `req.user` and `req.session` to the request — use this on any protected route
- `req.user` and `req.session` types are declared globally in `server/src/types/express.d.ts`

### Client-side
- Use axios with `withCredentials: true` — never `fetch()` — so the session cookie is sent on every request
- Auth endpoints are standard Better Auth routes under `/api/auth/` (e.g. `/api/auth/sign-in/email`, `/api/auth/sign-out`)
- On app load, call `GET /api/auth/get-session` to restore the session; store the result in Zustand

### Environment Variables (`server/.env`)

```
DATABASE_URL=
ANTHROPIC_API_KEY=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173
```

## Documentation

Use **Context7** (`mcp__context7`) to fetch up-to-date documentation for any library in this project before implementing or modifying features. This applies to:

- React, React Router, TanStack Query, Zustand, shadcn/ui, Tailwind CSS, Vite, axios
- Express, Prisma, Bun, bcrypt
- Anthropic SDK

Example usage: resolve the library ID first with `mcp__context7__resolve-library-id`, then fetch docs with `mcp__context7__query-docs`. Always prefer Context7 over relying on training data for API signatures, config options, or version-specific behavior.
