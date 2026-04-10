import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/SectionHeader';
import { StateChip } from '@/components/shared/StateChip';
import { StatCard } from '@/components/shared/StatCard';
import { FilterBar } from '@/components/shared/FilterBar';
import { SessionDetailSheet, SESSION_STATUS_MAP } from '@/components/shared/SessionDetailSheet';
import { TrendLine } from '@/components/charts/TrendLine';
import { IntegrityLane } from '@/components/charts/IntegrityLane';
import { HeatmapGrid } from '@/components/charts/HeatmapGrid';
import { CompositionBar } from '@/components/charts/CompositionBar';
import { MiniBar } from '@/components/charts/MiniBar';
import { SparkLine } from '@/components/charts/SparkLine';
import { mockProviders } from '@/data/mock/providers';
import { mockSessions } from '@/data/mock/sessions';
import { mockDailyActivity, mockHourlyActivity, mockHeatmapDays, mockHeatmapHours } from '@/data/mock/analytics';
import { useFilters, sliceByTimeframe, filterSessions, filterProviders } from '@/lib/filters';
import { Session } from '@/types';

function fmt(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  return n.toString();
}

function fmtCurrency(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(2)}k`;
  return `$${n.toFixed(2)}`;
}

function SessionRow({ session, onSelect }: { session: Session; onSelect: (s: Session) => void }) {
  const statusColors: Record<string, string> = {
    success: 'var(--tt-accent)',
    warning: 'var(--tt-warning)',
    error: 'var(--tt-error)',
    fallback: 'var(--tt-fallback)',
    degraded: 'var(--tt-degraded)',
    unknown: 'var(--tt-unknown)',
  };
  return (
    <tr
      style={{ cursor: 'pointer', borderBottom: '1px solid var(--tt-border)' }}
      onClick={() => onSelect(session)}
      data-testid={`session-row-${session.id}`}
    >
      <td style={tdStyle}><span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--tt-text-muted)' }}>{session.id}</span></td>
      <td style={tdStyle}><span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--tt-text-muted)' }}>{new Date(session.timestamp).toLocaleTimeString()}</span></td>
      <td style={tdStyle}><span style={{ fontSize: 12, color: 'var(--tt-text-secondary)' }}>{session.provider}</span></td>
      <td style={tdStyle}><span style={{ fontSize: 11, color: 'var(--tt-text-muted)', fontFamily: 'JetBrains Mono' }}>{session.model}</span></td>
      <td style={{ ...tdStyle, textAlign: 'right' }}><span style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>{fmt(session.tokens)}</span></td>
      <td style={{ ...tdStyle, textAlign: 'right' }}><span style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>${session.cost.toFixed(3)}</span></td>
      <td style={tdStyle}>
        <StateChip state={SESSION_STATUS_MAP[session.status] ?? 'unknown'} label={session.status} />
      </td>
      <td style={{ ...tdStyle, textAlign: 'right' }}>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: statusColors[session.status] ?? 'var(--tt-text-muted)' }}>
          {(session.successScore * 100).toFixed(0)}%
        </span>
      </td>
    </tr>
  );
}

const tdStyle: React.CSSProperties = {
  padding: '8px 10px',
  fontSize: 12,
  color: 'var(--tt-text-primary)',
  verticalAlign: 'middle',
};

const thStyle: React.CSSProperties = {
  padding: '6px 10px',
  fontSize: 9,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--tt-text-muted)',
  fontFamily: "'Manrope', sans-serif",
  textAlign: 'left',
  borderBottom: '1px solid var(--tt-border)',
  whiteSpace: 'nowrap',
};

export function OverviewPage() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const { filters } = useFilters();

  const filteredActivity = useMemo(
    () => sliceByTimeframe(mockDailyActivity, filters.timeframe),
    [filters.timeframe]
  );

  const filteredProviders = useMemo(
    () => filterProviders(mockProviders, filters),
    [filters]
  );

  const filteredSessions = useMemo(
    () => filterSessions(mockSessions, filters),
    [filters]
  );

  const totalSpend = useMemo(
    () => filteredProviders.reduce((s, p) => s + p.spend, 0),
    [filteredProviders]
  );

  const totalTokens = useMemo(
    () => filteredProviders.reduce((s, p) => s + p.tokens, 0),
    [filteredProviders]
  );

  const totalSessions = useMemo(
    () => filteredProviders.reduce((s, p) => s + p.sessions, 0),
    [filteredProviders]
  );

  const avgSuccessRate = useMemo(() => {
    const active = filteredProviders.filter(p => p.successRate > 0);
    return active.length > 0
      ? active.reduce((s, p) => s + p.successRate, 0) / active.length
      : 0;
  }, [filteredProviders]);

  const avgLatency = useMemo(() => {
    const active = filteredProviders.filter(p => p.avgLatency > 0);
    return active.length > 0
      ? active.reduce((s, p) => s + p.avgLatency, 0) / active.length
      : 0;
  }, [filteredProviders]);

  const trendData = useMemo(
    () => filteredActivity.map(d => ({
      date: d.date,
      tokens: d.tokens / 1e6,
      sessions: d.sessions,
    })),
    [filteredActivity]
  );

  const warningSessionsCount = useMemo(
    () => filteredSessions.filter(s => s.status !== 'success').length,
    [filteredSessions]
  );

  const surfaceTruthResolved = useMemo(
    () => filteredSessions.filter(s => s.surfaceTruth === 'resolved').length,
    [filteredSessions]
  );
  const surfaceTruthUnresolved = useMemo(
    () => filteredSessions.filter(s => s.surfaceTruth === 'unresolved').length,
    [filteredSessions]
  );
  const surfaceTruthUnknown = useMemo(
    () => filteredSessions.filter(s => s.surfaceTruth === 'unknown').length,
    [filteredSessions]
  );

  const contextHealthy = useMemo(
    () => filteredSessions.filter(s => s.contextHealth === 'healthy').length,
    [filteredSessions]
  );
  const contextDegraded = useMemo(
    () => filteredSessions.filter(s => s.contextHealth === 'degraded').length,
    [filteredSessions]
  );
  const contextLow = useMemo(
    () => filteredSessions.filter(s => s.contextHealth === 'low').length,
    [filteredSessions]
  );

  const needsAttention = useMemo(
    () => filteredSessions.filter(s => s.status !== 'success').slice(0, 5),
    [filteredSessions]
  );

  const recentSessions = useMemo(
    () => filteredSessions.slice(0, 10),
    [filteredSessions]
  );

  return (
    <div>
      <FilterBar />
      <div style={{ padding: '24px 28px', maxWidth: 1400 }}>
        <PageHeader
          title="Overview"
          subtitle="System status and operational triage"
          badge={<StateChip state="warning" size="md" />}
        />

        {/* Operational Hero Band */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 24 }}>
          <StatCard label="Total Spend" value={fmtCurrency(totalSpend)} delta={3.2} deltaLabel={filters.timeframe} size="lg" />
          <StatCard label="Sessions" value={fmt(totalSessions)} delta={8.4} deltaLabel={filters.timeframe} size="lg" />
          <StatCard label="Total Tokens" value={fmt(totalTokens)} delta={5.6} deltaLabel={filters.timeframe} size="lg" />
          <StatCard label="Success Rate" value={`${avgSuccessRate.toFixed(1)}%`} delta={-1.2} deltaLabel={filters.timeframe} size="lg" />
          <StatCard label="Avg Latency" value={`${Math.round(avgLatency)}ms`} delta={-4.8} deltaLabel={filters.timeframe} size="lg" />
        </div>

        {/* KPI Deck */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
          <StatCard label="Active Providers" value={`${filteredProviders.length} / 6`} sparkline={<SparkLine data={[3,4,3,4,3,4,3]} color="var(--tt-accent)" />} />
          <StatCard label="Models in Use" value="7" sparkline={<SparkLine data={[7,7,8,7,7,8,7]} color="var(--tt-accent)" />} />
          <StatCard label="Fallback Rate" value="3.2%" delta={1.4} sparkline={<SparkLine data={[2,1,2,3,3,4,3]} color="var(--tt-fallback)" />} />
          <StatCard label="Context Health" value="74%" delta={-2.1} sparkline={<SparkLine data={[80,78,76,75,74,74,74]} color="var(--tt-warning)" />} />
        </div>

        {/* Trend Activity */}
        <div className="tt-panel" style={{ padding: 16, marginBottom: 16 }}>
          <div className="tt-label" style={{ marginBottom: 12 }}>Trend Activity — {filters.timeframe === '7d' ? 'Last 7 Days' : filters.timeframe === '14d' ? 'Last 14 Days' : filters.timeframe === '30d' ? 'Last 30 Days' : filters.timeframe === '24h' ? 'Last 24 Hours' : `Last ${filters.timeframe}`}</div>
          <TrendLine
            data={trendData}
            series={[
              { key: 'tokens', label: 'Tokens (M)', color: 'var(--tt-accent)' },
              { key: 'sessions', label: 'Sessions', color: 'var(--tt-mixed)' },
            ]}
            height={180}
            formatValue={v => v.toFixed(1)}
          />
        </div>

        {/* Provider Integrity + Activity Cadence */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div className="tt-panel" style={{ padding: 16 }}>
            <div className="tt-label" style={{ marginBottom: 12 }}>Provider Integrity</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredProviders.map(p => (
                <div key={p.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--tt-text-secondary)', fontFamily: "'Manrope', sans-serif" }}>{p.name}</span>
                    <StateChip state={p.status} size="sm" />
                  </div>
                  <IntegrityLane
                    segments={[
                      { label: 'Healthy', value: Math.round(p.integrityScore * 100), state: 'healthy' },
                      { label: 'Degraded', value: Math.round((1 - p.integrityScore) * 60), state: 'degraded' },
                      { label: 'Unknown', value: Math.round((1 - p.integrityScore) * 40), state: 'unknown' },
                    ]}
                    height={6}
                  />
                </div>
              ))}
              {filteredProviders.length === 0 && (
                <div style={{ color: 'var(--tt-text-muted)', fontSize: 12 }}>No providers match the current filter.</div>
              )}
            </div>
          </div>

          <div className="tt-panel" style={{ padding: 16 }}>
            <div className="tt-label" style={{ marginBottom: 12 }}>Activity Cadence — Hour × Day</div>
            <HeatmapGrid
              data={mockHourlyActivity}
              rowLabels={mockHeatmapDays}
              colLabels={mockHeatmapHours}
            />
          </div>
        </div>

        {/* Investigation Log + Truth/Context */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div className="tt-panel" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="tt-label">Investigation Log</div>
              <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: 'var(--tt-warning)' }}>
                {warningSessionsCount} need attention
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {needsAttention.length === 0 && (
                <div style={{ color: 'var(--tt-text-muted)', fontSize: 12 }}>All sessions healthy for this period.</div>
              )}
              {needsAttention.map(s => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    background: 'var(--tt-bg)',
                    borderRadius: 5,
                    border: '1px solid var(--tt-border)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedSession(s)}
                  data-testid={`investigation-row-${s.id}`}
                >
                  <StateChip state={SESSION_STATUS_MAP[s.status] ?? 'unknown'} label={s.status} />
                  <span style={{ fontSize: 9, fontFamily: 'JetBrains Mono', color: 'var(--tt-text-muted)', flexShrink: 0 }}>
                    {new Date(s.timestamp).toLocaleTimeString()}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--tt-text-secondary)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.provider} · {s.model}
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--tt-text-muted)', flexShrink: 0 }}>
                    ${s.cost.toFixed(3)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="tt-panel" style={{ padding: 16 }}>
            <div className="tt-label" style={{ marginBottom: 12 }}>Active Surface Truth</div>
            <CompositionBar
              segments={[
                { label: 'Resolved', value: surfaceTruthResolved, color: 'var(--tt-accent)' },
                { label: 'Unresolved', value: surfaceTruthUnresolved, color: 'var(--tt-unresolved)' },
                { label: 'Unknown', value: surfaceTruthUnknown, color: 'var(--tt-unknown)' },
              ]}
              height={12}
              showLegend={true}
            />
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="tt-label">Total Surfaces</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: 'var(--tt-text-primary)' }}>
                  {surfaceTruthResolved + surfaceTruthUnresolved + surfaceTruthUnknown}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="tt-label">Resolution Rate</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: 'var(--tt-accent)' }}>
                  {surfaceTruthResolved + surfaceTruthUnresolved + surfaceTruthUnknown > 0
                    ? `${((surfaceTruthResolved / (surfaceTruthResolved + surfaceTruthUnresolved + surfaceTruthUnknown)) * 100).toFixed(0)}%`
                    : '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="tt-panel" style={{ padding: 16 }}>
            <div className="tt-label" style={{ marginBottom: 12 }}>Context Health</div>
            <IntegrityLane
              segments={[
                { label: 'Healthy', value: contextHealthy, state: 'healthy' },
                { label: 'Degraded', value: contextDegraded, state: 'degraded' },
                { label: 'Low', value: contextLow, state: 'critical' },
              ]}
              height={12}
              showLabels={true}
            />
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="tt-label">Healthy Rate</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: 'var(--tt-accent)' }}>
                  {contextHealthy + contextDegraded + contextLow > 0
                    ? `${((contextHealthy / (contextHealthy + contextDegraded + contextLow)) * 100).toFixed(0)}%`
                    : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Provider Summaries Table */}
        <div className="tt-panel" style={{ padding: 16, marginBottom: 16, overflowX: 'auto' }}>
          <div className="tt-label" style={{ marginBottom: 12 }}>Provider Summaries</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Provider', 'Status', 'Spend', 'Tokens', 'Sessions', 'Success Rate', 'Integrity', 'Trend'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProviders.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--tt-border)' }} data-testid={`provider-row-${p.id}`}>
                  <td style={tdStyle}><span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 13 }}>{p.name}</span></td>
                  <td style={tdStyle}><StateChip state={p.status} /></td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 12 }}>{fmtCurrency(p.spend)}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 12 }}>{fmt(p.tokens)}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 12 }}>{p.sessions.toLocaleString()}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 12 }}>
                    <span style={{ color: p.successRate >= 90 ? 'var(--tt-accent)' : p.successRate >= 70 ? 'var(--tt-warning)' : 'var(--tt-critical-text)' }}>
                      {p.successRate > 0 ? `${p.successRate.toFixed(1)}%` : '—'}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 12 }}>
                    {p.integrityScore > 0 ? `${(p.integrityScore * 100).toFixed(0)}%` : '—'}
                  </td>
                  <td style={tdStyle}>
                    <MiniBar data={p.trend} color={p.status === 'healthy' ? 'var(--tt-accent)' : p.status === 'critical' ? 'var(--tt-critical)' : 'var(--tt-warning)'} />
                  </td>
                </tr>
              ))}
              {filteredProviders.length === 0 && (
                <tr><td colSpan={8} style={{ ...tdStyle, textAlign: 'center', color: 'var(--tt-text-muted)' }}>No providers match the current filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Sessions Table */}
        <div className="tt-panel" style={{ padding: 16, overflowX: 'auto' }}>
          <div className="tt-label" style={{ marginBottom: 12 }}>Recent Sessions</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['ID', 'Time', 'Provider', 'Model', 'Tokens', 'Cost', 'Status', 'Score'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentSessions.map(s => (
                <SessionRow key={s.id} session={s} onSelect={setSelectedSession} />
              ))}
              {recentSessions.length === 0 && (
                <tr><td colSpan={8} style={{ ...tdStyle, textAlign: 'center', color: 'var(--tt-text-muted)' }}>No sessions match the current filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SessionDetailSheet session={selectedSession} onClose={() => setSelectedSession(null)} />
    </div>
  );
}
