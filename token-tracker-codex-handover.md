# Token Tracker — Codex Handover Response
**Date:** 2026-04-07  
**Scope:** Explicit answers to all 10 follow-up questions for Codex review

---

## 1. Product Parity Audit

### Web Dashboard

**Fully implemented:**
- Overview: KPI stat cards (spend, tokens, sessions, success rate, latency), 14-day TrendLine, Provider Integrity lanes, Activity Heatmap (24×7), Surface Truth CompositionBar, Context Health CompositionBar, "Needs Attention" session band, full session log table with row-level StatusChip
- Analytics: Period comparison KPIs (7d vs prior 7d with computed deltas), multi-line TrendLine, Outcome Distribution, Surface Truth Distribution, Provider Efficiency lanes, Activity Heatmap, Model rankings (RankedBar), Model breakdown table, MatrixComparison scatter chart
- Team: Leaderboard table with gold/silver/bronze rank badges, sparkline trend per member, status chips, disconnected state; member detail sheet with full stats + explanation factors
- Sessions: TanStack React Table with column sorting, global text filter, status dropdown filter, CompositionBar outcome summary, session detail Sheet with 6 core metrics + context health + surface truth + explanation factors
- Admin: System Health panel, Ingestion Records table, Audit Log, Team Management, Provider Configuration (role-gated via ProtectedRoute)
- Settings: Profile, notifications, display prefs, API key management (role-gated)
- FilterBar: renders, persists state to URL query params, supports provider/model/team/status/timeframe

**Visually present but not functionally wired:**
- FilterBar: state is in URL but zero page components call `useFilters()` to read it. Not one chart or table is filtered. "Share View" copies the correct URL but the data is identical regardless of what you select.
- Admin: provider config toggles, API key actions, team role changes — no state persistence
- Settings: all toggle switches and inputs — no persistence (not even localStorage)
- ProtectedRoute: renders the AdminPage and SettingsPage unconditionally — `canAccess()` always returns `true`
- Session detail in Overview: click handler sets state but no Sheet is mounted — nothing visible happens on click

**Missing compared to Token Tracker source:**
- Asset Volatility section (exists only on mobile)
- Success Analysis / explanation factors section (exists only on mobile)
- Real auth / login flow
- Real API data
- Date range filter applied to charts
- Session export (CSV/JSON)
- Pagination on sessions and team tables

**Exists in mobile but not web:**
- Asset Volatility section (per-model volatility score, risk level chip, track bar)
- Success Analysis section (summary stats row + explanation factors with directional bars)
- `mockAssetVolatility` and `mockSuccessFactors` data (mobile only in `metrics.ts`)

**Exists in web but not mobile:**
- Sessions log page (full table with sorting, filtering, detail sheet)
- Admin page (system health, ingestion records, audit log, provider config)
- Settings page
- MatrixComparison scatter chart
- `FilterBar` global filter mechanism
- JetBrains Mono font (web only)

---

### Parity Verdicts

| Feature | Verdict | Notes |
|---------|---------|-------|
| Overview | `partial parity` | Web has all sections; filter does nothing; mobile has richer hero band and session feed but no detail tap |
| Analytics | `partial parity` | Mobile has Asset Volatility + Success Analysis that web lacks; both have chart content but no filter wiring |
| Team / Leaderboard | `partial parity` | Web has sortable table + detail sheet; mobile has search but no sort; both have rank/avatar/stats; same data |
| Sessions / detail | `partial parity` | Web: full table with sorting + detail sheet (populated). Mobile: no sessions screen at all |
| Sessions detail behavior | `visual only` (mobile) / `partial parity` (web) | Web Sheet is populated; overview page click is broken; mobile has no session screen |
| Admin | `missing` (mobile) | Web has it, mobile does not and is not planned |
| Settings | `missing` (mobile) | Web has it; mobile has no settings screen |

---

## 2. Time Filter Reality Check

