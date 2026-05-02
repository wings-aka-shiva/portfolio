import { useEffect, useState } from "react";

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  fork: boolean;
}

export function useGitHubRepos(username: string, limit = 6) {
  const [repos, setRepos]     = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API responded with ${res.status}`);
        return res.json() as Promise<GitHubRepo[]>;
      })
      .then((data) => {
        const top = data
          .filter((r) => !r.fork)
          .sort((a, b) => {
            // primary: stars descending; secondary: recently updated
            if (b.stargazers_count !== a.stargazers_count)
              return b.stargazers_count - a.stargazers_count;
            return (
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
            );
          })
          .slice(0, limit);
        setRepos(top);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [username, limit]);

  return { repos, loading, error };
}
