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
import { mockProviders } from '@/data/mock/providers';
import { mockModels } from '@/data/mock/models';
import { mockSessions } from '@/data/mock/sessions';
import { mockDailyActivity, mockHourlyActivity, mockHeatmapDays, mockHeatmapHours } from '@/data/mock/analytics';

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

export function AnalyticsPage() {
  const trendData14 = mockDailyActivity.slice(-14).map(d => ({
    date: d.date,
    tokens: Math.round(d.tokens / 1e6 * 10) / 10,
    sessions: d.sessions,
    cost: Math.round(d.cost * 10) / 10,
    success: d.successRate,
  }));

  const currentPeriod = mockDailyActivity.slice(-7);
  const prevPeriod = mockDailyActivity.slice(-14, -7);

  const sumTokens = (arr: typeof mockDailyActivity) => arr.reduce((s, d) => s + d.tokens, 0);
  const sumSessions = (arr: typeof mockDailyActivity) => arr.reduce((s, d) => s + d.sessions, 0);
  const sumCost = (arr: typeof mockDailyActivity) => arr.reduce((s, d) => s + d.cost, 0);
  const avgSuccess = (arr: typeof mockDailyActivity) => arr.reduce((s, d) => s + d.successRate, 0) / arr.length;

  const currT = sumTokens(currentPeriod);
  const prevT = sumTokens(prevPeriod);
  const currS = sumSessions(currentPeriod);
  const prevS = sumSessions(prevPeriod);
  const currC = sumCost(currentPeriod);
  const prevC = sumCost(prevPeriod);
  const currSR = avgSuccess(currentPeriod);
  const prevSR = avgSuccess(prevPeriod);

  const deltaT = ((currT - prevT) / prevT) * 100;
  const deltaS = ((currS - prevS) / prevS) * 100;
  const deltaC = ((currC - prevC) / prevC) * 100;
  const deltaSR = currSR - prevSR;

  function fmt(n: number) {
    if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
    return n.toFixed(0);
  }

  const surfaceTruthResolved = mockSessions.filter(s => s.surfaceTruth === 'resolved').length;
  const surfaceTruthUnresolved = mockSessions.filter(s => s.surfaceTruth === 'unresolved').length;
  const surfaceTruthUnknown = mockSessions.filter(s => s.surfaceTruth === 'unknown').length;

  const outcomeComposition = [
    { label: 'Success', value: mockSessions.filter(s => s.status === 'success').length, color: 'var(--tt-accent)' },
    { label: 'Warning', value: mockSessions.filter(s => s.status === 'warning').length, color: 'var(--tt-warning)' },
    { label: 'Error', value: mockSessions.filter(s => s.status === 'error').length, color: 'var(--tt-critical)' },
    { label: 'Fallback', value: mockSessions.filter(s => s.status === 'fallback').length, color: 'var(--tt-fallback)' },
    { label: 'Degraded', value: mockSessions.filter(s => s.status === 'degraded').length, color: 'var(--tt-degraded)' },
    { label: 'Unknown', value: mockSessions.filter(s => s.status === 'unknown').length, color: 'var(--tt-unknown)' },
  ];

  const providerHeatmap = mockProviders.map(p => mockDailyActivity.slice(-10).map(d => d.providers[p.name] ?? 0));

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
          <StatCard label="Tokens (7d)" value={fmt(currT)} delta={deltaT} />
          <StatCard label="Sessions (7d)" value={fmt(currS)} delta={deltaS} />
          <StatCard label="Spend (7d)" value={`$${currC.toFixed(0)}`} delta={deltaC} />
          <StatCard label="Success Rate (7d)" value={`${currSR.toFixed(1)}%`} delta={deltaSR} />
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

        {/* Trend panels side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={panelStyle}>
            <div style={labelStyle}>Token Volume — 14 Days</div>
            <TrendLine
              data={trendData14}
              series={[{ key: 'tokens', label: 'Tokens (M)', color: 'var(--tt-accent)' }]}
              height={160}
              formatValue={v => `${v.toFixed(1)}M`}
            />
          </div>
          <div style={panelStyle}>
            <div style={labelStyle}>Session Volume — 14 Days</div>
            <TrendLine
              data={trendData14}
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
              items={mockProviders.filter(p => p.successRate > 0).map(p => ({
                label: p.name,
                value: p.successRate,
                color: p.successRate >= 90 ? 'var(--tt-accent)' : p.successRate >= 70 ? 'var(--tt-warning)' : 'var(--tt-critical)',
              }))}
              formatValue={v => `${v.toFixed(1)}%`}
            />
          </div>
        </div>

        {/* Activity Cadence + Cost Trend */}
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
            <div style={labelStyle}>Spend Trend — 14 Days</div>
            <TrendLine
              data={trendData14}
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

        {/* Activity Heatmap + Success Analysis */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={panelStyle}>
            <div style={labelStyle}>Activity Heatmap — Date × Provider</div>
            <HeatmapGrid
              data={providerHeatmap}
              rowLabels={mockProviders.map(p => p.name.slice(0, 8))}
              colLabels={mockDailyActivity.slice(-10).map(d => d.date.slice(5))}
              color="var(--tt-accent)"
            />
          </div>
          <div style={panelStyle}>
            <div style={labelStyle}>Success Analysis — By Provider</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {mockProviders.filter(p => p.successRate > 0).map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 80, fontSize: 11, color: 'var(--tt-text-secondary)', fontFamily: "'Manrope', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>{p.name}</span>
                  <SparkLine data={p.trend} color={p.status === 'healthy' ? 'var(--tt-accent)' : p.status === 'critical' ? 'var(--tt-critical)' : 'var(--tt-warning)'} height={24} />
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--tt-text-primary)', marginLeft: 'auto', flexShrink: 0 }}>{p.successRate.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Context Pressure + Active Surface Truth */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={panelStyle}>
            <div style={labelStyle}>Context Pressure — Provider Breakdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mockProviders.filter(p => p.sessions > 0).map(p => (
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
          <div style={labelStyle}>Success Rate Trend — 14 Days</div>
          <TrendLine
            data={trendData14}
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

        {/* Daily Activity Table */}
        <div style={{ ...panelStyle, overflowX: 'auto' }}>
          <div style={labelStyle}>Daily Activity — Last 14 Days</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Date', 'Tokens', 'Sessions', 'Spend', 'Success Rate'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockDailyActivity.slice(-14).reverse().map(d => (
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
