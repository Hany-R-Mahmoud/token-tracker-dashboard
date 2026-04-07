import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '@/constants/colors';
import { StateChip } from '@/src/components/shared/StateChip';
import { StateCard } from '@/src/components/shared/StateCard';
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
import {
  mockDailyActivity,
  mockContextHealth,
  mockSurfaceTruth,
  mockHeatmapData,
  mockHeatmapHours,
  mockHeatmapDays,
} from '@/src/data/mock/analytics';
import {
  mockModelVolume,
  mockModelCostPerKTokens,
  mockModelBreakdown,
  mockOutcomeDistribution,
  mockProviderDistribution,
} from '@/src/data/mock/models';
import { formatTokens, formatCost } from '@/src/lib/format';

const TIME_FILTERS = [
  { label: '7d', value: '7d' },
  { label: '14d', value: '14d' },
  { label: '30d', value: '30d' },
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

      {/* Analytics Hero — State Cards */}
      <View style={styles.heroGrid}>
        <StateCard
          state="healthy"
          title="Tokens (7d)"
          value={formatTokens(curr7Tokens)}
          subValue={`+${tokenDelta}% vs prior 7d`}
        />
        <StateCard
          state="healthy"
          title="Sessions (7d)"
          value={curr7Sessions.toLocaleString()}
          subValue="+9.3% vs prior 7d"
        />
        <StateCard
          state="warning"
          title="Spend (7d)"
          value={formatCost(curr7Spend)}
          subValue="+9.6% vs prior 7d"
        />
        <StateCard
          state="mixed"
          title="Success (7d)"
          value={`${curr7Success.toFixed(1)}%`}
          subValue="+0.2% vs prior 7d"
        />
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

      {/* Outcome Distribution */}
      <PanelCard>
        <SectionHeader title="Outcome Distribution" />
        <CompositionBar
          segments={mockOutcomeDistribution.map(d => ({ label: d.label, value: d.value, color: d.color }))}
          height={10}
          showLegend
        />
        <View style={styles.distGrid}>
          {mockOutcomeDistribution.map(d => (
            <View key={d.label} style={styles.distCell}>
              <Text style={[styles.distValue, { color: d.color }]}>{d.pct}%</Text>
              <Text style={styles.distLabel}>{d.label}</Text>
            </View>
          ))}
        </View>
      </PanelCard>

      {/* Provider Distribution */}
      <PanelCard>
        <SectionHeader title="Provider Distribution" />
        <CompositionBar
          segments={mockProviderDistribution.map(d => ({ label: d.label, value: d.value, color: d.color }))}
          height={10}
          showLegend
        />
        <View style={styles.distGrid}>
          {mockProviderDistribution.map(d => (
            <View key={d.label} style={styles.distCell}>
              <Text style={[styles.distValue, { color: d.color }]}>{d.pct}%</Text>
              <Text style={styles.distLabel}>{d.label}</Text>
            </View>
          ))}
        </View>
      </PanelCard>

      {/* Model Pressure — Token Volume */}
      <PanelCard>
        <SectionHeader title="Model Pressure — Token Volume" />
        <RankedListBar items={mockModelVolume} />
      </PanelCard>

      {/* Value Density Mapping */}
      <PanelCard>
        <SectionHeader title="Value Density — Cost per 1K Tokens" />
        <RankedListBar items={mockModelCostPerKTokens} />
      </PanelCard>

      {/* Model Breakdown Table */}
      <PanelCard>
        <SectionHeader title="Model Breakdown" />
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHead, { flex: 2 }]}>MODEL</Text>
          <Text style={[styles.tableHead, styles.tableNum]}>TOKENS</Text>
          <Text style={[styles.tableHead, styles.tableNum]}>SESSIONS</Text>
          <Text style={[styles.tableHead, styles.tableNum]}>SUCCESS</Text>
          <Text style={[styles.tableHead, styles.tableNum]}>$/K</Text>
        </View>
        {mockModelBreakdown.map((row, i) => (
          <View key={i} style={[styles.tableRow, i < mockModelBreakdown.length - 1 && styles.tableRowBorder]}>
            <View style={{ flex: 2 }}>
              <Text style={styles.tableModel} numberOfLines={1}>{row.name}</Text>
              <Text style={styles.tableProvider}>{row.provider}</Text>
            </View>
            <Text style={[styles.tableCell, styles.tableNum]}>{row.tokensLabel}</Text>
            <Text style={[styles.tableCell, styles.tableNum]}>{row.sessions}</Text>
            <Text style={[styles.tableCell, styles.tableNum, {
              color: row.successRate >= 90 ? colors.accentColor :
                row.successRate >= 75 ? colors.warningText : colors.criticalText,
            }]}>{row.successRate.toFixed(0)}%</Text>
            <Text style={[styles.tableCell, styles.tableNum]}>{row.costLabel}</Text>
          </View>
        ))}
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

      {/* Activity Heatmap */}
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
                    style={[styles.heatCell, { backgroundColor: colors.accentColor, opacity }]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </PanelCard>

      {/* Success State Cards */}
      <View style={styles.stateCardRow}>
        <StateCard state="healthy"   title="Success" value={`${successCount}`}  subValue="sessions" />
        <StateCard state="critical"  title="Error"   value={`${errorCount}`}    subValue="sessions" />
        <StateCard state="fallback"  title="Fallback" value={`${fallbackCount}`} subValue="sessions" />
      </View>
      <View style={[styles.stateCardRow, { marginTop: 8 }]}>
        <StateCard state="warning"   title="Warning"  value={`${warningCount}`}   subValue="sessions" />
        <StateCard state="degraded"  title="Degraded" value={`${degradedCount}`}  subValue="sessions" />
        <StateCard state="unknown"   title="Unknown"  value={`${unknownCount}`}   subValue="sessions" />
      </View>

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
                d.successRate >= 80 ? colors.warningText : colors.criticalText,
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
  heroGrid: { gap: 8, marginBottom: 10 },
  stateCardRow: { flexDirection: 'row', gap: 8, marginBottom: 0 },
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
  distGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  distCell: {
    flex: 1,
    minWidth: 70,
    alignItems: 'center',
  },
  distValue: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  distLabel: {
    fontSize: 8,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
    marginBottom: 2,
  },
  tableHead: {
    fontSize: 8,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  tableNum: {
    minWidth: 52,
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
  },
  tableRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  tableModel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  tableProvider: {
    fontSize: 9,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginTop: 1,
  },
  tableCell: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
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
