# Token Tracker — Current State Report
**Generated:** 2026-04-07  
**Purpose:** AI review to determine what is needed next across web dashboard and mobile app.

---

## 1. Project Overview

Token Tracker is a "Surface Truth Engine" — an observability dashboard for AI/LLM API usage. It tracks token consumption, costs, session health, provider integrity, team productivity, and context quality across multiple AI providers (OpenAI, Anthropic, Gemini, Cohere, Azure OpenAI).

**Monorepo structure (pnpm workspaces):**
```
artifacts/
  token-tracker-web/     React + Vite web dashboard
  token-tracker-mobile/  Expo (React Native) mobile app
  api-server/            Express API stub
  mockup-sandbox/        Vite canvas preview server
```

**Shared brand identity:**
- Colors: Dark navy `#0b1326` background, mint green `#a3ffd9` accent
- Fonts: Space Grotesk (headings/display), Manrope (body), Inter (labels/data)
- Logo: Diamond-with-horizontal-lines icon (PNG), used in both apps

---

## 2. Web Dashboard (`token-tracker-web`)

### Tech Stack
- React 18 + Vite + TypeScript
- Wouter (client-side routing)
- TanStack React Table v8 (Sessions page)
- Recharts (wrapped via custom chart components)
- shadcn/ui component library (full suite installed)
- CSS custom properties (`--tt-*`) for theming

### Pages (6 total)

#### `/` — Overview
**Status: COMPLETE**
- Global `FilterBar` (time range, provider, model, team, status dropdowns + share button)
- KPI row: Total Spend, Sessions, Total Tokens, Success Rate, Avg Latency (with 7d delta chips)
- Secondary stats: Active Providers (3/6), Models in Use, Fallback Rate, Context Health
- 14-day `TrendLine` area chart (tokens + sessions dual axis)
- Provider Integrity: `IntegrityLane` bars for each provider with health state
- Activity Cadence: `HeatmapGrid` (hour × day, 7 days × 24 hours)
- Surface Truth: `CompositionBar` (resolved/unresolved/unknown)
- Context Health: `CompositionBar` (healthy/degraded/low)
- Sessions Needing Attention: 5-row table of non-success sessions
- Full session log table: ID, timestamp, provider, model, tokens, cost, status chip, score
- Session detail side panel (slide-out) on row click

**Gaps:**
- `FilterBar` selections are not wired to data — UI is presentational only
- Session detail panel content is minimal (no full trace, no retry info)

#### `/analytics` — Analytics
**Status: COMPLETE**
- Period comparison KPI cards (7d vs prior 7d): Tokens, Sessions, Cost, Success Rate with computed deltas
- 14-day TrendLine (tokens, sessions, cost, success rate — multi-line)
- Outcome Distribution: `CompositionBar` + legend (Success/Warning/Error/Fallback/Degraded)
- Surface Truth Distribution: `CompositionBar`
- Provider efficiency matrix: `IntegrityLane` per provider
- Activity Heatmap: `HeatmapGrid` (hour × day)
- Model rankings: `RankedBar` by token volume
- Model breakdown table (name, provider, tokens, sessions, success%, cost/K)
- `MatrixComparison` chart for provider × metric scatter

**Gaps:**
- No Asset Volatility section (exists on mobile, not web)
- No Success Analysis / explanation factors section (exists on mobile, not web)
- `MatrixComparison` is a basic scatter — no bubble sizing

#### `/team` — Team / Leaderboard
**Status: COMPLETE**
- Leaderboard table: rank (gold/silver/bronze badges), avatar, name, role, tokens, sessions, success%, cost, spend, trend sparkline, status chip
- Disconnected/inactive members shown at 50% opacity, not clickable
- Member detail slide-out sheet: full stats, 7-day trend sparklines, top models used, context health bar

**Gaps:**
- No search or filter on the leaderboard
- No pagination (all members shown at once)

#### `/sessions` — Sessions Log
**Status: COMPLETE**
- TanStack React Table with sorting on all columns
- Global text filter input
- Status filter dropdown
- Column: ID, timestamp, provider, model, tokens, cost, status, score, surface truth, context health
- `CompositionBar` summary strip (outcome breakdown at top)
- Row click → detail panel (currently placeholder content)

