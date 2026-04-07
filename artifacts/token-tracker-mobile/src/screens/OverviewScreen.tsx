import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '@/constants/colors';
import { BrandLockup } from '@/src/components/shared/BrandLockup';
import { StateChip } from '@/src/components/shared/StateChip';
import { HealthDot } from '@/src/components/shared/HealthDot';
import { StatCard } from '@/src/components/shared/StatCard';
import { SectionHeader } from '@/src/components/shared/SectionHeader';
import { FilterPills } from '@/src/components/shared/FilterPills';
import { PanelCard } from '@/src/components/shared/PanelCard';
import { MiniBar } from '@/src/components/charts/MiniBar';
import { TrendSparkline } from '@/src/components/charts/TrendSparkline';
import { IntegrityLane } from '@/src/components/charts/IntegrityLane';
import { CompositionBar } from '@/src/components/charts/CompositionBar';
import { mockProviders } from '@/src/data/mock/providers';
import { mockSessions } from '@/src/data/mock/sessions';
import { mockSurfaceTruth, mockContextHealth, mockDailyActivity } from '@/src/data/mock/analytics';
import { formatTokens, formatCost, formatMs } from '@/src/lib/format';
import { mockPeriodMetrics } from '@/src/data/mock/metrics';
import type { HealthState } from '@/src/types';

const TIME_FILTERS = [
  { label: 'Last 7d', value: '7d' },
  { label: 'Last 14d', value: '14d' },
  { label: 'Last 30d', value: '30d' },
  { label: 'Today', value: '1d' },
];

const SESSION_STATUS_COLORS: Record<string, string> = {
  success: colors.accentColor,
  warning: colors.warningText,
  error: colors.criticalText,
  fallback: colors.fallbackColor,
  degraded: colors.degradedColor,
  unknown: colors.unknownColor,
};

