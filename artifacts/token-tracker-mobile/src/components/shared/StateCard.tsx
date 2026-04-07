import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '@/constants/colors';
import { HealthState, semanticColors } from '@/src/theme';
import { HealthDot } from '@/src/components/shared/HealthDot';

interface StateCardProps {
  state: HealthState;
  title: string;
  body?: string;
  value?: string;
  subValue?: string;
}

export function StateCard({ state, title, body, value, subValue }: StateCardProps) {
  const { bg, text, dot } = semanticColors[state];

  return (
    <View style={[styles.card, { borderColor: dot + '40', backgroundColor: bg }]}>
      <View style={styles.header}>
        <HealthDot state={state} size={8} />
        <Text style={[styles.title, { color: text }]}>{title}</Text>
      </View>
      {value !== undefined && (
        <Text style={[styles.value, { color: text }]}>{value}</Text>
      )}
      {subValue !== undefined && (
        <Text style={styles.subValue}>{subValue}</Text>
      )}
      {body !== undefined && (
        <Text style={styles.body}>{body}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    borderWidth: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  title: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 22,
    fontFamily: 'SpaceGrotesk_700Bold',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  subValue: {
    fontSize: 10,
    fontFamily: 'Manrope_400Regular',
    color: colors.textMuted,
    marginBottom: 2,
  },
  body: {
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
});
