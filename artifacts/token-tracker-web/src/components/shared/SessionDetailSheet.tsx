import { Session, SessionStatus, HealthState } from '@/types';
import { StateChip } from '@/components/shared/StateChip';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export const SESSION_STATUS_MAP: Record<SessionStatus, HealthState> = {
  success: 'healthy',
  warning: 'warning',
  error: 'error',
  fallback: 'fallback',
  degraded: 'degraded',
  unknown: 'unknown',
};

export const CONTEXT_COLORS: Record<string, string> = {
  healthy: 'var(--tt-accent)',
  degraded: 'var(--tt-warning)',
  low: 'var(--tt-critical-text)',
};

export const TRUTH_COLORS: Record<string, string> = {
  resolved: 'var(--tt-accent)',
  unresolved: 'var(--tt-unresolved)',
  unknown: 'var(--tt-unknown)',
};

interface SessionDetailSheetProps {
  session: Session | null;
  onClose: () => void;
}

export function SessionDetailSheet({ session, onClose }: SessionDetailSheetProps) {
  if (!session) return null;

  return (
    <Sheet open={!!session} onOpenChange={onClose}>
      <SheetContent style={{ background: 'var(--tt-bg-secondary)', borderLeft: '1px solid var(--tt-border)', color: 'var(--tt-text-primary)', width: 420, maxWidth: '95vw', overflowY: 'auto' }}>
        <SheetHeader>
          <SheetTitle style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--tt-text-primary)', fontSize: 15 }}>
            Session {session.id}
          </SheetTitle>
        </SheetHeader>

        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <StateChip state={SESSION_STATUS_MAP[session.status] ?? 'unknown'} label={session.status} size="md" />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--tt-text-muted)' }}>
              {new Date(session.timestamp).toLocaleString()}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Provider', value: session.provider },
              { label: 'Model', value: session.model },
              { label: 'Tokens', value: session.tokens.toLocaleString() },
              { label: 'Cost', value: `$${session.cost.toFixed(4)}` },
              { label: 'Duration', value: `${(session.duration / 1000).toFixed(1)}s` },
              { label: 'Success Score', value: `${(session.successScore * 100).toFixed(0)}%` },
            ].map(item => (
              <div key={item.label} style={{ background: 'var(--tt-bg)', border: '1px solid var(--tt-border)', borderRadius: 5, padding: '8px 10px' }}>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--tt-text-muted)', marginBottom: 2, fontFamily: "'Manrope', sans-serif" }}>{item.label}</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: 'var(--tt-text-primary)' }}>{item.value}</div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--tt-text-muted)', marginBottom: 8, fontFamily: "'Manrope', sans-serif" }}>
              Cognitive Resolution Status
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ background: 'var(--tt-bg)', border: '1px solid var(--tt-border)', borderRadius: 5, padding: '8px 10px' }}>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--tt-text-muted)', marginBottom: 2 }}>Context Health</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: CONTEXT_COLORS[session.contextHealth] ?? 'var(--tt-text-muted)' }}>{session.contextHealth}</div>
              </div>
              <div style={{ background: 'var(--tt-bg)', border: '1px solid var(--tt-border)', borderRadius: 5, padding: '8px 10px' }}>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--tt-text-muted)', marginBottom: 2 }}>Surface Truth</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: TRUTH_COLORS[session.surfaceTruth] ?? 'var(--tt-text-muted)' }}>{session.surfaceTruth}</div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--tt-text-muted)', marginBottom: 8, fontFamily: "'Manrope', sans-serif" }}>
              Explanation Factors
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {session.explanationFactors.map((factor, i) => (
                <div key={i} style={{
                  padding: '6px 10px',
                  background: 'var(--tt-bg)',
                  border: '1px solid var(--tt-border)',
                  borderRadius: 4,
                  fontSize: 11,
                  color: 'var(--tt-text-secondary)',
                  fontFamily: "'Manrope', sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--tt-accent)', display: 'inline-block', flexShrink: 0 }} />
                  {factor}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--tt-text-muted)', marginBottom: 8, fontFamily: "'Manrope', sans-serif" }}>
              Evidence Notes
            </div>
            <div style={{
              padding: '10px 12px',
              background: 'var(--tt-bg)',
              border: '1px solid var(--tt-border)',
              borderRadius: 5,
              fontSize: 12,
              color: 'var(--tt-text-secondary)',
              fontFamily: "'Manrope', sans-serif",
              lineHeight: 1.6,
            }}>
              {session.evidenceNotes}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
