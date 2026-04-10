import { SystemHealth, IngestionRecord, AuditEntry, HealthState } from '@/types';

export const mockSystemHealth: SystemHealth = {
  overall: 'warning',
  providerCount: 6,
  activeProviders: 3,
  degradedProviders: 1,
  criticalProviders: 1,
  lastSync: '2026-04-07T08:40:00Z',
  ingestionStatus: 'healthy',
  surfaceTruthResolved: 148,
  surfaceTruthUnresolved: 22,
  surfaceTruthUnknown: 8,
};

export const mockIngestionRecords: IngestionRecord[] = [
  {
    id: 'ing_001',
    source: 'OpenAI API Logs',
    lastRun: '2026-04-07T08:38:00Z',
    records: 2840,
    status: 'healthy',
    nextScheduled: '2026-04-07T08:53:00Z',
  },
  {
    id: 'ing_002',
    source: 'Anthropic API Logs',
    lastRun: '2026-04-07T08:37:30Z',
    records: 1920,
    status: 'healthy',
    nextScheduled: '2026-04-07T08:52:30Z',
  },
  {
    id: 'ing_003',
    source: 'Gemini Usage Export',
    lastRun: '2026-04-07T08:36:00Z',
    records: 892,
    status: 'warning',
    nextScheduled: '2026-04-07T08:51:00Z',
  },
  {
    id: 'ing_004',
    source: 'Cohere Audit Feed',
    lastRun: '2026-04-07T08:34:00Z',
    records: 412,
    status: 'degraded',
    nextScheduled: '2026-04-07T08:49:00Z',
  },
  {
    id: 'ing_005',
    source: 'Azure Monitor Export',
    lastRun: '2026-04-07T07:58:00Z',
    records: 188,
    status: 'critical',
    nextScheduled: '2026-04-07T09:13:00Z',
  },
];

export const mockAuditLog: AuditEntry[] = [
  { id: 'aud_001', timestamp: '2026-04-07T08:42:00Z', actor: 'admin@tokentracker.io', action: 'PROVIDER_CONFIG_UPDATE', target: 'OpenAI', outcome: 'success' },
  { id: 'aud_002', timestamp: '2026-04-07T08:38:00Z', actor: 'admin@tokentracker.io', action: 'INGESTION_TRIGGER', target: 'Anthropic API Logs', outcome: 'success' },
  { id: 'aud_003', timestamp: '2026-04-07T08:34:00Z', actor: 'system', action: 'CIRCUIT_BREAKER_OPEN', target: 'Azure OpenAI', outcome: 'warning' },
  { id: 'aud_004', timestamp: '2026-04-07T08:28:00Z', actor: 'admin@tokentracker.io', action: 'MEMBER_INVITE', target: 'new.engineer@co.io', outcome: 'success' },
  { id: 'aud_005', timestamp: '2026-04-07T08:22:00Z', actor: 'system', action: 'SURFACE_TRUTH_SCAN', target: 'All surfaces', outcome: 'success' },
  { id: 'aud_006', timestamp: '2026-04-07T08:18:00Z', actor: 'admin@tokentracker.io', action: 'FILTER_PRESET_SAVE', target: 'Last7d-OpenAI', outcome: 'success' },
  { id: 'aud_007', timestamp: '2026-04-07T08:14:00Z', actor: 'system', action: 'HEALTH_CHECK', target: 'Cohere', outcome: 'warning' },
  { id: 'aud_008', timestamp: '2026-04-07T08:09:00Z', actor: 'admin@tokentracker.io', action: 'SESSION_EXPORT', target: 'ses_001–ses_020', outcome: 'success' },
  { id: 'aud_009', timestamp: '2026-04-07T08:04:00Z', actor: 'system', action: 'FALLBACK_ACTIVATED', target: 'Azure OpenAI → OpenAI', outcome: 'warning' },
  { id: 'aud_010', timestamp: '2026-04-07T07:58:00Z', actor: 'admin@tokentracker.io', action: 'RBAC_ROLE_VIEW', target: 'Members', outcome: 'success' },
  { id: 'aud_011', timestamp: '2026-04-07T07:52:00Z', actor: 'system', action: 'INGESTION_COMPLETE', target: 'OpenAI API Logs', outcome: 'success' },
  { id: 'aud_012', timestamp: '2026-04-07T07:48:00Z', actor: 'admin@tokentracker.io', action: 'PROVIDER_DISABLE', target: 'Mistral', outcome: 'success' },
  { id: 'aud_013', timestamp: '2026-04-07T07:42:00Z', actor: 'system', action: 'RATE_LIMIT_HIT', target: 'Azure OpenAI', outcome: 'failure' },
  { id: 'aud_014', timestamp: '2026-04-07T07:38:00Z', actor: 'admin@tokentracker.io', action: 'DASHBOARD_SNAPSHOT', target: 'Overview', outcome: 'success' },
  { id: 'aud_015', timestamp: '2026-04-07T07:34:00Z', actor: 'system', action: 'CONTEXT_HEALTH_DEGRADED', target: 'Gemini 1.5 Pro', outcome: 'warning' },
  { id: 'aud_016', timestamp: '2026-04-07T07:29:00Z', actor: 'admin@tokentracker.io', action: 'SETTINGS_UPDATE', target: 'DefaultTimeframe', outcome: 'success' },
  { id: 'aud_017', timestamp: '2026-04-07T07:24:00Z', actor: 'system', action: 'INGESTION_COMPLETE', target: 'Anthropic API Logs', outcome: 'success' },
  { id: 'aud_018', timestamp: '2026-04-07T07:18:00Z', actor: 'admin@tokentracker.io', action: 'MEMBER_STATUS_CHECK', target: 'Dana Reeves', outcome: 'warning' },
  { id: 'aud_019', timestamp: '2026-04-07T07:12:00Z', actor: 'system', action: 'SURFACE_TRUTH_UNRESOLVED', target: 'ses_003, ses_006, ses_010', outcome: 'warning' },
  { id: 'aud_020', timestamp: '2026-04-07T07:08:00Z', actor: 'admin@tokentracker.io', action: 'LOGIN', target: 'admin@tokentracker.io', outcome: 'success' },
];

