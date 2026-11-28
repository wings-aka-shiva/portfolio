import { useCallback, useMemo, useState } from "react";
import { getRecentUpdates, type SiteUpdate } from "../data/updates";

const SEEN_KEY = "updatesSeenThrough";
// Ids already seen on the updatesSeenThrough date, so an update added later
// on that same day still counts as new.
const SEEN_IDS_KEY = "updatesSeenIds";

interface SeenState {
  through: string | null;
  ids: string[];
}

function readSeen(): SeenState {
  try {
    const through = localStorage.getItem(SEEN_KEY);
    let ids: string[] = [];
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(SEEN_IDS_KEY) ?? "[]");
      if (Array.isArray(parsed)) ids = parsed.filter((x): x is string => typeof x === "string");
    } catch {
      ids = [];
    }
    return { through, ids };
  } catch {
    return { through: null, ids: [] };
  }
}

function writeSeen(state: SeenState) {
  try {
    if (state.through) localStorage.setItem(SEEN_KEY, state.through);
    localStorage.setItem(SEEN_IDS_KEY, JSON.stringify(state.ids));
  } catch {
    // Storage unavailable: everything just stays unseen.
  }
}

export function isUnseen(u: SiteUpdate, seen: SeenState): boolean {
  if (!seen.through) return true;
  if (u.date > seen.through) return true;
  return u.date === seen.through && !seen.ids.includes(u.id);
}

export function useSiteUpdates() {
  const updates = useMemo(() => getRecentUpdates(14), []);
  const [seen, setSeen] = useState<SeenState>(readSeen);

  const unseenCount = updates.filter((u) => isUnseen(u, seen)).length;

  const markAllSeen = useCallback(() => {
    if (updates.length === 0) return;
    const through = updates[0].date;
    const next: SeenState = {
      through,
      ids: updates.filter((u) => u.date === through).map((u) => u.id),
    };
    writeSeen(next);
    setSeen(next);
  }, [updates]);

  return { updates, seen, unseenCount, markAllSeen };
}

export type SiteUpdatesState = ReturnType<typeof useSiteUpdates>;
