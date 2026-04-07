import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HealthState, semanticColors } from '@/src/theme';

interface HealthDotProps {
  state: HealthState;
  size?: number;
  pulse?: boolean;
}

export function HealthDot({ state, size = 8 }: HealthDotProps) {
  const { dot } = semanticColors[state];
  return (
    <View style={[
      styles.dot,
      { width: size, height: size, borderRadius: size / 2, backgroundColor: dot }
    ]} />
  );
}

const styles = StyleSheet.create({
  dot: {
    flexShrink: 0,
  },
});
