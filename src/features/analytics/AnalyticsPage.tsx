import { useMemo } from 'react';
import { PageHeader } from '@/components/shared/SectionHeader';
import { StateChip } from '@/components/shared/StateChip';
import { StatCard } from '@/components/shared/StatCard';
import { FilterBar } from '@/components/shared/FilterBar';
import { TrendLine } from '@/components/charts/TrendLine';
import { IntegrityLane } from '@/components/charts/IntegrityLane';
import { HeatmapGrid } from '@/components/charts/HeatmapGrid';
import { CompositionBar } from '@/components/charts/CompositionBar';
import { RankedBar } from '@/components/charts/RankedBar';
import { SparkLine } from '@/components/charts/SparkLine';
import { MatrixComparison } from '@/components/charts/MatrixComparison';
import { mockProviders } from '@/data/mock/providers';
import { mockModels } from '@/data/mock/models';
import { mockSessions } from '@/data/mock/sessions';
import { mockDailyActivity, mockHourlyActivity, mockHeatmapDays, mockHeatmapHours } from '@/data/mock/analytics';
import { mockAssetVolatility, mockSuccessFactors, mockSuccessAnalysisSummary } from '@/data/mock/metrics';
import { useFilters, sliceByTimeframe, filterSessions, filterProviders } from '@/lib/filters';

const panelStyle: React.CSSProperties = {
  background: 'var(--tt-bg-secondary)',
  border: '1px solid var(--tt-border)',
  borderRadius: 6,
  padding: 16,
};

const labelStyle: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--tt-text-muted)',
  fontFamily: "'Manrope', sans-serif",
  marginBottom: 12,
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
};

const tdStyle: React.CSSProperties = {
  padding: '8px 10px',
  fontSize: 12,
  color: 'var(--tt-text-primary)',
  borderBottom: '1px solid var(--tt-border)',
};

const RISK_COLORS: Record<string, string> = {
  low: 'var(--tt-accent)',
  medium: 'var(--tt-warning)',
  high: 'var(--tt-fallback)',
  extreme: 'var(--tt-critical-text)',
};

const RISK_STATES: Record<string, 'healthy' | 'warning' | 'degraded' | 'critical'> = {
  low: 'healthy',
  medium: 'warning',
  high: 'degraded',
  extreme: 'critical',
};

function fmt(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  return n.toFixed(0);
}

