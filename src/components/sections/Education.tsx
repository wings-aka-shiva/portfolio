import { useInView } from "../../hooks/useInView";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Section } from "../ui/Section";
import { education, type Education } from "../../data/education";

interface EducationCardProps {
  entry: Education;
  index: number;
}

function EducationCard({ entry, index }: EducationCardProps) {
  const { ref, inView } = useInView(0.1);

  return (
    <div
      ref={ref}
      className={[
        "transition-all duration-700 ease-out",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      ].join(" ")}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <Card hover className="p-6 h-full flex flex-col gap-5">
        {/* Header */}
        <div>
          <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
            <h3 className="font-display font-bold text-lg text-text leading-tight">
              {entry.institution}
            </h3>
            <Badge variant={entry.status === "ongoing" ? "cyan" : "muted"}>
              {entry.status === "ongoing" ? "Ongoing" : "Completed"}
            </Badge>
          </div>
          <p className="font-display text-base text-accent mb-1">
            {entry.degree}
          </p>
          <p className="font-body text-sm text-muted mb-2">{entry.field}</p>
          <div className="flex items-center gap-3 font-body text-xs text-faint">
            <span>📍 {entry.location}</span>
            <span className="text-border">·</span>
            <span>
              {entry.startYear} — {entry.endYear}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Clubs */}
        <div>
          <p className="font-body text-xs text-faint uppercase tracking-wider mb-3">
            Clubs &amp; Activities
          </p>
          <div className="flex flex-wrap gap-2">
            {entry.clubs.map((club) => (
              <Badge key={club} variant="muted">
                {club}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function Education() {
  return (
    <Section id="education" label="Academic Background" title="Education">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {education.map((entry, index) => (
          <EducationCard key={entry.id} entry={entry} index={index} />
        ))}
      </div>
    </Section>
  );
}

export default Education;
