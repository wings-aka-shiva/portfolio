import { useState } from "react";
import { PageShell } from "../components/ui/PageShell";
import { ProjectCard } from "../components/sections/Projects";
import { projectsPublicFirst, type Project } from "../data/projects";
import { usePageMeta } from "../hooks/usePageMeta";

type Filter = "All" | Project["category"];

const FILTERS: Filter[] = ["All", "AI", "Cloud", "Full stack", "Backend", "Algorithms", "Data"];

function ProjectsPage() {
  const [filter, setFilter] = useState<Filter>("All");

  usePageMeta(
    "Projects | Shiva Kumar Tirupathi",
    "Projects by Shiva Kumar Tirupathi: AWS deployments, a Claude API CLI, a .NET internet banking site, graph algorithms, a JavaFX booking app and data mining benchmarks."
  );

  const shown = filter === "All" ? projectsPublicFirst : projectsPublicFirst.filter((p) => p.category === filter);

  return (
    <PageShell>
      <h1 className="font-display font-extrabold text-[36px] md:text-[56px] leading-[1.05] tracking-[-0.01em] text-text">
        Things I've built
      </h1>

      <div role="group" aria-label="Filter projects by category" className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f)}
              className={[
                "font-mono text-[13px] rounded-md border px-3 py-1.5 transition-colors duration-200 cursor-pointer",
                active
                  ? "border-accent bg-accent/20 text-text"
                  : "border-border text-muted hover:text-text hover:border-accent-text/60",
              ].join(" ")}
            >
              {f}
            </button>
          );
        })}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {shown.length} {shown.length === 1 ? "project" : "projects"} shown
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {shown.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </PageShell>
  );
}

export default ProjectsPage;