### Web
The `FilterBar` stores filter state in URL query params via `wouter`'s `setLocation()`. Changing any dropdown updates the URL (e.g. `/?timeframe=30d&providers=OpenAI`). The `useFilters()` hook parses the URL into a `FilterState` object.

**Does it actually slice data?** No. Not a single page component calls `useFilters()`. `OverviewPage`, `AnalyticsPage`, `TeamPage`, and `AdminPage` import and render their data directly from `mockProviders`, `mockSessions`, `mockDailyActivity` etc. with hardcoded slices.

The only page with real filtering is `SessionsPage` — but that uses its own local `useState` for text search and status, not `useFilters()`.

**Which components receive `filters` state?** Only `FilterBar` itself — it reads and writes to `useFilters()`. No downstream consumer exists.

**Which components ignore it?** All six feature pages ignore it entirely.

**What needs to change to make it real:**
1. Each page calls `const { filters } = useFilters()` at the top
2. `mockDailyActivity` slices need a helper: `filterByTimeframe(data, filters.timeframe)` that maps `'7d'→slice(-7)`, `'30d'→slice(-30)` etc.
3. Session data filtered: `mockSessions.filter(s => (!filters.providers.length || filters.providers.includes(s.provider)) && (!filters.status || s.status === filters.status))`
4. Provider data filtered similarly
5. All derived totals (totalSpend, totalTokens, etc.) recomputed from the filtered slice inside `useMemo`

**Estimated effort:** Medium — 1–2 days to wire all 4 pages correctly. The infrastructure (URL state, FilterState type, `useFilters` hook) is all already built; only the consumption side is missing.

### Mobile
Each screen has a `const [timeFilter, setTimeFilter] = useState('7d')` and `FilterPills` renders it visually. There is no downstream consumption. `last7`, `last14`, `prev7` are hardcoded slice lengths in `AnalyticsScreen` regardless of `timeFilter` value. No `useMemo` uses `timeFilter` as a dependency.

**Estimated effort:** Small — 1 day. Replace hardcoded slice lengths with a derived length from `timeFilter`, add `useMemo` for all derived values with `[timeFilter]` dependency.

---

## 3. Session Detail Gap

### Web — Sessions Page
**List view ready?** Yes. Full TanStack React Table with sorting on all columns, text filter, status filter dropdown, sticky headers.

**Detail data shape ready?** Yes. Each `Session` object in `mockSessions` includes: `id`, `timestamp`, `provider`, `model`, `tokens`, `cost`, `duration`, `status`, `successScore`, `contextHealth`, `surfaceTruth`, `explanationFactors[]`, `evidenceNotes`.

**Navigation/sheet missing?** No. `SessionDetailSheet` is mounted inside `SessionsPage` and opens on row click. It is fully implemented: status chip, 6 core metric tiles, Cognitive Resolution Status (context health + surface truth), Explanation Factors list.

**Detail panel blank?** No — the Sessions page detail is complete. The gap is in OverviewPage only: the 5-row "needs attention" list and the full session table both call `onSelect(session)` which calls `setSelectedSession(session)`, but `OverviewPage` never renders a `SessionDetailSheet`. The state is set, then goes nowhere.

**Shortest correct path:**
- Import and mount `SessionDetailSheet` in `OverviewPage` (2 lines, 1 day max)
- Alternatively: clicking a session row in Overview navigates to `/sessions` with the session ID pre-selected

### Web — Overview Session Rows
**Gap:** Broken click. `setSelectedSession` updates state but no Sheet is rendered. Fix: add `<SessionDetailSheet session={selectedSession} onClose={() => setSelectedSession(null)} />` at the bottom of `OverviewPage`. Data is ready. Navigation is ready. It's a missing mount, not a missing feature.

### Mobile
**List view ready?** Partial — a 10-item recent session feed exists in OverviewScreen (provider, model, tokens, cost, status chip, score). No dedicated sessions screen or sortable list.

**Detail data shape ready?** Mobile `mockSessions` has less data than web version (no `explanationFactors`, no `evidenceNotes`, no `duration` field in the mobile mock).

