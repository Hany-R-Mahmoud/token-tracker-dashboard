import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Line } from 'react-native-svg';
import colors from '@/constants/colors';

interface BrandMarkProps {
  size?: number;
  color?: string;
}

export function BrandMark({ size = 28, color = colors.accentColor }: BrandMarkProps) {
  const w = size;
  const h = size;
  const cx = w / 2;
  const cy = h / 2;
  const r = size * 0.38;

  const pts = [
    `${cx},${cy - r}`,
    `${cx + r * 0.8},${cy - r * 0.2}`,
    `${cx + r * 0.8},${cy + r * 0.5}`,
    `${cx},${cy + r}`,
    `${cx - r * 0.8},${cy + r * 0.5}`,
    `${cx - r * 0.8},${cy - r * 0.2}`,
  ].join(' ');

  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <Polygon
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        opacity={0.9}
      />
      <Line x1={cx - r * 0.6} y1={cy - r * 0.18} x2={cx + r * 0.6} y2={cy - r * 0.18}
        stroke={color} strokeWidth={1} opacity={0.7} />
      <Line x1={cx - r * 0.72} y1={cy + r * 0.18} x2={cx + r * 0.72} y2={cy + r * 0.18}
        stroke={color} strokeWidth={1} opacity={0.7} />
      <Line x1={cx - r * 0.55} y1={cy + r * 0.52} x2={cx + r * 0.55} y2={cy + r * 0.52}
        stroke={color} strokeWidth={1} opacity={0.5} />
    </Svg>
  );
}

interface BrandLockupProps {
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLockup({ size = 'md' }: BrandLockupProps) {
  const markSize = size === 'sm' ? 20 : size === 'lg' ? 36 : 26;
  const fontSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 14;
  const subSize = size === 'sm' ? 8 : size === 'lg' ? 10 : 9;

  return (
    <View style={styles.lockup}>
      <BrandMark size={markSize} />
      <View style={styles.wordmark}>
        <Text style={[styles.name, { fontSize }]}>Token Tracker</Text>
        <Text style={[styles.sub, { fontSize: subSize }]}>SURFACE TRUTH ENGINE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lockup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wordmark: {
    flexDirection: 'column',
  },
  name: {
    color: colors.textPrimary,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  sub: {
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 0.8,
    marginTop: 1,
  },
});
