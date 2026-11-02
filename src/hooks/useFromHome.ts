import { useLocation } from "react-router-dom";

export interface BlogNavState {
  /** Set when the visitor entered the blog from the homepage panel */
  fromHome?: boolean;
}

/**
 * Router state to pass along when navigating inside a blog section, so its
 * back link keeps returning to the homepage. Undefined when not from home.
 */
export function useFromHomeState(): BlogNavState | undefined {
  const state = useLocation().state as BlogNavState | null;
  return state?.fromHome ? { fromHome: true } : undefined;
}
