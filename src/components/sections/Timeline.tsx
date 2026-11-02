/**
 * Two-track timeline pieces shared by the home timeline and /experience:
 * engineering on the left (mono, indigo, dot grid), personal growth on the
 * right (serif, warm). Below md both collapse into one column with the line
 * on the left.
 */

export function TechMarker({ className = "" }: { className?: string }) {
  return (
    <span
      className={`block w-3.5 h-3.5 rounded-[3px] rotate-45 bg-accent-dot shadow-[0_0_0_4px_var(--color-tech-panel)] ${className}`}
      aria-hidden
    />
  );
}

export function LifeMarker({ className = "" }: { className?: string }) {
  return (
    <span
      className={`block w-3 h-3 rounded-full border-2 border-life-accent bg-life-panel shadow-[0_0_0_4px_var(--color-life-panel)] ${className}`}
      aria-hidden
    />
  );
}

interface LegendProps {
  /** Grid template for md+, matching the timeline below it */
  columns: string;
}

export function TimelineLegend({ columns }: LegendProps) {
  return (
    <div className={`grid grid-cols-2 gap-4 mb-4 md:gap-0 ${columns}`} aria-hidden>
      <p className="flex items-center gap-2.5 md:justify-end md:pr-6 font-mono text-xs uppercase tracking-[0.08em] text-accent-text">
        <span className="order-first md:order-last w-[9px] h-[9px] rotate-45 bg-accent-dot shrink-0" />
        // engineering
      </p>
      <span className="hidden md:block" />
      <p className="flex items-center gap-2.5 md:pl-6 font-serif italic text-sm text-life-accent">
        <span className="w-[11px] h-[11px] rounded-full border-2 border-life-accent shrink-0" />
        Personal growth
      </p>
    </div>
  );
}

/** Rounded wrapper with the two themed panels and the centre line behind its children. */
export function TimelineFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-[18px] overflow-hidden border border-border-soft bg-tech-panel">
      <div className="hidden md:block absolute inset-y-0 left-0 w-1/2 tech-grid" aria-hidden />
      <div className="hidden md:block absolute inset-y-0 right-0 w-1/2 life-grid" aria-hidden />
      <div className="absolute inset-y-0 left-[17px] md:left-[calc(50%-1px)] w-0.5 bg-[#2e2e52]" aria-hidden />
      <div className="relative">{children}</div>
    </div>
  );
}
