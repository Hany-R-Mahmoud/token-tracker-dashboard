import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--tt-bg)',
      }}
    >
      <Sidebar />
      <main
        style={{
          flex: 1,
          minWidth: 0,
          overflowX: 'hidden',
        }}
      >
        {children}
      </main>
    </div>
  );
}

export function PageLayout({ children, noPad = false }: { children: ReactNode; noPad?: boolean }) {
  return (
    <div style={{ padding: noPad ? 0 : '24px 28px', maxWidth: 1400 }}>
      {children}
    </div>
  );
}
