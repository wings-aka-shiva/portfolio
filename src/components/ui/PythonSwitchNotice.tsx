import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const STORAGE_KEY = "neetcodePythonNotice";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Fallback for when sessionStorage throws: show at most once per page load.
let shownThisPageLoad = false;

function shouldShow(): boolean {
  if (shownThisPageLoad) return false;
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === null;
  } catch {
    return true;
  }
}

function markShown() {
  shownThisPageLoad = true;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // storage unavailable - the module flag covers this page load
  }
}

/** One-time-per-session notice about moving NeetCode solutions from Java to Python. */
export default function PythonSwitchNotice() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const titleId = `${uid}-title`;

  useEffect(() => {
    if (shouldShow()) {
      markShown();
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const returnTo = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (!panel.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      if (returnTo && document.contains(returnTo)) returnTo.focus();
    };
  }, [open]);

  if (!open) return null;
  const close = () => setOpen(false);

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={close} aria-hidden />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative bg-surface border border-border rounded-2xl p-6 max-w-md w-full my-auto"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-display text-xl font-semibold text-text">
            Switching to Python
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="shrink-0 -mr-2 -mt-1 w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-text hover:bg-surface-2 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <p className="font-body text-sm text-text/80 leading-relaxed">
            I'm moving all my NeetCode solutions from Java to Python. The write-ups already
            published are in Java for now. Every new one will be in Python, and I'll bring the
            older ones across as I go.
          </p>
          <p className="font-body text-sm text-text/80 leading-relaxed">
            Each topic's first question is now open, so I'm working through all of them side by
            side.
          </p>
        </div>

        <button
          type="button"
          data-autofocus
          autoFocus
          onClick={close}
          className="mt-6 w-full inline-flex justify-center rounded-lg px-6 py-3 font-body font-medium text-sm text-white bg-accent hover:bg-accent-dark transition-colors cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>,
    document.body,
  );
}
