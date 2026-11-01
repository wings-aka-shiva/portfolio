import { useInView } from "../../hooks/useInView";
import { Badge } from "../ui/Badge";
import { Section } from "../ui/Section";
import { TechChipList } from "../ui/TechChip";
import { DateText } from "../ui/DateText";
import { workExperience, type WorkEntry } from "../../data/work-experience";

const typeLabel: Record<WorkEntry["type"], string> = {
  "Full Time":        "Full Time",
  Internship:         "Internship",
  Contract:           "Contract",
  "industry-project": "Industry Project",
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

function Logo({ entry }: { entry: WorkEntry }) {
  const box =
    "shrink-0 flex items-center justify-center w-8 h-8 rounded-md border border-border bg-surface-2 p-1 overflow-hidden";

  const inner = entry.logo ? (
    <img src={entry.logo} alt={`${entry.company} logo`} className="w-full h-full object-contain" />
  ) : (
    <span className="font-display font-bold text-[10px] text-muted" aria-hidden>
      {initials(entry.company)}
    </span>
  );

  return entry.websiteUrl ? (
    <a href={entry.websiteUrl} target="_blank" rel="noreferrer" className={box} aria-label={`Visit ${entry.company}`}>
      {inner}
    </a>
  ) : (
    <span className={box}>{inner}</span>
  );
}

interface TimelineEntryProps {
  entry: WorkEntry;
  isLast: boolean;
}

function TimelineEntry({ entry, isLast }: TimelineEntryProps) {
  const { ref, inView } = useInView(0.12);

  return (
    <div
      ref={ref}
      className={[
        "relative pl-8 sm:pl-10 transition-all duration-500 ease-out",
        isLast ? "pb-0" : "pb-10",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      ].join(" ")}
    >
      {/* Timeline node */}
      <span
        className={[
          "absolute left-0 top-6 w-3 h-3 rounded-full border-2 -translate-x-1/2",
          entry.isCurrent
            ? "border-cyan bg-cyan shadow-[0_0_12px_rgba(6,182,212,0.5)]"
            : "border-border bg-surface-2",
        ].join(" ")}
        aria-hidden
      />

      {/* Card */}
      <article
        className={[
          "bg-surface border border-border border-l-2 rounded-xl p-5 sm:p-6",
          // Hover tints only the non-left sides so the left accent stripe survives
          "transition-colors duration-300 hover:border-y-accent/30 hover:border-r-accent/30",
          entry.isCurrent ? "border-l-cyan" : "border-l-accent/60",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <Logo entry={entry} />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base font-semibold text-text leading-snug">
                {entry.role}
              </h3>
              {entry.isCurrent ? (
                <Badge variant="cyan">Current</Badge>
              ) : (
                <Badge variant="muted">{typeLabel[entry.type]}</Badge>
              )}
            </div>
            <p className="font-body text-sm text-muted mt-0.5">
              {entry.company}
              <span className="mx-1.5 text-faint">·</span>
              {entry.location}
              <span className="mx-1.5 text-faint">·</span>
              <DateText value={entry.period} />
            </p>
          </div>
        </div>

        {/* Tech tags */}
        <TechChipList items={entry.tech} className="mt-3" />

        {/* Impact bullets */}
        <ul className="mt-4 space-y-2.5">
          {entry.bullets.map((point, i) => (
            <li key={i} className="flex gap-3 font-body text-sm text-text/80 leading-relaxed">
              <span
                className={[
                  "mt-[0.55em] shrink-0 w-1.5 h-1.5",
                  entry.isCurrent ? "bg-cyan" : "bg-accent",
                ].join(" ")}
                aria-hidden
              />
              {point}
            </li>
          ))}
        </ul>

        {/* Award callout */}
        {entry.highlight && (
          <div className="bg-accent/8 border border-accent/20 rounded-lg px-4 py-3 mt-4">
            <p className="font-body text-sm font-semibold text-accent">
              {entry.highlight.title}
            </p>
            <p className="font-body text-xs text-muted mt-1">
              <span className="italic">"{entry.highlight.description}"</span>
              <span className="mx-1.5 text-faint">·</span>
              {entry.highlight.praisedBy}, {entry.highlight.date}
            </p>
          </div>
        )}
      </article>
    </div>
  );
}

function WorkExperience() {
  return (
    <Section id="experience" label="Where I've worked" title="Experience">
      <div className="relative">
        {/* Vertical timeline line */}
        <div
          className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-accent/60 via-border to-transparent"
          aria-hidden
        />

        {workExperience.map((entry, index) => (
          <TimelineEntry
            key={entry.id}
            entry={entry}
            isLast={index === workExperience.length - 1}
          />
        ))}
      </div>
    </Section>
  );
}

export default WorkExperience;