**Navigation/sheet missing?** Yes entirely. No `onPress` handlers exist on session rows in mobile. No bottom sheet for session detail is built.

**Shortest correct path:** 
1. Add `explanationFactors` and `duration` to mobile session mock to match web shape
2. Build a `SessionDetailSheet` using expo-blur (same pattern as `MemberDetailSheet` in TeamScreen — this is already implemented and can be copied)
3. Add `onPress` to session rows
Estimated: 1 day. The `MemberDetailSheet` is a direct template.

---

## 4. Analytics Parity Gap

### Why were Asset Volatility and Success Analysis omitted from web?

They were built on mobile during a late code-review iteration cycle. The web dashboard was completed first to a "passed" state, and these sections were only added to mobile during a third round of code-review rejections that specifically demanded them. The web was not reopened after.

### Is the data already present for web?

No. `metrics.ts` (which contains `mockAssetVolatility`, `mockSuccessFactors`, `mockSuccessAnalysisSummary`, `mockPeriodMetrics`) exists **only in the mobile artifact** at `artifacts/token-tracker-mobile/src/data/mock/metrics.ts`. The web `src/data/mock/` directory does not have this file.

### Are these easy to add using the existing web architecture?

Yes. The web already has:
- `CompositionBar`, `IntegrityLane`, `RankedBar` — all needed for the sections
- `StateChip` — for risk level labels
- The panel/card pattern used on AnalyticsPage matches exactly

### Files/components to add or change:

1. **New:** `artifacts/token-tracker-web/src/data/mock/metrics.ts` — copy from mobile, same shape
2. **Modify:** `artifacts/token-tracker-web/src/features/analytics/AnalyticsPage.tsx`
   - Import `mockAssetVolatility`, `mockSuccessFactors`, `mockSuccessAnalysisSummary`
   - Add "Asset Volatility" panel section (after Outcome Distribution)
   - Add "Success Analysis" panel section (after Asset Volatility)
3. No new components needed — existing primitives suffice

Estimated effort: Small — half a day.

### What other analytics sections differ between mobile and web?

| Section | Web | Mobile |
|---------|-----|--------|
| Asset Volatility | ✗ | ✓ |
| Success Analysis + factors | ✗ | ✓ |
| MatrixComparison (scatter) | ✓ | ✗ |
| Daily Activity table (last 14d) | ✗ | ✓ |
| Context Pressure per-model bars | ✓ (via sessions) | ✓ (explicit section) |
| Model Breakdown table | ✓ | ✓ |
| 14-day line chart | ✓ (TrendLine area) | ✓ (ActivityLineChart line) |

---

## 5. API Integration Readiness

### What API server artifact currently exists?

`artifacts/api-server` — Express 5 with pino logging, CORS enabled, JSON body parsing. Depends on `@workspace/api-zod` (in `lib/api-zod/`) and `@workspace/db`.

### What endpoints or contracts are currently available?

Only one: `GET /api/healthz` → `{ status: "ok" }` (validated via Zod `HealthCheckResponse` schema).

No domain endpoints exist: no `/api/sessions`, `/api/providers`, `/api/analytics`, `/api/team`, `/api/models`.

### What shape does the frontend currently expect?

The frontend does not call any API. It imports TypeScript types from `@/types` and mock data from `@/data/mock/*.ts` directly at import time. There is no `fetch()`, no `axios`, no `useQuery` connected to any endpoint anywhere in either app.

`@tanstack/react-query` is installed in the web app's dependencies but `QueryClientProvider` is mounted without any queries being registered.

### What is missing to connect both apps to the real API?

1. **API:** Domain route handlers for providers, sessions, analytics, team, models (5 Express routers)
2. **Database:** Drizzle ORM schema and migration defining the actual tables (`@workspace/db` package appears to exist but is empty/stub)
3. **Zod contracts:** Per-entity request/response schemas in `@workspace/api-zod`
4. **Web client:** Replace `import { mockSessions } from '@/data/mock/sessions'` with `useQuery({ queryKey: ['sessions'], queryFn: () => fetch('/api/sessions').then(r => r.json()) })` — `react-query` is already wired in the QueryClientProvider
5. **Mobile client:** No HTTP client or query layer exists. Would need `@tanstack/react-query` or bare `fetch` + `useEffect` pattern

