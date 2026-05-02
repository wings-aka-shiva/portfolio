import { Link } from "react-router-dom";
import { blogCategories, type BlogCategory } from "../data/blog-categories";

// ─── NeetCode hero tile (full-width, live) ────────────────────────────────────

function HeroTile({ category }: { category: BlogCategory }) {
  return (
    <Link to="/blog/neetcode" className="block group">
      <div
        className={[
          "bg-surface border border-border rounded-2xl p-8",
          "flex flex-col md:flex-row md:items-center gap-6 md:gap-10",
          "transition-all duration-300",
          "group-hover:border-accent/40 group-hover:shadow-glow group-hover:-translate-y-0.5",
        ].join(" ")}
      >
        {/* Emoji */}
        <span
          className="text-6xl leading-none shrink-0 select-none"
          role="img"
          aria-label={category.name}
        >
          {category.emoji}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <h2 className="font-display font-bold text-xl text-text">
              {category.name}
            </h2>
            <span className="font-body text-[11px] tracking-wide px-2.5 py-0.5 rounded-full bg-accent/12 text-accent border border-accent/25">
              Live
            </span>
          </div>
          <p className="font-body text-sm text-muted leading-relaxed mb-4">
            {category.caption}
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="font-body text-xs text-faint">
              {category.postCount} solved so far
            </span>
            <span className="font-body text-sm text-accent group-hover:underline underline-offset-2 transition-all duration-200">
              Explore the map →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Novels secondary hero tile ───────────────────────────────────────────────

function NovelsHeroTile({ category }: { category: BlogCategory }) {
  return (
    <Link to="/blog/novels" className="block group">
      <div
        className={[
          "border border-border rounded-2xl p-8",
          "flex flex-col md:flex-row md:items-center gap-6 md:gap-10",
          "transition-all duration-300",
          "group-hover:border-accent/40 group-hover:shadow-glow group-hover:-translate-y-0.5",
        ].join(" ")}
        style={{
          background:
            "radial-gradient(ellipse at 0% 50%, rgba(180,120,30,0.08) 0%, #111118 60%)",
        }}
      >
        {/* Emoji */}
        <span
          className="text-6xl leading-none shrink-0 select-none"
          role="img"
          aria-label={category.name}
        >
          {category.emoji}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <h2 className="font-display font-bold text-xl text-text">
              {category.name}
            </h2>
            <span className="font-body text-[11px] tracking-wide px-2.5 py-0.5 rounded-full bg-accent/12 text-accent border border-accent/25">
              Live
            </span>
          </div>
          <p className="font-body text-sm text-muted leading-relaxed mb-4">
            {category.caption}
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="font-body text-xs text-faint">
              {category.postCount} books tracked
            </span>
            <span className="font-body text-sm text-accent group-hover:underline underline-offset-2 transition-all duration-200">
              Explore the shelves →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Regular coming-soon tile ─────────────────────────────────────────────────

function RegularTile({ category }: { category: BlogCategory }) {
  const isLiminal = category.style === "liminal";

  const inner = (
    <div
      className={[
        "rounded-2xl p-8 flex flex-col gap-4 h-full",
        category.live
          ? "transition-all duration-300 group-hover:border-accent/40 group-hover:shadow-glow group-hover:-translate-y-0.5"
          : "cursor-default select-none",
        isLiminal ? "border" : "bg-surface border border-border",
      ].join(" ")}
      style={
        isLiminal
          ? {
              background:
                "radial-gradient(ellipse at 55% -20%, rgba(79,70,229,0.13) 0%, rgba(99,102,241,0.04) 45%, #09090f 72%)",
              borderColor: "rgba(255,255,255,0.045)",
            }
          : {}
      }
    >
      {/* Emoji */}
      <span
        className={[
          "text-5xl leading-none",
          isLiminal ? "opacity-75" : "opacity-50",
        ].join(" ")}
        role="img"
        aria-label={category.name}
      >
        {category.emoji}
      </span>

      {/* Text */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <h2
            className={[
              "font-display font-semibold text-base leading-tight",
              isLiminal ? "text-text/65" : "text-text/60",
            ].join(" ")}
          >
            {category.name}
          </h2>
          <span
            className={[
              "font-body text-[10px] tracking-wide px-2 py-0.5 rounded-full border",
              category.live
                ? "bg-accent/12 text-accent border-accent/25"
                : "bg-white/5 text-faint border-white/10",
            ].join(" ")}
          >
            {category.live ? "Live" : "Soon"}
          </span>
        </div>
        <p
          className={[
            "font-body text-sm leading-relaxed",
            isLiminal ? "text-muted/55 italic" : "text-muted/60",
          ].join(" ")}
        >
          {category.caption}
        </p>
      </div>
    </div>
  );

  if (category.live) {
    return (
      <Link to={`/blog/${category.slug}`} className="block group h-full">
        {inner}
      </Link>
    );
  }

  return inner;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function BlogLanding() {
  const [hero, ...rest] = blogCategories; // NeetCode is always first

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <div className="mb-12">
          <p className="font-body text-xs text-accent tracking-[0.3em] uppercase mb-3">
            Writing
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-text mb-3">
            The Blog
          </h1>
          <p className="font-body text-sm text-muted">
            Ideas, journeys, and things that make me think.
          </p>
        </div>

        {/* Mum quote */}
        <blockquote className="border-l-2 border-accent/50 pl-5 mb-12">
          <p className="font-display italic text-lg text-muted leading-relaxed">
            "Mum says I never save money.
            <br />
            I say it's hard when you love too many things."
          </p>
        </blockquote>

        {/* Category grid */}
        {(() => {
          const novels  = rest.find((c) => c.id === "novels")!;
          const others  = rest.filter((c) => c.id !== "novels");
          return (
            <div className="flex flex-col gap-4">
              {/* NeetCode — full-width hero */}
              <HeroTile category={hero} />

              {/* Novels — secondary hero */}
              <NovelsHeroTile category={novels} />

              {/* Remaining 4 — 2×2 grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {others.map((cat) => (
                  <RegularTile key={cat.id} category={cat} />
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

export default BlogLanding;