export function AnalyticsPage() {
  const { filters } = useFilters();

  const filteredActivity = useMemo(
    () => sliceByTimeframe(mockDailyActivity, filters.timeframe),
    [filters.timeframe]
  );

  const filteredSessions = useMemo(
    () => filterSessions(mockSessions, filters),
    [filters]
  );

  const filteredProviders = useMemo(
    () => filterProviders(mockProviders, filters),
    [filters]
  );

  const periodDays = filteredActivity.length;
  const prevStart = Math.max(0, mockDailyActivity.length - periodDays * 2);
  const prevEnd = Math.max(0, mockDailyActivity.length - periodDays);
  const prevPeriod = useMemo(
    () => mockDailyActivity.slice(prevStart, prevEnd),
    [prevStart, prevEnd]
  );

  const trendData = useMemo(
    () => filteredActivity.map(d => ({
      date: d.date,
      tokens: Math.round(d.tokens / 1e6 * 10) / 10,
      sessions: d.sessions,
      cost: Math.round(d.cost * 10) / 10,
      success: d.successRate,
    })),
    [filteredActivity]
  );

  const sumTokens = (arr: typeof mockDailyActivity) => arr.reduce((s, d) => s + d.tokens, 0);
  const sumSessions = (arr: typeof mockDailyActivity) => arr.reduce((s, d) => s + d.sessions, 0);
  const sumCost = (arr: typeof mockDailyActivity) => arr.reduce((s, d) => s + d.cost, 0);
  const avgSuccess = (arr: typeof mockDailyActivity) =>
    arr.length > 0 ? arr.reduce((s, d) => s + d.successRate, 0) / arr.length : 0;

  const currT = useMemo(() => sumTokens(filteredActivity), [filteredActivity]);
  const prevT = useMemo(() => sumTokens(prevPeriod), [prevPeriod]);
  const currS = useMemo(() => sumSessions(filteredActivity), [filteredActivity]);
  const prevS = useMemo(() => sumSessions(prevPeriod), [prevPeriod]);
  const currC = useMemo(() => sumCost(filteredActivity), [filteredActivity]);
  const prevC = useMemo(() => sumCost(prevPeriod), [prevPeriod]);
  const currSR = useMemo(() => avgSuccess(filteredActivity), [filteredActivity]);
  const prevSR = useMemo(() => avgSuccess(prevPeriod), [prevPeriod]);

  const deltaT = prevT > 0 ? ((currT - prevT) / prevT) * 100 : 0;
  const deltaS = prevS > 0 ? ((currS - prevS) / prevS) * 100 : 0;
  const deltaC = prevC > 0 ? ((currC - prevC) / prevC) * 100 : 0;
  const deltaSR = currSR - prevSR;

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

  const outcomeComposition = useMemo(() => [
    { label: 'Success',  value: filteredSessions.filter(s => s.status === 'success').length,  color: 'var(--tt-accent)' },
    { label: 'Warning',  value: filteredSessions.filter(s => s.status === 'warning').length,  color: 'var(--tt-warning)' },
    { label: 'Error',    value: filteredSessions.filter(s => s.status === 'error').length,    color: 'var(--tt-error)' },
    { label: 'Fallback', value: filteredSessions.filter(s => s.status === 'fallback').length, color: 'var(--tt-fallback)' },
    { label: 'Degraded', value: filteredSessions.filter(s => s.status === 'degraded').length, color: 'var(--tt-degraded)' },
    { label: 'Unknown',  value: filteredSessions.filter(s => s.status === 'unknown').length,  color: 'var(--tt-unknown)' },
  ], [filteredSessions]);

  const providerHeatmap = useMemo(
    () => filteredProviders.map(p => filteredActivity.slice(-10).map(d => d.providers[p.name] ?? 0)),
    [filteredProviders, filteredActivity]
  );

  const periodLabel = filters.timeframe === '7d' ? '7 Days'
    : filters.timeframe === '14d' ? '14 Days'
    : filters.timeframe === '30d' ? '30 Days'
    : filters.timeframe === '24h' ? '24 Hours'
    : `${filters.timeframe}`;

  return (
    <div>
      <FilterBar />
      <div style={{ padding: '24px 28px', maxWidth: 1400 }}>
        <PageHeader
          title="Analytics"
          subtitle="Comparison-first deep analysis"
          badge={<StateChip state="mixed" size="md" />}
        />

        {/* Analytics Hero — current vs prior period */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
          <StatCard label={`Tokens (${filters.timeframe})`} value={fmt(currT)} delta={deltaT} />
          <StatCard label={`Sessions (${filters.timeframe})`} value={fmt(currS)} delta={deltaS} />
          <StatCard label={`Spend (${filters.timeframe})`} value={`$${currC.toFixed(0)}`} delta={deltaC} />
          <StatCard label={`Success Rate (${filters.timeframe})`} value={`${currSR.toFixed(1)}%`} delta={deltaSR} />
        </div>

        {/* Prior period reference */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, alignItems: 'center' }}>
          <span className="tt-label">Prior period:</span>
          {[
            { label: 'Tokens', value: fmt(prevT) },
            { label: 'Sessions', value: prevS.toLocaleString() },
            { label: 'Spend', value: `$${prevC.toFixed(0)}` },
            { label: 'Success', value: `${prevSR.toFixed(1)}%` },
          ].map(item => (
            <span key={item.label} style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--tt-text-muted)', background: 'var(--tt-bg-secondary)', border: '1px solid var(--tt-border)', padding: '2px 8px', borderRadius: 4 }}>
              {item.label}: {item.value}
            </span>
          ))}
        </div>

        {/* Trend panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={panelStyle}>
            <div style={labelStyle}>Token Volume — {periodLabel}</div>
            <TrendLine
              data={trendData}
              series={[{ key: 'tokens', label: 'Tokens (M)', color: 'var(--tt-accent)' }]}
              height={160}
              formatValue={v => `${v.toFixed(1)}M`}
            />
          </div>
          <div style={panelStyle}>
            <div style={labelStyle}>Session Volume — {periodLabel}</div>
            <TrendLine
              data={trendData}
              series={[{ key: 'sessions', label: 'Sessions', color: 'var(--tt-mixed)' }]}
              height={160}
            />
          </div>
        </div>

        {/* Value Density + Provider Efficiency */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={panelStyle}>
            <div style={labelStyle}>Value Density — Cost per 1K Tokens</div>
            <RankedBar
              items={mockModels.map(m => ({
                label: m.name,
                value: m.avgCost * 1000,
                color: m.avgCost > 0.04 ? 'var(--tt-critical)' : m.avgCost > 0.02 ? 'var(--tt-warning)' : 'var(--tt-accent)',
              }))}
              formatValue={v => `$${v.toFixed(2)}`}
            />
          </div>
          <div style={panelStyle}>
            <div style={labelStyle}>Provider Efficiency — Success Rate</div>
            <RankedBar
              items={filteredProviders.filter(p => p.successRate > 0).map(p => ({
                label: p.name,
                value: p.successRate,
                color: p.successRate >= 90 ? 'var(--tt-accent)' : p.successRate >= 70 ? 'var(--tt-warning)' : 'var(--tt-critical)',
              }))}
              formatValue={v => `${v.toFixed(1)}%`}
            />
          </div>
        </div>

        {/* Activity Cadence + Spend Trend */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={panelStyle}>
            <div style={labelStyle}>Activity Cadence — Hour × Day</div>
            <HeatmapGrid
              data={mockHourlyActivity}
              rowLabels={mockHeatmapDays}
              colLabels={mockHeatmapHours}
            />
          </div>
          <div style={panelStyle}>
            <div style={labelStyle}>Spend Trend — {periodLabel}</div>
            <TrendLine
              data={trendData}
              series={[{ key: 'cost', label: 'Spend ($)', color: 'var(--tt-fallback)' }]}
              height={160}
              formatValue={v => `$${v.toFixed(0)}`}
            />
          </div>
        </div>

        {/* Outcome Composition + Model Pressure */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={panelStyle}>
            <div style={labelStyle}>Outcome Composition</div>
            <CompositionBar segments={outcomeComposition} height={14} showLegend={true} />
          </div>
          <div style={panelStyle}>
            <div style={labelStyle}>Model Pressure</div>
            <RankedBar
              items={mockModels.map(m => ({
                label: m.name,
                value: m.pressure * 100,
                color: m.pressure > 0.8 ? 'var(--tt-critical)' : m.pressure > 0.5 ? 'var(--tt-warning)' : 'var(--tt-accent)',
              }))}
              formatValue={v => `${v.toFixed(0)}%`}
            />
          </div>
        </div>

        {/* Asset Volatility */}
        <div style={{ ...panelStyle, marginBottom: 16 }}>
          <div style={labelStyle}>Asset Volatility — Model Risk Analysis</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Model', 'Provider', 'Risk', 'Volatility Score', 'Success Std Dev', 'Latency Std Dev', 'Cost Std Dev'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockAssetVolatility.map((rec, i) => (
                  <tr key={i} data-testid={`volatility-row-${i}`}>
                    <td style={tdStyle}><span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 12 }}>{rec.model}</span></td>
                    <td style={{ ...tdStyle, color: 'var(--tt-text-muted)', fontSize: 11 }}>{rec.provider}</td>
                    <td style={tdStyle}>
                      <StateChip state={RISK_STATES[rec.riskLevel]} label={rec.riskLevel} size="sm" />
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                        <div style={{ width: 60, height: 6, background: 'var(--tt-bg)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${rec.volatilityScore * 100}%`, height: '100%', background: RISK_COLORS[rec.riskLevel], borderRadius: 3 }} />
                        </div>
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: RISK_COLORS[rec.riskLevel], flexShrink: 0 }}>
                          {(rec.volatilityScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--tt-text-muted)' }}>±{rec.successRateStdDev.toFixed(1)}%</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--tt-text-muted)' }}>{rec.latencyStdDev.toLocaleString()}ms</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--tt-text-muted)' }}>${rec.costStdDev.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Success Analysis */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={panelStyle}>
            <div style={labelStyle}>Success Analysis — Outcome Distribution</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
              {[
                { label: 'Success', value: `${mockSuccessAnalysisSummary.overallPct}%`, color: 'var(--tt-accent)' },
                { label: 'Warning', value: `${mockSuccessAnalysisSummary.warnPct}%`, color: 'var(--tt-warning)' },
                { label: 'Error', value: `${mockSuccessAnalysisSummary.errorPct}%`, color: 'var(--tt-error)' },
                { label: 'Fallback', value: `${mockSuccessAnalysisSummary.fallbackPct}%`, color: 'var(--tt-fallback)' },
                { label: 'Degraded', value: `${mockSuccessAnalysisSummary.degradedPct}%`, color: 'var(--tt-degraded)' },
                { label: 'Unknown', value: `${mockSuccessAnalysisSummary.unknownPct}%`, color: 'var(--tt-unknown)' },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--tt-bg)', border: '1px solid var(--tt-border)', borderRadius: 5, padding: '8px 10px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 16, color: item.color, fontWeight: 500 }}>{item.value}</div>
                  <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--tt-text-muted)', marginTop: 2 }}>{item.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, background: 'var(--tt-bg)', border: '1px solid var(--tt-border)', borderRadius: 5, padding: '8px 10px' }}>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--tt-text-muted)', marginBottom: 4 }}>7d Trend</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: 'var(--tt-accent)' }}>{mockSuccessAnalysisSummary.trend7d}</div>
              </div>
              <div style={{ flex: 1, background: 'var(--tt-bg)', border: '1px solid var(--tt-border)', borderRadius: 5, padding: '8px 10px' }}>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--tt-text-muted)', marginBottom: 4 }}>30d Trend</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: 'var(--tt-warning)' }}>{mockSuccessAnalysisSummary.trend30d}</div>
              </div>
            </div>
          </div>

          <div style={panelStyle}>
            <div style={labelStyle}>Success Factors — Impact Analysis</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mockSuccessFactors.map((factor, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: factor.direction === 'positive' ? 'var(--tt-accent)' : factor.direction === 'negative' ? 'var(--tt-error)' : 'var(--tt-text-muted)',
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 11, color: 'var(--tt-text-secondary)', fontFamily: "'Manrope', sans-serif", flex: 1, minWidth: 0 }}>{factor.factor}</span>
                  <div style={{ width: 80, height: 4, background: 'var(--tt-bg)', borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                    <div style={{
                      width: `${factor.impact * 100}%`,
                      height: '100%',
                      background: factor.direction === 'positive' ? 'var(--tt-accent)' : factor.direction === 'negative' ? 'var(--tt-error)' : 'var(--tt-text-muted)',
                      borderRadius: 2,
                    }} />
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--tt-text-muted)', flexShrink: 0, width: 32, textAlign: 'right' }}>
                    {factor.frequency}×
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Heatmap + Success Analysis by Provider */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={panelStyle}>
            <div style={labelStyle}>Activity Heatmap — Date × Provider</div>
            <HeatmapGrid
              data={providerHeatmap}
              rowLabels={filteredProviders.map(p => p.name.slice(0, 8))}
              colLabels={filteredActivity.slice(-10).map(d => d.date.slice(5))}
              color="var(--tt-accent)"
            />
          </div>
          <div style={panelStyle}>
            <div style={labelStyle}>Success Analysis — By Provider</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredProviders.filter(p => p.successRate > 0).map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 80, fontSize: 11, color: 'var(--tt-text-secondary)', fontFamily: "'Manrope', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>{p.name}</span>
                  <SparkLine data={p.trend} color={p.status === 'healthy' ? 'var(--tt-accent)' : p.status === 'critical' ? 'var(--tt-critical)' : 'var(--tt-warning)'} height={24} />
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--tt-text-primary)', marginLeft: 'auto', flexShrink: 0 }}>{p.successRate.toFixed(1)}%</span>
                </div>
              ))}
              {filteredProviders.length === 0 && (
                <div style={{ color: 'var(--tt-text-muted)', fontSize: 12 }}>No providers match the current filter.</div>
              )}
            </div>
          </div>
        </div>

        {/* Context Pressure + Active Surface Truth */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={panelStyle}>
            <div style={labelStyle}>Context Pressure — Provider Breakdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredProviders.filter(p => p.sessions > 0).map(p => (
                <div key={p.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--tt-text-secondary)' }}>{p.name}</span>
                    <StateChip state={p.status} size="sm" />
                  </div>
                  <IntegrityLane
                    segments={[
                      { label: 'Good', value: Math.round(p.integrityScore * 80), state: 'healthy' },
                      { label: 'Degraded', value: Math.round((1 - p.integrityScore) * 60), state: 'degraded' },
                      { label: 'Low', value: Math.round((1 - p.integrityScore) * 40), state: 'critical' },
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
          <div style={panelStyle}>
            <div style={labelStyle}>Active Surface Truth</div>
            <CompositionBar
              segments={[
                { label: 'Resolved', value: surfaceTruthResolved, color: 'var(--tt-accent)' },
                { label: 'Unresolved', value: surfaceTruthUnresolved, color: 'var(--tt-unresolved)' },
                { label: 'Unknown', value: surfaceTruthUnknown, color: 'var(--tt-unknown)' },
              ]}
              height={12}
              showLegend={true}
            />
            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[
                { label: 'Resolved', value: surfaceTruthResolved, color: 'var(--tt-accent)' },
                { label: 'Unresolved', value: surfaceTruthUnresolved, color: 'var(--tt-unresolved)' },
                { label: 'Unknown', value: surfaceTruthUnknown, color: 'var(--tt-unknown)' },
              ].map(item => (
                <div key={item.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 18, color: item.color, fontWeight: 500 }}>{item.value}</div>
                  <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--tt-text-muted)' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Success Rate Trend */}
        <div style={{ ...panelStyle, marginBottom: 16 }}>
          <div style={labelStyle}>Success Rate Trend — {periodLabel}</div>
          <TrendLine
            data={trendData}
            series={[{ key: 'success', label: 'Success Rate %', color: 'var(--tt-accent)' }]}
            height={120}
            formatValue={v => `${v.toFixed(1)}%`}
          />
        </div>

        {/* Model Breakdown Table */}
        <div style={{ ...panelStyle, marginBottom: 16, overflowX: 'auto' }}>
          <div style={labelStyle}>Model Breakdown</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Model', 'Provider', 'Tokens', 'Sessions', 'Success Rate', 'Avg Cost', 'Pressure'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockModels.map(m => (
                <tr key={m.id} data-testid={`model-row-${m.id}`}>
                  <td style={tdStyle}><span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 12 }}>{m.name}</span></td>
                  <td style={tdStyle}><span style={{ fontSize: 11, color: 'var(--tt-text-muted)' }}>{m.provider}</span></td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 11 }}>{(m.tokens / 1e6).toFixed(1)}M</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 11 }}>{m.sessions.toLocaleString()}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
                    <span style={{ color: m.successRate >= 90 ? 'var(--tt-accent)' : m.successRate >= 70 ? 'var(--tt-warning)' : 'var(--tt-critical-text)' }}>
                      {m.successRate.toFixed(1)}%
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 11 }}>${m.avgCost.toFixed(3)}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
                    <span style={{ color: m.pressure > 0.8 ? 'var(--tt-critical-text)' : m.pressure > 0.5 ? 'var(--tt-warning)' : 'var(--tt-accent)' }}>
                      {(m.pressure * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Provider × Model Token Matrix */}
        {(() => {
          const topProviders = filteredProviders.slice(0, 4).map(p => p.name);
          const topModels = mockModels.slice(0, 6).map(m => m.name.split(' ').slice(-2).join(' '));
          const matrix = topProviders.map(pName => {
            const provider = filteredProviders.find(p => p.name === pName);
            return topModels.map((_, mi) => {
              const model = mockModels[mi];
              const isMatch = provider?.models.includes(model.name) ?? false;
              return { value: isMatch ? Math.round(model.tokens / 1e3) : 0 };
            });
          });
          if (topProviders.length === 0) return null;
          return (
            <div style={{ ...panelStyle, marginBottom: 16 }}>
              <div style={labelStyle}>Provider × Model — Token Distribution (K)</div>
              <MatrixComparison
                data={matrix}
                rowLabels={topProviders}
                colLabels={topModels}
                formatValue={v => v === 0 ? '' : `${v}K`}
              />
            </div>
          );
        })()}

        {/* Daily Activity Table */}
        <div style={{ ...panelStyle, overflowX: 'auto' }}>
          <div style={labelStyle}>Daily Activity — {periodLabel}</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Date', 'Tokens', 'Sessions', 'Spend', 'Success Rate'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredActivity.slice().reverse().map(d => (
                <tr key={d.date} data-testid={`daily-row-${d.date}`}>
                  <td style={{ ...tdStyle, fontFamily: 'JetBrains Mono', fontSize: 11 }}>{d.date}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 11 }}>{(d.tokens / 1e6).toFixed(1)}M</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 11 }}>{d.sessions.toLocaleString()}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 11 }}>${d.cost.toFixed(0)}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
                    <span style={{ color: d.successRate >= 95 ? 'var(--tt-accent)' : d.successRate >= 85 ? 'var(--tt-warning)' : 'var(--tt-critical-text)' }}>
                      {d.successRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
