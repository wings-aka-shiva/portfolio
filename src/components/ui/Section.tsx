interface SectionProps {
  id?: string;
  label?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, label, title, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`py-20 max-w-5xl mx-auto px-6 ${className}`}>
      {(label || title) && (
        <div className="mb-12">
          {label && (
            <p className="font-body text-xs text-accent tracking-[0.3em] uppercase mb-3">
              {label}
            </p>
          )}
          {title && (
            <h2 className="font-display text-3xl font-bold text-text">
              {title}
            </h2>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
