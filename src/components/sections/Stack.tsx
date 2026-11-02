import { HomeSection } from "../ui/Section";
import { certifications, skillCategories, type Certification } from "../../data/skills";

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "Jul 2025" -> 202506, for sorting newest first */
function dateRank(date: string) {
  const [month = "", year = "0"] = date.trim().split(/\s+/).slice(-2);
  return Number(year) * 100 + MONTHS.indexOf(month.slice(0, 3).toLowerCase());
}

const newestFirst = (a: Certification, b: Certification) => dateRank(b.date) - dateRank(a.date);

const isSimulation = (c: Certification) => c.issuer.startsWith("Forage");

const certs = certifications.filter((c) => !isSimulation(c)).sort(newestFirst);
const simulations = certifications.filter(isSimulation).sort(newestFirst);

/** "2025", or "2024-2025" when the simulations span years */
const simYears = (() => {
  const years = simulations.map((s) => Math.floor(dateRank(s.date) / 100));
  const first = Math.min(...years);
  const last = Math.max(...years);
  return first === last ? String(first) : `${first}-${last}`;
})();

const groupLabel = "mb-3 font-mono text-xs uppercase tracking-[0.08em] text-muted";

function Certifications() {
  return (
    <div className="mt-12">
      {certs.length > 0 && (
        <section aria-labelledby="certs-certifications">
          <h3 id="certs-certifications" className={groupLabel}>
            Certifications
          </h3>
          <ul className="divide-y divide-border-soft border-y border-border-soft">
            {certs.map((c) => (
              <li
                key={c.id}
                className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-6 gap-y-1 py-3"
              >
                <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 min-w-0">
                  <span className="font-body text-[15px] text-text">{c.name}</span>
                  <span className="text-muted" aria-hidden>·</span>
                  <span className="font-body text-[15px] text-muted">
                    {c.issuer === "Amazon Web Services" ? "AWS" : c.issuer}
                  </span>
                  <span className="text-muted" aria-hidden>·</span>
                  <span className="font-mono text-xs text-muted">{c.date}</span>
                </span>
                {c.credentialUrl && (
                  <a
                    href={c.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 font-mono text-[13px] text-accent-text hover:underline underline-offset-2"
                  >
                    verify ↗
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {simulations.length > 0 && (
        <section aria-labelledby="certs-simulations" className="mt-8">
          <h3 id="certs-simulations" className={groupLabel}>
            Job simulations
          </h3>
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            {simulations.map((s, i) => (
              <span key={s.id} className="inline-flex items-baseline gap-x-2">
                <a
                  href={s.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group font-body text-sm text-body hover:text-text transition-colors"
                >
                  {s.name.replace(/ Job Simulation$/, "")}{" "}
                  <span className="group-hover:text-accent-text transition-colors" aria-hidden>↗</span>
                </a>
                {i < simulations.length - 1 && <span className="text-muted" aria-hidden>·</span>}
              </span>
            ))}
            <span className="font-mono text-xs text-muted">
              <span aria-hidden>· </span>Forage · {simYears}
            </span>
          </p>
        </section>
      )}
    </div>
  );
}

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
      <Certifications />
    </HomeSection>
  );
}

export default Stack;
