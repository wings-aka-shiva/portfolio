import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Experience", sectionId: "experience" },
  { label: "Education",  sectionId: "education"  },
  { label: "Coding",     sectionId: "coding"     },
  { label: "Repos",      sectionId: "repos"      },
  { label: "Blog",       sectionId: "blog"       },
  { label: "About",      sectionId: "about"      },
  { label: "Contact",    sectionId: "contact"    },
] as const;

function Layout() {
  const [scrolled,     setScrolled]     = useState(false);
  const [activeId,     setActiveId]     = useState<string>("");
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [heroVisible,  setHeroVisible]  = useState(true);
  const headerRef   = useRef<HTMLElement>(null);
  const navigate    = useNavigate();
  const location    = useLocation();

  // Frost header on scroll; also always frost when menu is open
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Show full name in nav when hero name heading scrolls off screen
  useEffect(() => {
    setHeroVisible(true); // reset on each route change
    const heroName = document.getElementById("hero-name");
    if (!heroName) return;
    const obs = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(heroName);
    return () => obs.disconnect();
  }, [location.pathname]);

  // Highlight whichever section is mid-screen
  useEffect(() => {
    const ids = ["hero", ...NAV_ITEMS.map((n) => n.sectionId)];
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [location.pathname]);

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
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const scrollToSection = (sectionId: string) => {
    const doScroll = () =>
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(doScroll, 150);
    } else {
      doScroll();
    }
  };

  const handleNavClick = (sectionId: string) => {
    setMenuOpen(false);
    scrollToSection(sectionId);
  };

  // Derive active nav item: pathname-based takes priority over scroll observer
  const resolvedActiveId = location.pathname.startsWith("/blog")
    ? "blog"
    : activeId;

  const isFrosted = scrolled || menuOpen;

  return (
    <div className="min-h-screen bg-bg text-text">
      <header
        ref={headerRef}
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isFrosted
            ? "bg-bg/85 backdrop-blur-md border-b border-border"
            : "bg-transparent",
        ].join(" ")}
      >
        {/* ── Top bar ─────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Monogram / full name */}
          {(() => {
            const showFullName = !heroVisible || location.pathname.startsWith("/blog");
            return (
              <button
                onClick={() => handleNavClick("hero")}
                className="relative h-5 overflow-hidden select-none cursor-pointer font-display font-bold text-sm text-text"
              >
                <span
                  className={[
                    "absolute inset-0 flex items-center tracking-[0.2em] transition-all duration-300 ease-in-out",
                    showFullName ? "opacity-0 -translate-y-full" : "opacity-100 translate-y-0",
                  ].join(" ")}
                  aria-hidden={showFullName}
                >
                  SK<span className="text-accent">T.</span>
                </span>
                <span
                  className={[
                    "absolute inset-0 flex items-center whitespace-nowrap tracking-[0.05em] transition-all duration-300 ease-in-out",
                    showFullName ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full",
                  ].join(" ")}
                  aria-hidden={!showFullName}
                >
                  Shiva Kumar <span className="text-accent ml-[0.3em]">Tirupathi</span>
                </span>
                {/* invisible sizer — keeps button width stable */}
                <span className="invisible whitespace-nowrap tracking-[0.05em]">Shiva Kumar Tirupathi</span>
              </button>
            );
          })()}

          {/* Desktop nav — sm and above */}
          <ul className="hidden sm:flex items-center gap-5">
            {NAV_ITEMS.map(({ label, sectionId }) => {
              const isActive = resolvedActiveId === sectionId;
              return (
                <li key={sectionId}>
                  <button
                    onClick={() => handleNavClick(sectionId)}
                    className={[
                      "font-body text-sm transition-colors duration-200 relative cursor-pointer",
                      "after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-accent",
                      "after:transition-all after:duration-200",
                      isActive
                        ? "text-text after:w-full"
                        : "text-muted hover:text-text after:w-0 hover:after:w-full",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Hamburger — below sm only */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="sm:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] cursor-pointer shrink-0"
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

        {/* ── Mobile dropdown ─────────────────────────────────────── */}
        <div
          id="mobile-nav"
          className={[
            "sm:hidden overflow-hidden",
            "transition-[max-height,opacity] duration-300 ease-in-out",
            menuOpen ? "max-h-[360px] opacity-100" : "max-h-0 opacity-0",
          ].join(" ")}
          aria-hidden={!menuOpen}
        >
          <ul className="border-t border-border px-6 py-2">
            {NAV_ITEMS.map(({ label, sectionId }) => {
              const isActive = resolvedActiveId === sectionId;
              return (
                <li key={sectionId} className="border-b border-border/40 last:border-0">
                  <button
                    onClick={() => handleNavClick(sectionId)}
                    className={[
                      "w-full text-left font-body text-sm py-4 flex items-center gap-2.5",
                      "transition-colors duration-150 cursor-pointer",
                      isActive ? "text-text" : "text-muted hover:text-text",
                    ].join(" ")}
                    tabIndex={menuOpen ? 0 : -1}
                  >
                    {/* Active dot */}
                    <span
                      className={[
                        "shrink-0 w-1.5 h-1.5 rounded-full transition-all duration-200",
                        isActive ? "bg-accent scale-100" : "bg-transparent scale-0",
                      ].join(" ")}
                    />
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </header>

      <main className="min-w-[360px]">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
