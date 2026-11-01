import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Lazy pages render a short fallback first, so keep retrying for a while
// until the target position or element exists.
const MAX_WAIT_MS = 2000;

function retryUntil(attempt: () => boolean) {
  const started = performance.now();
  let frame = 0;
  const tick = () => {
    if (attempt() || performance.now() - started > MAX_WAIT_MS) return;
    frame = requestAnimationFrame(tick);
  };
  tick();
  return () => cancelAnimationFrame(frame);
}

/** "/blog/neetcode/two-sum" -> "/blog/neetcode", "/guitar/metronome" -> "/guitar" */
function scopeOf(pathname: string) {
  return pathname.split("/").slice(0, pathname.startsWith("/blog/") ? 3 : 2).join("/");
}

/**
 * Scroll handling for BrowserRouter, which has no built-in restoration:
 * back/forward returns to the saved position, a hash scrolls to its element,
 * and any other navigation starts at the top. Navigation inside one section
 * (e.g. between NeetCode problems) is left alone; those pages scroll themselves.
 */
export function useScrollRestoration() {
  const location = useLocation();
  const navType = useNavigationType();
  const positions = useRef(new Map<string, number>());
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  // Remember the latest position for the current history entry
  useEffect(() => {
    const key = location.key;
    const save = () => positions.current.set(key, window.scrollY);
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, [location.key]);

  useLayoutEffect(() => {
    const saved = positions.current.get(location.key);
    const sameScope = scopeOf(prevPath.current) === scopeOf(location.pathname);
    prevPath.current = location.pathname;

    if (navType === "POP" && saved !== undefined) {
      return retryUntil(() => {
        window.scrollTo({ top: saved, behavior: "instant" });
        return Math.abs(window.scrollY - saved) < 2;
      });
    }

    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      return retryUntil(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ block: "start" });
        return !!el;
      });
    }

    if (!sameScope) window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.key, location.pathname, location.hash, navType]);
}