### Is there a shared client or adapter layer yet?

No. There is no shared API client, no axios instance, no fetch wrapper, no type-safe API client (e.g. tRPC or openapi-fetch). The `lib/api-zod` package has only the health check schema.

### Recommended integration plan:

**1. Web:**
- Add domain Zod schemas to `lib/api-zod/src/` (Session, Provider, Analytics, etc.)
- Implement Express route handlers in `api-server` reading from DB or returning mock JSON
- Replace each page's mock imports with `useQuery` hooks — `react-query` is already installed and QueryClient is mounted
- Set `VITE_API_URL` env var; use it as the fetch base URL

**2. Mobile:**
- Add `@tanstack/react-query` (not currently installed in mobile)
- Create `src/lib/api.ts` as a typed fetch wrapper using base URL from `process.env.EXPO_PUBLIC_API_URL`
- Replace screen-level mock imports with query hooks, keeping mock data as the `initialData` fallback during development

**3. Shared data contract:**
- `lib/api-zod` should export all entity schemas: `ProviderSchema`, `SessionSchema`, `AnalyticsSchema`, `TeamMemberSchema`, `ModelSchema`
- Both apps infer TypeScript types from these schemas using `z.infer<typeof Schema>` — eliminates the duplicate type definitions in `@/types` (web) and `src/types/index.ts` (mobile)

---

## 6. Shared Library Recommendation

**Recommendation: Yes — create a shared library. The monorepo already supports it.**

The `lib/` directory is already a recognized workspace glob (`packages: - lib/*`). `lib/api-zod` already exists as proof of concept.

**Proposed package structure:**

```
lib/
  api-zod/          ← already exists, extend it
    src/
      health.ts      (existing)
      session.ts     (new: SessionSchema, SessionListSchema)
      provider.ts    (new: ProviderSchema)
      analytics.ts   (new: DailyActivitySchema, HeatmapSchema)
      team.ts        (new: TeamMemberSchema)
      models.ts      (new: ModelSchema, ModelBreakdownSchema)
      metrics.ts     (new: AssetVolatilitySchema, SuccessFactorSchema)
      index.ts       (barrel export)

  types/            ← new package: @workspace/types
    src/
      health.ts      (HealthState union, all 12 states)
      filters.ts     (FilterState interface)
      index.ts

  design-tokens/    ← new package: @workspace/design-tokens
    src/
      colors.ts      (the 22 color constants — currently duplicated)
      semanticColors.ts (12-state color map — currently duplicated)
      typography.ts
      index.ts

  mock-data/        ← new package: @workspace/mock-data
    src/
      providers.ts
      sessions.ts
      analytics.ts
      team.ts
      models.ts
      metrics.ts
      index.ts
```

**Why not "it depends":**
- The same `HealthState` type, same color values, and same mock data shapes are currently hand-duplicated across two artifacts. This will diverge as both apps evolve. The monorepo infrastructure for shared packages is already configured. The cost of not sharing is bugs and drift.
- `lib/types` and `lib/design-tokens` are immediate wins with near-zero setup cost.
- `lib/mock-data` is the right place for mock contracts to live once there is a real API — they become the development fallback, not the primary source.
- `lib/api-zod` already exists; just needs populating.

---

## 7. Auth and Access Structure

### Web

**What is present:**
- `src/lib/auth.ts` exports `useAuth()` and `canAccess(role, resource)`
- `useAuth()` returns a hardcoded constant `V1_USER = { email: 'admin@tokentracker.io', role: 'admin', name: 'Admin' }` — always authenticated, always admin
- `canAccess()` always returns `true` regardless of role or resource inputs (comment says "v1: single-admin")
- `ProtectedRoute` calls `canAccess(requiredRole, resource)` and renders children unconditionally

