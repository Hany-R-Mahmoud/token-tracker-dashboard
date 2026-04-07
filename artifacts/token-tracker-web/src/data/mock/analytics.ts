import { DailyActivity } from '@/types';

function makeDate(daysAgo: number): string {
  const d = new Date('2026-04-07');
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export const mockDailyActivity: DailyActivity[] = [
  { date: makeDate(29), tokens: 2840000, sessions: 168, cost: 108.4, successRate: 91.2, providers: { OpenAI: 88, Anthropic: 52, Gemini: 20, Cohere: 8 } },
  { date: makeDate(28), tokens: 3120000, sessions: 184, cost: 119.6, successRate: 92.8, providers: { OpenAI: 96, Anthropic: 58, Gemini: 22, Cohere: 8 } },
  { date: makeDate(27), tokens: 2640000, sessions: 156, cost: 101.2, successRate: 90.4, providers: { OpenAI: 82, Anthropic: 48, Gemini: 18, Cohere: 8 } },
  { date: makeDate(26), tokens: 3480000, sessions: 206, cost: 133.8, successRate: 93.6, providers: { OpenAI: 108, Anthropic: 64, Gemini: 24, Cohere: 10 } },
  { date: makeDate(25), tokens: 3820000, sessions: 226, cost: 146.8, successRate: 94.2, providers: { OpenAI: 118, Anthropic: 70, Gemini: 28, Cohere: 10 } },
  { date: makeDate(24), tokens: 4120000, sessions: 244, cost: 158.4, successRate: 94.8, providers: { OpenAI: 128, Anthropic: 76, Gemini: 30, Cohere: 10 } },
  { date: makeDate(23), tokens: 3940000, sessions: 233, cost: 151.4, successRate: 93.8, providers: { OpenAI: 122, Anthropic: 72, Gemini: 28, Cohere: 11 } },
  { date: makeDate(22), tokens: 4280000, sessions: 253, cost: 164.7, successRate: 95.2, providers: { OpenAI: 132, Anthropic: 78, Gemini: 32, Cohere: 11 } },
  { date: makeDate(21), tokens: 4640000, sessions: 274, cost: 178.6, successRate: 95.6, providers: { OpenAI: 142, Anthropic: 84, Gemini: 34, Cohere: 14 } },
  { date: makeDate(20), tokens: 4980000, sessions: 294, cost: 191.8, successRate: 96.2, providers: { OpenAI: 152, Anthropic: 90, Gemini: 36, Cohere: 16 } },
  { date: makeDate(19), tokens: 4820000, sessions: 285, cost: 185.6, successRate: 95.8, providers: { OpenAI: 148, Anthropic: 88, Gemini: 34, Cohere: 15 } },
  { date: makeDate(18), tokens: 5160000, sessions: 305, cost: 198.8, successRate: 96.4, providers: { OpenAI: 158, Anthropic: 94, Gemini: 36, Cohere: 17 } },
  { date: makeDate(17), tokens: 5480000, sessions: 324, cost: 211.2, successRate: 96.8, providers: { OpenAI: 168, Anthropic: 100, Gemini: 38, Cohere: 18 } },
  { date: makeDate(16), tokens: 5820000, sessions: 344, cost: 224.6, successRate: 97.2, providers: { OpenAI: 178, Anthropic: 106, Gemini: 40, Cohere: 20 } },
  { date: makeDate(15), tokens: 5640000, sessions: 334, cost: 217.8, successRate: 97.0, providers: { OpenAI: 172, Anthropic: 104, Gemini: 38, Cohere: 20 } },
  { date: makeDate(14), tokens: 5960000, sessions: 352, cost: 230.4, successRate: 97.4, providers: { OpenAI: 182, Anthropic: 108, Gemini: 42, Cohere: 20 } },
  { date: makeDate(13), tokens: 6240000, sessions: 369, cost: 240.8, successRate: 97.6, providers: { OpenAI: 190, Anthropic: 114, Gemini: 44, Cohere: 21 } },
  { date: makeDate(12), tokens: 6080000, sessions: 360, cost: 234.8, successRate: 97.2, providers: { OpenAI: 186, Anthropic: 110, Gemini: 42, Cohere: 22 } },
  { date: makeDate(11), tokens: 5800000, sessions: 343, cost: 224.0, successRate: 96.8, providers: { OpenAI: 178, Anthropic: 106, Gemini: 38, Cohere: 21 } },
  { date: makeDate(10), tokens: 6420000, sessions: 380, cost: 248.2, successRate: 97.8, providers: { OpenAI: 196, Anthropic: 118, Gemini: 44, Cohere: 22 } },
  { date: makeDate(9), tokens: 6680000, sessions: 395, cost: 258.4, successRate: 98.0, providers: { OpenAI: 204, Anthropic: 122, Gemini: 46, Cohere: 23 } },
  { date: makeDate(8), tokens: 6840000, sessions: 405, cost: 264.8, successRate: 97.6, providers: { OpenAI: 208, Anthropic: 126, Gemini: 48, Cohere: 23 } },
  { date: makeDate(7), tokens: 6960000, sessions: 412, cost: 269.6, successRate: 97.8, providers: { OpenAI: 212, Anthropic: 128, Gemini: 48, Cohere: 24 } },
  { date: makeDate(6), tokens: 7120000, sessions: 421, cost: 275.8, successRate: 98.0, providers: { OpenAI: 216, Anthropic: 132, Gemini: 50, Cohere: 23 } },
  { date: makeDate(5), tokens: 7280000, sessions: 430, cost: 281.8, successRate: 98.2, providers: { OpenAI: 220, Anthropic: 136, Gemini: 50, Cohere: 24 } },
  { date: makeDate(4), tokens: 7080000, sessions: 419, cost: 274.4, successRate: 97.8, providers: { OpenAI: 216, Anthropic: 132, Gemini: 48, Cohere: 23 } },
  { date: makeDate(3), tokens: 7440000, sessions: 440, cost: 288.2, successRate: 98.0, providers: { OpenAI: 226, Anthropic: 138, Gemini: 52, Cohere: 24 } },
  { date: makeDate(2), tokens: 7640000, sessions: 452, cost: 296.4, successRate: 98.2, providers: { OpenAI: 232, Anthropic: 142, Gemini: 54, Cohere: 24 } },
  { date: makeDate(1), tokens: 7820000, sessions: 463, cost: 303.6, successRate: 98.4, providers: { OpenAI: 238, Anthropic: 146, Gemini: 56, Cohere: 23 } },
  { date: makeDate(0), tokens: 4840000, sessions: 286, cost: 187.8, successRate: 95.6, providers: { OpenAI: 148, Anthropic: 90, Gemini: 34, Cohere: 14 } },
];

export const mockTrendData = {
  tokens: mockDailyActivity.slice(-14).map(d => ({ date: d.date, value: d.tokens })),
  sessions: mockDailyActivity.slice(-14).map(d => ({ date: d.date, value: d.sessions })),
  cost: mockDailyActivity.slice(-14).map(d => ({ date: d.date, value: d.cost })),
  successRate: mockDailyActivity.slice(-14).map(d => ({ date: d.date, value: d.successRate })),
};

export const mockHourlyActivity = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => {
    const base = 20 + Math.floor(Math.sin((hour - 9) / 3) * 30 + 30);
    const dayFactor = day === 0 || day === 6 ? 0.4 : 1.0;
    return Math.max(0, Math.floor(base * dayFactor + Math.random() * 10));
  })
);

export const mockHeatmapDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const mockHeatmapHours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
