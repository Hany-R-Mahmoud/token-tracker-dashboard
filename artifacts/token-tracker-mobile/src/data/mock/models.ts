export interface ModelUsageRecord {
  label: string;
  value: number;
  valueLabel: string;
  color: string;
}

import colors from '@/constants/colors';

export const mockModelVolume: ModelUsageRecord[] = [
  { label: 'GPT-4o',          value: 12400000, valueLabel: '12.4M', color: colors.accentColor },
  { label: 'Claude 3.5',      value: 9200000,  valueLabel: '9.2M',  color: '#7ec8e3' },
  { label: 'GPT-4 Turbo',     value: 8100000,  valueLabel: '8.1M',  color: '#a0c4ff' },
  { label: 'Gemini 1.5 Pro',  value: 6800000,  valueLabel: '6.8M',  color: colors.warningText },
  { label: 'GPT-4o Mini',     value: 5200000,  valueLabel: '5.2M',  color: '#c3f584' },
  { label: 'Command R+',      value: 3400000,  valueLabel: '3.4M',  color: colors.fallbackColor },
  { label: 'Claude 3 Haiku',  value: 2800000,  valueLabel: '2.8M',  color: '#e8b4ff' },
  { label: 'GPT-4 Azure',     value: 1800000,  valueLabel: '1.8M',  color: colors.criticalText },
];

export const mockModelCostPerKTokens: ModelUsageRecord[] = [
  { label: 'GPT-4 Azure',        value: 64, valueLabel: '$64/K', color: colors.criticalText },
  { label: 'Claude 3.5 Sonnet',  value: 42, valueLabel: '$42/K', color: colors.warningText },
  { label: 'GPT-4o',             value: 38, valueLabel: '$38/K', color: colors.accentColor },
  { label: 'Gemini 1.5 Pro',     value: 28, valueLabel: '$28/K', color: '#7ec8e3' },
  { label: 'Command R+',         value: 22, valueLabel: '$22/K', color: colors.fallbackColor },
  { label: 'Claude 3 Haiku',     value: 12, valueLabel: '$12/K', color: colors.degradedColor },
  { label: 'GPT-4o Mini',        value: 8,  valueLabel: '$8/K',  color: '#c3f584' },
  { label: 'Gemini 1.5 Flash',   value: 5,  valueLabel: '$5/K',  color: colors.textMuted },
];

export interface ModelBreakdownRow {
  name: string;
  provider: string;
  tokens: number;
  tokensLabel: string;
  sessions: number;
  successRate: number;
  costPerK: number;
  costLabel: string;
}

export const mockModelBreakdown: ModelBreakdownRow[] = [
  { name: 'GPT-4o',          provider: 'OpenAI',     tokens: 12400000, tokensLabel: '12.4M', sessions: 820, successRate: 97.2, costPerK: 38, costLabel: '$38' },
  { name: 'Claude 3.5',      provider: 'Anthropic',  tokens: 9200000,  tokensLabel: '9.2M',  sessions: 610, successRate: 95.4, costPerK: 42, costLabel: '$42' },
  { name: 'GPT-4 Turbo',     provider: 'OpenAI',     tokens: 8100000,  tokensLabel: '8.1M',  sessions: 480, successRate: 92.8, costPerK: 38, costLabel: '$38' },
  { name: 'Gemini 1.5 Pro',  provider: 'Gemini',     tokens: 6800000,  tokensLabel: '6.8M',  sessions: 380, successRate: 79.4, costPerK: 28, costLabel: '$28' },
  { name: 'GPT-4o Mini',     provider: 'OpenAI',     tokens: 5200000,  tokensLabel: '5.2M',  sessions: 640, successRate: 96.1, costPerK: 8,  costLabel: '$8' },
  { name: 'Command R+',      provider: 'Cohere',     tokens: 3400000,  tokensLabel: '3.4M',  sessions: 210, successRate: 70.2, costPerK: 22, costLabel: '$22' },
  { name: 'Claude 3 Haiku',  provider: 'Anthropic',  tokens: 2800000,  tokensLabel: '2.8M',  sessions: 340, successRate: 88.6, costPerK: 12, costLabel: '$12' },
  { name: 'GPT-4 Azure',     provider: 'Azure',      tokens: 1800000,  tokensLabel: '1.8M',  sessions: 140, successRate: 41.8, costPerK: 64, costLabel: '$64' },
];

export const mockOutcomeDistribution = [
  { label: 'Success',  value: 58, pct: 58, color: '#a3ffd9' },
  { label: 'Warning',  value: 18, pct: 18, color: '#e89e48' },
  { label: 'Error',    value: 10, pct: 10, color: '#e85b6a' },
  { label: 'Fallback', value: 8,  pct: 8,  color: '#a67abb' },
  { label: 'Degraded', value: 4,  pct: 4,  color: '#8fa3b1' },
  { label: 'Unknown',  value: 2,  pct: 2,  color: '#5f7088' },
];

export const mockProviderDistribution = [
  { label: 'OpenAI',      value: 52, pct: 52, color: '#a3ffd9' },
  { label: 'Anthropic',   value: 26, pct: 26, color: '#7ec8e3' },
  { label: 'Gemini',      value: 13, pct: 13, color: '#e89e48' },
  { label: 'Cohere',      value: 6,  pct: 6,  color: '#a67abb' },
  { label: 'Azure',       value: 2,  pct: 2,  color: '#e85b6a' },
  { label: 'Mistral',     value: 1,  pct: 1,  color: '#5f7088' },
];
