import { useInView } from "../../hooks/useInView";
import { Badge } from "../ui/Badge";
import { Section } from "../ui/Section";
import { DateText } from "../ui/DateText";
import { education, type Education } from "../../data/education";

function EducationCard({ entry }: { entry: Education }) {
  const { ref, inView } = useInView(0.1);
  const ongoing = entry.status === "ongoing";

  return (
    <div
      ref={ref}
      className={[
        "bg-surface border border-border rounded-xl p-5 h-full",
        "transition-all duration-500 ease-out hover:border-accent/30",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      ].join(" ")}
    >
      <h3 className="font-display text-base font-semibold text-text leading-snug">
        {entry.degree}
      </h3>
      <p className="font-body text-sm text-muted mt-0.5">
        {entry.institution}
        <span className="mx-1.5 text-faint">·</span>
        {entry.location}
      </p>
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className="font-body text-xs text-muted">
          <DateText value={`${entry.startYear} - ${ongoing ? `Dec ${entry.endYear}` : entry.endYear}`} />
        </span>
        <Badge variant={ongoing ? "cyan" : "muted"}>
          {ongoing ? "Ongoing" : "Completed"}
        </Badge>
      </div>
      <p className="font-body text-xs text-muted/80 mt-2">{entry.note}</p>
    </div>
  );
}

function Education() {
  return (
    <Section id="education" label="Background" title="Education">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {education.map((entry) => (
          <EducationCard key={entry.id} entry={entry} />
        ))}
      </div>
    </Section>
  );
}

export default Education;
