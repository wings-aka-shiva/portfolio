import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { novels, getCover, type Novel } from "../data/novels";

// ─── Derived data ────────────────────────────────────────────────────────────

const currentlyReading = novels.filter((n) => n.status === "reading");
const waitlist         = novels.filter((n) => n.status === "waitlist");
const readNovels       = novels.filter((n) => n.status === "read");

const readByAuthor = readNovels.reduce<Record<string, Novel[]>>((acc, n) => {
  (acc[n.author] ??= []).push(n);
  return acc;
}, {});
const authorsSorted = Object.keys(readByAuthor).sort();

// ─── Library colour tokens ───────────────────────────────────────────────────

const L = {
  bg:               "#0d0a07",
  text:             "#f5ede0",
  muted:            "#a08060",
  faint:            "#6b4f35",
  wood:             "#1c1409",
  brass:            "#c8922a",
  brassDim:         "#8a7a6a",
  plateBg:          "#2a1e10",
  plateBorderHi:    "#6b4a20",
  plateBorderLo:    "#4a3520",
} as const;

// ─── Brass label ─────────────────────────────────────────────────────────────

function BrassLabel({
  children,
  textColor  = L.brass,
  borderColor = L.plateBorderHi,
}: {
  children:    React.ReactNode;
  textColor?:  string;
  borderColor?: string;
}) {
  return (
    <span
      className="font-display text-xs tracking-widest uppercase px-3 py-1 rounded"
      style={{ backgroundColor: L.plateBg, border: `1px solid ${borderColor}`, color: textColor }}
    >
      {children}
    </span>
  );
}

// ─── Drag-scroll hook ────────────────────────────────────────────────────────

function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const s = useRef({
    isDragging: false,
    didDrag:    false,
    startX:     0,
    scrollLeft: 0,
    lastX:      0,
    velocity:   0,
    rafId:      0,
  });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const st = s.current;
    st.isDragging = true;
    st.didDrag    = false;
    st.startX     = e.pageX - (ref.current?.offsetLeft ?? 0);
    st.scrollLeft = ref.current?.scrollLeft ?? 0;
    st.lastX      = e.pageX;
    st.velocity   = 0;
    if (ref.current) ref.current.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const st = s.current;
    if (!st.isDragging || !ref.current) return;
    const x    = e.pageX - (ref.current.offsetLeft ?? 0);
    const walk = x - st.startX;
    if (Math.abs(walk) > 4) st.didDrag = true;
    st.velocity            = e.pageX - st.lastX;
    st.lastX               = e.pageX;
    ref.current.scrollLeft = st.scrollLeft - walk;
  }, []);

  const stopDrag = useCallback(() => {
    const st = s.current;
    if (!st.isDragging) return;
    st.isDragging = false;
    if (ref.current) ref.current.style.cursor = "grab";

    const momentum = () => {
      if (!ref.current || Math.abs(st.velocity) < 0.5) return;
      ref.current.scrollLeft -= st.velocity;
      st.velocity            *= 0.92;
      st.rafId = requestAnimationFrame(momentum);
    };
    cancelAnimationFrame(st.rafId);
    st.rafId = requestAnimationFrame(momentum);
  }, []);

  const didDrag = useCallback(() => s.current.didDrag, []);

  return { ref, didDrag, onMouseDown, onMouseMove, onMouseUp: stopDrag, onMouseLeave: stopDrag };
}

// ─── BookCard ────────────────────────────────────────────────────────────────

interface BookCardProps {
  novel:        Novel;
  showAuthor:   boolean;
  large:        boolean;
  hoveredIdx:   number | null;
  cardIdx:      number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick:      () => void;
}

