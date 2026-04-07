import { HealthState } from '@/types';

interface Segment {
  label: string;
  value: number;
  state: HealthState;
}

const STATE_COLORS: Record<HealthState, string> = {
  healthy: 'var(--tt-accent)',
  mixed: 'var(--tt-mixed)',
  warning: 'var(--tt-warning)',
  critical: 'var(--tt-critical)',
  fallback: 'var(--tt-fallback)',
  degraded: 'var(--tt-degraded)',
  unknown: 'var(--tt-unknown)',
  unresolved: 'var(--tt-unresolved)',
  loading: 'var(--tt-text-muted)',
  error: 'var(--tt-critical)',
  empty: 'var(--tt-text-muted)',
  disconnected: 'var(--tt-text-muted)',
};

interface IntegrityLaneProps {
  segments: Segment[];
  height?: number;
  showLabels?: boolean;
}

export function IntegrityLane({ segments, height = 8, showLabels = false }: IntegrityLaneProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;

  return (
    <div aria-label="integrity lane">
      <div style={{ display: 'flex', height, borderRadius: 4, overflow: 'hidden', gap: 1 }}>
        {segments.map((seg, i) => (
          <div
            key={i}
            style={{
              flex: seg.value / total,
              backgroundColor: STATE_COLORS[seg.state] ?? 'var(--tt-text-muted)',
              opacity: 0.85,
            }}
            title={`${seg.label}: ${seg.value}`}
          />
        ))}
      </div>
      {showLabels && (
        <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
          {segments.map((seg, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--tt-text-muted)', fontFamily: "'Manrope', sans-serif" }}>
              <span style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: STATE_COLORS[seg.state], display: 'inline-block' }} />
              {seg.label} <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--tt-text-primary)' }}>{seg.value}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