**Gaps:**
- Session detail panel shows minimal data (no token trace, latency breakdown, prompt summary)
- No date range filter on sessions
- No export (CSV/JSON)

#### `/admin` — Admin *(role-gated)*
**Status: COMPLETE**
- System Health panel: provider count, active/degraded/critical, last sync, ingestion status
- Surface Truth resolution rate with progress bar
- Ingestion Records table: source, last run, records ingested, status, next scheduled
- Audit Log table: timestamp, user, action, resource, outcome
- Team Management: member list with role badges and status
- Provider Configuration: per-provider toggle (enabled/disabled), model list, health dot
- `ProtectedRoute` wrapper with `requiredRole="admin"` check

**Gaps:**
- Auth/role system is mocked (`lib/auth.ts`) — no real user/session
- Provider config toggles are presentational (no state persistence)
- Audit log is static mock data

#### `/settings` — Settings *(role-gated)*
**Status: COMPLETE**
- Profile section: name, email, role inputs (read-only)
- Notification preferences: toggle switches (email, Slack, in-app, mobile)
- Display preferences: theme selector, density selector, default time range
- API key management: masked key display, regenerate/revoke actions (presentational)
- Danger zone: delete account button (no action wired)

**Gaps:**
- All settings are presentational — no persistence, no actual config effect

### Shared Components (Web)
| Component | Description |
|-----------|-------------|
| `BrandMark` / `BrandLockup` | Logo PNG + wordmark, supports collapsed sidebar state |
| `Sidebar` | Collapsible left nav with 6 route items + collapse toggle |
| `AppShell` | Layout wrapper with sidebar + content area |
| `FilterBar` | Global filter strip (time, provider, model, team, status) |
| `StatCard` | KPI card with value, label, delta chip |
| `StateChip` | Health-state pill (healthy/warning/critical/fallback/degraded/unknown) |
| `SectionHeader` / `PageHeader` | Page and section title blocks |
| `ProtectedRoute` | Role-based route guard |

### Chart Primitives (Web)
| Chart | Description |
|-------|-------------|
| `TrendLine` | Recharts AreaChart — multi-series daily trend |
| `SparkLine` | Inline mini Recharts AreaChart for stat cards |
| `MiniBar` | SVG bar chart row (sparkline-style) |
| `IntegrityLane` | Labeled horizontal progress bar with health color |
| `CompositionBar` | Stacked proportional bar + optional legend |
| `HeatmapGrid` | Hour × day grid with opacity-scaled cells |
| `RankedBar` | Horizontal ranked list with value bars |
| `MatrixComparison` | Recharts ScatterChart provider × metric |

### Mock Data (Web)
| File | Contents |
|------|----------|
| `providers.ts` | 6 providers with tokens, spend, sessions, success rate, latency, trend, status |
| `sessions.ts` | ~100 sessions with id, provider, model, tokens, cost, status, score, surfaceTruth, contextHealth |
| `analytics.ts` | 30-day daily activity, 24-hour hourly activity, heatmap matrix |
| `models.ts` | 8 models with provider, tokens, sessions, success rate, cost/K |
| `team.ts` | 10 team members with rank, tokens, sessions, success rate, spend, trend, models |
| `admin.ts` | SystemHealth, IngestionRecords, AuditLog, TeamManagement, ProviderConfig |

---

## 3. Mobile App (`token-tracker-mobile`)

### Tech Stack
- Expo SDK 53, Expo Router (file-based routing)
- React Native + TypeScript
- `react-native-svg` (sparklines, primitive charts)
- `react-native-chart-kit` (14-day ActivityLineChart)
- `expo-blur` (sheet backdrop)
- `react-native-safe-area-context`
- Fonts: SpaceGrotesk (700Bold, 600SemiBold), Manrope (400Regular, 600SemiBold), Inter (600SemiBold, 400Regular)

### Screens (3 tabs)

