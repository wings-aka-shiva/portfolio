import { HomeSection } from "../ui/Section";
import { education, educationPeriod } from "../../data/education";

function HomeEducation() {
  return (
    <HomeSection id="education" n="06" label="education" title="Education" size="md">
      <ul className="flex flex-wrap gap-x-14 gap-y-5">
        {education.map((e) => (
          <li key={e.id}>
            <p className="font-body font-semibold text-base text-text">{e.degree}</p>
            <p className="font-body text-sm text-muted mt-0.5">
              {e.short} · {educationPeriod(e)}
            </p>
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}

export default HomeEducation;
