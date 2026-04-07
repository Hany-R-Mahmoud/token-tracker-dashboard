import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import colors from '@/constants/colors';
import { StateChip } from '@/src/components/shared/StateChip';
import { HealthDot } from '@/src/components/shared/HealthDot';
import { SectionHeader, PageHeader } from '@/src/components/shared/SectionHeader';
import { PanelCard } from '@/src/components/shared/PanelCard';
import { MiniBar } from '@/src/components/charts/MiniBar';
import { TrendSparkline } from '@/src/components/charts/TrendSparkline';
import { mockTeamMembers } from '@/src/data/mock/team';
import { formatTokens, formatCost } from '@/src/lib/format';
import { TeamMember } from '@/src/types';

const STATUS_STATE_MAP = {
  active: 'healthy',
  disconnected: 'disconnected',
  unavailable: 'unknown',
} as const;

const RANK_COLORS = [colors.accentColor, '#c3f584', '#a0c4ff', colors.textSecondary, colors.textMuted];

function getRankColor(rank: number): string {
  return RANK_COLORS[Math.min(rank - 1, RANK_COLORS.length - 1)];
}

interface MemberDetailSheetProps {
  member: TeamMember | null;
  onClose: () => void;
}

function MemberDetailSheet({ member, onClose }: MemberDetailSheetProps) {
  const insets = useSafeAreaInsets();
  if (!member) return null;

  const stateKey = STATUS_STATE_MAP[member.status];

  return (
    <Modal
      visible={!!member}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.sheet, { backgroundColor: colors.bgTertiary, paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.sheetHandle} />

        <View style={styles.sheetHeader}>
          <View>
            <Text style={styles.sheetName}>{member.name}</Text>
            <Text style={styles.sheetRole}>{member.role}</Text>
          </View>
          <View style={styles.sheetHeaderRight}>
            <Text style={[styles.rankBadge, { color: getRankColor(member.rank) }]}>#{member.rank}</Text>
            <StateChip state={stateKey} />
          </View>
        </View>

        {member.status === 'unavailable' ? (
          <View style={styles.unavailableState}>
            <Feather name="user-x" size={32} color={colors.unknownColor} />
            <Text style={styles.unavailableTitle}>Member Unavailable</Text>
            <Text style={styles.unavailableSub}>
              {member.name} has not yet logged any activity. Their session will appear here once they connect.
            </Text>
          </View>
        ) : member.status === 'disconnected' ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <PanelCard style={styles.disconnectedBanner} padding={12}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Feather name="wifi-off" size={16} color={colors.degradedColor} />
                <Text style={styles.disconnectedText}>Member is disconnected — data may be stale</Text>
              </View>
            </PanelCard>
            <MemberStats member={member} />
          </ScrollView>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <MemberStats member={member} />
          </ScrollView>
        )}

        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
          <Text style={styles.closeBtnText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

function MemberStats({ member }: { member: TeamMember }) {
  const healthState = member.contextHealth === 'healthy' ? 'healthy' : member.contextHealth === 'degraded' ? 'degraded' : 'critical';

  return (
    <>
      <View style={styles.statGrid}>
        <View style={styles.sheetStat}>
          <Text style={styles.sheetStatValue}>{formatTokens(member.tokens)}</Text>
          <Text style={styles.sheetStatLabel}>TOKENS</Text>
        </View>
        <View style={styles.sheetStat}>
          <Text style={styles.sheetStatValue}>{member.sessions}</Text>
          <Text style={styles.sheetStatLabel}>SESSIONS</Text>
        </View>
        <View style={styles.sheetStat}>
          <Text style={styles.sheetStatValue}>{formatCost(member.cost)}</Text>
          <Text style={styles.sheetStatLabel}>SPEND</Text>
        </View>
        <View style={styles.sheetStat}>
          <Text style={[styles.sheetStatValue, {
            color: member.successRate >= 90 ? colors.accentColor :
              member.successRate >= 70 ? colors.warningText : colors.criticalText
          }]}>{member.successRate.toFixed(1)}%</Text>
          <Text style={styles.sheetStatLabel}>SUCCESS</Text>
        </View>
      </View>

      <View style={[styles.sheetPanel, { marginTop: 16 }]}>
        <Text style={styles.sheetPanelLabel}>TOKEN TREND — 7 DAYS</Text>
        <TrendSparkline data={member.trend} width={280} height={48} />
      </View>

      <View style={styles.sheetPanel}>
        <Text style={styles.sheetPanelLabel}>SESSION DETAILS</Text>
        <View style={styles.sheetDetail}>
          <Text style={styles.sheetDetailKey}>Primary Model</Text>
          <Text style={styles.sheetDetailVal}>{member.primaryModel}</Text>
        </View>
        <View style={styles.sheetDetail}>
          <Text style={styles.sheetDetailKey}>Context Health</Text>
          <StateChip state={healthState} />
        </View>
        <View style={styles.sheetDetail}>
          <Text style={styles.sheetDetailKey}>Email</Text>
          <Text style={styles.sheetDetailVal}>{member.email}</Text>
        </View>
        <View style={styles.sheetDetail}>
          <Text style={styles.sheetDetailKey}>Joined</Text>
          <Text style={styles.sheetDetailVal}>{member.joinedDate}</Text>
        </View>
      </View>
    </>
  );
}

export function TeamScreen() {
  const insets = useSafeAreaInsets();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const activeMembers = mockTeamMembers.filter(m => m.status === 'active');
  const topTokens = mockTeamMembers.reduce((s, m) => s + m.tokens, 0);
  const topSpend = mockTeamMembers.reduce((s, m) => s + m.cost, 0);

  const webTopPad = Platform.OS === 'web' ? 67 : 0;

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: webTopPad + 12, paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader title="Leaderboard" subtitle="Team token usage and performance" />

        {/* Summary Band */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{activeMembers.length}</Text>
            <Text style={styles.summaryLabel}>ACTIVE</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{formatTokens(topTokens)}</Text>
            <Text style={styles.summaryLabel}>TOTAL TOKENS</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{formatCost(topSpend)}</Text>
            <Text style={styles.summaryLabel}>TOTAL SPEND</Text>
          </View>
        </View>

        {/* Podium Top 3 */}
        <PanelCard>
          <SectionHeader title="Top Performers" />
          <View style={styles.podium}>
            {mockTeamMembers.slice(0, 3).map((m, i) => (
              <TouchableOpacity
                key={m.id}
                style={[styles.podiumCard, { opacity: 1 - i * 0.05 }]}
                onPress={() => setSelectedMember(m)}
                activeOpacity={0.75}
                testID={`member-row-${m.id}`}
              >
                <Text style={[styles.podiumRank, { color: getRankColor(m.rank) }]}>#{m.rank}</Text>
                <Text style={styles.podiumName}>{m.name.split(' ')[0]}</Text>
                <Text style={styles.podiumRole}>{m.role}</Text>
                <Text style={[styles.podiumTokens, { color: getRankColor(m.rank) }]}>{formatTokens(m.tokens)}</Text>
                <MiniBar values={m.trend} height={16} width={60} color={getRankColor(m.rank)} />
              </TouchableOpacity>
            ))}
          </View>
        </PanelCard>

        {/* Full Leaderboard List */}
        <PanelCard>
          <SectionHeader title="All Members" />
          {mockTeamMembers.map(m => {
            const stateKey = STATUS_STATE_MAP[m.status];
            return (
              <TouchableOpacity
                key={m.id}
                style={styles.memberRow}
                onPress={() => setSelectedMember(m)}
                activeOpacity={0.75}
                testID={`member-row-${m.id}`}
              >
                {/* Rank */}
                <Text style={[styles.memberRank, { color: getRankColor(m.rank) }]}>
                  {m.rank < 10 ? `#0${m.rank}` : `#${m.rank}`}
                </Text>

                {/* Identity */}
                <View style={styles.memberIdentity}>
                  <HealthDot state={stateKey} size={7} />
                  <View>
                    <Text style={styles.memberName}>{m.name}</Text>
                    <Text style={styles.memberRole}>{m.role}</Text>
                  </View>
                </View>

                {/* Stats */}
                {m.status === 'unavailable' ? (
                  <Text style={styles.memberUnavailable}>UNAVAILABLE</Text>
                ) : m.status === 'disconnected' ? (
                  <View style={styles.memberDisconnected}>
                    <StateChip state="disconnected" />
                    <Text style={styles.memberTokens}>{formatTokens(m.tokens)}</Text>
                  </View>
                ) : (
                  <View style={styles.memberStats}>
                    <Text style={styles.memberTokens}>{formatTokens(m.tokens)}</Text>
                    <Text style={[styles.memberSuccess, {
                      color: m.successRate >= 90 ? colors.accentColor :
                        m.successRate >= 75 ? colors.warningText : colors.criticalText
                    }]}>{m.successRate.toFixed(0)}%</Text>
                    <MiniBar values={m.trend} height={16} width={48} color={getRankColor(m.rank)} />
                  </View>
                )}

                <Feather name="chevron-right" size={14} color={colors.textMuted} />
              </TouchableOpacity>
            );
          })}
        </PanelCard>
      </ScrollView>

      <MemberDetailSheet member={selectedMember} onClose={() => setSelectedMember(null)} />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 14 },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.bgTertiary,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk_700Bold',
    color: colors.accentColor,
    letterSpacing: -0.3,
  },
  summaryLabel: {
    fontSize: 8,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 3,
  },
  podium: {
    flexDirection: 'row',
    gap: 8,
  },
  podiumCard: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderColor,
    padding: 10,
    alignItems: 'center',
    gap: 4,
  },
  podiumRank: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.2,
  },
  podiumName: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  podiumRole: {
    fontSize: 8,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  podiumTokens: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
    gap: 8,
  },
  memberRank: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    width: 32,
    letterSpacing: 0.2,
  },
  memberIdentity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberName: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  memberRole: {
    fontSize: 9,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginTop: 1,
  },
  memberStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberTokens: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textSecondary,
    minWidth: 40,
    textAlign: 'right',
  },
  memberSuccess: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    minWidth: 32,
    textAlign: 'right',
  },
  memberUnavailable: {
    fontSize: 8,
    fontFamily: 'Inter_600SemiBold',
    color: colors.unknownColor,
    letterSpacing: 0.8,
  },
  memberDisconnected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  // Sheet styles
  sheet: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  sheetName: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  sheetRole: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginTop: 2,
  },
  sheetHeaderRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  rankBadge: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.5,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sheetStat: {
    flex: 1,
    minWidth: 80,
    backgroundColor: colors.bg,
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderColor,
    alignItems: 'center',
  },
  sheetStatValue: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: colors.accentColor,
    letterSpacing: -0.4,
  },
  sheetStatLabel: {
    fontSize: 8,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 3,
  },
  sheetPanel: {
    backgroundColor: colors.bg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderColor,
    padding: 12,
    marginBottom: 10,
  },
  sheetPanelLabel: {
    fontSize: 8,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  sheetDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  sheetDetailKey: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  sheetDetailVal: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  closeBtn: {
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentColor,
    borderRadius: 6,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  closeBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.accentColor,
  },
  unavailableState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  unavailableTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: colors.unknownColor,
  },
  unavailableSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  disconnectedBanner: {
    borderColor: colors.degradedColor + '60',
    backgroundColor: colors.degradedSoft,
    marginBottom: 12,
  },
  disconnectedText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.degradedColor,
    flex: 1,
  },
});
