import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import colors from '@/constants/colors';

interface PanelCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export function PanelCard({ children, style, padding = 14 }: PanelCardProps) {
  return (
    <View style={[styles.card, { padding }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgTertiary,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 8,
    marginBottom: 10,
  },
});
