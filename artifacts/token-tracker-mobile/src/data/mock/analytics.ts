import { DailyActivity, SurfaceTruthRecord, ContextHealthRecord } from '@/src/types';

export const mockDailyActivity: DailyActivity[] = [
  { date: '2026-03-09', tokens: 2800000, sessions: 180, cost: 108.00, successRate: 94.2 },
  { date: '2026-03-10', tokens: 3100000, sessions: 200, cost: 122.00, successRate: 95.1 },
  { date: '2026-03-11', tokens: 3400000, sessions: 215, cost: 134.00, successRate: 93.8 },
  { date: '2026-03-12', tokens: 3200000, sessions: 205, cost: 128.00, successRate: 92.4 },
  { date: '2026-03-13', tokens: 3600000, sessions: 230, cost: 142.00, successRate: 94.6 },
  { date: '2026-03-14', tokens: 2400000, sessions: 155, cost: 94.00, successRate: 96.2 },
  { date: '2026-03-15', tokens: 2200000, sessions: 140, cost: 88.00, successRate: 95.8 },
  { date: '2026-03-16', tokens: 3800000, sessions: 245, cost: 150.00, successRate: 93.1 },
  { date: '2026-03-17', tokens: 4100000, sessions: 262, cost: 162.00, successRate: 92.8 },
  { date: '2026-03-18', tokens: 4400000, sessions: 280, cost: 174.00, successRate: 91.6 },
  { date: '2026-03-19', tokens: 4200000, sessions: 270, cost: 166.00, successRate: 90.4 },
  { date: '2026-03-20', tokens: 4600000, sessions: 295, cost: 182.00, successRate: 89.8 },
  { date: '2026-03-21', tokens: 3200000, sessions: 205, cost: 126.00, successRate: 91.2 },
  { date: '2026-03-22', tokens: 3000000, sessions: 190, cost: 118.00, successRate: 92.4 },
  { date: '2026-03-23', tokens: 4800000, sessions: 308, cost: 190.00, successRate: 90.8 },
  { date: '2026-03-24', tokens: 5200000, sessions: 334, cost: 206.00, successRate: 89.2 },
  { date: '2026-03-25', tokens: 5600000, sessions: 360, cost: 220.00, successRate: 88.4 },
  { date: '2026-03-26', tokens: 5400000, sessions: 346, cost: 214.00, successRate: 87.8 },
  { date: '2026-03-27', tokens: 5800000, sessions: 372, cost: 230.00, successRate: 87.2 },
  { date: '2026-03-28', tokens: 4200000, sessions: 270, cost: 166.00, successRate: 89.4 },
  { date: '2026-03-29', tokens: 4000000, sessions: 258, cost: 158.00, successRate: 90.1 },
  { date: '2026-03-30', tokens: 6200000, sessions: 400, cost: 246.00, successRate: 86.4 },
  { date: '2026-03-31', tokens: 6600000, sessions: 425, cost: 262.00, successRate: 85.2 },
  { date: '2026-04-01', tokens: 7000000, sessions: 450, cost: 278.00, successRate: 84.6 },
  { date: '2026-04-02', tokens: 6800000, sessions: 437, cost: 270.00, successRate: 83.8 },
  { date: '2026-04-03', tokens: 7200000, sessions: 462, cost: 286.00, successRate: 83.2 },
  { date: '2026-04-04', tokens: 5400000, sessions: 346, cost: 214.00, successRate: 85.6 },
  { date: '2026-04-05', tokens: 5200000, sessions: 334, cost: 206.00, successRate: 86.2 },
  { date: '2026-04-06', tokens: 7600000, sessions: 488, cost: 302.00, successRate: 82.4 },
  { date: '2026-04-07', tokens: 8100000, sessions: 520, cost: 322.00, successRate: 81.8 },
];

