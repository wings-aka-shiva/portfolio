import { Suspense, useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ResumeRequestTrigger } from "../components/ui/ResumeRequest";
import { container } from "../components/ui/styles";
import { useScrollRestoration } from "../hooks/useScrollRestoration";

const NAV_ITEMS = [
  { label: "experience", to: "/experience", match: "/experience" },
  { label: "projects",   to: "/projects",   match: "/projects"   },
  { label: "blog",       to: "/blog",       match: "/blog"       },
  { label: "about",      to: "/about",      match: "/about"      },
  { label: "contact",    to: "/#contact",   match: null          },
] as const;

const resumeButton =
  "shrink-0 rounded-lg border border-accent px-3 py-1.5 font-mono text-[13px] text-text hover:bg-accent/20 transition-colors duration-200 cursor-pointer";

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-mono text-sm text-muted">Loading...</p>
    </div>
  );
}

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const location  = useLocation();

  useScrollRestoration();

  // Close mobile menu on outside click / tap
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // Close mobile menu when route changes
  useEffect(() => { setMenuOpen(false); }, [location.pathname, location.hash]);

  const isCurrent = (match: string | null) =>
    match !== null && (location.pathname === match || location.pathname.startsWith(`${match}/`));

  const subPath = location.pathname === "/" ? "" : location.pathname.replace(/\/$/, "");

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Fixed rather than sticky so the existing pages keep their own top padding */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-[rgba(9,9,15,0.92)] border-b border-border-soft"
      >
        <div className={`${container} h-16 flex items-center justify-between gap-4`}>
          {/* Logo: ~/shiva, plus the current path on sub-pages */}
          <Link
            to="/"
            aria-label="Shiva Kumar Tirupathi, home"
            className="min-w-0 truncate font-mono text-[15px] font-semibold text-text"
          >
            ~/shiva
            {subPath && <span className="text-muted font-normal">{subPath}</span>}
            <span className="text-cyan-text" aria-hidden>_</span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main" className="hidden md:flex items-center gap-7">
            <ul className="flex items-center gap-6">
              {NAV_ITEMS.map(({ label, to, match }) => {
                const current = isCurrent(match);
                return (
                  <li key={label}>
                    <Link
                      to={to}
                      aria-current={current ? "page" : undefined}
                      className={[
                        "font-mono text-[13px] transition-colors duration-200",
                        current ? "text-text" : "text-muted hover:text-text",
                      ].join(" ")}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ResumeRequestTrigger className={resumeButton}>resume</ResumeRequestTrigger>
          </nav>

          {/* Mobile: resume button + hamburger */}
          <div className="md:hidden flex items-center gap-3 shrink-0">
            <ResumeRequestTrigger className={resumeButton}>resume</ResumeRequestTrigger>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              className="flex flex-col justify-center items-center w-10 h-10 gap-[5px] cursor-pointer shrink-0 rounded-lg"
            >
              <span
                className={[
                  "block w-5 h-[1.5px] bg-text rounded-full",
                  "transition-all duration-300 origin-center",
                  menuOpen ? "rotate-45 translate-y-[6.5px]" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "block w-5 h-[1.5px] bg-text rounded-full",
                  "transition-all duration-300",
                  menuOpen ? "opacity-0 scale-x-0" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "block w-5 h-[1.5px] bg-text rounded-full",
                  "transition-all duration-300 origin-center",
                  menuOpen ? "-rotate-45 -translate-y-[6.5px]" : "",
                ].join(" ")}
              />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <nav
          id="mobile-nav"
          aria-label="Main"
          className={[
            "md:hidden overflow-hidden",
            "transition-[max-height,opacity] duration-300 ease-in-out",
            menuOpen ? "max-h-[360px] opacity-100" : "max-h-0 opacity-0 invisible",
          ].join(" ")}
        >
          <ul className="border-t border-border-soft px-4 py-2">
            {NAV_ITEMS.map(({ label, to, match }) => {
              const current = isCurrent(match);
              return (
                <li key={label} className="border-b border-border-soft last:border-0">
                  <Link
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    aria-current={current ? "page" : undefined}
                    className={[
                      "w-full font-mono text-sm py-4 flex items-center gap-2.5",
                      "transition-colors duration-150",
                      current ? "text-text" : "text-muted hover:text-text",
                    ].join(" ")}
                  >
                    <span className={current ? "text-cyan-text" : "text-transparent"} aria-hidden>
                      &gt;
                    </span>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <main className="min-w-[360px]">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

export default Layout;
