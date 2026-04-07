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
  mixed: colors.mixedColor,
  mixedSoft: colors.mixedSoft,
  unresolved: colors.unresolvedColor,
  unresolvedSoft: colors.unresolvedSoft,
  error: colors.errorColor,
  errorSoft: colors.errorSoft,
  loading: colors.loadingColor,
  loadingSoft: colors.loadingSoft,
  empty: colors.emptyColor,
  emptySoft: colors.emptySoft,
  disconnected: colors.disconnectedColor,
  disconnectedSoft: colors.disconnectedSoft,
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

/**
 * Every HealthState has a UNIQUE combination of dot/bg/text colors.
 * States that were previously aliasing each other are now distinct:
 *   - mixed     → amber-gold (#d4a84b) — warmer than warning (#c47b18)
 *   - warning   → orange (#c47b18) — the classic warning amber
 *   - unresolved → coral-orange (#e07050) — distinct from both warning and error
 *   - critical  → deep red (#b01522) with text #e85b6a
 *   - error     → hot pink-red (#d63661) — distinct from critical red
 *   - loading   → blue-teal (#4a9eba) — communicates "in progress"
 *   - empty     → slate-grey (#6a7a90) — communicates "nothing here"
 *   - fallback  → soft violet (#a67abb)
 *   - degraded  → blue-grey (#8fa3b1)
 *   - unknown   → dim slate (#5f7088)
 *   - disconnected → muted purple (#6b4f72)
 *   - healthy   → mint accent (#a3ffd9)
 */
export const semanticColors: Record<HealthState, { dot: string; bg: string; text: string; label: string }> = {
  healthy:      { dot: palette.accent,        bg: palette.accentSoft,        text: palette.accent,        label: 'HEALTHY' },
  mixed:        { dot: palette.mixed,          bg: palette.mixedSoft,         text: palette.mixed,         label: 'MIXED' },
  warning:      { dot: palette.warning,        bg: palette.warningSoft,       text: palette.warningText,   label: 'WARNING' },
  critical:     { dot: palette.critical,       bg: palette.criticalSoft,      text: palette.criticalText,  label: 'CRITICAL' },
  error:        { dot: palette.error,          bg: palette.errorSoft,         text: palette.error,         label: 'ERROR' },
  fallback:     { dot: palette.fallback,       bg: palette.fallbackSoft,      text: palette.fallback,      label: 'FALLBACK' },
  degraded:     { dot: palette.degraded,       bg: palette.degradedSoft,      text: palette.degraded,      label: 'DEGRADED' },
  unknown:      { dot: palette.unknown,        bg: 'rgba(95,112,136,0.12)',   text: palette.unknown,       label: 'UNKNOWN' },
  unresolved:   { dot: palette.unresolved,     bg: palette.unresolvedSoft,    text: palette.unresolved,    label: 'UNRESOLVED' },
  loading:      { dot: palette.loading,        bg: palette.loadingSoft,       text: palette.loading,       label: 'LOADING' },
  empty:        { dot: palette.empty,          bg: palette.emptySoft,         text: palette.empty,         label: 'EMPTY' },
  disconnected: { dot: palette.disconnected,   bg: palette.disconnectedSoft,  text: palette.disconnected,  label: 'DISCONNECTED' },
};

export const typography = {
  displayFont: 'SpaceGrotesk_700Bold',
  headingFont: 'SpaceGrotesk_600SemiBold',
  bodyFont: 'Manrope_400Regular',
  bodyMediumFont: 'Manrope_500Medium',
  bodySemiBoldFont: 'Manrope_600SemiBold',
  monoFont: 'Inter_400Regular',
  labelFont: 'Inter_600SemiBold',
  sizes: {
    hero: 28,
    title: 18,
    subtitle: 14,
    body: 13,
    label: 10,
    micro: 9,
  },
};

export function useTheme() {
  return {
    palette,
    spacing,
    radii,
    elevation,
    typography,
    semanticColors,
  };
}

export { colors };
