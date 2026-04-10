import { FilterState } from '@/types';
import { useFilters } from '@/lib/filters';
import { mockProviders } from '@/data/mock/providers';
import { mockModels } from '@/data/mock/models';
import { mockTeamMembers } from '@/data/mock/team';

const TIMEFRAMES = [
  { value: '24h', label: 'Last 24h' },
  { value: '7d', label: 'Last 7d' },
  { value: '30d', label: 'Last 30d' },
  { value: '90d', label: 'Last 90d' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'healthy', label: 'Healthy' },
  { value: 'warning', label: 'Warning' },
  { value: 'critical', label: 'Critical' },
  { value: 'degraded', label: 'Degraded' },
  { value: 'unknown', label: 'Unknown' },
];

interface FilterBarProps {
  showStatus?: boolean;
}

export function FilterBar({ showStatus = true }: FilterBarProps) {
  const { filters, setFilters, copyShareableUrl } = useFilters();

  const setField = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters({ ...filters, [key]: value });
  };

  const selectStyle: React.CSSProperties = {
    background: 'var(--tt-bg-secondary)',
    border: '1px solid var(--tt-border)',
    borderRadius: 5,
    color: 'var(--tt-text-secondary)',
    fontSize: 12,
    padding: '4px 8px',
    fontFamily: "'Manrope', sans-serif",
    outline: 'none',
    cursor: 'pointer',
  };

  const btnStyle: React.CSSProperties = {
    background: 'var(--tt-bg-secondary)',
    border: '1px solid var(--tt-border)',
    borderRadius: 5,
    color: 'var(--tt-accent)',
    fontSize: 11,
    padding: '4px 10px',
    fontFamily: "'Manrope', sans-serif",
    cursor: 'pointer',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
  };

  const providerNames = Array.from(new Set(mockProviders.map(p => p.name)));
  const modelNames = Array.from(new Set(mockModels.map(m => m.name)));
  const teamNames = Array.from(new Set(mockTeamMembers.map(m => m.role)));

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        borderBottom: '1px solid var(--tt-border)',
        background: 'var(--tt-bg-tertiary)',
        flexWrap: 'wrap',
      }}
      data-testid="filter-bar"
    >
      <select
        style={selectStyle}
        value={filters.timeframe}
        onChange={e => setField('timeframe', e.target.value)}
        data-testid="filter-timeframe"
      >
        {TIMEFRAMES.map(t => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      <select
        style={selectStyle}
        value={filters.providers[0] ?? ''}
        onChange={e => setField('providers', e.target.value ? [e.target.value] : [])}
        data-testid="filter-provider"
      >
        <option value="">All Providers</option>
        {providerNames.map(n => <option key={n} value={n}>{n}</option>)}
      </select>

      <select
        style={selectStyle}
        value={filters.models[0] ?? ''}
        onChange={e => setField('models', e.target.value ? [e.target.value] : [])}
        data-testid="filter-model"
      >
        <option value="">All Models</option>
        {modelNames.map(n => <option key={n} value={n}>{n}</option>)}
      </select>

      <select
        style={selectStyle}
        value={filters.team}
        onChange={e => setField('team', e.target.value)}
        data-testid="filter-team"
      >
        <option value="">All Teams</option>
        {teamNames.map(n => <option key={n} value={n}>{n}</option>)}
      </select>

      {showStatus && (
        <select
          style={selectStyle}
          value={filters.status}
          onChange={e => setField('status', e.target.value)}
          data-testid="filter-status"
        >
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )}

      <button style={btnStyle} onClick={copyShareableUrl} data-testid="button-share-view">
        Share View
      </button>

      {(filters.providers.length > 0 || filters.models.length > 0 || filters.team || filters.status) && (
        <button
          style={{ ...btnStyle, color: 'var(--tt-text-muted)', borderColor: 'transparent' }}
          onClick={() => setFilters({ timeframe: filters.timeframe, providers: [], models: [], team: '', status: '' })}
          data-testid="button-clear-filters"
        >
          Clear
        </button>
      )}
    </div>
  );
}