export function OverviewScreen() {
  const insets = useSafeAreaInsets();
  const [timeFilter, setTimeFilter] = useState('7d');

  const totalTokens = mockProviders.reduce((s, p) => s + p.tokens, 0);
  const totalSpend = mockProviders.reduce((s, p) => s + p.spend, 0);
  const totalSessions = mockProviders.reduce((s, p) => s + p.sessions, 0);
  const avgLatency = Math.round(mockProviders.reduce((s, p) => s + p.avgLatency, 0) / mockProviders.length);
  const avgSuccessRate = mockProviders.reduce((s, p) => s + p.successRate, 0) / mockProviders.length;
  const activeProviders = mockProviders.filter(p => p.status === 'healthy' || p.status === 'warning').length;
  const criticalProviders = mockProviders.filter(p => p.status === 'critical').length;
  const overallState: HealthState = criticalProviders > 0 ? 'critical' : mockProviders.some(p => p.status === 'warning') ? 'warning' : 'healthy';
  const recentTrend = mockDailyActivity.slice(-7).map(d => d.tokens / 1_000_000);

  const resolved = mockSurfaceTruth.filter(s => s.status === 'resolved').length;
  const unresolved = mockSurfaceTruth.filter(s => s.status === 'unresolved').length;
  const unknown = mockSurfaceTruth.filter(s => s.status === 'unknown').length;

  const webTopPad = Platform.OS === 'web' ? 67 : 0;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingTop: webTopPad + 12, paddingBottom: insets.bottom + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Brand Header */}
      <View style={styles.header}>
        <BrandLockup size="sm" />
        <StateChip state={overallState} />
      </View>

      {/* Operational Hero Band */}
      <PanelCard style={styles.heroBand}>
        <View style={styles.heroRow}>
          <View>
            <Text style={styles.heroTitle}>System Status</Text>
            <Text style={styles.heroSub}>Production · Token Tracker v1.0</Text>
          </View>
          <HealthDot state={overallState} size={10} />
        </View>
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{activeProviders}/{mockProviders.length}</Text>
            <Text style={styles.heroStatLabel}>PROVIDERS ACTIVE</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{((resolved / mockSurfaceTruth.length) * 100).toFixed(0)}%</Text>
            <Text style={styles.heroStatLabel}>TRUTH RESOLVED</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={[styles.heroStatValue, { color: colors.criticalText }]}>{criticalProviders}</Text>
            <Text style={styles.heroStatLabel}>CRITICAL</Text>
          </View>
        </View>
      </PanelCard>

      {/* Filter Pills */}
      <View style={styles.filterRow}>
        <FilterPills pills={TIME_FILTERS} active={timeFilter} onSelect={setTimeFilter} />
      </View>

      {/* KPI Deck — deltas sourced from mockPeriodMetrics */}
      {(() => {
        const pm = (label: string) => mockPeriodMetrics.find(m => m.label === label);
        const fallbackRate = mockSessions.filter(s => s.status === 'fallback').length / mockSessions.length * 100;
        const fallbackM = pm('Fallback Rate');
        return (
          <>
            <View style={styles.kpiRow}>
              <StatCard label="Total Spend" value={formatCost(totalSpend)} delta={pm('Total Spend')?.delta ?? ''} deltaPositive={pm('Total Spend')?.deltaPositive ?? false} flex={1} />
              <StatCard label="Sessions" value={totalSessions.toLocaleString()} delta={pm('Sessions')?.delta ?? ''} deltaPositive={pm('Sessions')?.deltaPositive ?? true} flex={1} />
            </View>
            <View style={[styles.kpiRow, { marginTop: 8 }]}>
              <StatCard label="Total Tokens" value={formatTokens(totalTokens)} delta={pm('Total Tokens')?.delta ?? ''} deltaPositive={pm('Total Tokens')?.deltaPositive ?? true} flex={1} />
              <StatCard label="Success Rate" value={`${avgSuccessRate.toFixed(1)}%`} delta={pm('Success Rate')?.delta ?? ''} deltaPositive={pm('Success Rate')?.deltaPositive ?? false} flex={1} />
            </View>
            <View style={[styles.kpiRow, { marginTop: 8 }]}>
              <StatCard label="Avg Latency" value={formatMs(avgLatency)} delta={pm('Avg Latency')?.delta ?? ''} deltaPositive={pm('Avg Latency')?.deltaPositive ?? true} flex={1} />
              <StatCard label="Fallback Rate" value={`${fallbackRate.toFixed(1)}%`} delta={fallbackM?.delta ?? ''} deltaPositive={fallbackM?.deltaPositive ?? false} flex={1} />
            </View>
          </>
        );
      })()}

      {/* Trend Activity */}
      <PanelCard>
        <SectionHeader title="Trend Activity — Last 7 Days" />
        <TrendSparkline data={recentTrend} width={280} height={64} />
      </PanelCard>

      {/* Provider Integrity */}
      <PanelCard>
        <SectionHeader title="Provider Integrity" />
        {mockProviders.map(p => (
          <IntegrityLane
            key={p.id}
            label={p.name}
            score={p.integrityScore}
            state={p.status}
          />
        ))}
      </PanelCard>

      {/* Cluster Topology */}
      <PanelCard>
        <SectionHeader title="Cluster Topology" />
        <View style={styles.clusterGrid}>
          {mockProviders.map(p => {
            const state = p.status;
            let bg = colors.accentSoft;
            let dot = colors.accentColor;
            if (state === 'critical') { bg = colors.criticalSoft; dot = colors.criticalText; }
            else if (state === 'warning') { bg = colors.warningSoft; dot = colors.warningText; }
            else if (state === 'degraded') { bg = colors.degradedSoft; dot = colors.degradedColor; }
            else if (state === 'unknown') { bg = 'rgba(95,112,136,0.1)'; dot = colors.unknownColor; }
            return (
              <View key={p.id} style={[styles.clusterNode, { backgroundColor: bg, borderColor: dot + '40' }]}>
                <HealthDot state={p.status} size={6} />
                <Text style={[styles.clusterName, { color: dot }]} numberOfLines={1}>{p.name}</Text>
                <MiniBar values={p.trend} color={dot} height={14} width={48} />
              </View>
            );
          })}
        </View>
      </PanelCard>

      {/* Investigation Log */}
      <PanelCard>
        <SectionHeader title="Investigation Log" />
        {mockSessions.filter(s => s.status !== 'success').slice(0, 4).map(s => (
          <View key={s.id} style={styles.logRow}>
            <HealthDot state={s.status === 'error' ? 'critical' : s.status === 'fallback' ? 'fallback' : s.status === 'degraded' ? 'degraded' : 'warning'} size={6} />
            <View style={{ flex: 1 }}>
              <Text style={styles.logId}>{s.id}</Text>
              <Text style={styles.logDetail}>{s.provider} · {s.explanationFactors[0]}</Text>
            </View>
            <Text style={styles.logTime}>{new Date(s.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
        ))}
      </PanelCard>

      {/* Active Surface Truth */}
      <PanelCard>
        <SectionHeader title="Active Surface Truth" />
        <CompositionBar
          segments={[
            { label: 'Resolved', value: resolved, color: colors.accentColor },
            { label: 'Unresolved', value: unresolved, color: colors.warningText },
            { label: 'Unknown', value: unknown, color: colors.unknownColor },
          ]}
          height={8}
          showLegend
        />
        {mockSurfaceTruth.filter(s => s.status !== 'resolved').slice(0, 3).map(s => (
          <View key={s.id} style={[styles.logRow, { marginTop: 8 }]}>
            <HealthDot state={s.status === 'unresolved' ? 'warning' : 'unknown'} size={6} />
            <Text style={styles.logDetail}>{s.sessionId} · {s.provider} · {s.model}</Text>
            <StateChip state={s.status === 'unresolved' ? 'unresolved' : 'unknown'} />
          </View>
        ))}
      </PanelCard>

      {/* Context Health */}
      <PanelCard>
        <SectionHeader title="Context Health" />
        {mockContextHealth.map((c, i) => (
          <View key={i} style={styles.contextRow}>
            <HealthDot state={c.health === 'healthy' ? 'healthy' : c.health === 'degraded' ? 'degraded' : 'critical'} size={6} />
            <Text style={styles.contextModel} numberOfLines={1}>{c.model}</Text>
            <View style={styles.contextTrack}>
              <View style={[styles.contextFill, {
                width: `${c.pressure * 100}%` as `${number}%`,
                backgroundColor: c.pressure >= 0.9 ? colors.criticalText : c.pressure >= 0.7 ? colors.warningText : colors.accentColor,
              }]} />
            </View>
            <Text style={styles.contextPct}>{(c.pressure * 100).toFixed(0)}%</Text>
          </View>
        ))}
      </PanelCard>

      {/* Provider Summary List */}
      <PanelCard>
        <SectionHeader title="Provider Summaries" />
        {mockProviders.map(p => (
          <View key={p.id} style={styles.providerRow}>
            <View style={styles.providerLeft}>
              <StateChip state={p.status} />
              <Text style={styles.providerName}>{p.name}</Text>
            </View>
            <View style={styles.providerRight}>
              <Text style={styles.providerStat}>{formatTokens(p.tokens)}</Text>
              <Text style={styles.providerStatLabel}>tokens</Text>
            </View>
            <View style={styles.providerRight}>
              <Text style={styles.providerStat}>{formatCost(p.spend)}</Text>
              <Text style={styles.providerStatLabel}>spend</Text>
            </View>
            <MiniBar values={p.trend} height={18} width={40} color={
              p.status === 'healthy' ? colors.accentColor :
              p.status === 'warning' ? colors.warningText :
              p.status === 'critical' ? colors.criticalText :
              colors.degradedColor
            } />
          </View>
        ))}
      </PanelCard>

      {/* Recent Sessions */}
      <PanelCard>
        <SectionHeader title="Recent Sessions" />
        {mockSessions.slice(0, 6).map(s => (
          <View key={s.id} style={styles.sessionRow}>
            <View style={[styles.sessionDot, { backgroundColor: SESSION_STATUS_COLORS[s.status] ?? colors.unknownColor }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.sessionId}>{s.id} · {s.provider}</Text>
              <Text style={styles.sessionModel}>{s.model}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.sessionCost}>{formatCost(s.cost)}</Text>
              <Text style={styles.sessionTokens}>{formatTokens(s.tokens)}</Text>
            </View>
          </View>
        ))}
      </PanelCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 14, gap: 0 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroBand: { marginBottom: 10 },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  heroTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary },
  heroSub: { fontSize: 10, fontFamily: 'Inter_400Regular', color: colors.textMuted, marginTop: 2 },
  heroStats: { flexDirection: 'row', gap: 20 },
  heroStat: {},
  heroStatValue: { fontSize: 22, fontFamily: 'SpaceGrotesk_700Bold', color: colors.accentColor, letterSpacing: -0.5 },
  heroStatLabel: { fontSize: 8, fontFamily: 'Inter_600SemiBold', color: colors.textMuted, letterSpacing: 0.8, textTransform: 'uppercase' },
  filterRow: { marginBottom: 10 },
  kpiRow: { flexDirection: 'row', gap: 8 },
  clusterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  clusterNode: {
    flex: 1,
    minWidth: 100,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  clusterName: { fontSize: 9, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.3 },
  logRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  logId: { fontSize: 10, fontFamily: 'Inter_600SemiBold', color: colors.textSecondary },
  logDetail: { fontSize: 10, fontFamily: 'Inter_400Regular', color: colors.textMuted, marginTop: 1 },
  logTime: { fontSize: 9, fontFamily: 'Inter_400Regular', color: colors.textMuted },
  contextRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 7 },
  contextModel: { fontSize: 10, fontFamily: 'Inter_400Regular', color: colors.textSecondary, width: 110 },
  contextTrack: { flex: 1, height: 4, backgroundColor: colors.bgSecondary, borderRadius: 2, overflow: 'hidden' },
  contextFill: { height: '100%', borderRadius: 2 },
  contextPct: { fontSize: 9, fontFamily: 'Inter_400Regular', color: colors.textMuted, width: 28, textAlign: 'right' },
  providerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: colors.borderColor },
  providerLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  providerName: { fontSize: 11, fontFamily: 'Inter_500Medium', color: colors.textSecondary },
  providerRight: { alignItems: 'flex-end', minWidth: 44 },
  providerStat: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary },
  providerStatLabel: { fontSize: 8, fontFamily: 'Inter_400Regular', color: colors.textMuted },
  sessionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: colors.borderColor },
  sessionDot: { width: 7, height: 7, borderRadius: 4 },
  sessionId: { fontSize: 10, fontFamily: 'Inter_600SemiBold', color: colors.textSecondary },
  sessionModel: { fontSize: 9, fontFamily: 'Inter_400Regular', color: colors.textMuted, marginTop: 1 },
  sessionCost: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary },
  sessionTokens: { fontSize: 9, fontFamily: 'Inter_400Regular', color: colors.textMuted },
});
