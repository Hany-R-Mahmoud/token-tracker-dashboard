import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import colors from '@/constants/colors';

interface ActivityLineChartProps {
  labels: string[];
  data: number[];
  suffix?: string;
  color?: string;
  height?: number;
}

const screenWidth = Dimensions.get('window').width;

export function ActivityLineChart({
  labels,
  data,
  suffix = '',
  color = colors.accentColor,
  height = 160,
}: ActivityLineChartProps) {
  const chartWidth = screenWidth - 28;

  const chartConfig = {
    backgroundColor: colors.bgTertiary,
    backgroundGradientFrom: colors.bgTertiary,
    backgroundGradientTo: colors.bgTertiary,
    decimalPlaces: 0,
    color: () => color,
    labelColor: () => colors.textMuted,
    style: { borderRadius: 6 },
    propsForDots: {
      r: '3',
      strokeWidth: '1.5',
      stroke: color,
    },
    propsForBackgroundLines: {
      stroke: colors.borderColor,
      strokeWidth: 0.5,
    },
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={{ labels, datasets: [{ data, color: () => color }] }}
        width={chartWidth}
        height={height}
        chartConfig={chartConfig}
        bezier
        withInnerLines
        withOuterLines={false}
        withVerticalLines={false}
        withShadow={false}
        style={styles.chart}
        formatYLabel={(v) => `${Number(v).toFixed(0)}${suffix}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -6,
  },
  chart: {
    borderRadius: 6,
  },
});
