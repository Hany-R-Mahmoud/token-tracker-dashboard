import { useState } from 'react';
import { PageHeader } from '@/components/shared/SectionHeader';
import { useAuth } from '@/lib/auth';

const sectionStyle: React.CSSProperties = {
  background: 'var(--tt-bg-secondary)',
  border: '1px solid var(--tt-border)',
  borderRadius: 6,
  padding: 20,
  marginBottom: 16,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 9,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--tt-text-muted)',
  fontFamily: "'Manrope', sans-serif",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  background: 'var(--tt-bg)',
  border: '1px solid var(--tt-border)',
  borderRadius: 5,
  color: 'var(--tt-text-primary)',
  fontSize: 12,
  fontFamily: "'Manrope', sans-serif",
  outline: 'none',
  boxSizing: 'border-box',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  fontFamily: "'Space Grotesk', sans-serif",
  color: 'var(--tt-text-primary)',
  letterSpacing: '-0.01em',
  marginBottom: 12,
};

const dividerStyle: React.CSSProperties = {
  borderTop: '1px solid var(--tt-border)',
  margin: '16px 0',
};

function ToggleSetting({ label, description, defaultEnabled = false }: { label: string; description?: string; defaultEnabled?: boolean }) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 12 }}>
      <div>
        <div style={{ fontSize: 12, color: 'var(--tt-text-primary)', fontFamily: "'Manrope', sans-serif", fontWeight: 500 }}>{label}</div>
        {description && <div style={{ fontSize: 11, color: 'var(--tt-text-muted)', fontFamily: "'Manrope', sans-serif", marginTop: 2 }}>{description}</div>}
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          background: enabled ? 'var(--tt-accent)' : 'var(--tt-bg)',
          border: `1px solid ${enabled ? 'var(--tt-accent)' : 'var(--tt-border)'}`,
          cursor: 'pointer',
          position: 'relative',
          flexShrink: 0,
          transition: 'all 0.2s',
        }}
        aria-checked={enabled}
        role="switch"
      >
        <span style={{
          display: 'block',
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: 'white',
          position: 'absolute',
          top: 2,
          left: enabled ? 20 : 2,
          transition: 'left 0.2s',
        }} />
      </button>
    </div>
  );
}

