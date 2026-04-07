import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '@/constants/colors';
import { HealthDot } from '@/src/components/shared/HealthDot';
import { HealthState } from '@/src/types';

interface IntegrityLaneProps {
  label: string;
  score: number;
  state: HealthState;
  showLabel?: boolean;
}

export function IntegrityLane({ label, score, state, showLabel = true }: IntegrityLaneProps) {
  const pct = Math.max(0, Math.min(1, score));
  let barColor = colors.criticalText;
  if (pct >= 0.9) barColor = colors.accentColor;
  else if (pct >= 0.7) barColor = colors.warningText;
  else if (pct >= 0.5) barColor = colors.fallbackColor;

  return (
    <View style={styles.row}>
      <HealthDot state={state} size={7} />
      {showLabel && (
        <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">{label}</Text>
      )}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%` as `${number}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={styles.score}>{(pct * 100).toFixed(0)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 7,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    flex: 1,
    minWidth: 0,
  },
  track: {
    flex: 1,
    height: 4,
    backgroundColor: colors.bgSecondary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
  score: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    minWidth: 30,
    textAlign: 'right',
  },
});
