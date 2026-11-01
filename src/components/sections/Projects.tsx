import { useInView } from "../../hooks/useInView";
import { Section } from "../ui/Section";
import { TechChipList } from "../ui/TechChip";
import { EmailLink } from "../ui/EmailLink";
import { projects, type Project } from "../../data/projects";

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" strokeLinecap="round" />
    </svg>
  );
}

function RepoFooter({ project }: { project: Project }) {
  const { repo } = project;

  if (repo.visibility === "public") {
    return (
      <a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-body text-sm text-accent hover:text-text transition-colors duration-200"
        aria-label={`${project.title} source code`}
      >
        Code ↗
      </a>
    );
  }

  const subject = encodeURIComponent(`Walkthrough: ${project.title}`);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span
        className="inline-flex items-center gap-1.5 bg-surface-2 border border-border rounded px-2 py-0.5 text-xs font-mono text-muted"
        title="This repo is private. Happy to walk you through the code and design."
      >
        <LockIcon />
        Private · {repo.owner}
      </span>
      <EmailLink
        query={`subject=${subject}`}
        className="font-body text-xs text-accent hover:text-text transition-colors duration-200"
      >
        Ask me for a walkthrough →
      </EmailLink>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { ref, inView } = useInView(0.1);

  return (
    <div
      ref={ref}
      className={[
        "transition-all duration-500 ease-out",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      ].join(" ")}
      style={{ transitionDelay: `${index * 75}ms` }}
    >
      <article className="h-full bg-surface border border-border rounded-xl p-6 flex flex-col transition duration-300 hover:border-accent/40 hover:-translate-y-0.5">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-accent">
            {project.category}
          </p>
          <time dateTime={project.year} className="font-mono text-xs text-muted">
            {project.year}
          </time>
        </div>

        <h3 className="font-display text-lg font-semibold text-text leading-snug mt-3">
          {project.title}
        </h3>
        <p className="font-body text-sm text-muted mt-0.5">{project.context}</p>

        <p className="font-body text-sm text-text/80 leading-relaxed mt-4">{project.summary}</p>

        <ul className="mt-4 space-y-2.5">
          {project.highlights.map((point, i) => (
            <li key={i} className="flex gap-3 font-body text-sm text-text/80 leading-relaxed">
              <span className="mt-[0.55em] shrink-0 w-1.5 h-1.5 bg-accent" aria-hidden />
              {point}
            </li>
          ))}
        </ul>

        <TechChipList items={project.stack} className="mt-5 mb-6" />

        <div className="mt-auto pt-4 border-t border-border">
          <RepoFooter project={project} />
        </div>
      </article>
    </div>
  );
}

function Projects() {
  return (
    <Section id="projects" label="Things I've built" title="Projects">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </Section>
  );
}

export default Projects;
