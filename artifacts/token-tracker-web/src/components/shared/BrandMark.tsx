interface BrandMarkProps {
  size?: number;
  color?: string;
}

export function BrandMark({ size = 28, color = '#a3ffd9' }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Token Tracker mark"
    >
      {/* Outer diamond */}
      <path
        d="M50 4 L96 50 L50 96 L4 50 Z"
        stroke={color}
        strokeWidth="5"
        fill="none"
      />
      {/* Horizontal signal cut 1 (top) */}
      <line x1="22" y1="36" x2="78" y2="36" stroke={color} strokeWidth="5" strokeLinecap="square" />
      {/* Horizontal signal cut 2 (middle) */}
      <line x1="10" y1="50" x2="90" y2="50" stroke={color} strokeWidth="5" strokeLinecap="square" />
      {/* Horizontal signal cut 3 (bottom) */}
      <line x1="22" y1="64" x2="78" y2="64" stroke={color} strokeWidth="5" strokeLinecap="square" />
    </svg>
  );
}

export function BrandLockup({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5" data-testid="brand-lockup">
      <BrandMark size={28} />
      {!collapsed && (
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: '-0.02em',
            color: 'var(--tt-text-primary)',
          }}
        >
          Token Tracker
        </span>
      )}
    </div>
  );
}
