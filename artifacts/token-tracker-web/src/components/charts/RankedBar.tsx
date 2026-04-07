interface RankedItem {
  label: string;
  value: number;
  rank?: number;
  color?: string;
}

interface RankedBarProps {
  items: RankedItem[];
  formatValue?: (v: number) => string;
  color?: string;
  maxItems?: number;
}

export function RankedBar({ items, formatValue, color = 'var(--tt-accent)', maxItems = 8 }: RankedBarProps) {
  const sorted = [...items].sort((a, b) => b.value - a.value).slice(0, maxItems);
  const max = sorted[0]?.value ?? 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} aria-label="ranked bar chart">
      {sorted.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 16,
            fontSize: 9,
            fontFamily: 'JetBrains Mono',
            color: 'var(--tt-text-muted)',
            textAlign: 'right',
            flexShrink: 0,
          }}>
            {i + 1}
          </span>
          <span style={{
            width: 110,
            fontSize: 11,
            color: 'var(--tt-text-secondary)',
            fontFamily: "'Manrope', sans-serif",
            truncate: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {item.label}
          </span>
          <div style={{ flex: 1, height: 6, background: 'var(--tt-bg)', borderRadius: 3, overflow: 'hidden' }}>
            <div
              style={{
                width: `${(item.value / max) * 100}%`,
                height: '100%',
                borderRadius: 3,
                backgroundColor: item.color ?? color,
                opacity: 0.85,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <span style={{
            fontSize: 10,
            fontFamily: 'JetBrains Mono',
            color: 'var(--tt-text-primary)',
            flexShrink: 0,
            width: 60,
            textAlign: 'right',
          }}>
            {formatValue ? formatValue(item.value) : item.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
