import colors from '@/constants/colors';

export const palette = {
  bg: colors.bg,
  bgSecondary: colors.bgSecondary,
  bgTertiary: colors.bgTertiary,
  textPrimary: colors.textPrimary,
  textSecondary: colors.textSecondary,
  textMuted: colors.textMuted,
  border: colors.borderColor,
  borderStrong: colors.borderStrong,
  accent: colors.accentColor,
  accentStrong: colors.accentStrong,
  accentSoft: colors.accentSoft,
  critical: colors.critical,
  criticalSoft: colors.criticalSoft,
  criticalText: colors.criticalText,
  warning: colors.warningColor,
  warningSoft: colors.warningSoft,
  warningText: colors.warningText,
  fallback: colors.fallbackColor,
  fallbackSoft: colors.fallbackSoft,
  degraded: colors.degradedColor,
  degradedSoft: colors.degradedSoft,
  unknown: colors.unknownColor,
  successSoft: colors.successSoft,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii = {
  xs: 3,
  sm: 4,
  md: 6,
  lg: 10,
  xl: 16,
  full: 999,
};

export const elevation = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 12,
  },
};

export type HealthState =
  | 'healthy'
  | 'mixed'
  | 'warning'
  | 'critical'
  | 'fallback'
  | 'degraded'
  | 'unknown'
  | 'unresolved'
  | 'loading'
  | 'error'
  | 'empty'
  | 'disconnected';

export const semanticColors: Record<HealthState, { dot: string; bg: string; text: string; label: string }> = {
  healthy:      { dot: palette.accent,    bg: palette.accentSoft,   text: palette.accent,      label: 'HEALTHY' },
  mixed:        { dot: palette.warning,   bg: palette.warningSoft,  text: palette.warningText, label: 'MIXED' },
  warning:      { dot: palette.warning,   bg: palette.warningSoft,  text: palette.warningText, label: 'WARNING' },
  critical:     { dot: palette.critical,  bg: palette.criticalSoft, text: palette.criticalText,label: 'CRITICAL' },
  fallback:     { dot: palette.fallback,  bg: palette.fallbackSoft, text: palette.fallback,    label: 'FALLBACK' },
  degraded:     { dot: palette.degraded,  bg: palette.degradedSoft, text: palette.degraded,    label: 'DEGRADED' },
  unknown:      { dot: palette.unknown,   bg: 'rgba(95,112,136,0.12)', text: palette.unknown,  label: 'UNKNOWN' },
  unresolved:   { dot: palette.warning,   bg: palette.warningSoft,  text: palette.warningText, label: 'UNRESOLVED' },
  loading:      { dot: palette.textMuted, bg: 'rgba(132,147,150,0.1)', text: palette.textMuted,label: 'LOADING' },
  error:        { dot: palette.critical,  bg: palette.criticalSoft, text: palette.criticalText,label: 'ERROR' },
  empty:        { dot: palette.textMuted, bg: 'rgba(132,147,150,0.1)', text: palette.textMuted,label: 'EMPTY' },
  disconnected: { dot: palette.degraded,  bg: palette.degradedSoft, text: palette.degraded,    label: 'DISCONNECTED' },
};

export const typography = {
  displayFont: 'Inter_700Bold',
  headingFont: 'Inter_600SemiBold',
  bodyFont: 'Inter_400Regular',
  monoFont: 'Inter_400Regular',
  sizes: {
    hero: 28,
    title: 18,
    subtitle: 14,
    body: 13,
    label: 10,
    micro: 9,
  },
};

export { colors };
