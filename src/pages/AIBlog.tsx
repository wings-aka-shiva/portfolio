import { Link, useNavigate, useParams } from "react-router-dom";
import { aiPosts, type AIPost } from "../data/ai-posts";
import { Badge } from "../components/ui/Badge";
import KofiPanel from "../components/ui/KofiPanel";

// ── Content parser ────────────────────────────────────────────────────────────

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "code"; lang: string; text: string }
  | { type: "list"; items: string[] }
  | { type: "paragraph"; text: string };

function parseContent(raw: string): Block[] {
  const blocks: Block[] = [];
  const lines = raw.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();

    if (!t) { i++; continue; }

    // Code block
    if (t.startsWith("```")) {
      const lang = t.slice(3).trim();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      blocks.push({ type: "code", lang, text: code.join("\n") });
      continue;
    }

    if (t.startsWith("## ")) { blocks.push({ type: "h2", text: t.slice(3) }); i++; continue; }
    if (t.startsWith("### ")) { blocks.push({ type: "h3", text: t.slice(4) }); i++; continue; }

    // Blockquote
    if (t.startsWith("> ")) {
      let text = t.slice(2);
      i++;
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        text += " " + lines[i].trim().slice(2);
        i++;
      }
      blocks.push({ type: "blockquote", text });
      continue;
    }

    // Numbered list
    if (/^\d+\. /.test(t)) {
      const items: string[] = [];
      let cur = t.replace(/^\d+\. /, "");
      i++;
      while (i < lines.length) {
        const nt = lines[i].trim();
        if (!nt) break;
        if (/^\d+\. /.test(nt)) { items.push(cur); cur = nt.replace(/^\d+\. /, ""); i++; }
        else { cur += " " + nt; i++; }
      }
      items.push(cur);
      blocks.push({ type: "list", items });
      continue;
    }

    // Paragraph — collect until blank line or a block-starting line
    let text = t;
    i++;
    while (i < lines.length) {
      const nt = lines[i].trim();
      if (!nt) break;
      if (
        nt.startsWith("## ") || nt.startsWith("### ") ||
        nt.startsWith("> ") || nt.startsWith("```") ||
        /^\d+\. /.test(nt)
      ) break;
      text += " " + nt;
      i++;
    }
    blocks.push({ type: "paragraph", text });
  }

  return blocks;
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return text;
  return parts.map((p, idx) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={idx} className="font-semibold text-text">{p.slice(2, -2)}</strong>
      : <span key={idx}>{p}</span>
  );
}

// ── Content renderer ──────────────────────────────────────────────────────────

function ContentRenderer({ content }: { content: string }) {
  const blocks = parseContent(content);
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={i} className="font-display font-bold text-lg text-text mt-8 mb-3">
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="font-display font-semibold text-base text-text mt-6 mb-2">
                {block.text}
              </h3>
            );
          case "blockquote":
            return (
              <blockquote key={i} className="border-l-2 border-accent pl-4 text-accent/90 italic font-body text-sm my-4">
                {renderInline(block.text)}
              </blockquote>
            );
          case "code":
            return (
              <pre key={i} className="bg-surface-2 border border-border rounded-xl p-4 font-mono text-xs text-text overflow-x-auto my-4">
                <code>{block.text}</code>
              </pre>
            );
          case "list":
            return (
              <ol key={i} className="font-body text-sm text-muted leading-relaxed ml-4 space-y-2 list-decimal list-outside my-4">
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ol>
            );
          case "paragraph":
            return (
              <p key={i} className="font-body text-sm text-text/80 leading-relaxed mb-4">
                {renderInline(block.text)}
              </p>
            );
        }
      })}
    </>
  );
}

// ── Excerpt helper ────────────────────────────────────────────────────────────

function getExcerpt(content: string): string {
  for (const line of content.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith("#") || t.startsWith(">") || t.startsWith("```") || /^\d+\. /.test(t)) continue;
    return t;
  }
  return "";
}

// ── Desktop post list row ─────────────────────────────────────────────────────

interface PostRowProps {
  post: AIPost;
  active: boolean;
  onClick: () => void;
}

function PostRow({ post, active, onClick }: PostRowProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left px-4 py-3 transition-colors duration-150",
        active
          ? "border-l-2 border-accent bg-accent/10"
          : "border-l-2 border-transparent hover:bg-white/4",
      ].join(" ")}
    >
      <p className={["font-body text-sm leading-snug", active ? "text-text" : "text-muted"].join(" ")}>
        {post.title}
      </p>
      <p className="font-body text-xs text-faint mt-0.5">{post.date}</p>
    </button>
  );
}

// ── Post card (grid view, both breakpoints) ───────────────────────────────────