**What is real vs placeholder:**
- The `UserRole` type exists: `'admin' | 'analyst' | 'viewer'`
- The `ROLES` map exists
- Everything else is stub. No login page, no token, no session cookie, no OAuth, no redirect on unauthorized.

**Is the app actually protected?**
No. Any user who navigates to `/admin` or `/settings` sees the full page. The route guard always passes.

**Is single-admin mode implemented?**
Only implied. The comment `// v1: single-admin` documents intent, but the code branch for single-admin is identical to "no auth whatsoever."

**How ready is the structure for future RBAC?**
Moderately. The interfaces (`UserRole`, `AuthUser`) are in place. `canAccess(role, resource)` is the right function signature for RBAC. The `ProtectedRoute` component is the right pattern. Wiring real auth means: implement a real `useAuth()` that reads from a session token/cookie, and implement `canAccess()` with a policy table. The call sites don't need to change.

### Mobile

Auth is intentionally omitted — no `useAuth()`, no protected screens, no role concept. This is structurally deliberate (mobile is a read-only analytics viewer in the current scope). There is no preparation for future auth (no token storage, no auth context). If auth is added later, it would need to be built from scratch or the Expo auth pattern applied.

---

## 8. Test Gap — Prioritized First Test Plan

### What to test first (do now):

**Tier 1 — Unit tests (highest leverage, lowest effort):**
- `lib/filters.ts`: `parseFilters()`, `serializeFilters()`, `getDefaultFilters()` — pure functions, no mocks needed
- `lib/auth.ts`: `canAccess()` — when it becomes real, this is the most critical unit
- Format utilities (`src/lib/format.ts` on mobile): `formatTokens()`, `formatCost()`, `formatMs()`
- Mock data integrity: assert that `mockProviders`, `mockSessions`, `mockTeamMembers` conform to their TypeScript types at runtime (prevents silent schema drift)

**Tier 2 — Component tests:**
- `StateChip`: renders correct color for all 12 HealthState values
- `CompositionBar`: renders correct number of segments, correct proportions
- `FilterBar`: selecting a timeframe updates the URL query param

**Tier 3 — Integration tests (next milestone):**
- API routes once they exist: `GET /api/healthz` returns `{ status: "ok" }`; all domain routes return correct shape per Zod schema
- Filter state round-trip: set filters → URL updates → page re-renders with filtered data

**Tier 4 — UI/E2E tests (when wiring is real):**
- Web: navigate to Overview → change time filter → charts update
- Web: click session row → Session detail sheet opens with correct data
- Web: navigate to `/admin` as non-admin → redirected (once auth is real)
- Mobile: switch to Analytics tab → all sections render without crash

### What can wait:
- Visual regression tests — too early, UI is still evolving
- Load testing — no real API yet
- Accessibility audits — premature before feature parity is closed
- Mobile E2E (Detox/Maestro) — requires physical device or simulator CI setup

---

## 9. Recommended Next 5 Tasks (Priority Order)

### Task 1: Wire time filter to data in both apps
**Why it matters:** The single most visible fake feature. Every user interaction with the filter does nothing. Makes the prototype feel broken.  
**Affected apps:** Web + Mobile  
**Complexity:** Medium  
**Improves:** Usability, parity  

**Web:** Call `useFilters()` in each page, wrap derived values in `useMemo([filters])`, add `filterByTimeframe()` helper to `lib/filters.ts`.  
**Mobile:** Replace hardcoded slice lengths with computed values from `timeFilter` state, add `useMemo` dependencies.

---

### Task 2: Add Asset Volatility + Success Analysis to web Analytics page
**Why it matters:** These are the most analytically valuable sections in the product. Mobile has them; web doesn't. Closes a visible parity gap with one targeted change.  
**Affected apps:** Web  
**Complexity:** Small  
**Improves:** Parity  

Copy `metrics.ts` mock data to web, add two panels to `AnalyticsPage.tsx`. No new components needed.

---

