interface HeatmapGridProps {
  data: number[][];
  rowLabels: string[];
  colLabels: string[];
  color?: string;
  maxVal?: number;
}

export function HeatmapGrid({ data, rowLabels, colLabels, color = '#a3ffd9', maxVal }: HeatmapGridProps) {
  const allVals = data.flat();
  const max = maxVal ?? Math.max(...allVals, 1);

  return (
    <div style={{ overflowX: 'auto' }} aria-label="heatmap grid">
      <div style={{ display: 'flex', gap: 0 }}>
        {/* Row labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 16, paddingRight: 8 }}>
          {rowLabels.map((label, i) => (
            <div key={i} style={{ height: 14, display: 'flex', alignItems: 'center', fontSize: 9, color: 'var(--tt-text-muted)', fontFamily: 'JetBrains Mono', whiteSpace: 'nowrap' }}>
              {label}
            </div>
          ))}
        </div>
        {/* Grid */}
        <div style={{ flex: 1 }}>
          {/* Col labels */}
          <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>
            {colLabels.map((label, i) => (
              i % 3 === 0 ? (
                <div key={i} style={{ width: 14, fontSize: 8, color: 'var(--tt-text-muted)', fontFamily: 'JetBrains Mono', textAlign: 'center', overflow: 'hidden' }}>
                  {label.slice(0, 2)}
                </div>
              ) : (
                <div key={i} style={{ width: 14 }} />
              )
            ))}
          </div>
          {/* Cells */}
          {data.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: 2, marginBottom: 2 }}>
              {row.map((val, ci) => (
                <div
                  key={ci}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 2,
                    backgroundColor: color,
                    opacity: max > 0 ? 0.1 + (val / max) * 0.9 : 0.1,
                  }}
                  title={`${rowLabels[ri]} ${colLabels[ci]}: ${val}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
