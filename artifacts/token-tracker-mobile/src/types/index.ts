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

export type SessionStatus =
  | 'success'
  | 'warning'
  | 'error'
  | 'fallback'
  | 'degraded'
  | 'unknown';

export type TruthState = 'resolved' | 'unresolved' | 'unknown';

export type ContextHealth = 'healthy' | 'degraded' | 'low';

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
  email: string;
  status: MemberStatus;
  tokens: number;
  sessions: number;
  cost: number;
  successRate: number;
  rank: number;
  trend: number[];
  contextHealth: ContextHealth;
  primaryModel: string;
  joinedDate: string;
}

export interface DailyActivity {
  date: string;
  tokens: number;
  sessions: number;
  cost: number;
  successRate: number;
}

export interface SurfaceTruthRecord {
  id: string;
  sessionId: string;
  status: TruthState;
  provider: string;
  model: string;
  timestamp: string;
  resolution: string | null;
}

export interface ContextHealthRecord {
  provider: string;
  model: string;
  health: ContextHealth;
  pressure: number;
  contextUsed: number;
  contextMax: number;
}
