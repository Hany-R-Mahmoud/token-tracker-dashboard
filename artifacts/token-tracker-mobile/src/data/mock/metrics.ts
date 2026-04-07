export interface PeriodMetric {
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
}

export interface SystemStat {
  label: string;
  value: string | number;
}

export const mockPeriodMetrics: PeriodMetric[] = [
  { label: 'Total Spend',  value: '$4,394',   delta: '+3.2% 7d',  deltaPositive: false },
  { label: 'Sessions',     value: '6,942',    delta: '+8.4% 7d',  deltaPositive: true  },
  { label: 'Total Tokens', value: '113.2M',   delta: '+5.6% 7d',  deltaPositive: true  },
  { label: 'Success Rate', value: '84.4%',    delta: '-1.2% 7d',  deltaPositive: false },
  { label: 'Avg Latency',  value: '1,236ms',  delta: '-4.8% 7d',  deltaPositive: true  },
  { label: 'Fallback Rate',value: '3.2%',     delta: '+1.4% 7d',  deltaPositive: false },
];

export const mockSystemStats: SystemStat[] = [
  { label: 'Providers Active', value: '4 / 6' },
  { label: 'Truth Resolved',   value: '50%'   },
  { label: 'Critical',         value: 1        },
];

export interface AssetVolatilityRecord {
  provider: string;
  model: string;
  successRateStdDev: number;
  latencyStdDev: number;
  costStdDev: number;
  volatilityScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
}

export const mockAssetVolatility: AssetVolatilityRecord[] = [
  { provider: 'Azure OpenAI', model: 'GPT-4 Azure',       successRateStdDev: 18.4, latencyStdDev: 3200, costStdDev: 0.42, volatilityScore: 0.92, riskLevel: 'extreme' },
  { provider: 'Gemini',       model: 'Gemini 1.5 Flash',  successRateStdDev: 11.2, latencyStdDev: 1400, costStdDev: 0.18, volatilityScore: 0.68, riskLevel: 'high'    },
  { provider: 'Gemini',       model: 'Gemini 1.5 Pro',    successRateStdDev: 9.6,  latencyStdDev: 1120, costStdDev: 0.22, volatilityScore: 0.58, riskLevel: 'high'    },
  { provider: 'Cohere',       model: 'Command R+',        successRateStdDev: 7.4,  latencyStdDev: 820,  costStdDev: 0.14, volatilityScore: 0.44, riskLevel: 'medium'  },
  { provider: 'OpenAI',       model: 'GPT-4 Turbo',       successRateStdDev: 3.2,  latencyStdDev: 410,  costStdDev: 0.08, volatilityScore: 0.18, riskLevel: 'low'     },
  { provider: 'OpenAI',       model: 'GPT-4o',            successRateStdDev: 1.8,  latencyStdDev: 220,  costStdDev: 0.04, volatilityScore: 0.08, riskLevel: 'low'     },
  { provider: 'Anthropic',    model: 'Claude 3.5 Sonnet', successRateStdDev: 2.4,  latencyStdDev: 280,  costStdDev: 0.06, volatilityScore: 0.12, riskLevel: 'low'     },
  { provider: 'Anthropic',    model: 'Claude 3 Haiku',    successRateStdDev: 4.1,  latencyStdDev: 340,  costStdDev: 0.05, volatilityScore: 0.22, riskLevel: 'medium'  },
];

export interface SuccessFactorRecord {
  factor: string;
  impact: number;
  direction: 'positive' | 'negative' | 'neutral';
  frequency: number;
}

export const mockSuccessFactors: SuccessFactorRecord[] = [
  { factor: 'High semantic coherence',    impact: 0.94, direction: 'positive', frequency: 68 },
  { factor: 'Complete retrieval',         impact: 0.88, direction: 'positive', frequency: 55 },
  { factor: 'Grounded citations',         impact: 0.85, direction: 'positive', frequency: 48 },
  { factor: 'Low hallucination rate',     impact: 0.82, direction: 'positive', frequency: 44 },
  { factor: 'Context window fragmented',  impact: 0.72, direction: 'negative', frequency: 22 },
  { factor: 'Latency spike',              impact: 0.65, direction: 'negative', frequency: 18 },
  { factor: 'Rate limit hit',             impact: 0.48, direction: 'negative', frequency: 12 },
  { factor: 'Circuit breaker open',       impact: 0.22, direction: 'negative', frequency: 8  },
];

export const mockSuccessAnalysisSummary = {
  overallPct: 58,
  errorPct: 10,
  fallbackPct: 8,
  degradedPct: 4,
  warnPct: 18,
  unknownPct: 2,
  topFactorPositive: 'High semantic coherence',
  topFactorNegative: 'Context window fragmented',
  trend7d: '+0.2%',
  trend30d: '-3.6%',
};
