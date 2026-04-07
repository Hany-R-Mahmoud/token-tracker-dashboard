# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Token Tracker Web Dashboard (`artifacts/token-tracker-web`)

- **Kind**: React + Vite web app
- **Port**: 25045
- **Preview path**: `/`
- **Stack**: React, Vite, Wouter (routing), Recharts (charts), TanStack Query, Radix UI primitives
- **Design**: Always dark — mint-on-ink palette (#0b1326 bg, #a3ffd9 mint accent), Space Grotesk (headings), Manrope (body), JetBrains Mono (metrics)

#### Pages
1. **Overview** (`/`) — Hero stats, trend charts, provider integrity lanes, heatmap, investigation log, surface truth band, recent sessions table
2. **Analytics** (`/analytics`) — Current vs prior period comparison, 8 chart panels, model breakdown table, daily activity table
3. **Team** (`/team`) — Leaderboard with podium visualization, member sparklines, detail sheet
4. **Sessions** (`/sessions`) — Full session log, outcome composition bar, search/filter, session detail sheet with explanation factors
5. **Admin** (`/admin`) — System health, provider config, ingestion status, team management, audit log
6. **Settings** (`/settings`) — Account info, dashboard defaults, display/notification preferences, system config, danger zone

#### Architecture
- `src/features/` — Page components by feature (overview, analytics, team, sessions, admin, settings)
- `src/components/shared/` — AppShell, Sidebar, BrandMark, StateChip, HealthDot, SectionHeader, StatCard, FilterBar
- `src/components/charts/` — MiniBar, TrendLine, IntegrityLane, CompositionBar, HeatmapGrid, RankedBar, SparkLine
- `src/data/mock/` — providers.ts, models.ts, sessions.ts, team.ts, analytics.ts, admin.ts
- `src/types/index.ts` — All TypeScript types (HealthState, SessionStatus, Provider, Model, Session, TeamMember, etc.)
- `src/lib/auth.ts` — v1 single-admin auth scaffold (admin@tokentracker.io), RBAC extension path
- `src/lib/filters.ts` — URL-encoded filter state with shareable links

#### Data
- 6 providers, 8 models, 20 sessions, 12 team members, 30-day daily activity
- 9 semantic health states: healthy, mixed, warning, critical, fallback, degraded, unknown, unresolved, disconnected