#### Tab 1: Overview
**Status: COMPLETE**
- `BrandLockup` header (logo PNG + wordmark + overall health StateChip)
- System Status hero band: Providers Active (N/total), Truth Resolved (%), Critical count
- Time filter pills (Last 7d / 14d / 30d / Today) — presentational
- KPI cards: Total Spend, Sessions, Total Tokens, Success Rate, Avg Latency, Fallback Rate (all with delta strings from `mockPeriodMetrics`)
- 7-day token `TrendSparkline`
- Provider roster: each provider with `HealthDot`, token count, spend, `MiniBar` trend, `StateChip`
- Surface Truth `CompositionBar` (resolved/unresolved/unknown)
- Context Pressure: per-model horizontal fill bars
- Session feed: 10 most recent sessions (provider, model, tokens, cost, status, score)

**Gaps:**
- Time filter not wired to data slicing
- No session detail drill-down on tap

#### Tab 2: Analytics
**Status: COMPLETE**
- Hero StateCards: Tokens (7d), Sessions (7d avg/day), Spend (7d + per-session), Success rate (7d)
- 14-day Token Volume `ActivityLineChart` (react-native-chart-kit line chart)
- 14-day Session Volume `ActivityLineChart`
- 7-day Success Rate `TrendSparkline`
- Outcome Distribution: `CompositionBar` + stats grid (sourced from `mockOutcomeDistribution`)
- Provider Distribution: `CompositionBar` (sourced from `mockProviderDistribution`)
- **Asset Volatility section**: per-model volatility score (0–100), risk level chip (low/medium/high/extreme), track bar, σ-based explanation note
- **Success Analysis section**: summary row (Overall%, Error%, Fallback%, Degraded%), 7d/30d trends, explanation factors with directional bars
- Model Pressure ranked list (`RankedListBar` by token volume)
- Value Density ranked list (`RankedListBar` by cost/K tokens)
- Model Breakdown table (name, provider, tokens, sessions, success%, cost/K)
- Provider Efficiency `IntegrityLane` bars
- Activity Cadence `MiniBar` per provider
- Activity Heatmap (hour × day grid)
- State breakdown cards (Success/Error/Fallback/Warning/Degraded/Unknown counts)
- Active Surface Truth `CompositionBar`
- Context Pressure fill bars
- 14-day Daily Activity table

**Gaps:**
- Time filter not wired to data slicing
- Charts show subsets for performance but don't respect selected filter period

#### Tab 3: Team / Leaderboard
**Status: COMPLETE**
- Search input (filters by name, role, team)
- Team filter pills
- Leaderboard card list: rank badge (gold/silver/bronze/numeric), avatar, name, role, tokens, sessions, success%, `TrendSparkline`, `StateChip`
- Disconnected/inactive members shown with muted opacity
- Tap row → `MemberDetailSheet` (bottom modal with expo-blur backdrop):
  - Full stat grid (tokens, sessions, spend, success, latency, fallback)
  - 7-day `TrendSparkline`
  - Top models used list
  - Context Health bar
  - `StateChip` for member status

**Gaps:**
- Search is only by name/role/team — no sort by column
- No pagination

### Theme System (Mobile)
- `src/theme/index.ts` exports `useTheme()` hook, `semanticColors` (12 states × 4 tokens each), `palette`, `spacing`, `radii`, `elevation`, `typography`
- All 12 HealthStates have **unique** dot/bg/text color combinations: healthy, mixed, warning, critical, error, fallback, degraded, unknown, unresolved, loading, empty, disconnected
- `constants/colors.ts` defines all raw color tokens (22 named semantic colors)

### Shared Components (Mobile)
| Component | Description |
|-----------|-------------|
| `BrandLockup` / `BrandMark` | Logo PNG image + wordmark, size sm/md/lg |
| `StateChip` | Health-state pill driven by `semanticColors` |
| `HealthDot` | Colored dot driven by `semanticColors` |
| `StatCard` | KPI card with label, value, delta chip |
| `StateCard` | Full-width semantic state card (bg/text from health state) |
| `SectionHeader` / `PageHeader` | Title + subtitle blocks |
| `FilterPills` | Horizontal scrolling pill selector |
| `PanelCard` | Bordered content panel with consistent padding |

