import { describe, it, expect } from 'vitest';
import {
  getDefaultFilters,
  parseFilters,
  serializeFilters,
  sliceByTimeframe,
  filterSessions,
  filterProviders,
} from '../lib/filters';
import type { DailyActivity, Session, FilterState } from '../types';

const makeDay = (date: string): DailyActivity => ({
  date,
  tokens: 1000,
  sessions: 10,
  cost: 2.5,
  successRate: 95,
  providers: {},
});

const makeSession = (overrides: Partial<Session> = {}): Session => ({
  id: 'ses_test',
  timestamp: '2026-04-07T08:00:00Z',
  provider: 'OpenAI',
  model: 'GPT-4o',
  tokens: 5000,
  cost: 0.5,
  duration: 1500,
  status: 'success',
  successScore: 0.95,
  contextHealth: 'healthy',
  surfaceTruth: 'resolved',
  explanationFactors: [],
  evidenceNotes: '',
  ...overrides,
});

describe('getDefaultFilters', () => {
  it('returns correct defaults', () => {
    const f = getDefaultFilters();
    expect(f.timeframe).toBe('7d');
    expect(f.providers).toEqual([]);
    expect(f.models).toEqual([]);
    expect(f.team).toBe('');
    expect(f.status).toBe('');
  });
});

describe('parseFilters', () => {
  it('parses timeframe from URL params', () => {
    const params = new URLSearchParams('timeframe=30d');
    const f = parseFilters(params);
    expect(f.timeframe).toBe('30d');
  });

  it('parses multiple providers from comma-separated string', () => {
    const params = new URLSearchParams('providers=OpenAI,Anthropic');
    const f = parseFilters(params);
    expect(f.providers).toEqual(['OpenAI', 'Anthropic']);
  });

  it('returns defaults when params are empty', () => {
    const f = parseFilters(new URLSearchParams(''));
    expect(f).toEqual(getDefaultFilters());
  });

  it('filters out empty provider strings', () => {
    const params = new URLSearchParams('providers=OpenAI,,Anthropic');
    const f = parseFilters(params);
    expect(f.providers).toEqual(['OpenAI', 'Anthropic']);
  });
});

describe('serializeFilters', () => {
  it('serializes timeframe', () => {
    const f: FilterState = { ...getDefaultFilters(), timeframe: '30d' };
    const result = new URLSearchParams(serializeFilters(f));
    expect(result.get('timeframe')).toBe('30d');
  });

  it('serializes providers as comma-separated', () => {
    const f: FilterState = { ...getDefaultFilters(), providers: ['OpenAI', 'Anthropic'] };
    const result = new URLSearchParams(serializeFilters(f));
    expect(result.get('providers')).toBe('OpenAI,Anthropic');
  });

  it('does not include empty arrays', () => {
    const f: FilterState = { ...getDefaultFilters(), providers: [] };
    const result = serializeFilters(f);
    expect(result).not.toContain('providers');
  });

  it('round-trips through parse → serialize', () => {
    const original: FilterState = {
      timeframe: '14d',
      providers: ['OpenAI'],
      models: ['GPT-4o'],
      team: 'eng',
      status: 'warning',
    };
    const serialized = serializeFilters(original);
    const reparsed = parseFilters(new URLSearchParams(serialized));
    expect(reparsed).toEqual(original);
  });
});

describe('sliceByTimeframe', () => {
  const days = Array.from({ length: 60 }, (_, i) =>
    makeDay(`2026-02-${String(i + 1).padStart(2, '0')}`)
  );

  it('slices last 7 days for 7d', () => {
    expect(sliceByTimeframe(days, '7d')).toHaveLength(7);
  });

  it('slices last 14 days for 14d', () => {
    expect(sliceByTimeframe(days, '14d')).toHaveLength(14);
  });

  it('slices last 30 days for 30d', () => {
    expect(sliceByTimeframe(days, '30d')).toHaveLength(30);
  });

  it('defaults to 7 for unknown timeframe', () => {
    expect(sliceByTimeframe(days, 'unknown')).toHaveLength(7);
  });

  it('returns all items if data is shorter than requested period', () => {
    const shortData = days.slice(0, 3);
    expect(sliceByTimeframe(shortData, '7d')).toHaveLength(3);
  });
});

describe('filterSessions', () => {
  const sessions = [
    makeSession({ id: 's1', provider: 'OpenAI', model: 'GPT-4o', status: 'success' }),
    makeSession({ id: 's2', provider: 'Anthropic', model: 'Claude 3.5', status: 'error' }),
    makeSession({ id: 's3', provider: 'OpenAI', model: 'GPT-4o-mini', status: 'warning' }),
  ];

  it('returns all sessions when no filters set', () => {
    expect(filterSessions(sessions, getDefaultFilters())).toHaveLength(3);
  });

  it('filters by provider', () => {
    const f: FilterState = { ...getDefaultFilters(), providers: ['OpenAI'] };
    const result = filterSessions(sessions, f);
    expect(result).toHaveLength(2);
    expect(result.every(s => s.provider === 'OpenAI')).toBe(true);
  });

  it('filters by model', () => {
    const f: FilterState = { ...getDefaultFilters(), models: ['GPT-4o'] };
    const result = filterSessions(sessions, f);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('s1');
  });

  it('filters by status', () => {
    const f: FilterState = { ...getDefaultFilters(), status: 'error' };
    const result = filterSessions(sessions, f);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('s2');
  });

  it('combines provider and status filters', () => {
    const f: FilterState = { ...getDefaultFilters(), providers: ['OpenAI'], status: 'warning' };
    const result = filterSessions(sessions, f);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('s3');
  });

  it('returns empty when no sessions match', () => {
    const f: FilterState = { ...getDefaultFilters(), providers: ['Google'] };
    expect(filterSessions(sessions, f)).toHaveLength(0);
  });
});

describe('filterProviders', () => {
  const providers = [
    { name: 'OpenAI', tokens: 100 },
    { name: 'Anthropic', tokens: 80 },
    { name: 'Google', tokens: 60 },
  ];

  it('returns all when no provider filter set', () => {
    expect(filterProviders(providers, getDefaultFilters())).toHaveLength(3);
  });

  it('filters to selected providers', () => {
    const f: FilterState = { ...getDefaultFilters(), providers: ['OpenAI', 'Google'] };
    const result = filterProviders(providers, f);
    expect(result).toHaveLength(2);
    expect(result.map(p => p.name)).toEqual(['OpenAI', 'Google']);
  });
});