interface PostCardProps {
  post: AIPost;
  onClick: () => void;
}

function PostCard({ post, onClick }: PostCardProps) {
  const excerpt = getExcerpt(post.content);
  return (
    <div
      onClick={onClick}
      className="bg-surface border border-border rounded-2xl p-5 mb-4 cursor-pointer transition-all duration-200 hover:border-accent/40 hover:shadow-glow"
    >
      <p className="font-display font-semibold text-sm text-text leading-snug">
        {post.title}
      </p>
      {excerpt && (
        <p className="font-body text-xs text-muted line-clamp-2 mt-1">
          {excerpt}
        </p>
      )}
      <p className="font-body text-xs text-faint mt-1">{post.date}</p>
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="muted">{tag}</Badge>
          ))}
        </div>
      )}
      <p className="font-body text-xs text-accent text-right mt-3">Read →</p>
    </div>
  );
}

// ── Post content area ─────────────────────────────────────────────────────────

function PostContent({ post }: { post: AIPost }) {
  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-text leading-tight mb-2">
        {post.title}
      </h1>
      <p className="font-body text-xs text-faint mb-3">{post.date}</p>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="muted">{tag}</Badge>
        ))}
      </div>
      <div className="h-px bg-border mb-6" />
      <ContentRenderer content={post.content} />
      <KofiPanel firstLine="Enjoyed the breakdown?" />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const NAV_H    = 64;
const TOPBAR_H = 48;
const PANEL_H  = `calc(100vh - ${NAV_H + TOPBAR_H}px)`;

const SCROLLBAR_CLASSES = [
  "[&::-webkit-scrollbar]:w-1.5",
  "[&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:bg-border",
  "[&::-webkit-scrollbar-thumb]:rounded-full",
  "[&::-webkit-scrollbar-thumb:hover]:bg-accent/40",
].join(" ");

function AIBlog() {
  const { slug }     = useParams<{ slug?: string }>();
  const navigate     = useNavigate();
  const selectedPost = slug ? (aiPosts.find((p) => p.slug === slug) ?? null) : null;

  function selectPost(post: AIPost) {
    navigate(`/blog/ai/${post.slug}`);
  }

  function closePost() {
    navigate("/blog/ai");
  }

  const topBar = (
    <div
      className="border-b border-border bg-surface/70 backdrop-blur-md px-6 flex items-center justify-between gap-6 shrink-0"
      style={{ height: `${TOPBAR_H}px` }}
    >
      <div className="flex items-center gap-4">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 font-body text-xs text-muted hover:text-accent transition-colors duration-200"
        >
          ← Blog
        </Link>
        <div className="h-4 w-px bg-border" />
        <span className="font-display font-bold text-sm text-text">AI Journey</span>
      </div>
      <span className="font-body text-xs text-faint">
        {aiPosts.length} {aiPosts.length === 1 ? "post" : "posts"}
      </span>
    </div>
  );

  return (
    <div style={{ paddingTop: `${NAV_H}px` }}>
      {topBar}

      {selectedPost === null ? (
        /* ── Grid view (no slug) — both breakpoints ─────────── */
        <div className={`overflow-y-auto ${SCROLLBAR_CLASSES}`} style={{ height: PANEL_H }}>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiPosts.map((post) => (
              <PostCard key={post.id} post={post} onClick={() => selectPost(post)} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* ── Mobile: full-screen content ───────────────────── */}
          <div className="md:hidden" style={{ height: PANEL_H }}>
            <div className={`overflow-y-auto h-full ${SCROLLBAR_CLASSES}`}>
              <div className="p-5">
                <button
                  onClick={closePost}
                  className="inline-flex items-center gap-1.5 font-body text-sm text-muted hover:text-accent transition-colors duration-200 mb-6"
                >
                  ← Posts
                </button>
                <PostContent post={selectedPost} />
              </div>
            </div>
          </div>

          {/* ── Desktop: two-panel ────────────────────────────── */}
          <div className="hidden md:flex" style={{ height: PANEL_H }}>
            <aside
              className={`shrink-0 border-r border-border overflow-y-auto ${SCROLLBAR_CLASSES}`}
              style={{ width: "28%", minWidth: "220px", maxWidth: "320px" }}
            >
              <div className="py-2">
                {aiPosts.map((post) => (
                  <PostRow
                    key={post.id}
                    post={post}
                    active={selectedPost.id === post.id}
                    onClick={() => selectPost(post)}
                  />
                ))}
              </div>
            </aside>

            <main className={`flex-1 overflow-y-auto ${SCROLLBAR_CLASSES}`}>
              <div className="p-8 max-w-2xl">
                <PostContent post={selectedPost} />
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export default AIBlog;
