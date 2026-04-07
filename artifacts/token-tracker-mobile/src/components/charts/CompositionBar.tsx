import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '@/constants/colors';

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

export function CompositionBar({ segments, height = 8, showLegend = true }: CompositionBarProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;

  return (
    <View>
      <View style={[styles.track, { height }]}>
        {segments.map((seg, i) => (
          <View
            key={i}
            style={{
              width: `${(seg.value / total) * 100}%` as `${number}%`,
              height: '100%',
              backgroundColor: seg.color,
            }}
          />
        ))}
      </View>
      {showLegend && (
        <View style={styles.legend}>
          {segments.filter(s => s.value > 0).map((seg, i) => (
            <View key={i} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: seg.color }]} />
              <Text style={styles.legendLabel}>
                {seg.label} {((seg.value / total) * 100).toFixed(0)}%
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: colors.bgSecondary,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 9,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    letterSpacing: 0.2,
  },
});