export interface TeamGroup {
  id: string;
  name: string;
  members: number;
  tokens: number;
  spend: number;
  status: HealthState;
}

export interface ProviderConfig {
  id: string;
  name: string;
  apiKeyStatus: 'active' | 'inactive';
  rateLimit: number;
  status: HealthState;
  endpoint: string;
}

export const mockTeamManagement: TeamGroup[] = [
  { id: 'team_1', name: 'Core Platform', members: 6, tokens: 42400000, spend: 1634.80, status: 'healthy' },
  { id: 'team_2', name: 'Research', members: 4, tokens: 28600000, spend: 1102.40, status: 'healthy' },
  { id: 'team_3', name: 'Infrastructure', members: 2, tokens: 8200000, spend: 316.60, status: 'warning' },
];

export const mockProviderConfig: ProviderConfig[] = [
  { id: 'openai', name: 'OpenAI', apiKeyStatus: 'active', rateLimit: 10000, status: 'healthy', endpoint: 'api.openai.com' },
  { id: 'anthropic', name: 'Anthropic', apiKeyStatus: 'active', rateLimit: 5000, status: 'healthy', endpoint: 'api.anthropic.com' },
  { id: 'gemini', name: 'Gemini', apiKeyStatus: 'active', rateLimit: 2000, status: 'warning', endpoint: 'generativelanguage.googleapis.com' },
  { id: 'cohere', name: 'Cohere', apiKeyStatus: 'active', rateLimit: 1000, status: 'degraded', endpoint: 'api.cohere.ai' },
  { id: 'mistral', name: 'Mistral', apiKeyStatus: 'inactive', rateLimit: 0, status: 'unknown', endpoint: 'api.mistral.ai' },
  { id: 'azure-openai', name: 'Azure OpenAI', apiKeyStatus: 'active', rateLimit: 1000, status: 'critical', endpoint: 'resource.openai.azure.com' },
];
