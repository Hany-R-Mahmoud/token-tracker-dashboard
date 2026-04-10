interface BrandMarkProps {
  size?: number;
}

export function BrandMark({ size = 28 }: BrandMarkProps) {
  return (
    <img
      src="/logo.png"
      alt="Token Tracker"
      width={size}
      height={size}
      style={{ borderRadius: size * 0.22, display: 'block', flexShrink: 0 }}
    />
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
