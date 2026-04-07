interface Segment {
  label: string;
  value: number;
  color: string;
}

interface CompositionBarProps {
  segments: Segment[];
  height?: number;
  showLegend?: boolean;
}

export function CompositionBar({ segments, height = 10, showLegend = true }: CompositionBarProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;

  return (
    <div aria-label="composition bar">
      <div style={{ display: 'flex', height, borderRadius: 4, overflow: 'hidden', gap: 1 }}>
        {segments.map((seg, i) => (
          <div
            key={i}
            style={{
              flex: seg.value / total,
              backgroundColor: seg.color,
              opacity: 0.8,
            }}
            title={`${seg.label}: ${((seg.value / total) * 100).toFixed(1)}%`}
          />
        ))}
      </div>
      {showLegend && (
        <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
          {segments.map((seg, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--tt-text-secondary)', fontFamily: "'Manrope', sans-serif" }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: seg.color, display: 'inline-block' }} />
              {seg.label}
              <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--tt-text-primary)', fontSize: 10 }}>
                {((seg.value / total) * 100).toFixed(0)}%
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
