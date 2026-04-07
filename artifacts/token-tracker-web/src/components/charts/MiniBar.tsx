import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';

interface MiniBarProps {
  data: number[];
  color?: string;
  height?: number;
}

export function MiniBar({ data, color = 'var(--tt-accent)', height = 32 }: MiniBarProps) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <div style={{ width: 80, height }} aria-label="mini bar chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Bar dataKey="v" fill={color} radius={[1, 1, 0, 0]} />
          <Tooltip
            contentStyle={{ background: 'var(--tt-panel)', border: '1px solid var(--tt-border)', borderRadius: 4, fontSize: 10 }}
            itemStyle={{ color: 'var(--tt-text-primary)' }}
            formatter={(v: number) => [v.toLocaleString(), '']}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
