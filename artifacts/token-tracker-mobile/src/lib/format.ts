export function formatTokens(t: number): string {
  if (t >= 1_000_000_000) return `${(t / 1_000_000_000).toFixed(1)}B`;
  if (t >= 1_000_000) return `${(t / 1_000_000).toFixed(1)}M`;
  if (t >= 1_000) return `${(t / 1_000).toFixed(0)}K`;
  return String(t);
}

export function formatCost(c: number): string {
  if (c >= 1000) return `$${(c / 1000).toFixed(1)}k`;
  if (c >= 100) return `$${c.toFixed(0)}`;
  return `$${c.toFixed(2)}`;
}

export function formatPct(p: number): string {
  return `${p.toFixed(1)}%`;
}

export function formatMs(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms)}ms`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
