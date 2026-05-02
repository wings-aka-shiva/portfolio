import { useEffect, useState } from "react";
import { useInView } from "../../hooks/useInView";
import { useGitHubRepos, type GitHubRepo } from "../../hooks/useGitHubRepos";
import { Section } from "../ui/Section";
import { getLanguageColor } from "../../utils/language-colors";
import { relativeTime } from "../../utils/relative-time";

// ─── Star icon ───────────────────────────────────────────────────────────────

function StarIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
    >
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
    </svg>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="h-4 bg-surface-2 rounded w-2/3" />
        <div className="h-3 w-3 bg-surface-2 rounded" />
      </div>
      <div className="space-y-1.5 mb-5">
        <div className="h-3 bg-surface-2 rounded w-full" />
        <div className="h-3 bg-surface-2 rounded w-4/5" />
      </div>
      <div className="border-t border-border pt-3 flex gap-4">
        <div className="h-3 bg-surface-2 rounded w-20" />
        <div className="h-3 bg-surface-2 rounded w-10" />
        <div className="h-3 bg-surface-2 rounded w-16 ml-auto" />
      </div>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState() {
  return (
    <div className="col-span-full flex flex-col items-center gap-3 py-16 text-center">
      <p className="font-body text-sm text-muted">
        Couldn't load repositories right now.
      </p>
      <a
        href="https://github.com/wings-aka-shiva"
        target="_blank"
        rel="noreferrer"
        className="font-body text-xs text-accent hover:underline underline-offset-2"
      >
        View GitHub profile →
      </a>
    </div>
  );
}

// ─── Repo card ────────────────────────────────────────────────────────────────

interface RepoCardProps {
  repo: GitHubRepo;
  index: number;
  visible: boolean;
}

function RepoCard({ repo, index, visible }: RepoCardProps) {
  const langColor = getLanguageColor(repo.language);

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      aria-label={repo.name}
      className={[
        "group block bg-surface border border-border rounded-2xl p-5",
        "transition-all duration-700 ease-out",
        "hover:border-accent/35 hover:shadow-glow",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
      ].join(" ")}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Name row */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <h3 className="font-display font-semibold text-sm text-text leading-tight truncate">
          {repo.name}
        </h3>
        {/* Arrow — only visible on hover */}
        <svg
          className="shrink-0 w-3.5 h-3.5 text-faint group-hover:text-accent transition-colors duration-200 mt-0.5"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden
        >
          <path d="M3 13L13 3M13 3H6M13 3v7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Description */}
      <p
        className={[
          "font-body text-xs leading-relaxed mb-4",
          repo.description ? "text-muted line-clamp-2" : "text-faint italic",
        ].join(" ")}
      >
        {repo.description ?? "No description"}
      </p>

      {/* Metadata row */}
      <div className="border-t border-border pt-3 flex items-center gap-3 flex-wrap text-xs font-body text-muted">
        {/* Language */}
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: langColor }}
              aria-label={repo.language}
            />
            {repo.language}
          </span>
        )}

        {/* Stars */}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1 text-muted">
            <StarIcon />
            {repo.stargazers_count}
          </span>
        )}

        {/* Updated */}
        <span className="ml-auto text-faint">
          {relativeTime(repo.updated_at)}
        </span>
      </div>
    </a>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

function GitHubRepos() {
  const { repos, loading, error } = useGitHubRepos("wings-aka-shiva");
  const { ref, inView }           = useInView(0.1);

  // Trigger animation after cards mount, regardless of load vs scroll order
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (inView && repos.length > 0) {
      const t = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    }
  }, [inView, repos.length]);

  return (
    <Section id="repos" label="Open Source" title="GitHub repositories">
      <div
        ref={ref}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}

        {error && <ErrorState />}

        {!loading && !error && repos.map((repo, index) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            index={index}
            visible={visible}
          />
        ))}
      </div>

      {/* Link to full profile */}
      {!loading && !error && (
        <div className="mt-8 text-center">
          <a
            href="https://github.com/wings-aka-shiva"
            target="_blank"
            rel="noreferrer"
            className="font-body text-xs text-muted hover:text-accent transition-colors duration-200 underline-offset-2 hover:underline"
          >
            View all repositories on GitHub →
          </a>
        </div>
      )}
    </Section>
  );
}

export default GitHubRepos;
