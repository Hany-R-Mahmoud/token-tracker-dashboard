import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, action, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
      <div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: 'var(--tt-text-primary)', letterSpacing: '-0.01em', margin: 0 }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: 11, color: 'var(--tt-text-muted)', marginTop: 2, fontFamily: "'Manrope', sans-serif" }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, badge, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--tt-text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p style={{ fontSize: 13, color: 'var(--tt-text-secondary)', fontFamily: "'Manrope', sans-serif", margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
