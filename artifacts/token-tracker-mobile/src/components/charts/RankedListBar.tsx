import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '@/constants/colors';

interface RankedItem {
  label: string;
  value: number;
  valueLabel: string;
  color?: string;
}

interface RankedListBarProps {
  items: RankedItem[];
  maxItems?: number;
}

export function RankedListBar({ items, maxItems = 6 }: RankedListBarProps) {
  const shown = items.slice(0, maxItems);
  const max = Math.max(...shown.map(i => i.value), 1);

  return (
    <View>
      {shown.map((item, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.rank}>{i + 1}</Text>
          <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">{item.label}</Text>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                {
                  width: `${(item.value / max) * 100}%` as `${number}%`,
                  backgroundColor: item.color ?? colors.accentColor,
                }
              ]}
            />
          </View>
          <Text style={styles.value}>{item.valueLabel}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  rank: {
    fontSize: 9,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    width: 14,
    textAlign: 'right',
  },
  label: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    width: 100,
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
  value: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    minWidth: 36,
    textAlign: 'right',
  },
});
