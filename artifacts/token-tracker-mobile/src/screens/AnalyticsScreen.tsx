import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '@/constants/colors';
import { StateChip } from '@/src/components/shared/StateChip';
import { SectionHeader, PageHeader } from '@/src/components/shared/SectionHeader';
import { FilterPills } from '@/src/components/shared/FilterPills';
import { PanelCard } from '@/src/components/shared/PanelCard';
import { TrendSparkline } from '@/src/components/charts/TrendSparkline';
import { IntegrityLane } from '@/src/components/charts/IntegrityLane';
import { CompositionBar } from '@/src/components/charts/CompositionBar';
import { RankedListBar } from '@/src/components/charts/RankedListBar';
import { MiniBar } from '@/src/components/charts/MiniBar';
import { mockProviders } from '@/src/data/mock/providers';
import { mockSessions } from '@/src/data/mock/sessions';
import { mockDailyActivity, mockContextHealth, mockSurfaceTruth, mockHeatmapData, mockHeatmapHours, mockHeatmapDays } from '@/src/data/mock/analytics';
import { formatTokens, formatCost } from '@/src/lib/format';

const TIME_FILTERS = [
  { label: '7d', value: '7d' },
  { label: '14d', value: '14d' },
  { label: '30d', value: '30d' },
];

const MODEL_ITEMS = [
  { label: 'GPT-4o', value: 12400000, valueLabel: '12.4M', color: colors.accentColor },
  { label: 'Claude 3.5', value: 9200000, valueLabel: '9.2M', color: '#7ec8e3' },
  { label: 'GPT-4 Turbo', value: 8100000, valueLabel: '8.1M', color: '#a0c4ff' },
  { label: 'Gemini 1.5 Pro', value: 6800000, valueLabel: '6.8M', color: colors.warningText },
  { label: 'GPT-4o Mini', value: 5200000, valueLabel: '5.2M', color: '#c3f584' },
  { label: 'Command R+', value: 3400000, valueLabel: '3.4M', color: colors.fallbackColor },
];

const VALUE_DENSITY_ITEMS = [
  { label: 'GPT-4 Azure', value: 64, valueLabel: '$64/K', color: colors.criticalText },
  { label: 'Claude 3.5 Sonnet', value: 42, valueLabel: '$42/K', color: colors.warningText },
  { label: 'GPT-4o', value: 38, valueLabel: '$38/K', color: colors.accentColor },
  { label: 'Gemini 1.5 Pro', value: 28, valueLabel: '$28/K', color: '#7ec8e3' },
  { label: 'Command R+', value: 22, valueLabel: '$22/K', color: colors.fallbackColor },
  { label: 'Claude 3 Haiku', value: 12, valueLabel: '$12/K', color: colors.degradedColor },
];

