import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendSeries {
  key: string;
  label: string;
  color: string;
}

interface TrendLineProps {
  data: Array<{ date: string; [key: string]: string | number }>;
  series: TrendSeries[];
  height?: number;
  formatValue?: (v: number) => string;
}

export function TrendLine({ data, series, height = 180, formatValue }: TrendLineProps) {
  return (
    <div style={{ width: '100%', height }} aria-label="trend chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            {series.map(s => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={s.color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={s.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 9, fill: 'var(--tt-text-muted)', fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => v.slice(5)}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 9, fill: 'var(--tt-text-muted)', fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={false}
            width={40}
            tickFormatter={v => formatValue ? formatValue(v as number) : (v as number).toLocaleString()}
          />
          <Tooltip
            contentStyle={{ background: 'var(--tt-panel)', border: '1px solid var(--tt-border)', borderRadius: 4, fontSize: 11 }}
            labelStyle={{ color: 'var(--tt-text-muted)', fontFamily: 'JetBrains Mono', fontSize: 10 }}
            itemStyle={{ color: 'var(--tt-text-primary)', fontFamily: 'JetBrains Mono', fontSize: 11 }}
            formatter={(v: number, name: string) => [formatValue ? formatValue(v) : v.toLocaleString(), name]}
          />
          {series.map(s => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={1.5}
              fill={`url(#grad-${s.key})`}
              dot={false}
              activeDot={{ r: 3, fill: s.color }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
