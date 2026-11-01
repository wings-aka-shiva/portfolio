import { HomeSection } from "../ui/Section";
import { skillCategories, uniqueSkillCount } from "../../data/skills";

/** The full skills list. The hero's shiva.json card already shows the core stack. */
function Stack() {
  return (
    <HomeSection id="skills" n="05" label="stack" title="What I work with">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {skillCategories.map((category) => (
          <section key={category.id} aria-labelledby={`skills-${category.id}`}>
            <h3
              id={`skills-${category.id}`}
              className="mb-3 font-mono text-xs uppercase tracking-[0.08em] text-muted"
            >
              {category.label}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <li
                  key={skill.name}
                  className={[
                    "font-mono text-xs rounded-md border px-2.5 py-1",
                    skill.core ? "text-accent-text border-accent/40" : "text-body border-border",
                  ].join(" ")}
                >
                  {skill.name}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="mt-8 font-mono text-xs text-muted">
        {uniqueSkillCount} skills · highlighted ones are what I reach for first
      </p>
    </HomeSection>
  );
}

export default Stack;
