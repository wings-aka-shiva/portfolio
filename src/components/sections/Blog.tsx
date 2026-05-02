import { useNavigate } from "react-router-dom";
import { useInView } from "../../hooks/useInView";
import { Section } from "../ui/Section";
import { blogCategories, type BlogCategory } from "../../data/blog-categories";

// Show 4 categories on the homepage (Liminal is a /blog discovery)
const PREVIEW_IDS = ["neetcode", "novels", "food", "ai"];
const previewCategories = blogCategories.filter((c) =>
  PREVIEW_IDS.includes(c.id)
);

interface PreviewCardProps {
  category: BlogCategory;
  index: number;
  inView: boolean;
}

function PreviewCard({ category, index, inView }: PreviewCardProps) {
  const navigate = useNavigate();
  const isLive   = category.live;

  return (
    <div
      onClick={isLive ? () => navigate(`/blog/${category.slug}`) : undefined}
      className={[
        "bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3",
        "transition-all duration-700 ease-out",
        isLive
          ? "cursor-pointer hover:border-accent/40 hover:shadow-glow hover:-translate-y-0.5"
          : "cursor-default",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
      ].join(" ")}
      style={{ transitionDelay: `${index * 80}ms` }}
      role={isLive ? "button" : undefined}
      tabIndex={isLive ? 0 : undefined}
      onKeyDown={
        isLive
          ? (e) => e.key === "Enter" && navigate(`/blog/${category.slug}`)
          : undefined
      }
    >
      {/* Emoji + badge row */}
      <div className="flex items-start justify-between gap-2">
        <span
          className={[
            "text-3xl leading-none select-none",
            isLive ? "" : "opacity-50",
          ].join(" ")}
          role="img"
          aria-label={category.name}
        >
          {category.emoji}
        </span>
        {isLive ? (
          <span className="font-body text-[10px] tracking-wide px-2 py-0.5 rounded-full bg-accent/12 text-accent border border-accent/25 shrink-0">
            Live
          </span>
        ) : (
          <span className="font-body text-[10px] tracking-wide px-2 py-0.5 rounded-full bg-white/5 text-faint border border-white/10 shrink-0">
            Soon
          </span>
        )}
      </div>

      {/* Text */}
      <div>
        <p
          className={[
            "font-display font-semibold text-sm leading-tight mb-1",
            isLive ? "text-text" : "text-text/60",
          ].join(" ")}
        >
          {category.name}
        </p>
        <p
          className={[
            "font-body text-xs leading-relaxed",
            isLive ? "text-muted" : "text-muted/50",
          ].join(" ")}
        >
          {category.caption}
        </p>
      </div>

      {/* Live CTA */}
      {isLive && (
        <p className="font-body text-xs text-accent mt-auto">Explore →</p>
      )}
    </div>
  );
}

function Blog() {
  const { ref, inView } = useInView(0.1);
  const navigate        = useNavigate();

  return (
    <Section id="blog" label="Writing" title="From the blog">
      <div
        ref={ref}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
      >
        {previewCategories.map((cat, index) => (
          <PreviewCard
            key={cat.id}
            category={cat}
            index={index}
            inView={inView}
          />
        ))}
      </div>

      {/* Explore all CTA */}
      <div className="text-center">
        <button
          onClick={() => navigate("/blog")}
          className={[
            "inline-flex items-center gap-2 font-body text-sm text-muted",
            "border border-border rounded-lg px-5 py-2.5",
            "hover:border-accent/40 hover:text-accent transition-all duration-200 cursor-pointer",
          ].join(" ")}
        >
          Explore all categories →
        </button>
      </div>
    </Section>
  );
}

export default Blog;