export function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const [timeFilter, setTimeFilter] = useState('7d');

  const last7 = mockDailyActivity.slice(-7);
  const prev7 = mockDailyActivity.slice(-14, -7);

  const curr7Tokens = last7.reduce((s, d) => s + d.tokens, 0);
  const prev7Tokens = prev7.reduce((s, d) => s + d.tokens, 0);
  const curr7Sessions = last7.reduce((s, d) => s + d.sessions, 0);
  const curr7Spend = last7.reduce((s, d) => s + d.cost, 0);
  const curr7Success = last7.reduce((s, d) => s + d.successRate, 0) / last7.length;

  const tokenDelta = ((curr7Tokens - prev7Tokens) / prev7Tokens * 100).toFixed(1);

  const tokenTrend = last7.map(d => d.tokens / 1_000_000);
  const sessionTrend = last7.map(d => d.sessions);
  const successTrend = last7.map(d => d.successRate);

  const successCount = mockSessions.filter(s => s.status === 'success').length;
  const warningCount = mockSessions.filter(s => s.status === 'warning').length;
  const errorCount = mockSessions.filter(s => s.status === 'error').length;
  const fallbackCount = mockSessions.filter(s => s.status === 'fallback').length;
  const degradedCount = mockSessions.filter(s => s.status === 'degraded').length;
  const unknownCount = mockSessions.filter(s => s.status === 'unknown').length;

  const resolved = mockSurfaceTruth.filter(s => s.status === 'resolved').length;
  const unresolved = mockSurfaceTruth.filter(s => s.status === 'unresolved').length;
  const unknownTruth = mockSurfaceTruth.filter(s => s.status === 'unknown').length;

  const webTopPad = Platform.OS === 'web' ? 67 : 0;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingTop: webTopPad + 12, paddingBottom: insets.bottom + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Analytics Header */}
      <View style={styles.headerRow}>
        <PageHeader title="Analytics" subtitle="Comparison-first deep analysis" badge={<StateChip state="mixed" />} />
      </View>

      {/* Filter Pills */}
      <View style={styles.filterRow}>
        <FilterPills pills={TIME_FILTERS} active={timeFilter} onSelect={setTimeFilter} />
      </View>

      {/* Analytics Hero */}
      <View style={styles.heroGrid}>
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>TOKENS (7D)</Text>
          <Text style={styles.heroValue}>{formatTokens(curr7Tokens)}</Text>
          <Text style={[styles.heroDelta, { color: parseFloat(tokenDelta) > 0 ? colors.accentColor : colors.criticalText }]}>
            +{tokenDelta}%
          </Text>
        </View>
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>SESSIONS (7D)</Text>
          <Text style={styles.heroValue}>{curr7Sessions.toLocaleString()}</Text>
          <Text style={[styles.heroDelta, { color: colors.accentColor }]}>+9.3%</Text>
        </View>
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>SPEND (7D)</Text>
          <Text style={styles.heroValue}>{formatCost(curr7Spend)}</Text>
          <Text style={[styles.heroDelta, { color: colors.criticalText }]}>+9.6%</Text>
        </View>
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>SUCCESS (7D)</Text>
          <Text style={[styles.heroValue, { color: colors.accentColor }]}>{curr7Success.toFixed(1)}%</Text>
          <Text style={[styles.heroDelta, { color: colors.accentColor }]}>+0.2%</Text>
        </View>
      </View>

      {/* Trend Panels */}
      <PanelCard>
        <SectionHeader title="Token Volume — 7 Days" />
        <TrendSparkline data={tokenTrend} width={280} height={56} color={colors.accentColor} />
      </PanelCard>

      <PanelCard>
        <SectionHeader title="Session Volume — 7 Days" />
        <TrendSparkline data={sessionTrend} width={280} height={56} color="#a0c4ff" />
      </PanelCard>

      <PanelCard>
        <SectionHeader title="Success Rate — 7 Days" />
        <TrendSparkline data={successTrend} width={280} height={56} color={colors.accentColor} />
        <View style={styles.trendFooter}>
          <Text style={styles.trendFooterText}>Avg: {curr7Success.toFixed(1)}%</Text>
          <Text style={styles.trendFooterText}>
            Min: {Math.min(...successTrend).toFixed(1)}% · Max: {Math.max(...successTrend).toFixed(1)}%
          </Text>
        </View>
      </PanelCard>

      {/* Value Density Mapping */}
      <PanelCard>
        <SectionHeader title="Value Density — Cost per 1K Tokens" />
        <RankedListBar items={VALUE_DENSITY_ITEMS} />
      </PanelCard>

      {/* Provider Efficiency Matrix */}
      <PanelCard>
        <SectionHeader title="Provider Efficiency — Success Rate" />
        {mockProviders.map(p => (
          <IntegrityLane
            key={p.id}
            label={p.name}
            score={p.successRate / 100}
            state={p.status}
          />
        ))}
      </PanelCard>

      {/* Activity Cadence */}
      <PanelCard>
        <SectionHeader title="Activity Cadence — Token Trend" />
        {mockProviders.slice(0, 4).map(p => (
          <View key={p.id} style={styles.cadenceRow}>
            <Text style={styles.cadenceLabel} numberOfLines={1}>{p.name}</Text>
            <MiniBar values={p.trend} height={20} width={80}
              color={p.status === 'healthy' ? colors.accentColor : p.status === 'critical' ? colors.criticalText : colors.warningText}
            />
            <Text style={styles.cadenceStat}>{formatTokens(p.tokens)}</Text>
          </View>
        ))}
      </PanelCard>

      {/* Outcome Composition */}
      <PanelCard>
        <SectionHeader title="Outcome Composition" />
        <CompositionBar
          segments={[
            { label: 'Success', value: successCount, color: colors.accentColor },
            { label: 'Warning', value: warningCount, color: colors.warningText },
            { label: 'Error', value: errorCount, color: colors.criticalText },
            { label: 'Fallback', value: fallbackCount, color: colors.fallbackColor },
            { label: 'Degraded', value: degradedCount, color: colors.degradedColor },
            { label: 'Unknown', value: unknownCount, color: colors.unknownColor },
          ]}
          height={10}
          showLegend
        />
      </PanelCard>

      {/* Model Pressure */}
      <PanelCard>
        <SectionHeader title="Model Pressure — Token Volume" />
        <RankedListBar items={MODEL_ITEMS} />
      </PanelCard>

      {/* Activity Heatmap (simplified grid) */}
      <PanelCard>
        <SectionHeader title="Activity Heatmap — Hour × Day" />
        <View style={styles.heatmapWrapper}>
          <View style={styles.heatmapHours}>
            {mockHeatmapHours.map(h => (
              <Text key={h} style={styles.heatmapHourLabel}>{h}</Text>
            ))}
          </View>
          {mockHeatmapData.map((row, di) => (
            <View key={di} style={styles.heatmapRow}>
              <Text style={styles.heatmapDayLabel}>{mockHeatmapDays[di]}</Text>
              {row.map((val, hi) => {
                const maxVal = 36;
                const opacity = 0.05 + (val / maxVal) * 0.95;
                return (
                  <View
                    key={hi}
                    style={[styles.heatCell, {
                      backgroundColor: colors.accentColor,
                      opacity,
                    }]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </PanelCard>

      {/* Success Analysis */}
      <PanelCard>
        <SectionHeader title="Success Analysis" />
        <View style={styles.successRow}>
          <View style={styles.successStat}>
            <Text style={styles.successValue}>{(successCount / mockSessions.length * 100).toFixed(0)}%</Text>
            <Text style={styles.successLabel}>OVERALL</Text>
          </View>
          <View style={styles.successStat}>
            <Text style={[styles.successValue, { color: colors.criticalText }]}>{errorCount}</Text>
            <Text style={styles.successLabel}>ERRORS</Text>
          </View>
          <View style={styles.successStat}>
            <Text style={[styles.successValue, { color: colors.warningText }]}>{fallbackCount}</Text>
            <Text style={styles.successLabel}>FALLBACKS</Text>
          </View>
          <View style={styles.successStat}>
            <Text style={[styles.successValue, { color: colors.degradedColor }]}>{degradedCount}</Text>
            <Text style={styles.successLabel}>DEGRADED</Text>
          </View>
        </View>
      </PanelCard>

      {/* Active Surface Truth */}
      <PanelCard>
        <SectionHeader title="Active Surface Truth" />
        <CompositionBar
          segments={[
            { label: 'Resolved', value: resolved, color: colors.accentColor },
            { label: 'Unresolved', value: unresolved, color: colors.warningText },
            { label: 'Unknown', value: unknownTruth, color: colors.unknownColor },
          ]}
          height={8}
          showLegend
        />
      </PanelCard>

      {/* Context Pressure */}
      <PanelCard>
        <SectionHeader title="Context Pressure" />
        {mockContextHealth.map((c, i) => (
          <View key={i} style={styles.ctxRow}>
            <Text style={styles.ctxModel} numberOfLines={1}>{c.model}</Text>
            <View style={styles.ctxTrack}>
              <View style={[styles.ctxFill, {
                width: `${c.pressure * 100}%` as `${number}%`,
                backgroundColor: c.pressure >= 0.9 ? colors.criticalText : c.pressure >= 0.7 ? colors.warningText : colors.accentColor,
              }]} />
            </View>
            <Text style={styles.ctxPct}>{(c.pressure * 100).toFixed(0)}%</Text>
          </View>
        ))}
      </PanelCard>

      {/* Daily Activity Table */}
      <PanelCard>
        <SectionHeader title="Daily Activity — Last 14 Days" />
        {mockDailyActivity.slice(-14).reverse().map(d => (
          <View key={d.date} style={styles.dailyRow}>
            <Text style={styles.dailyDate}>{d.date.slice(5)}</Text>
            <Text style={styles.dailyStat}>{formatTokens(d.tokens)}</Text>
            <Text style={styles.dailyStat}>{d.sessions}</Text>
            <Text style={styles.dailyStat}>{formatCost(d.cost)}</Text>
            <Text style={[styles.dailyStat, {
              color: d.successRate >= 90 ? colors.accentColor :
                d.successRate >= 80 ? colors.warningText : colors.criticalText
            }]}>{d.successRate.toFixed(1)}%</Text>
          </View>
        ))}
      </PanelCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 14 },
  headerRow: { marginBottom: 4 },
  filterRow: { marginBottom: 12 },
  heroGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  heroCard: {
    flex: 1,
    minWidth: 130,
    backgroundColor: colors.bgTertiary,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 6,
    padding: 12,
  },
  heroLabel: {
    fontSize: 8,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  heroValue: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  heroDelta: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  trendFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  trendFooterText: {
    fontSize: 9,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  cadenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cadenceLabel: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    flex: 1,
  },
  cadenceStat: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    minWidth: 40,
    textAlign: 'right',
  },
  heatmapWrapper: { gap: 3 },
  heatmapHours: {
    flexDirection: 'row',
    marginLeft: 28,
    gap: 3,
    marginBottom: 2,
  },
  heatmapHourLabel: {
    fontSize: 8,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    flex: 1,
    textAlign: 'center',
  },
  heatmapRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  heatmapDayLabel: {
    fontSize: 8,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    width: 24,
  },
  heatCell: {
    flex: 1,
    height: 16,
    borderRadius: 2,
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 4,
  },
  successStat: { alignItems: 'center' },
  successValue: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: colors.accentColor,
    letterSpacing: -0.5,
  },
  successLabel: {
    fontSize: 8,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  ctxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 7,
  },
  ctxModel: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    width: 105,
  },
  ctxTrack: {
    flex: 1,
    height: 4,
    backgroundColor: colors.bgSecondary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  ctxFill: { height: '100%', borderRadius: 2 },
  ctxPct: {
    fontSize: 9,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    width: 28,
    textAlign: 'right',
  },
  dailyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
    gap: 4,
  },
  dailyDate: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    width: 44,
  },
  dailyStat: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    textAlign: 'right',
  },
});
