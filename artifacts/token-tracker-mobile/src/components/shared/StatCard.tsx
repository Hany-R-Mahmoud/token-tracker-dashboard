import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '@/constants/colors';

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  accent?: boolean;
  flex?: number;
}

export function StatCard({ label, value, delta, deltaPositive, accent, flex }: StatCardProps) {
  return (
    <View style={[styles.card, flex !== undefined ? { flex } : {}]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, accent && { color: colors.accentColor }]}>{value}</Text>
      {delta !== undefined && (
        <Text style={[styles.delta, { color: deltaPositive ? colors.accentColor : colors.criticalText }]}>
          {delta}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgTertiary,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 6,
    padding: 12,
  },
  label: {
    fontSize: 9,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.8,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontFamily: 'SpaceGrotesk_700Bold',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  delta: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
});
