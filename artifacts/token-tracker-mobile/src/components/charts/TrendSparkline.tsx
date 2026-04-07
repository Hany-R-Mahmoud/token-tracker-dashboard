import React from 'react';
import { View } from 'react-native';
import Svg, { Polyline, Defs, LinearGradient, Stop, Polygon } from 'react-native-svg';
import colors from '@/constants/colors';

interface TrendSparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showFill?: boolean;
}

export function TrendSparkline({
  data,
  width = 120,
  height = 36,
  color = colors.accentColor,
  showFill = true,
}: TrendSparklineProps) {
  if (data.length < 2) return <View style={{ width, height }} />;

  const min = Math.min(...data);
  const max = Math.max(...data, min + 1);
  const range = max - min;

  const pad = 2;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;

  const points = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * innerW,
    y: pad + innerH - ((v - min) / range) * innerH,
  }));

  const linePoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const fillPoints = [
    `${points[0].x},${pad + innerH}`,
    ...points.map(p => `${p.x},${p.y}`),
    `${points[points.length - 1].x},${pad + innerH}`,
  ].join(' ');

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <Stop offset="100%" stopColor={color} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      {showFill && (
        <Polygon
          points={fillPoints}
          fill={`url(#grad-${color})`}
        />
      )}
      <Polyline
        points={linePoints}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
