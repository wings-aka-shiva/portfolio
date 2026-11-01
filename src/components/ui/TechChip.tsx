interface TechChipListProps {
  items: string[];
  className?: string;
}

/** Mono tech-stack chips shared by Experience, Hackathons and Projects. */
export function TechChipList({ items, className = "" }: TechChipListProps) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {items.map((t) => (
        <li
          key={t}
          className="text-xs font-mono bg-surface-2 border border-border rounded px-2 py-0.5 text-muted"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}
