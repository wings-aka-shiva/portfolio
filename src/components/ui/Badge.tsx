type BadgeVariant = 'accent' | 'cyan' | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  accent: 'bg-accent/10 text-accent   border-accent/25',
  cyan:   'bg-cyan/10   text-cyan     border-cyan/25',
  muted:  'bg-white/5   text-muted    border-white/10',
};

export function Badge({ children, variant = 'muted' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5 rounded-full',
        'text-xs font-body font-medium border',
        variantClasses[variant],
      ].join(' ')}
    >
      {children}
    </span>
  );
}