### Task 3: Fix Overview session click (web) + add session tap-through (mobile)
**Why it matters:** Session detail is a core workflow. On web, clicking a session in Overview silently fails. On mobile, there's no way to inspect a session at all.  
**Affected apps:** Web + Mobile  
**Complexity:** Small (web) / Medium (mobile)  
**Improves:** Usability  

Web: Mount `SessionDetailSheet` in `OverviewPage` — 2-line fix.  
Mobile: Copy `MemberDetailSheet` pattern, add `explanationFactors` + `duration` to mobile session mock, wire `onPress` on session rows.

---

### Task 4: Create `lib/types` and `lib/design-tokens` shared packages
**Why it matters:** `HealthState`, color tokens, and mock data shapes are already duplicated. Every new feature deepens the divergence. Fixing this before the API integration saves significant rework.  
**Affected apps:** Web + Mobile + API  
**Complexity:** Medium  
**Improves:** Architecture, production readiness  

Create two new `lib/` packages. Migrate `HealthState` union and `FilterState` interface to `lib/types`. Migrate color constants to `lib/design-tokens`. Update both apps to import from shared packages.

---

### Task 5: Implement real API domain endpoints + connect web via react-query
**Why it matters:** The product currently has no backend. `react-query` is installed but unused. The API server runs but serves only a health check. This is the gate to production readiness.  
**Affected apps:** Web + API server  
**Complexity:** Large  
**Improves:** Production readiness, architecture  

Add Zod schemas to `lib/api-zod`. Implement `/api/sessions`, `/api/providers`, `/api/analytics`, `/api/team` in `api-server`. Replace web mock imports with `useQuery` hooks. Mobile follows in a subsequent task.

---

## 10. Hard Truths

### 3 Biggest Risks If Left As-Is

1. **The filter system creates a false confidence trap.** `FilterBar` looks functional — it updates the URL, state is preserved, "Share View" copies a URL with query params. Every user and every demo reviewer will assume it works. It does not affect a single data point. This is the most dangerous kind of fake feature: one that actively deceives.

2. **The two apps are already diverging architecturally and will get harder to sync.** Mobile has `metrics.ts` with Asset Volatility and Success Analysis data that web doesn't have. Mobile has 12 semantic health states; web has 6. Mobile uses `constants/colors.ts` directly; web uses CSS vars. If shared packages are not created before the next feature sprint, every new feature will need to be implemented twice, incompatibly.

3. **Auth is non-existent despite the scaffolding suggesting it is present.** `ProtectedRoute` exists, `canAccess()` exists, `UserRole` type exists. A developer reading the code for the first time will assume the admin routes are protected. They are not. Any user navigating to `/admin` sees everything. If this goes to a staging environment without a real auth layer, it is a data exposure incident.

### 3 Most Valuable Fixes to Do Next

1. **Wire the time filter.** This turns the most prominent UI control from a lie into a feature. It is the highest-visibility fix for the least code change. The entire infrastructure is built; only the consumers are missing.

2. **Create `lib/types` + `lib/design-tokens` shared packages.** Not glamorous but the highest-leverage architectural fix. Every future feature will be easier and more consistent. Every current duplication gets resolved. Do this before the API integration or the shared API types will also be duplicated.

3. **Implement session detail tap-through on mobile.** The session list exists. The data shape exists. The `MemberDetailSheet` pattern is a working template. This is the biggest usability gap on mobile and takes one day.

### Prototype, MVP, or Production-Ready Shell?

**Prototype — closer to a high-fidelity prototype than an MVP.**

Specific evidence:
- Zero real data anywhere. All state is imported from static TypeScript files at build time.
- The primary interactive control (filter) does nothing.
- Auth is cosmetic scaffolding.
- The API server serves one endpoint with no domain logic.
- No tests of any kind exist.

It is a *high-quality* prototype — the visual design is production-caliber, the component architecture is sound, TypeScript is clean, the data model is well-thought-out. But the gap between "looks like a product" and "is a product" has not been closed on any dimension.

The shortest path to MVP: wire the time filter, connect the API, add real auth. Everything else is already in good shape.

