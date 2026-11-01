import { useEffect, useLayoutEffect, useRef, useState } from "react";

export const EMAIL = "shivatirupathi10@gmail.com";

const GUTTER = 16;

interface EmailLinkProps {
  /** Optional query string for the mailto, e.g. "subject=Hi&body=..." (already encoded) */
  query?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Plain mailto anchor. Many visitors have no default mail app, where mailto
 * fails silently, so the click also copies the address and shows a short
 * toast under the link. The default mailto navigation is never prevented.
 */
export function EmailLink({ query, className = "", children }: EmailLinkProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const linkRef  = useRef<HTMLAnchorElement>(null);
  const toastRef = useRef<HTMLSpanElement>(null);
  const timer    = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Keep the toast inside the viewport (fixed position escapes overflow clips).
  useLayoutEffect(() => {
    const toast = toastRef.current;
    if (!pos || !toast) return;
    const half = toast.offsetWidth / 2;
    const min  = GUTTER + half;
    const max  = window.innerWidth - GUTTER - half;
    const x    = Math.min(Math.max(pos.x, min), Math.max(min, max));
    if (x !== pos.x) setPos({ ...pos, x });
  }, [pos]);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      const r = linkRef.current?.getBoundingClientRect();
      if (!r) return;
      setPos({ x: r.left + r.width / 2, y: r.bottom + 8 });
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setPos(null), 2000);
    } catch {
      // Clipboard unavailable or denied: no toast, mailto still runs.
    }
  };

  return (
    <>
      <a
        ref={linkRef}
        href={`mailto:${EMAIL}${query ? `?${query}` : ""}`}
        onClick={handleClick}
        className={className}
      >
        {children}
      </a>
      <span
        ref={toastRef}
        role="status"
        aria-live="polite"
        style={pos ? { left: pos.x, top: pos.y } : undefined}
        className={[
          "fixed z-[70] -translate-x-1/2 pointer-events-none",
          "max-w-[calc(100vw-2rem)] rounded-md border border-border bg-surface-2 px-3 py-1.5",
          "font-body text-xs text-text text-center shadow-card",
          "transition-opacity duration-200",
          pos ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        {pos ? `Email copied: ${EMAIL}` : ""}
      </span>
    </>
  );
}
