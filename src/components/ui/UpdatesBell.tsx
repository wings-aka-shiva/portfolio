import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SiteUpdate, UpdateType } from "../../data/updates";
import { isUnseen, type SiteUpdatesState } from "../../hooks/useSiteUpdates";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}`;
}

const TAG_STYLE: Record<UpdateType, string> = {
  feature: "text-accent-text border-accent-text/40",
  blog: "text-cyan-text border-cyan-text/40",
  project: "text-[#fde68a] border-[#fde68a]/40",
};

const rowClass =
  "block px-4 py-3 hover:bg-surface-2 transition-colors duration-150";

interface Props extends SiteUpdatesState {
  /** Called when the panel opens, e.g. to close the mobile menu. */
  onOpen?: () => void;
}

export function UpdatesBell({ updates, seen, unseenCount, markAllSeen, onOpen }: Props) {
  const [open, setOpen] = useState(false);
  // Which items were new at the moment the panel was opened.
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const wrapRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const openPanel = () => {
    setNewIds(new Set(updates.filter((u) => isUnseen(u, seen)).map((u) => u.id)));
    markAllSeen();
    onOpen?.();
    setOpen(true);
  };

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) bellRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) close(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const badge = unseenCount > 9 ? "9+" : String(unseenCount);

  return (
    <div ref={wrapRef} className="md:relative shrink-0">
      <button
        ref={bellRef}
        type="button"
        onClick={() => (open ? close() : openPanel())}
        aria-label={unseenCount > 0 ? `Updates, ${unseenCount} new` : "Updates"}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        className="relative flex items-center justify-center w-11 h-11 rounded-lg text-muted hover:text-text transition-colors duration-200 cursor-pointer"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {unseenCount > 0 && (
          <span
            aria-hidden
            className="absolute top-1.5 right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#ef4444] text-white font-mono text-[10px] font-bold leading-4 text-center"
          >
            {badge}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label="Recent updates"
          tabIndex={-1}
          className={[
            "fixed left-4 right-4 top-[68px] z-50",
            "md:absolute md:left-auto md:right-0 md:top-full md:mt-2 md:w-[360px]",
            "bg-surface border border-border rounded-xl shadow-card",
            "max-h-[70vh] overflow-y-auto outline-none",
          ].join(" ")}
        >
          <div className="flex items-center justify-between gap-2 pl-4 pr-1 py-1 border-b border-border-soft">
            <p className="font-mono text-[12px] text-muted">
              <span className="text-cyan-text">$</span> git log --since=2.weeks
            </p>
            <button
              type="button"
              onClick={() => close()}
              aria-label="Close updates"
              className="flex items-center justify-center w-11 h-11 rounded-lg text-muted hover:text-text cursor-pointer"
            >
              <span aria-hidden>✕</span>
            </button>
          </div>

          {updates.length === 0 ? (
            <p className="px-4 py-6 font-body text-[14px] text-muted">
              Nothing new in the last 2 weeks. Check back soon.
            </p>
          ) : (
            <ul>
              {updates.map((u) => (
                <li key={u.id} className="border-b border-border-soft last:border-0">
                  <UpdateRow update={u} isNew={newIds.has(u.id)} onPick={() => close(false)} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function UpdateRow({ update, isNew, onPick }: { update: SiteUpdate; isNew: boolean; onPick: () => void }) {
  const body = (
    <>
      <div className="flex items-center gap-2 mb-1">
        {isNew && <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] shrink-0" aria-label="new" />}
        <span
          className={`font-mono text-[10px] uppercase border rounded px-1.5 leading-4 ${TAG_STYLE[update.type]}`}
        >
          {update.type}
        </span>
        <span className="font-mono text-[11px] text-muted">{formatDate(update.date)}</span>
      </div>
      <p className="font-body text-[14px] text-text leading-snug">{update.title}</p>
    </>
  );

  if (!update.link) return <div className={rowClass}>{body}</div>;
  if (/^https?:\/\//.test(update.link)) {
    return (
      <a href={update.link} target="_blank" rel="noopener noreferrer" onClick={onPick} className={rowClass}>
        {body}
      </a>
    );
  }
  return (
    <Link to={update.link} onClick={onPick} className={rowClass}>
      {body}
    </Link>
  );
}
