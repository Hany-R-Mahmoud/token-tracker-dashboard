import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '@/constants/colors';

interface MiniBarProps {
  values: number[];
  color?: string;
  height?: number;
  width?: number;
  barGap?: number;
}

export function MiniBar({
  values,
  color = colors.accentColor,
  height = 20,
  width = 60,
  barGap = 2,
}: MiniBarProps) {
  const max = Math.max(...values, 1);
  const barCount = values.length;
  const barWidth = (width - barGap * (barCount - 1)) / barCount;

  return (
    <View style={[styles.container, { width, height }]}>
      {values.map((v, i) => (
        <View
          key={i}
          style={{
            width: barWidth,
            height: Math.max(2, (v / max) * height),
            backgroundColor: color,
            borderRadius: 1,
            opacity: 0.6 + 0.4 * (v / max),
            alignSelf: 'flex-end',
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
});