### Chart Primitives (Mobile)
| Chart | Description |
|-------|-------------|
| `ActivityLineChart` | react-native-chart-kit line chart (14-day trends) |
| `TrendSparkline` | react-native-svg SVG area line (compact inline sparkline) |
| `MiniBar` | SVG bar group (token volume cadence) |
| `IntegrityLane` | Labeled fill bar with health-state color |
| `CompositionBar` | Proportional stacked bar + optional legend |
| `RankedListBar` | Horizontal ranked list bars |

### Mock Data (Mobile)
| File | Contents |
|------|----------|
| `providers.ts` | Same 6 providers as web |
| `sessions.ts` | ~50 sessions |
| `analytics.ts` | 30-day daily activity, context health, surface truth, heatmap |
| `models.ts` | Model volume, cost/K, breakdown, outcome distribution, provider distribution |
| `metrics.ts` | PeriodMetrics (KPI deltas), AssetVolatility (8 models), SuccessFactors (8 factors), SuccessAnalysisSummary |
| `team.ts` | 10 team members |

---

## 4. Cross-App Consistency

| Feature | Web | Mobile |
|---------|-----|--------|
| Logo | PNG (BrandMark img tag) | PNG (Image component) |
| Color palette | `--tt-*` CSS vars (same values) | `constants/colors.ts` |
| Typography | Space Grotesk + Manrope + JetBrains Mono | Space Grotesk + Manrope + Inter |
| Health states | 6 states (healthy/mixed/warning/critical/fallback/degraded/unknown) | 12 states (above + error/unresolved/loading/empty/disconnected) |
| Mock data parity | 6 providers, ~100 sessions, 30d daily activity, 10 team members | Same core providers/sessions/team |
| Asset Volatility section | ✗ Missing | ✓ Present |
| Success Analysis section | ✗ Missing | ✓ Present |
| Time filter wired to data | ✗ Presentational | ✗ Presentational |
| Session detail drill-down | Partial (empty panel) | ✗ Not implemented |
| Settings persistence | ✗ Presentational | N/A (no settings screen) |
| Auth / role system | Mocked stub | N/A |
| Real API backend | ✗ Not connected | ✗ Not connected |

---

## 5. Known Gaps & Potential Next Steps

### High Impact
1. **Wire time filter to data** — both apps have filter UI but it doesn't affect any chart or table
2. **Session detail drill-down** — web panel is empty; mobile has no tap-to-detail
3. **Parity: add Asset Volatility + Success Analysis to web dashboard** (currently only on mobile)
4. **Extend web Health States** — web only handles 6 states; theme doesn't include error/unresolved/loading/empty/disconnected
5. **Real API integration** — `api-server` artifact exists but no endpoints are consumed; all data is hardcoded mock

### Medium Impact
6. **Settings persistence** — notifications, display prefs, API keys should at minimum use localStorage
7. **Session export** — CSV/JSON download from the sessions table
8. **Search + sort on Team leaderboard** — web has a static table; mobile has text search but no sort
9. **Mobile settings screen** — no equivalent of the web settings page on mobile
10. **Pagination** — sessions table and team leaderboard load all records at once

### Low Impact / Polish
11. **Mobile time filter wiring** — `timeFilter` state captured but not applied to data slice
12. **Web session detail panel** — currently renders "select a session" placeholder; should show trace, tokens, latency breakdown
13. **Admin panel interactivity** — provider toggles and settings don't persist
14. **Audit log** — static mock; could be a live feed
15. **Notifications screen** — mobile has no notification center
16. **Dark/light mode** — web CSS vars support it structurally but only dark palette is defined; mobile is dark-only by design

---

## 6. Architecture Health

| Concern | Status |
|---------|--------|
| TypeScript | Clean — zero errors on both apps |
| No `any` types | Confirmed across all files |
| Mock data isolation | All hardcoded values in `src/data/mock/` — no inline constants in UI |
| Component reuse | Strong in mobile; web has some duplication (inline styles repeated across pages) |
| Shared lib between apps | None yet — duplicate mock data structures (providers, sessions, team) |
| Testing | No automated tests yet (e2e, unit, or integration) |

