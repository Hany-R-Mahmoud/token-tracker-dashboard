import { useLocation } from 'wouter';
import { FilterState } from '@/types';

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
