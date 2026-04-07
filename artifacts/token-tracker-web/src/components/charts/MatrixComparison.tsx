interface MatrixCell {
  value: number;
  label?: string;
}

interface MatrixComparisonProps {
  data: MatrixCell[][];
  rowLabels: string[];
  colLabels: string[];
  formatValue?: (v: number) => string;
  colorScale?: [string, string];
  maxVal?: number;
  minVal?: number;
}

export function MatrixComparison({
  data,
  rowLabels,
  colLabels,
  formatValue,
  colorScale = ['var(--tt-bg)', 'var(--tt-accent)'],
  maxVal,
  minVal = 0,
}: MatrixComparisonProps) {
  const allVals = data.flat().map(c => c.value);
  const max = maxVal ?? Math.max(...allVals, 1);
  const min = minVal;
  const range = max - min;

  function getOpacity(val: number): number {
    if (range === 0) return 0.5;
    return 0.1 + ((val - min) / range) * 0.9;
  }

  return (
    <div style={{ overflowX: 'auto' }} aria-label="matrix comparison" data-testid="matrix-comparison">
      <table style={{ borderCollapse: 'separate', borderSpacing: 2 }}>
        <thead>
          <tr>
            <th style={{ padding: '0 8px 4px 0', fontSize: 9, color: 'var(--tt-text-muted)', fontFamily: "'Manrope', sans-serif", textAlign: 'right', minWidth: 80 }} />
            {colLabels.map((col, ci) => (
              <th
                key={ci}
                style={{
                  padding: '0 4px 4px',
                  fontSize: 9,
                  fontWeight: 600,
                  color: 'var(--tt-text-muted)',
                  fontFamily: "'Manrope', sans-serif",
                  textAlign: 'center',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                  maxWidth: 64,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={col}
              >
                {col.length > 8 ? `${col.slice(0, 7)}…` : col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ri) => (
            <tr key={ri}>
              <td
                style={{
                  padding: '2px 8px 2px 0',
                  fontSize: 10,
                  color: 'var(--tt-text-secondary)',
                  fontFamily: "'Manrope', sans-serif",
                  textAlign: 'right',
                  whiteSpace: 'nowrap',
                  maxWidth: 100,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={rowLabels[ri]}
              >
                {rowLabels[ri].length > 10 ? `${rowLabels[ri].slice(0, 9)}…` : rowLabels[ri]}
              </td>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    width: 40,
                    height: 32,
                    padding: 2,
                  }}
                  title={`${rowLabels[ri]} × ${colLabels[ci]}: ${formatValue ? formatValue(cell.value) : cell.value}`}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 3,
                      backgroundColor: colorScale[1],
                      opacity: getOpacity(cell.value),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {cell.value > 0 && (
                      <span style={{
                        fontSize: 8,
                        fontFamily: 'JetBrains Mono',
                        color: getOpacity(cell.value) > 0.6 ? 'var(--tt-bg)' : 'var(--tt-text-muted)',
                        lineHeight: 1,
                        fontWeight: 500,
                      }}>
                        {formatValue ? formatValue(cell.value) : cell.value}
                      </span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
