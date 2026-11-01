import { useInView } from "../../hooks/useInView";
import { Section } from "../ui/Section";
import { skillCategories, certifications, type SkillCategory } from "../../data/skills";

// Certifications featured on the portfolio, with short display names.
const FEATURED_CERTS: Record<string, string> = {
  "aws-cloud-foundations": "AWS Academy Cloud Foundations",
  "aws-solutions-arch":    "AWS Solutions Architecture (Forage)",
  "deloitte-tech":         "Deloitte Technology Simulation (Forage)",
};

function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`font-display text-xs uppercase tracking-widest text-accent mb-3 ${className}`}>
      {children}
    </h3>
  );
}

function CategoryBlock({ category }: { category: SkillCategory }) {
  const { ref, inView } = useInView(0.1);

  return (
    <div
      ref={ref}
      className={[
        "transition-all duration-500 ease-out",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      ].join(" ")}
    >
      <Eyebrow>{category.label}</Eyebrow>
      <ul className="font-body text-sm text-text/80 leading-relaxed space-y-1">
        {category.skills.map((skill) => (
          <li key={skill.name}>{skill.name}</li>
        ))}
      </ul>
    </div>
  );
}

function Skills() {
  const certs = certifications.filter((c) => c.id in FEATURED_CERTS);

  return (
    <Section id="skills" label="Toolkit" title="What I Work With">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10 mb-14">
        {skillCategories.map((category) => (
          <CategoryBlock key={category.id} category={category} />
        ))}
      </div>

      {/* Certifications */}
      <div>
        <Eyebrow>Certifications</Eyebrow>
        <ul className="flex flex-wrap gap-2">
          {certs.map((cert) => (
            <li
              key={cert.id}
              className="flex items-center gap-3 rounded-md border border-border bg-surface px-3 py-2"
            >
              <span className="font-body text-sm text-text/90">{FEATURED_CERTS[cert.id]}</span>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-xs text-accent hover:underline underline-offset-2"
                  aria-label={`View ${cert.name} credential`}
                >
                  View ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

export default Skills;
