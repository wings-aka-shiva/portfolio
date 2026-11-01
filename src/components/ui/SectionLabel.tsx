/** Mono section label, e.g. "01 / experience" */
export function SectionLabel({ n, name, className = "" }: { n: string; name: string; className?: string }) {
  return (
    <p className={`font-mono text-[13px] text-muted ${className}`}>
      <span className="text-cyan-text">{n}</span> / {name}
    </p>
  );
}
