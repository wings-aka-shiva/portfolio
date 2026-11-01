interface SectionProps {
  id?: string;
  label?: string;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

interface SectionHeaderProps {
  label?: string;
  title?: React.ReactNode;
  /** id for the h2, so the parent section can point aria-labelledby at it */
  titleId?: string;
  /** Extra line(s) rendered under the title, inside the header spacing */
  children?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ label, title, titleId, children, className = "" }: SectionHeaderProps) {
  return (
    <div className={`mb-10 ${className}`}>
      {label && (
        <p className="font-display text-xs uppercase tracking-[0.2em] text-accent mb-3">
          {label}
        </p>
      )}
      {title && (
        <h2 id={titleId} className="font-display text-3xl md:text-4xl font-bold text-text">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

export function Section({ id, label, title, children, className = '' }: SectionProps) {
  const titleId = id && title ? `${id}-title` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={`py-20 md:py-28 max-w-5xl mx-auto px-4 ${className}`}
    >
      {(label || title) && <SectionHeader label={label} title={title} titleId={titleId} />}
      {children}
    </section>
  );
}
