import { useLocation } from 'wouter';
import { FilterState, DailyActivity, Session } from '@/types';

export function getDefaultFilters(): FilterState {
  return {
    timeframe: '7d',
    providers: [],
    models: [],
    team: '',
    status: '',
  };
}

export function parseFilters(params: URLSearchParams): FilterState {
  const defaults = getDefaultFilters();
  const providers = params.get('providers');
  const models = params.get('models');
  return {
    timeframe: params.get('timeframe') ?? defaults.timeframe,
    providers: providers ? providers.split(',').filter(Boolean) : defaults.providers,
    models: models ? models.split(',').filter(Boolean) : defaults.models,
    team: params.get('team') ?? defaults.team,
    status: params.get('status') ?? defaults.status,
  };
}

export function serializeFilters(f: FilterState): string {
  const params = new URLSearchParams();
  if (f.timeframe) params.set('timeframe', f.timeframe);
  if (f.providers.length > 0) params.set('providers', f.providers.join(','));
  if (f.models.length > 0) params.set('models', f.models.join(','));
  if (f.team) params.set('team', f.team);
  if (f.status) params.set('status', f.status);
  return params.toString();
}

export function useFilters(): {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  copyShareableUrl: () => void;
} {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  );
  const filters = parseFilters(params);

  const setFilters = (f: FilterState) => {
    const serialized = serializeFilters(f);
    const base = location.split('?')[0];
    setLocation(serialized ? `${base}?${serialized}` : base);
  };

  const copyShareableUrl = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

  return { filters, setFilters, copyShareableUrl };
}

const TIMEFRAME_DAYS: Record<string, number> = {
  '24h': 1,
  '7d': 7,
  '14d': 14,
  '30d': 30,
  '90d': 90,
};

export function sliceByTimeframe(data: DailyActivity[], timeframe: string): DailyActivity[] {
  const n = TIMEFRAME_DAYS[timeframe] ?? 7;
  return data.slice(-n);
}

export function filterSessions(sessions: Session[], filters: FilterState): Session[] {
  return sessions.filter(s => {
    if (filters.providers.length > 0 && !filters.providers.includes(s.provider)) return false;
    if (filters.models.length > 0 && !filters.models.includes(s.model)) return false;
    if (filters.status && s.status !== filters.status) return false;
    return true;
  });
}

export function filterProviders<T extends { name: string }>(providers: T[], filters: FilterState): T[] {
  if (filters.providers.length === 0) return providers;
  return providers.filter(p => filters.providers.includes(p.name));
}
