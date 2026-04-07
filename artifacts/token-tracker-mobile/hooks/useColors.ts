import colors from "@/constants/colors";

/**
 * Returns the design tokens for the current color scheme.
 * Token Tracker is a dark-only app — returns the flat palette directly.
 */
export function useColors() {
  return colors;
}
