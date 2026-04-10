import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparkLineProps {
  data: number[];
  color?: string;
  height?: number;
}

export function SparkLine({ data, color = 'var(--tt-accent)', height = 24 }: SparkLineProps) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <div style={{ width: 60, height }} aria-label="sparkline">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
