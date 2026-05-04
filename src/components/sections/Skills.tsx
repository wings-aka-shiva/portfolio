import { useInView } from "../../hooks/useInView";
import { Section } from "../ui/Section";
import {
  skillCategories,
  certifications,
  awards,
  type SkillCategory,
  type Certification,
  type Award,
} from "../../data/skills";

// ─── Skill Category Card ──────────────────────────────────────────────────────

interface CategoryCardProps {
  category: SkillCategory;
  index: number;
}

function CategoryCard({ category, index }: CategoryCardProps) {
  const { ref, inView } = useInView(0.1);

  return (
    <div
      ref={ref}
      className={[
        "group rounded-2xl p-5 border transition-all duration-300 ease-out",
        "hover:border-accent/40 hover:shadow-glow",
        "bg-surface border-border",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      ].join(" ")}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <p className="font-body text-xs uppercase tracking-wider mb-3 text-white/90 transition-colors duration-300 group-hover:text-accent">
        {category.label}
      </p>
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <span
            key={skill.name}
            className={[
              "inline-flex items-center px-2.5 py-0.5 rounded-full",
              "text-xs font-body font-medium border",
              "transition-colors duration-300 group-hover:text-white",
              "bg-white/5 text-muted border-white/10",
            ].join(" ")}
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Certification Row ────────────────────────────────────────────────────────

interface CertRowProps {
  cert: Certification;
  index: number;
}

function CertRow({ cert, index }: CertRowProps) {
  const { ref, inView } = useInView(0.1);
  const isAws = cert.id === "aws-cloud-foundations";

  return (
    <div
      ref={ref}
      className={[
        "group rounded-xl px-4 py-3 border flex items-center justify-between gap-4",
        "transition-all duration-300 ease-out",
        "hover:border-accent/40 hover:shadow-glow",
        isAws ? "bg-accent/5 border-accent/20" : "bg-surface border-border",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      ].join(" ")}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="min-w-0">
        <p className="font-display text-sm font-semibold text-text leading-snug transition-colors duration-300 group-hover:text-accent">{cert.name}</p>
        <p className="font-body text-xs text-muted mt-0.5">{cert.issuer}</p>
        <p className="font-body text-xs text-faint">{cert.date}</p>
      </div>
      {cert.credentialUrl && (
        <a
          href={cert.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-body text-xs text-muted border border-border rounded-lg px-2.5 py-1 hover:border-accent/40 hover:text-accent transition-all duration-200"
        >
          View ↗
        </a>
      )}
    </div>
  );
}

// ─── Award Card ───────────────────────────────────────────────────────────────

interface AwardCardProps {
  award: Award;
  index: number;
}

function AwardCard({ award, index }: AwardCardProps) {
  const { ref, inView } = useInView(0.1);
  const isAboveAndBeyond = award.id === "above-and-beyond";

  return (
    <div
      ref={ref}
      className={[
        "group rounded-2xl p-5 border transition-all duration-300 ease-out",
        "hover:border-accent/40 hover:shadow-glow",
        isAboveAndBeyond ? "bg-accent/5 border-accent/20" : "bg-surface border-border",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      ].join(" ")}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-3xl" aria-hidden>{award.emoji}</span>
        <p className="font-display font-semibold text-text leading-snug transition-colors duration-300 group-hover:text-accent">{award.title}</p>
      </div>
      {award.praisedBy && (
        <p className="font-body text-xs text-faint mb-0.5">Praised by {award.praisedBy}</p>
      )}
      <p className="font-body text-xs text-faint mb-3">
        {award.issuer} · {award.date}
      </p>
      <div className="border-t border-border pt-3">
        <p className="font-body text-sm text-muted italic">{award.description}</p>
      </div>
    </div>
  );
}

// ─── Eyebrow label ────────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-xs uppercase tracking-wider text-white/90 mb-4">{children}</p>
  );
}

// ─── Skills section ───────────────────────────────────────────────────────────

function Skills() {
  return (
    <Section id="skills" label="What I Work With" title="Skills">
      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {skillCategories.map((category, index) => (
          <CategoryCard key={category.id} category={category} index={index} />
        ))}
      </div>

      {/* Certifications */}
      <div className="mb-12">
        <Eyebrow>Certifications</Eyebrow>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {certifications.map((cert, index) => (
            <CertRow key={cert.id} cert={cert} index={index} />
          ))}
        </div>
      </div>

      {/* Recognition */}
      <div>
        <Eyebrow>Awards &amp; Recognition</Eyebrow>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {awards.map((award, index) => (
            <AwardCard key={award.id} award={award} index={index} />
          ))}
        </div>
      </div>
    </Section>
  );
}

export default Skills;
