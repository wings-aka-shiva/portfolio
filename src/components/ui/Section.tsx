import { Link } from "react-router-dom";
import { SectionLabel } from "./SectionLabel";
import { accentLink, container } from "./styles";

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

// ─── v3 home sections ─────────────────────────────────────────────────────────

interface SectionShellProps {
  id?: string;
  labelledBy?: string;
  /** Last section on the page: extra bottom padding so it doesn't end against the screen edge */
  last?: boolean;
  children: React.ReactNode;
}

/** Full-width band with the top border and the shared container. */
export function SectionShell({ id, labelledBy, last = false, children }: SectionShellProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className="border-t border-border-soft scroll-mt-16">
      <div className={`${container} pt-9 md:pt-18 ${last ? "pb-20" : "pb-9 md:pb-18"}`}>{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  n: string;
  label: string;
  title: React.ReactNode;
  titleId: string;
  /** Top-right link, e.g. "full experience →" */
  more?: { to: string; label: string };
  /** "lg" = 40px (28px on phone), "md" = 32px */
  size?: "lg" | "md";
}

export function SectionHeading({ n, label, title, titleId, more, size = "lg" }: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 mb-6 md:mb-10">
      <div>
        <SectionLabel n={n} name={label} className="mb-3" />
        <h2
          id={titleId}
          className={[
            "font-display font-extrabold leading-tight text-text",
            size === "lg" ? "text-[28px] md:text-[40px]" : "text-[26px] md:text-[32px]",
          ].join(" ")}
        >
          {title}
        </h2>
      </div>
      {more && (
        <Link to={more.to} className={`${accentLink} py-1`}>
          {more.label}
        </Link>
      )}
    </div>
  );
}

type HomeSectionProps = Omit<SectionHeadingProps, "titleId"> & { id: string; children: React.ReactNode };

export function HomeSection({ id, children, ...heading }: HomeSectionProps) {
  const titleId = `${id}-title`;
  return (
    <SectionShell id={id} labelledBy={titleId}>
      <SectionHeading {...heading} titleId={titleId} />
      {children}
    </SectionShell>
  );
}