function BookCard({
  novel, showAuthor, large,
  hoveredIdx, cardIdx,
  onMouseEnter, onMouseLeave, onClick,
}: BookCardProps) {
  const cover       = getCover(novel.cover);
  const isHovered   = hoveredIdx === cardIdx;
  const isNeighbour =
    hoveredIdx !== null &&
    (cardIdx === hoveredIdx - 1 || cardIdx === hoveredIdx + 1);
  const isDimmed = hoveredIdx !== null && !isHovered && !isNeighbour;

  const coverStyle: React.CSSProperties = {
    transition: "transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1), filter 250ms ease",
    transform: isHovered
      ? "scale(1.08) translateY(-10px)"
      : isNeighbour
      ? "scale(1.03) translateY(-4px)"
      : "scale(1) translateY(0)",
    filter: isHovered
      ? "drop-shadow(0 8px 14px rgba(0,0,0,0.85)) drop-shadow(0 0 18px rgba(180,120,30,0.55))"
      : "drop-shadow(0 6px 10px rgba(0,0,0,0.7))",
  };

  const widthClass = large ? "w-[140px] md:w-[170px]" : "w-[110px] md:w-[140px]";

  return (
    <div
      className={`flex-shrink-0 ${widthClass} cursor-pointer select-none`}
      style={{ opacity: isDimmed ? 0.65 : 1, transition: "opacity 200ms ease" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div
        className="w-full rounded-xl overflow-hidden"
        style={{
          aspectRatio:     "2/3",
          backgroundColor: L.wood,
          border:          "1px solid #2a1a08",
          ...coverStyle,
        }}
      >
        {cover ? (
          <img
            src={cover}
            alt={novel.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl" style={{ opacity: 0.25 }}>📖</span>
          </div>
        )}
      </div>

      <p
        className="font-display text-xs font-semibold mt-2 leading-tight line-clamp-2"
        style={{ color: L.text }}
      >
        {novel.title}
      </p>

      {showAuthor && (
        <p
          className="font-body text-[10px] mt-0.5 line-clamp-2 leading-tight"
          style={{ color: L.muted }}
        >
          {novel.author}
        </p>
      )}
    </div>
  );
}

// ─── AuthorBlock (Read section — single scrollable shelf plank) ──────────────

interface AuthorBlockProps {
  author:      string;
  books:       Novel[];
  onCardClick: () => void;
}

function AuthorBlock({ author, books, onCardClick }: AuthorBlockProps) {
  return (
    <div className="mb-2">
      <div className="text-center mb-3 px-6">
        <BrassLabel borderColor={L.plateBorderLo}>{author}</BrassLabel>
      </div>
      <div className="wood-shelf relative">
        <ShelfRow
          books={books}
          showAuthor={false}
          onCardClick={onCardClick}
        />
        <div className="wood-shelf-edge" />
      </div>
    </div>
  );
}

// ─── ShelfRow ────────────────────────────────────────────────────────────────

interface ShelfRowProps {
  books:       Novel[];
  showAuthor:  boolean;
  large?:      boolean;
  onCardClick: () => void;
}

function ShelfRow({ books, showAuthor, large = false, onCardClick }: ShelfRowProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [rowHovered, setRowHovered] = useState(false);
  const drag = useDragScroll<HTMLDivElement>();

  const handleCardClick = (idx: number) => {
    void idx;
    if (drag.didDrag()) return;
    onCardClick();
  };

  const scrollBy = (dir: "left" | "right") => {
    drag.ref.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  const chevronBase =
    "hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 items-center justify-center " +
    "w-9 h-14 transition-all duration-200 text-xl font-bold select-none";

  return (
    <div
      className="relative"
      onMouseEnter={() => setRowHovered(true)}
      onMouseLeave={() => { setRowHovered(false); setHoveredIdx(null); }}
    >
      {/* Left chevron */}
      <button
        onClick={() => scrollBy("left")}
        className={`${chevronBase} left-0 ${rowHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{
          background: `linear-gradient(to right, ${L.wood} 60%, transparent)`,
          color: L.muted,
        }}
        aria-label="Scroll left"
      >
        ‹
      </button>

      {/* Scrollable shelf */}
      <div
        ref={drag.ref}
        className="overflow-x-auto no-scrollbar cursor-grab flex justify-center py-6 px-6"
        onMouseDown={drag.onMouseDown}
        onMouseMove={drag.onMouseMove}
        onMouseUp={drag.onMouseUp}
        onMouseLeave={(e) => { drag.onMouseLeave(e); setHoveredIdx(null); }}
      >
        <div className="inline-flex gap-4">
          {books.map((book, i) => (
            <BookCard
              key={book.id}
              novel={book}
              showAuthor={showAuthor}
              large={large}
              hoveredIdx={hoveredIdx}
              cardIdx={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => handleCardClick(i)}
            />
          ))}
        </div>
      </div>

      {/* Right chevron */}
      <button
        onClick={() => scrollBy("right")}
        className={`${chevronBase} right-0 ${rowHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{
          background: `linear-gradient(to left, ${L.wood} 60%, transparent)`,
          color: L.muted,
        }}
        aria-label="Scroll right"
      >
        ›
      </button>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Novels() {
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleCardClick = useCallback(() => {
    clearTimeout(toastTimer.current);
    setToast(true);
    toastTimer.current = setTimeout(() => setToast(false), 2000);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: L.bg }}>

      {/* Back link */}
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 font-body text-xs transition-colors duration-200
                     text-[#a08060] hover:text-[#c8922a]"
        >
          ← Back to Blog
        </Link>
      </div>

      {/* Header */}
      <div
        className="max-w-6xl mx-auto px-6 mb-12 text-center"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(180,100,20,0.12) 0%, transparent 70%)",
        }}
      >
        <h1
          className="font-display font-bold text-4xl md:text-5xl mb-3"
          style={{ color: L.text }}
        >
          Novels
        </h1>
        <p className="font-body text-sm italic" style={{ color: L.muted }}>
          I forgot a lot of them — but here are a few I remember.
        </p>
      </div>

      {/* Currently Reading */}
      <section className="mb-4">
        <div className="max-w-6xl mx-auto px-6 mb-3 text-center">
          <BrassLabel>Currently Reading</BrassLabel>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="wood-shelf relative">
            {/* Warm spotlight behind books */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 50% 85%, rgba(180,120,30,0.18) 0%, transparent 60%)",
              }}
            />
            <ShelfRow
              books={currentlyReading}
              showAuthor
              large

              onCardClick={handleCardClick}
            />
            <div className="wood-shelf-edge" />
          </div>
        </div>
      </section>

      {/* Up Next */}
      <section className="mb-6">
        <div className="max-w-6xl mx-auto px-6 mb-3 text-center">
          <BrassLabel textColor={L.brassDim} borderColor={L.plateBorderLo}>
            Up Next
          </BrassLabel>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="wood-shelf relative">
            <ShelfRow
              books={waitlist}
              showAuthor

              onCardClick={handleCardClick}
            />
            <div className="wood-shelf-edge" />
          </div>
        </div>
      </section>

      {/* Read */}
      <section>
        <div className="max-w-6xl mx-auto px-6 mb-6 text-center">
          <span
            className="font-body text-xs font-semibold uppercase tracking-widest"
            style={{ color: L.muted }}
          >
            Read
          </span>
          <p className="font-body text-xs mt-1" style={{ color: L.faint }}>
            — by author
          </p>
        </div>

        <div
          className="max-w-6xl mx-auto [&>div:last-child]:mb-0"
          style={{
            border:       "12px solid #2a1c0a",
            borderBottom: "none",
            borderRadius: "8px 8px 0 0",
            background:   "linear-gradient(180deg, #2a1c0a 0%, transparent 40px)",
            boxShadow:    "inset 4px 0 12px rgba(0,0,0,0.5), inset -4px 0 12px rgba(0,0,0,0.5), inset 0 4px 16px rgba(0,0,0,0.6), 4px 0 8px rgba(0,0,0,0.4), -4px 0 8px rgba(0,0,0,0.4)",
          }}
        >
          {authorsSorted.map((author) => (
            <AuthorBlock
              key={author}
              author={author}
              books={readByAuthor[author]}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      </section>

      {/* Toast */}
      <div
        aria-live="polite"
        className={[
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
          "rounded-xl px-5 py-2.5 font-body text-sm whitespace-nowrap",
          "transition-all duration-300",
          toast
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none",
        ].join(" ")}
        style={{
          backgroundColor: L.plateBg,
          border:          `1px solid ${L.plateBorderLo}`,
          color:           L.muted,
          boxShadow:       "0 4px 24px rgba(0,0,0,0.6)",
        }}
      >
        Post coming soon — check back later ☕
      </div>
    </div>
  );
}
