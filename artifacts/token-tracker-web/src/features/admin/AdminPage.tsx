import { PageHeader } from '@/components/shared/SectionHeader';
import { StateChip } from '@/components/shared/StateChip';
import { HealthDot } from '@/components/shared/StateChip';
import { IntegrityLane } from '@/components/charts/IntegrityLane';
import { mockSystemHealth, mockIngestionRecords, mockAuditLog, mockTeamManagement, mockProviderConfig } from '@/data/mock/admin';
import { mockTeamMembers } from '@/data/mock/team';

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
  fontSize: 11,
  borderBottom: '1px solid var(--tt-border)',
  color: 'var(--tt-text-primary)',
};

const OUTCOME_COLORS = {
  success: 'var(--tt-accent)',
  failure: 'var(--tt-critical-text)',
  warning: 'var(--tt-warning)',
};

export function AdminPage() {
  const resolutionRate = (mockSystemHealth.surfaceTruthResolved / (mockSystemHealth.surfaceTruthResolved + mockSystemHealth.surfaceTruthUnresolved + mockSystemHealth.surfaceTruthUnknown)) * 100;

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1400 }}>
      <PageHeader
        title="Admin"
        subtitle="System health, ingestion, and provider configuration"
        badge={<StateChip state={mockSystemHealth.overall} size="md" />}
      />

      {/* System Health Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Overall Status', value: mockSystemHealth.overall, isState: true },
          { label: 'Active Providers', value: `${mockSystemHealth.activeProviders} / ${mockSystemHealth.providerCount}`, isState: false },
          { label: 'Degraded', value: String(mockSystemHealth.degradedProviders), isState: false },
          { label: 'Critical', value: String(mockSystemHealth.criticalProviders), isState: false },
          { label: 'Truth Resolution', value: `${resolutionRate.toFixed(0)}%`, isState: false },
        ].map(item => (
          <div key={item.label} className="tt-panel" style={{ padding: '12px 14px' }}>
            <div className="tt-label">{item.label}</div>
            <div style={{ marginTop: 6 }}>
              {item.isState ? (
                <StateChip state={item.value as any} size="md" />
              ) : (
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 20, color: 'var(--tt-text-primary)' }}>{item.value}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Surface Truth Summary */}
      <div style={{ ...panelStyle, marginBottom: 16 }}>
        <div style={labelStyle}>Surface Truth Status</div>
        <IntegrityLane
          segments={[
            { label: 'Resolved', value: mockSystemHealth.surfaceTruthResolved, state: 'healthy' },
            { label: 'Unresolved', value: mockSystemHealth.surfaceTruthUnresolved, state: 'unresolved' },
            { label: 'Unknown', value: mockSystemHealth.surfaceTruthUnknown, state: 'unknown' },
          ]}
          height={12}
          showLabels={true}
        />
      </div>

      {/* Provider Config + Ingestion Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Provider Config */}
        <div style={panelStyle}>
          <div style={labelStyle}>Provider Configuration</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mockProviderConfig.map(pc => (
              <div key={pc.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--tt-bg)', borderRadius: 5, border: '1px solid var(--tt-border)' }} data-testid={`provider-config-${pc.id}`}>
                <HealthDot state={pc.status} size={8} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, fontFamily: "'Space Grotesk', sans-serif", color: 'var(--tt-text-primary)' }}>{pc.name}</div>
                  <div style={{ fontSize: 9, color: 'var(--tt-text-muted)', fontFamily: 'JetBrains Mono', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pc.endpoint}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                  <StateChip state={pc.status} size="sm" />
                  <span style={{ fontSize: 9, fontFamily: 'JetBrains Mono', color: pc.apiKeyStatus === 'active' ? 'var(--tt-accent)' : 'var(--tt-text-muted)' }}>
                    {pc.apiKeyStatus === 'active' ? '● API KEY ACTIVE' : '○ API KEY INACTIVE'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ingestion Records */}
        <div style={panelStyle}>
          <div style={labelStyle}>Ingestion Status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mockIngestionRecords.map(rec => (
              <div key={rec.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--tt-bg)', borderRadius: 5, border: '1px solid var(--tt-border)' }} data-testid={`ingestion-${rec.id}`}>
                <HealthDot state={rec.status} size={8} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontFamily: "'Manrope', sans-serif", color: 'var(--tt-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rec.source}</div>
                  <div style={{ fontSize: 9, fontFamily: 'JetBrains Mono', color: 'var(--tt-text-muted)' }}>
                    Last: {new Date(rec.lastRun).toLocaleTimeString()} · {rec.records.toLocaleString()} records
                  </div>
                </div>
                <StateChip state={rec.status} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Management + Member Table */}
      <div style={{ ...panelStyle, marginBottom: 16 }}>
        <div style={labelStyle}>Team Management</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          {mockTeamManagement.map(team => (
            <div key={team.id} style={{ padding: '10px 12px', background: 'var(--tt-bg)', border: '1px solid var(--tt-border)', borderRadius: 5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 500, fontFamily: "'Space Grotesk', sans-serif", color: 'var(--tt-text-primary)' }}>{team.name}</span>
                <StateChip state={team.status as any} size="sm" />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div>
                  <div className="tt-label">Members</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: 'var(--tt-text-primary)' }}>{team.members}</div>
                </div>
                <div>
                  <div className="tt-label">Spend</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: 'var(--tt-text-primary)' }}>${team.spend.toFixed(0)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Name', 'Role', 'Tokens', 'Sessions', 'Cost', 'Status', 'Actions'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockTeamMembers.map(m => (
              <tr key={m.id} data-testid={`admin-member-${m.id}`}>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: m.status === 'active' ? 'var(--tt-accent-soft)' : 'var(--tt-bg)', border: '1px solid var(--tt-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontFamily: 'JetBrains Mono', color: m.status === 'active' ? 'var(--tt-accent)' : 'var(--tt-text-muted)', flexShrink: 0 }}>
                      {m.avatar}
                    </div>
                    <span style={{ fontSize: 12, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, color: 'var(--tt-text-primary)' }}>{m.name}</span>
                  </div>
                </td>
                <td style={{ ...tdStyle, color: 'var(--tt-text-muted)', fontFamily: "'Manrope', sans-serif" }}>{m.role}</td>
                <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono' }}>{m.tokens > 0 ? `${(m.tokens / 1e6).toFixed(1)}M` : '—'}</td>
                <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono' }}>{m.sessions > 0 ? m.sessions.toLocaleString() : '—'}</td>
                <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono' }}>{m.cost > 0 ? `$${m.cost.toFixed(0)}` : '—'}</td>
                <td style={tdStyle}>
                  <StateChip state={m.status === 'active' ? 'healthy' : m.status === 'disconnected' ? 'disconnected' : 'unknown'} size="sm" />
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={{ padding: '3px 8px', fontSize: 9, fontFamily: "'Manrope', sans-serif", fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', background: 'var(--tt-bg-secondary)', border: '1px solid var(--tt-border)', borderRadius: 4, color: 'var(--tt-text-secondary)', cursor: 'pointer' }}>Edit</button>
                    {m.status !== 'active' && (
                      <button style={{ padding: '3px 8px', fontSize: 9, fontFamily: "'Manrope', sans-serif", fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', background: 'var(--tt-bg-secondary)', border: '1px solid var(--tt-border)', borderRadius: 4, color: 'var(--tt-warning)', cursor: 'pointer' }}>Reconnect</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Audit Log */}
      <div style={panelStyle}>
        <div style={labelStyle}>Audit Log</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Time', 'Actor', 'Action', 'Target', 'Outcome'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockAuditLog.map(entry => (
                <tr key={entry.id} data-testid={`audit-${entry.id}`}>
                  <td style={{ ...tdStyle, fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--tt-text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                  <td style={{ ...tdStyle, fontSize: 11, color: 'var(--tt-text-secondary)' }}>{entry.actor}</td>
                  <td style={{ ...tdStyle, fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--tt-accent)' }}>{entry.action}</td>
                  <td style={{ ...tdStyle, fontSize: 11, color: 'var(--tt-text-muted)' }}>{entry.target}</td>
                  <td style={tdStyle}>
                    <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: OUTCOME_COLORS[entry.outcome] ?? 'var(--tt-text-muted)', fontWeight: 600 }}>
                      {entry.outcome.toUpperCase()}
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
