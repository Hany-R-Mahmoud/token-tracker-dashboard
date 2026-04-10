import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  sparkline?: ReactNode;
  accent?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StatCard({ label, value, delta, deltaLabel, sparkline, accent, size = 'md' }: StatCardProps) {
  const isPositive = delta !== undefined && delta >= 0;
  const valueSize = size === 'lg' ? 28 : size === 'md' ? 22 : 16;

  return (
    <div
      className="tt-panel"
      style={{ padding: size === 'lg' ? '18px 20px' : '14px 16px', minWidth: 0 }}
      data-testid="stat-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span className="tt-label">{label}</span>
        {sparkline}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span
          className="tt-metric-large"
          style={{
            fontSize: valueSize,
            color: accent ? 'var(--tt-accent)' : 'var(--tt-text-primary)',
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {delta !== undefined && (
          <span style={{
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            color: isPositive ? 'var(--tt-accent)' : 'var(--tt-critical-text)',
          }}>
            {isPositive ? '+' : ''}{delta.toFixed(1)}%
            {deltaLabel && <span style={{ color: 'var(--tt-text-muted)', marginLeft: 4 }}>{deltaLabel}</span>}
          </span>
        )}
      </div>
    </div>
  );
}
