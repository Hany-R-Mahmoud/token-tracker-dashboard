import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HealthState, semanticColors } from '@/src/theme';
import colors from '@/constants/colors';

interface StateChipProps {
  state: HealthState;
  label?: string;
  size?: 'sm' | 'md';
}

export function StateChip({ state, label, size = 'sm' }: StateChipProps) {
  const { dot, bg, text, label: defaultLabel } = semanticColors[state];
  const displayLabel = label ?? defaultLabel;
  const isSm = size === 'sm';

  return (
    <View style={[styles.chip, { backgroundColor: bg, paddingHorizontal: isSm ? 6 : 8, paddingVertical: isSm ? 2 : 4 }]}>
      <View style={[styles.dot, { backgroundColor: dot, width: isSm ? 5 : 6, height: isSm ? 5 : 6 }]} />
      <Text style={[styles.label, { color: text, fontSize: isSm ? 8 : 10 }]}>{displayLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 3,
    gap: 4,
    alignSelf: 'flex-start',
  },
  dot: {
    borderRadius: 3,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
