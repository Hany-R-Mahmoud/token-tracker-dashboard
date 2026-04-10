export type HealthState =
  | 'healthy'
  | 'mixed'
  | 'warning'
  | 'critical'
  | 'fallback'
  | 'degraded'
  | 'unknown'
  | 'unresolved'
  | 'loading'
  | 'error'
  | 'empty'
  | 'disconnected';

export type TruthState = 'resolved' | 'unresolved' | 'unknown';

export type ContextHealth = 'healthy' | 'degraded' | 'low';

export type SessionStatus =
  | 'success'
  | 'warning'
  | 'error'
  | 'fallback'
  | 'degraded'
  | 'unknown';

export type MemberStatus = 'active' | 'disconnected' | 'unavailable';

export type UserRole = 'admin' | 'analyst' | 'viewer';

export interface Provider {
  id: string;
  name: string;
  status: HealthState;
  spend: number;
  tokens: number;
  sessions: number;
  successRate: number;
  avgLatency: number;
  trend: number[];
  integrityScore: number;
  models: string[];
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  tokens: number;
  sessions: number;
  successRate: number;
  avgCost: number;
  pressure: number;
  trend: number[];
}

export interface Session {
  id: string;
  timestamp: string;
  provider: string;
  model: string;
  tokens: number;
  cost: number;
  duration: number;
  status: SessionStatus;
  successScore: number;
  contextHealth: ContextHealth;
  surfaceTruth: TruthState;
  explanationFactors: string[];
  evidenceNotes: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  rank: number;
  tokens: number;
  sessions: number;
  cost: number;
  successRate: number;
  trend: number[];
  status: MemberStatus;
  avatar: string;
}

export interface DailyActivity {
  date: string;
  tokens: number;
  sessions: number;
  cost: number;
  successRate: number;
  providers: Record<string, number>;
}

export interface FilterState {
  timeframe: string;
  providers: string[];
  models: string[];
  team: string;
  status: string;
}

export interface SystemHealth {
  overall: HealthState;
  providerCount: number;
  activeProviders: number;
  degradedProviders: number;
  criticalProviders: number;
  lastSync: string;
  ingestionStatus: HealthState;
  surfaceTruthResolved: number;
  surfaceTruthUnresolved: number;
  surfaceTruthUnknown: number;
}

export interface IngestionRecord {
  id: string;
  source: string;
  lastRun: string;
  records: number;
  status: HealthState;
  nextScheduled: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  outcome: 'success' | 'failure' | 'warning';
}

export interface AuthUser {
  email: string;
  role: UserRole;
  name: string;
}
