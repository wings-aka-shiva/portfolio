import { useEffect, useRef, useState } from "react";
import { useInView } from "../../hooks/useInView";
import { readMinutes, story, STORY_PREVIEW_COUNT, type StoryParagraph } from "../../data/story";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ─── Photo ────────────────────────────────────────────────────────────────────

const PHOTO_URL = `${import.meta.env.BASE_URL}shiva.jpg`;

/**
 * Rendered as a CSS background rather than an <img> so browsers don't offer
 * "Save image", with right-click, drag and iOS long-press blocked on the photo
 * only. This deters casual saving; the file is still reachable via dev tools.
 */
interface PhotoProps {
  className?: string;
  /** Width and height classes */
  sizeClass?: string;
  /** v3 look: 2px accent border, no glow or offset ring */
  plain?: boolean;
}

export function Photo({ className = "", sizeClass = "w-32 h-32 md:w-40 md:h-40", plain = false }: PhotoProps) {
  const [failed, setFailed] = useState(false);
  const size = `${sizeClass} rounded-full`;

  // Background images don't fire onError, so probe the URL with a hidden Image.
  useEffect(() => {
    let active = true;
    const probe = new Image();
    probe.onerror = () => { if (active) setFailed(true); };
    probe.src = PHOTO_URL;
    return () => {
      active = false;
      probe.onerror = null;
    };
  }, []);

  return (
    <div className={`relative shrink-0 ${className}`}>
      {!plain && <div className="absolute inset-0 rounded-full bg-accent/20 blur-2xl pointer-events-none" aria-hidden />}
      {failed ? (
        <div
          className={`relative ${size} bg-surface-2 border border-border flex items-center justify-center`}
          aria-hidden
        >
          <span className="font-display text-2xl font-black text-faint">SKT</span>
        </div>
      ) : (
        <div
          role="img"
          aria-label="Shiva Kumar Tirupathi"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          className={[
            `relative ${size} bg-surface-2 select-none`,
            plain ? "border-2 border-accent" : "ring-2 ring-accent/40 ring-offset-4 ring-offset-bg",
          ].join(" ")}
          style={{
            backgroundImage: `url(${PHOTO_URL})`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            userSelect: "none",
          }}
        />
      )}
    </div>
  );
}

// ─── Paragraph ────────────────────────────────────────────────────────────────

interface ParagraphProps {
  paragraph: StoryParagraph;
  isFirst: boolean;
  isLast: boolean;
}

export function Paragraph({ paragraph, isFirst, isLast }: ParagraphProps) {
  const { ref, inView } = useInView(0.2);

  return (
    <div
      ref={ref}
      className={[
        "relative motion-safe:transition-opacity motion-safe:duration-300",
        isFirst ? "" : isLast ? "mt-8" : "mt-5",
        inView ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      {/* Chapter label: left margin on lg+, small eyebrow above the paragraph below that */}
      {paragraph.chapter && (
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted mb-2 lg:mb-0 lg:absolute lg:-left-32 lg:w-24 lg:text-right lg:top-1.5">
          {paragraph.chapter}
        </p>
      )}

      {isLast ? (
        <p className="font-display text-base md:text-lg font-semibold text-text leading-relaxed">
          {paragraph.text}
        </p>
      ) : (
        <p className="font-body text-sm md:text-base leading-7 text-text/85">
          {isFirst ? (
            <>
              <span className="font-display text-4xl font-black text-accent-text float-left mr-2 leading-none mt-1">
                {paragraph.text.charAt(0)}
              </span>
              {paragraph.text.slice(1)}
            </>
          ) : (
            paragraph.text
          )}
        </p>
      )}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

function AboutMe() {
  const [expanded, setExpanded] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const preview   = story.slice(0, STORY_PREVIEW_COUNT);
  const rest      = story.slice(STORY_PREVIEW_COUNT);
  const lastIndex = story.length - 1;

  const toggle = () => {
    if (expanded) {
      headerRef.current?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    }
    setExpanded((e) => !e);
  };

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative py-20 md:py-28 px-4 overflow-hidden"
    >
      {/* Warm wash behind the reading column */}
      <div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-accent/5 blur-3xl pointer-events-none"
        aria-hidden
      />

      {/* Header row: photo on top on mobile, on the right on md+ */}
      <div
        ref={headerRef}
        className="relative max-w-3xl mx-auto flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-8 scroll-mt-24"
      >
        <div>
          <p className="font-display text-xs uppercase tracking-[0.2em] text-accent mb-3">
            The human part
          </p>
          <h2 id="about-title" className="font-display text-3xl md:text-4xl font-bold text-text">
            About me
          </h2>
          <p className="mt-3">
            <span className="font-display text-lg font-semibold text-text">
              {"Story Time "}
              <span className="text-accent">{"<3"}</span>
            </span>
            <span className="font-mono text-xs text-muted">
              <span className="mx-2" aria-hidden>·</span>
              {readMinutes} min read
            </span>
          </p>
        </div>
        <div className="self-center">
          <Photo />
        </div>
      </div>

      <div className="relative max-w-2xl mx-auto mt-10">
        {/* Preview paragraphs */}
        <div className="relative">
          {preview.map((p, i) => (
            <Paragraph key={i} paragraph={p} isFirst={i === 0} isLast={i === lastIndex} />
          ))}

          {/* Fade-out over the end of the preview while collapsed */}
          <div
            className={[
              "absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-bg pointer-events-none",
              "motion-safe:transition-opacity motion-safe:duration-300",
              expanded ? "opacity-0" : "opacity-100",
            ].join(" ")}
            aria-hidden
          />
        </div>

        {/* Remaining paragraphs stay in the DOM (for scrapers); only the grid row
            collapses. Negative margin on lg keeps the chapter labels inside the clip. */}
        <div
          id="story-rest"
          className={[
            "grid motion-safe:transition-[grid-template-rows] motion-safe:duration-500 motion-safe:ease-out",
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          ].join(" ")}
        >
          <div className="min-h-0 overflow-hidden lg:-ml-32 lg:pl-32">
            {rest.map((p, i) => {
              const index = i + STORY_PREVIEW_COUNT;
              return (
                <Paragraph key={index} paragraph={p} isFirst={false} isLast={index === lastIndex} />
              );
            })}
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={toggle}
            aria-expanded={expanded}
            aria-controls="story-rest"
            className="font-body text-sm text-accent hover:text-text transition-colors duration-200 cursor-pointer px-3 py-2"
          >
            {expanded ? "Show less ↑" : "Read the full story ↓"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default AboutMe;
