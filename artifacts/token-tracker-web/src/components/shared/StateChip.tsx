import { HealthState } from '@/types';

const STATE_CONFIG: Record<HealthState, { label: string; color: string; bg: string; dot: string }> = {
  healthy:      { label: 'Healthy',      color: 'var(--tt-accent)',       bg: 'var(--tt-success-bg)',   dot: 'var(--tt-accent)' },
  mixed:        { label: 'Mixed',        color: 'var(--tt-mixed)',        bg: 'var(--tt-mixed-bg)',     dot: 'var(--tt-mixed)' },
  warning:      { label: 'Warning',      color: 'var(--tt-warning)',      bg: 'var(--tt-warning-bg)',   dot: 'var(--tt-warning)' },
  critical:     { label: 'Critical',     color: 'var(--tt-critical-text)',bg: 'var(--tt-critical-bg)', dot: 'var(--tt-critical)' },
  fallback:     { label: 'Fallback',     color: 'var(--tt-fallback)',     bg: 'var(--tt-fallback-bg)',  dot: 'var(--tt-fallback)' },
  degraded:     { label: 'Degraded',     color: 'var(--tt-degraded)',     bg: 'var(--tt-degraded-bg)',  dot: 'var(--tt-degraded)' },
  unknown:      { label: 'Unknown',      color: 'var(--tt-unknown)',      bg: 'var(--tt-unknown-bg)',   dot: 'var(--tt-unknown)' },
  unresolved:   { label: 'Unresolved',   color: 'var(--tt-unresolved)',   bg: 'var(--tt-unresolved-bg)',dot: 'var(--tt-unresolved)' },
  loading:      { label: 'Loading',      color: 'var(--tt-loading)',       bg: 'var(--tt-loading-bg)',      dot: 'var(--tt-loading)' },
  error:        { label: 'Error',        color: 'var(--tt-error)',          bg: 'var(--tt-error-bg)',         dot: 'var(--tt-error)' },
  empty:        { label: 'Empty',        color: 'var(--tt-empty)',          bg: 'var(--tt-empty-bg)',         dot: 'var(--tt-empty)' },
  disconnected: { label: 'Disconnected', color: 'var(--tt-disconnected)',   bg: 'var(--tt-disconnected-bg)', dot: 'var(--tt-disconnected)' },
};

interface StateChipProps {
  state: HealthState;
  label?: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export function StateChip({ state, label, size = 'sm', showDot = true }: StateChipProps) {
  const config = STATE_CONFIG[state] ?? STATE_CONFIG.unknown;
  const displayLabel = label ?? config.label;

  return (
    <span
      data-testid={`state-chip-${state}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: size === 'sm' ? '2px 7px' : '4px 10px',
        borderRadius: 4,
        backgroundColor: config.bg,
        color: config.color,
        fontSize: size === 'sm' ? 10 : 11,
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontFamily: "'Manrope', sans-serif",
        whiteSpace: 'nowrap',
        border: `1px solid ${config.color}22`,
      }}
    >
      {showDot && (
        <span
          style={{
            width: size === 'sm' ? 5 : 6,
            height: size === 'sm' ? 5 : 6,
            borderRadius: '50%',
            backgroundColor: config.dot,
            flexShrink: 0,
          }}
        />
      )}
      {displayLabel}
    </span>
  );
}

export function HealthDot({ state, size = 8 }: { state: HealthState; size?: number }) {
  const config = STATE_CONFIG[state] ?? STATE_CONFIG.unknown;
  return (
    <span
      data-testid={`health-dot-${state}`}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: config.dot,
        flexShrink: 0,
        boxShadow: state === 'healthy' ? `0 0 6px ${config.dot}88` : undefined,
      }}
    />
  );
}
