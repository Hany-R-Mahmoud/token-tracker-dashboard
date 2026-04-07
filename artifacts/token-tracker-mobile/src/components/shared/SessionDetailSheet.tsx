import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import colors from '@/constants/colors';
import { StateChip } from '@/src/components/shared/StateChip';
import { HealthDot } from '@/src/components/shared/HealthDot';
import { PanelCard } from '@/src/components/shared/PanelCard';
import { Session } from '@/src/types';
import { formatTokens, formatCost, formatMs } from '@/src/lib/format';
import type { HealthState } from '@/src/types';

const SESSION_STATE_MAP: Record<string, HealthState> = {
  success: 'healthy',
  warning: 'warning',
  error: 'critical',
  fallback: 'fallback',
  degraded: 'degraded',
  unknown: 'unknown',
};

const TRUTH_LABELS: Record<string, { label: string; color: string }> = {
  resolved: { label: 'Resolved', color: colors.accentColor },
  unresolved: { label: 'Unresolved', color: colors.criticalText },
  partial: { label: 'Partial', color: colors.warningText },
  unknown: { label: 'Unknown', color: colors.unknownColor },
};

const CONTEXT_LABELS: Record<string, { label: string; color: string }> = {
  healthy: { label: 'Healthy', color: colors.accentColor },
  degraded: { label: 'Degraded', color: colors.warningText },
  critical: { label: 'Critical', color: colors.criticalText },
  unknown: { label: 'Unknown', color: colors.unknownColor },
};

interface SessionDetailSheetProps {
  session: Session | null;
  onClose: () => void;
}

export function SessionDetailSheet({ session, onClose }: SessionDetailSheetProps) {
  const insets = useSafeAreaInsets();
  if (!session) return null;

  const stateKey = SESSION_STATE_MAP[session.status] ?? 'unknown';
  const truthInfo = TRUTH_LABELS[session.surfaceTruth] ?? TRUTH_LABELS.unknown;
  const contextInfo = CONTEXT_LABELS[session.contextHealth] ?? CONTEXT_LABELS.unknown;

  const ts = new Date(session.timestamp);
  const dateStr = ts.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = ts.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <Modal
      visible={!!session}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.sheet, { backgroundColor: colors.bgTertiary, paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sessionId}>{session.id}</Text>
            <Text style={styles.sessionMeta}>{dateStr} · {timeStr}</Text>
          </View>
          <StateChip state={stateKey} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>

          {/* Core Stats */}
          <View style={styles.statGrid}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatTokens(session.tokens)}</Text>
              <Text style={styles.statLabel}>TOKENS</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatCost(session.cost)}</Text>
              <Text style={styles.statLabel}>COST</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatMs(session.duration)}</Text>
              <Text style={styles.statLabel}>DURATION</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: session.successScore >= 0.9 ? colors.accentColor : session.successScore >= 0.8 ? colors.warningText : colors.criticalText }]}>
                {(session.successScore * 100).toFixed(0)}%
              </Text>
              <Text style={styles.statLabel}>SUCCESS</Text>
            </View>
          </View>

          {/* Provider / Model */}
          <PanelCard style={{ marginTop: 12 }}>
            <View style={styles.row}>
              <Feather name="cpu" size={14} color={colors.textMuted} />
              <Text style={styles.rowLabel}>Provider</Text>
              <Text style={styles.rowValue}>{session.provider}</Text>
            </View>
            <View style={styles.row}>
              <Feather name="layers" size={14} color={colors.textMuted} />
              <Text style={styles.rowLabel}>Model</Text>
              <Text style={styles.rowValue}>{session.model}</Text>
            </View>
          </PanelCard>

          {/* Truth Engine Signals */}
          <PanelCard style={{ marginTop: 12 }}>
            <Text style={styles.panelTitle}>Truth Engine Signals</Text>
            <View style={styles.row}>
              <HealthDot state={stateKey} size={8} />
              <Text style={styles.rowLabel}>Surface Truth</Text>
              <Text style={[styles.rowValue, { color: truthInfo.color }]}>{truthInfo.label}</Text>
            </View>
            <View style={styles.row}>
              <HealthDot state={session.contextHealth === 'healthy' ? 'healthy' : session.contextHealth === 'degraded' ? 'degraded' : 'critical'} size={8} />
              <Text style={styles.rowLabel}>Context Health</Text>
              <Text style={[styles.rowValue, { color: contextInfo.color }]}>{contextInfo.label}</Text>
            </View>
          </PanelCard>

          {/* Explanation Factors */}
          {session.explanationFactors && session.explanationFactors.length > 0 && (
            <PanelCard style={{ marginTop: 12 }}>
              <Text style={styles.panelTitle}>Explanation Factors</Text>
              {session.explanationFactors.map((f, i) => (
                <View key={i} style={styles.factorRow}>
                  <View style={styles.factorDot} />
                  <Text style={styles.factorText}>{f}</Text>
                </View>
              ))}
            </PanelCard>
          )}

          {/* Evidence Notes */}
          {session.evidenceNotes && (
            <PanelCard style={{ marginTop: 12 }}>
              <Text style={styles.panelTitle}>Evidence Notes</Text>
              <Text style={styles.evidenceText}>{session.evidenceNotes}</Text>
            </PanelCard>
          )}

        </ScrollView>

        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
          <Text style={styles.closeBtnText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3a4a6a',
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  sessionId: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#e8eaf6',
    letterSpacing: 0.2,
  },
  sessionMeta: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#7a8caa',
    marginTop: 3,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 4,
  },
  stat: {
    flex: 1,
    minWidth: '40%',
    backgroundColor: '#141f35',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#e8eaf6',
  },
  statLabel: {
    fontSize: 9,
    fontFamily: 'Inter_600SemiBold',
    color: '#7a8caa',
    letterSpacing: 0.8,
    marginTop: 3,
  },
  panelTitle: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: '#7a8caa',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5,
  },
  rowLabel: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#9aa8c0',
  },
  rowValue: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#e8eaf6',
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  factorDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#a3ffd9',
  },
  factorText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#c8d8f0',
    flex: 1,
  },
  evidenceText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#c8d8f0',
    lineHeight: 18,
  },
  closeBtn: {
    marginTop: 12,
    backgroundColor: '#1e2f50',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#a3ffd9',
  },
});
