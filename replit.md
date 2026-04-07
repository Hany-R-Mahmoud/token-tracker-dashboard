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
- `src/lib/auth.ts` — RBAC auth: three roles (admin/analyst/viewer) with per-resource permissions table; canAccess(role, resource, permission?)
- `src/lib/filters.ts` — URL-encoded filter state, parse/serialize, sliceByTimeframe, filterSessions, filterProviders helpers
- `src/__tests__/` — Vitest test suite (36 tests): filters.test.ts + auth.test.ts; run with `pnpm test`

#### Data
- 6 providers, 8 models, 20 sessions, 12 team members, 30-day daily activity
- 12 semantic health states: healthy, mixed, warning, critical, fallback, degraded, unknown, unresolved, loading, error, empty, disconnected

---

### Token Tracker Mobile (`artifacts/token-tracker-mobile`)

- **Kind**: Expo (React Native) mobile app
- **Port**: 20501
- **Preview path**: `/mobile/`
- **Stack**: Expo Router, React Native, react-native-svg, expo-blur, Inter fonts, @tanstack/react-query
- **Design**: Always dark — same Token Tracker identity as web (#0b1326 bg, #a3ffd9 mint accent), Inter 400/500/600/700

#### Screens (3 tabs)
1. **Overview** (`/`) — Brand lockup header, system status hero band, KPI stats, trend sparkline (time-filter responsive), provider integrity lanes, cluster topology grid, investigation log, surface truth composition, context health bars, provider summary list, recent sessions (tap to open SessionDetailSheet)
2. **Analytics** (`/analytics`) — Period stats hero grid (time-filter responsive), token/session/success trend sparklines, value density ranking, provider efficiency, activity heatmap, outcome composition, model pressure, daily activity table
3. **Team** (`/team`) — Leaderboard header, summary band, top-3 podium, full member list with rank/status/tokens/success; taps open member detail sheet with stats, trend sparkline, session details

#### Architecture
- `src/screens/` — OverviewScreen, AnalyticsScreen, TeamScreen
- `src/components/shared/` — BrandLockup, BrandMark, HealthDot, StateChip, StatCard, SectionHeader, PageHeader, FilterPills, PanelCard, SessionDetailSheet
- `src/components/charts/` — MiniBar, TrendSparkline (react-native-svg), IntegrityLane, CompositionBar, RankedListBar
- `src/data/mock/` — providers.ts, sessions.ts, team.ts, analytics.ts
- `src/types/index.ts` — All TypeScript types
- `src/theme/index.ts` — Palette, semantic health state colors, typography, spacing, radii
- `src/lib/format.ts` — Token/cost/time/date formatters

#### Data
- 6 providers, 10 sessions, 12 team members, 30-day daily activity
- 12 semantic health states in semanticColors: healthy, mixed, warning, critical, fallback, degraded, unknown, unresolved, loading, error, empty, disconnected
