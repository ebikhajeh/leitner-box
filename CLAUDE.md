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
- **Auth**: Custom email/password with httpOnly session cookies
- **AI**: Anthropic Claude API (`claude-haiku-4-5`) — server-side only

### Frontend (`client/`)
- **UI**: React 19 + TypeScript
- **Routing**: React Router v7
- **Server state**: TanStack Query
- **Client state**: Zustand (auth session)
- **Styling**: Tailwind CSS + shadcn/ui
- **HTTP**: axios with `withCredentials: true`

## Key Conventions

- All API routes are prefixed with `/api`
- Authentication via `authenticate` middleware that reads session cookie
- Leitner rules live in `server/src/lib/leitner.ts` as pure functions
- AI calls only happen in `server/src/services/aiService.ts`
- Prisma client is a singleton in `server/src/lib/db.ts`

## Environment Variables (`server/.env`)

```
DATABASE_URL=
ANTHROPIC_API_KEY=
SESSION_SECRET=
```

## Documentation

Use **Context7** (`mcp__context7`) to fetch up-to-date documentation for any library in this project before implementing or modifying features. This applies to:

- React, React Router, TanStack Query, Zustand, shadcn/ui, Tailwind CSS, Vite, axios
- Express, Prisma, Bun, bcrypt
- Anthropic SDK

Example usage: resolve the library ID first with `mcp__context7__resolve-library-id`, then fetch docs with `mcp__context7__query-docs`. Always prefer Context7 over relying on training data for API signatures, config options, or version-specific behavior.
