import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import colors from '@/constants/colors';

interface FilterPill {
  label: string;
  value: string;
}

interface FilterPillsProps {
  pills: FilterPill[];
  active: string;
  onSelect: (v: string) => void;
}

export function FilterPills({ pills, active, onSelect }: FilterPillsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {pills.map(p => (
        <TouchableOpacity
          key={p.value}
          onPress={() => onSelect(p.value)}
          style={[styles.pill, active === p.value && styles.pillActive]}
          activeOpacity={0.7}
        >
          <Text style={[styles.label, active === p.value && styles.labelActive]}>
            {p.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 4,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    backgroundColor: colors.bgTertiary,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  pillActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentColor,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: colors.textMuted,
    letterSpacing: 0.2,
  },
  labelActive: {
    color: colors.accentColor,
  },
});