export const mockSurfaceTruth: SurfaceTruthRecord[] = [
  { id: 'st_001', sessionId: 'ses_001', status: 'resolved',   provider: 'OpenAI',   model: 'GPT-4o',          timestamp: '2026-04-07T08:42:11Z', resolution: 'Full context window, all citations grounded.' },
  { id: 'st_002', sessionId: 'ses_002', status: 'resolved',   provider: 'Anthropic',model: 'Claude 3.5 Sonnet',timestamp: '2026-04-07T08:38:04Z', resolution: 'Evidence chain complete.' },
  { id: 'st_003', sessionId: 'ses_003', status: 'unresolved', provider: 'Gemini',   model: 'Gemini 1.5 Pro',  timestamp: '2026-04-07T08:31:58Z', resolution: null },
  { id: 'st_004', sessionId: 'ses_004', status: 'unknown',    provider: 'Azure OpenAI',model:'GPT-4 Azure',   timestamp: '2026-04-07T08:28:22Z', resolution: null },
  { id: 'st_005', sessionId: 'ses_005', status: 'resolved',   provider: 'OpenAI',   model: 'GPT-4o Mini',     timestamp: '2026-04-07T08:22:47Z', resolution: 'Structured extraction verified.' },
  { id: 'st_006', sessionId: 'ses_006', status: 'unresolved', provider: 'Cohere',   model: 'Command R+',      timestamp: '2026-04-07T08:18:33Z', resolution: null },
  { id: 'st_007', sessionId: 'ses_007', status: 'resolved',   provider: 'OpenAI',   model: 'GPT-4 Turbo',     timestamp: '2026-04-07T08:14:12Z', resolution: 'Citations verified across full document.' },
  { id: 'st_008', sessionId: 'ses_008', status: 'unknown',    provider: 'Gemini',   model: 'Gemini 1.5 Flash',timestamp: '2026-04-07T08:09:44Z', resolution: null },
  { id: 'st_009', sessionId: 'ses_009', status: 'resolved',   provider: 'Anthropic',model: 'Claude 3 Haiku',  timestamp: '2026-04-07T08:04:19Z', resolution: 'Extraction validated.' },
  { id: 'st_010', sessionId: 'ses_010', status: 'unresolved', provider: 'Azure OpenAI',model:'GPT-4 Azure',   timestamp: '2026-04-07T07:58:31Z', resolution: null },
];

export const mockContextHealth: ContextHealthRecord[] = [
  { provider: 'OpenAI',   model: 'GPT-4o',          health: 'healthy',  pressure: 0.42, contextUsed: 52000, contextMax: 128000 },
  { provider: 'OpenAI',   model: 'GPT-4o Mini',      health: 'healthy',  pressure: 0.28, contextUsed: 35000, contextMax: 128000 },
  { provider: 'Anthropic',model: 'Claude 3.5 Sonnet',health: 'healthy',  pressure: 0.38, contextUsed: 76000, contextMax: 200000 },
  { provider: 'Anthropic',model: 'Claude 3 Haiku',   health: 'healthy',  pressure: 0.22, contextUsed: 44000, contextMax: 200000 },
  { provider: 'Gemini',   model: 'Gemini 1.5 Pro',   health: 'degraded', pressure: 0.74, contextUsed: 746000,contextMax: 1000000 },
  { provider: 'Gemini',   model: 'Gemini 1.5 Flash', health: 'degraded', pressure: 0.68, contextUsed: 681000,contextMax: 1000000 },
  { provider: 'Cohere',   model: 'Command R+',       health: 'degraded', pressure: 0.81, contextUsed: 101000,contextMax: 128000 },
  { provider: 'Azure OpenAI',model:'GPT-4 Azure',    health: 'low',      pressure: 0.95, contextUsed: 118000,contextMax: 128000 },
];

export const mockHeatmapHours = ['0', '3', '6', '9', '12', '15', '18', '21'];
export const mockHeatmapDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const mockHeatmapData: number[][] = [
  [2, 1, 0, 0, 5, 8, 12, 6],
  [4, 2, 1, 8, 22, 28, 24, 14],
  [3, 2, 1, 7, 24, 30, 26, 16],
  [4, 2, 1, 8, 26, 32, 28, 18],
  [5, 2, 1, 9, 28, 36, 30, 20],
  [3, 1, 0, 6, 20, 26, 22, 12],
  [2, 1, 0, 4, 12, 18, 14, 8],
];
