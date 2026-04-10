import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--tt-bg)',
      gap: 16,
      padding: 40,
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono',
        fontSize: 64,
        fontWeight: 700,
        color: 'var(--tt-accent)',
        lineHeight: 1,
        letterSpacing: '-0.02em',
      }}>
        404
      </div>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 18,
        fontWeight: 600,
        color: 'var(--tt-text-primary)',
        letterSpacing: '-0.01em',
      }}>
        Page not found
      </div>
      <div style={{
        fontFamily: "'Manrope', sans-serif",
        fontSize: 13,
        color: 'var(--tt-text-muted)',
        textAlign: 'center',
        maxWidth: 360,
        lineHeight: 1.6,
      }}>
        The route you navigated to does not exist in this dashboard.
        Use the sidebar to access one of the available pages.
      </div>
      <Link href="/">
        <div style={{
          marginTop: 8,
          padding: '8px 20px',
          background: 'var(--tt-accent)',
          color: 'var(--tt-bg)',
          borderRadius: 5,
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "'Space Grotesk', sans-serif",
          cursor: 'pointer',
          letterSpacing: '0.02em',
        }}>
          Back to Overview
        </div>
      </Link>
    </div>
  );
}
