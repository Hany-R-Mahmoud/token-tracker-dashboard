import { Link, useLocation } from 'wouter';
import { BrandLockup } from './BrandMark';
import { HealthDot } from './StateChip';
import { useAuth } from '@/lib/auth';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  testId: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Overview', icon: '⬡', testId: 'nav-overview' },
  { path: '/analytics', label: 'Analytics', icon: '⟨⟩', testId: 'nav-analytics' },
  { path: '/team', label: 'Team', icon: '⊛', testId: 'nav-team' },
  { path: '/sessions', label: 'Sessions', icon: '≡', testId: 'nav-sessions' },
  { path: '/admin', label: 'Admin', icon: '⌥', testId: 'nav-admin' },
  { path: '/settings', label: 'Settings', icon: '⊙', testId: 'nav-settings' },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') return location === '/' || location === '';
    return location.startsWith(path);
  };

  return (
    <aside
      style={{
        width: 200,
        minHeight: '100vh',
        background: 'var(--tt-nav)',
        borderRight: '1px solid var(--tt-border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
      data-testid="sidebar"
    >
      {/* Brand */}
      <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid var(--tt-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BrandLockup />
          <HealthDot state="warning" size={7} />
        </div>
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 9, fontFamily: 'JetBrains Mono', color: 'var(--tt-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            v1.0 · PROD
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px' }}>
        {NAV_ITEMS.map(item => (
          <Link
            key={item.path}
            href={item.path}
            className={`tt-nav-link ${isActive(item.path) ? 'active' : ''}`}
            data-testid={item.testId}
            style={{ marginBottom: 2 }}
          >
            <span style={{ fontSize: 13, opacity: 0.6, width: 16, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Compact monitoring summary */}
      <div style={{
        padding: '10px 14px',
        borderTop: '1px solid var(--tt-border)',
        borderBottom: '1px solid var(--tt-border)',
      }}>
        <div className="tt-label" style={{ marginBottom: 6 }}>System Pulse</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {[
            { label: 'Spend', value: '$3.67k' },
            { label: 'Sessions', value: '6,252' },
            { label: 'Tokens', value: '105M' },
            { label: 'Health', value: '91%' },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: 8, color: 'var(--tt-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'Manrope', sans-serif" }}>{item.label}</div>
              <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--tt-text-primary)' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* User */}
      <div style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: 'var(--tt-accent-soft)',
            border: '1px solid var(--tt-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontFamily: 'JetBrains Mono',
            color: 'var(--tt-accent)',
            fontWeight: 600,
          }}>
            A
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--tt-text-primary)', fontFamily: "'Manrope', sans-serif", fontWeight: 600, lineHeight: 1.2 }}>{user.name}</div>
            <div style={{ fontSize: 9, color: 'var(--tt-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'Manrope', sans-serif" }}>{user.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
