import { Link } from "react-router-dom";
import { HomeSection } from "../ui/Section";
import { projectsPublicFirst, type Project } from "../../data/projects";

const SHOWN = 3;

/** First sentence of a summary */
const firstSentence = (text: string) => text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text;

function RowContent({ project }: { project: Project }) {
  const isPublic = project.repo.visibility === "public";
  return (
    <>
      <span className="flex flex-col gap-1 min-w-0 flex-1 sm:contents">
        <span className="font-display font-bold text-[17px] sm:text-lg text-text sm:flex-[1_1_240px]">
          {project.title}
        </span>
        <span className="font-mono text-xs text-accent-text sm:w-[120px] sm:order-3">
          {project.category} · {project.stack[0]}
        </span>
      </span>
      <span className="hidden sm:block font-body text-sm text-muted sm:flex-[2_1_320px] sm:order-2">
        {firstSentence(project.summary)}
      </span>
      <span
        className={[
          "shrink-0 ml-auto text-right font-mono text-[13px] sm:order-4",
          isPublic ? "text-cyan-text" : "text-muted",
        ].join(" ")}
      >
        {isPublic ? "code ↗" : "private"}
      </span>
    </>
  );
}

const rowClass =
  "flex flex-nowrap sm:flex-wrap items-center sm:items-baseline gap-x-7 gap-y-3 py-4 sm:py-[22px] border-b border-border hover:bg-surface/60 transition-colors duration-200";

function HomeProjects() {
  return (
    <HomeSection
      id="projects"
      n="03"
      label="projects"
      title="Things I've built"
      more={{ to: "/projects", label: `all ${projectsPublicFirst.length} projects →` }}
    >
      <ul className="border-t border-border">
        {projectsPublicFirst.slice(0, SHOWN).map((project) => (
          <li key={project.id}>
            {/* A public row opens the repo; a private row opens its card on /projects */}
            {project.repo.visibility === "public" ? (
              <a href={project.repo.url} target="_blank" rel="noopener noreferrer" className={rowClass}>
                <RowContent project={project} />
              </a>
            ) : (
              <Link to={`/projects#${project.id}`} className={rowClass}>
                <RowContent project={project} />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}

export default HomeProjects;
