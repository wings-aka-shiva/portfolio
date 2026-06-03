import { useEffect, useRef, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { liminalPosts, type LiminalPost } from "../data/liminal-posts";

// ─── colour tokens ────────────────────────────────────────────────────────────

const C = {
  bg:    "#09090f",
  text:  "#ddd8d0",
  faint: "#4a4550",
  muted: "#7a7280",
} as const;

// ─── fade-in wrapper ──────────────────────────────────────────────────────────

function FadePage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    const raf = requestAnimationFrame(() => {
      el.style.transition = "opacity 800ms ease";
      el.style.opacity    = "1";
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

// ─── Post title link (landing list) ─────────────────────────────────────────

function PostLink({ post }: { post: LiminalPost }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="py-6 text-center">
      <Link
        to={`/blog/liminal/${post.slug}`}
        className="font-display text-lg inline-flex items-center gap-2 transition-all duration-500"
        style={{
          color:                `${C.text}${hovered ? "e6" : "99"}`,
          textDecoration:       "underline",
          textDecorationColor:  "rgba(255,255,255,0.15)",
          textUnderlineOffset:  "4px",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {post.title}
        <span
          className="text-sm transition-all duration-500"
          style={{ color: hovered ? C.muted : C.faint }}
        >
          →
        </span>
      </Link>
    </div>
  );
}

// ─── Back link ───────────────────────────────────────────────────────────────

function BackLink({ to, label }: { to: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="px-8 pt-24">
      <Link
        to={to}
        className="font-body text-xs tracking-widest"
        style={{
          color:      hovered ? C.muted : C.faint,
          transition: "color 300ms ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {label}
      </Link>
    </div>
  );
}

// ─── Landing (/blog/liminal) ──────────────────────────────────────────────────

function Landing() {
  return (
    <FadePage>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: C.bg,
          background: `radial-gradient(ellipse at 50% 40%, rgba(120,80,60,0.06) 0%, ${C.bg} 65%)`,
        }}
      >
        <BackLink to="/blog" label="← Blog" />

        {/* eyebrow */}
        <div className="pt-16 pb-16 text-center">
          <p
            className="font-body italic text-xs tracking-widest"
            style={{ color: C.faint }}
          >
            unmoored
          </p>
        </div>

        {/* post list */}
        <div className="pb-32">
          {liminalPosts.map((post) => (
            <PostLink key={post.id} post={post} />
          ))}
        </div>
      </div>
    </FadePage>
  );
}

// ─── Post view (/blog/liminal/:slug) ─────────────────────────────────────────

function PostView({ post }: { post: LiminalPost }) {
  return (
    <FadePage>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: C.bg,
          background: `radial-gradient(ellipse at 50% 40%, rgba(120,80,60,0.06) 0%, ${C.bg} 65%)`,
        }}
      >
        <BackLink to="/blog/liminal" label="←" />

        {/* title */}
        <h1
          className="font-display text-xl text-center mt-20 mb-2"
          style={{ color: `${C.text}b3` }}
        >
          {post.title}
        </h1>

        {/* date */}
        <p
          className="font-body text-xs text-center mb-16"
          style={{ color: `${C.faint}80` }}
        >
          {post.date}
        </p>

        {/* poem */}
        <div className="max-w-lg mx-auto px-6 pb-40">
          {post.lines.map((line, i) =>
            line === "" ? (
              <br key={i} />
            ) : (
              <p
                key={i}
                className="font-body text-sm text-center tracking-wide"
                style={{
                  color:      `${C.text}bf`,
                  lineHeight: 2.4,
                }}
              >
                {line}
              </p>
            )
          )}
        </div>
      </div>
    </FadePage>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Liminal() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug) return <Landing />;

  const post = liminalPosts.find((p) => p.slug === slug);
  if (!post) return <Navigate to="/blog/liminal" replace />;

  return <PostView post={post} />;
}
