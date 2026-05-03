import { useInView } from "../../hooks/useInView";
import { Badge } from "../ui/Badge";
import { Section } from "../ui/Section";
import { workExperience, type WorkEntry } from "../../data/work-experience";

const typeVariant: Record<WorkEntry["type"], "accent" | "cyan" | "muted"> = {
  "Full Time":  "accent",
  Internship:   "cyan",
  Contract:     "muted",
};

interface TimelineEntryProps {
  entry: WorkEntry;
  index: number;
  isLast: boolean;
}

function TimelineEntry({ entry, index, isLast }: TimelineEntryProps) {
  const { ref, inView } = useInView(0.12);
  const isFirst = index === 0;

  return (
    <div
      ref={ref}
      className={[
        "relative pl-10 transition-all duration-700 ease-out",
        isLast ? "pb-0" : "pb-14",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      ].join(" ")}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Timeline node */}
      <span
        className={[
          "absolute left-0 top-1.5 flex items-center justify-center",
          "w-4 h-4 rounded-full border-2 -translate-x-1/2",
          isFirst
            ? "border-accent bg-accent shadow-glow"
            : "border-border bg-surface-2",
        ].join(" ")}
        aria-hidden
      />

      {/* Card */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-accent/30 hover:shadow-glow group">
        {/* Card header */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-6 pb-5">
          {/* Logo */}
          <a
            href={entry.websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-surface-2 border border-border overflow-hidden"
            aria-label={`Visit ${entry.company}`}
          >
            <img
              src={entry.logo}
              alt={entry.logoAlt}
              className="w-9 h-9 object-contain"
            />
          </a>

          {/* Company + role */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <h3 className="font-display font-semibold text-base text-text leading-tight">
                {entry.company}
              </h3>
              <Badge variant={typeVariant[entry.type]}>{entry.type}</Badge>
            </div>
            <p className="font-body text-sm text-accent mb-1">{entry.role}</p>
            <p className="font-body text-xs text-muted">
              {entry.duration}
              <span className="mx-1.5 text-faint">·</span>
              {entry.location}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-border" />

        {/* Highlights */}
        <ul className="px-6 pt-4 pb-5 space-y-2.5">
          {entry.highlights.map((point, i) => (
            <li key={i} className="flex gap-3 text-sm font-body text-muted leading-relaxed">
              <span className="mt-[5px] shrink-0 w-1 h-1 rounded-full bg-accent/60" aria-hidden />
              {point}
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className="px-6 pb-5 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <Badge key={tag} variant="muted">{tag}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkExperience() {
  return (
    <Section id="experience" label="Experience" title="Where I've worked">
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
            index={index}
            isLast={index === workExperience.length - 1}
          />
        ))}
      </div>
    </Section>
  );
}

export default WorkExperience;