export function SettingsPage() {
  const { user } = useAuth();
  const [defaultTimeframe, setDefaultTimeframe] = useState('7d');
  const [exportFormat, setExportFormat] = useState('json');
  const [saveMsg, setSaveMsg] = useState('');

  const handleSave = () => {
    setSaveMsg('Settings saved (mock — no persistence in v1)');
    setTimeout(() => setSaveMsg(''), 2500);
  };

  return (
    <div style={{ padding: '24px 28px', maxWidth: 880 }}>
      <PageHeader title="Settings" subtitle="System configuration and preferences" />

      {/* Account Section */}
      <div style={sectionStyle}>
        <div style={sectionLabelStyle}>Account</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={labelStyle}>Name</label>
            <input style={inputStyle} defaultValue={user.name} readOnly />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} defaultValue={user.email} readOnly />
          </div>
          <div>
            <label style={labelStyle}>Role</label>
            <input style={inputStyle} defaultValue={user.role} readOnly />
          </div>
          <div>
            <label style={labelStyle}>Auth Method</label>
            <input style={inputStyle} defaultValue="Token Tracker Admin (v1)" readOnly />
          </div>
        </div>
        <div style={{ ...dividerStyle, marginBottom: 0 }} />
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--tt-text-muted)', fontFamily: "'Manrope', sans-serif" }}>
            v1 ships with a single admin account. RBAC multi-role support is on the roadmap for v2.
          </div>
        </div>
      </div>

      {/* Dashboard Defaults */}
      <div style={sectionStyle}>
        <div style={sectionLabelStyle}>Dashboard Defaults</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={labelStyle}>Default Timeframe</label>
            <select style={selectStyle} value={defaultTimeframe} onChange={e => setDefaultTimeframe(e.target.value)} data-testid="setting-default-timeframe">
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Export Format</label>
            <select style={selectStyle} value={exportFormat} onChange={e => setExportFormat(e.target.value)} data-testid="setting-export-format">
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="tsv">TSV</option>
            </select>
          </div>
        </div>
      </div>

      {/* Display Preferences */}
      <div style={sectionStyle}>
        <div style={sectionLabelStyle}>Display Preferences</div>
        <ToggleSetting label="Show inline session explanations" description="Display explanation factor tags in session rows" defaultEnabled={true} />
        <ToggleSetting label="Enable sparklines in tables" description="Render mini trend charts in provider and model rows" defaultEnabled={true} />
        <ToggleSetting label="Show surface truth band" description="Display the surface truth resolution bar on Overview" defaultEnabled={true} />
        <ToggleSetting label="Compact sidebar mode" description="Reduce sidebar to icon-only view" />
        <ToggleSetting label="High-contrast mode" description="Increase contrast ratios for accessibility" />
      </div>

      {/* Notification Preferences */}
      <div style={sectionStyle}>
        <div style={sectionLabelStyle}>Notification Preferences</div>
        <ToggleSetting label="Critical provider alerts" description="Notify when any provider reaches critical state" defaultEnabled={true} />
        <ToggleSetting label="Ingestion failure alerts" description="Notify when an ingestion record fails or is degraded" defaultEnabled={true} />
        <ToggleSetting label="Session anomaly alerts" description="Notify when a session's success score drops below threshold" />
        <ToggleSetting label="Surface truth alert" description="Notify when unresolved surface truth surfaces exceed 20%" />
        <ToggleSetting label="Weekly digest email" description="Receive a weekly summary of usage and cost metrics" />
      </div>

      {/* System Configuration */}
      <div style={sectionStyle}>
        <div style={sectionLabelStyle}>System Configuration</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={labelStyle}>Ingestion Interval (min)</label>
            <input style={inputStyle} defaultValue="15" type="number" min={5} max={60} />
          </div>
          <div>
            <label style={labelStyle}>Session Retention (days)</label>
            <input style={inputStyle} defaultValue="90" type="number" min={7} max={365} />
          </div>
          <div>
            <label style={labelStyle}>Success Score Threshold</label>
            <input style={inputStyle} defaultValue="0.75" type="number" min={0} max={1} step={0.05} />
          </div>
          <div>
            <label style={labelStyle}>Fallback Trigger Threshold</label>
            <input style={inputStyle} defaultValue="3" type="number" min={1} max={10} />
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div style={sectionStyle}>
        <div style={sectionLabelStyle}>Data & Privacy</div>
        <ToggleSetting label="Enable data export" description="Allow export of session logs and analytics" defaultEnabled={true} />
        <ToggleSetting label="Anonymize member data in exports" description="Strip PII from exported records" defaultEnabled={true} />
        <ToggleSetting label="Include evidence notes in exports" description="Export session evidence notes alongside session data" />
      </div>

      {/* Danger Zone */}
      <div style={{ ...sectionStyle, borderColor: 'var(--tt-critical)33' }}>
        <div style={{ ...sectionLabelStyle, color: 'var(--tt-critical-text)' }}>Danger Zone</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Clear Session Cache', desc: 'Remove all cached session data. Ingestion will re-sync.', btnLabel: 'Clear Cache', color: 'var(--tt-warning)' },
            { label: 'Reset Filter Presets', desc: 'Remove all saved filter configurations.', btnLabel: 'Reset Presets', color: 'var(--tt-warning)' },
            { label: 'Wipe Analytics Data', desc: 'Permanently delete all analytics history. Cannot be undone.', btnLabel: 'Wipe Data', color: 'var(--tt-critical-text)' },
          ].map(action => (
            <div key={action.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--tt-bg)', border: '1px solid var(--tt-border)', borderRadius: 5 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--tt-text-primary)', fontFamily: "'Manrope', sans-serif" }}>{action.label}</div>
                <div style={{ fontSize: 11, color: 'var(--tt-text-muted)', fontFamily: "'Manrope', sans-serif", marginTop: 2 }}>{action.desc}</div>
              </div>
              <button style={{ padding: '5px 12px', fontSize: 10, fontFamily: "'Manrope', sans-serif", fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', background: 'var(--tt-bg-secondary)', border: `1px solid ${action.color}44`, borderRadius: 4, color: action.color, cursor: 'pointer', flexShrink: 0, marginLeft: 12 }}>
                {action.btnLabel}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={handleSave}
          data-testid="button-save-settings"
          style={{
            padding: '8px 20px',
            fontSize: 12,
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            background: 'var(--tt-accent)',
            color: 'var(--tt-bg)',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
          }}
        >
          Save Changes
        </button>
        {saveMsg && (
          <span style={{ fontSize: 11, color: 'var(--tt-accent)', fontFamily: 'JetBrains Mono' }}>{saveMsg}</span>
        )}
      </div>
    </div>
  );
}
