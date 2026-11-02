import { Link } from "react-router-dom";
import { SectionShell } from "../ui/Section";
import { SectionLabel } from "../ui/SectionLabel";
import { blogCategories } from "../../data/blog-categories";
import { codingProfiles } from "../../data/coding-profiles";

const collections = blogCategories.filter((c) => c.live);

// The homepage shows a short pick; everything else is one click away on /blog
const HOME_BLOG_IDS = ["neetcode", "novels"];
const homeCollections = HOME_BLOG_IDS.map((id) => collections.find((c) => c.id === id)).filter(
  (c): c is (typeof collections)[number] => c !== undefined
);

// Hidden entries never show; a "-" username means "not set up yet" unless it is coming soon
const visibleProfiles = codingProfiles.filter((p) => !p.hidden && (p.username !== "-" || p.comingSoon));
const onlineProfiles = visibleProfiles.filter((p) => !p.comingSoon && p.profileUrl);
const pendingProfiles = visibleProfiles.filter((p) => p.comingSoon);

/** "building, breaking - one model" -> "Building, breaking, one model" */
const tidyCaption = (text: string) => {
  const t = text.replace(/ - /g, ", ");
  return t.charAt(0).toUpperCase() + t.slice(1);
};

/** Focus rings in each panel's own accent */
const blogFocus = "focus-visible:outline-2 focus-visible:outline-blog-accent focus-visible:outline-offset-2";
const termFocus = "focus-visible:outline-2 focus-visible:outline-term-accent focus-visible:outline-offset-2";

const panelTitle = "mb-4 font-display font-extrabold text-[28px] leading-tight text-text";

// ─── Left: the blogger's notebook ─────────────────────────────────────────────

function Notebook() {
  return (
    <div className="blog-grid border border-blog-border rounded-[14px] px-6 py-5">
      <p className="pb-3 border-b border-blog-border font-serif">
        <span className="italic text-[15px] text-blog-accent">The notebook</span>
        <span className="text-[13px] text-blog-muted"> · {collections.length} collections</span>
      </p>
      <ul>
        {homeCollections.map((c) => (
          <li key={c.id} className="border-b border-blog-border">
            <Link
              to={`/blog/${c.slug}`}
              className={`group -mx-6 px-6 flex items-center gap-4 py-4 hover:bg-blog-hover transition-colors duration-200 ${blogFocus}`}
            >
              <span className="flex-1 min-w-0">
                <span className="block font-serif text-[17px] font-semibold text-blog-title">
                  {c.name}
                </span>
                <span className="block mt-0.5 font-serif italic text-sm text-blog-text">{tidyCaption(c.caption)}</span>
              </span>
              <span
                className="shrink-0 font-serif text-blog-accent transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="pt-4 text-right">
        <Link
          to="/blog"
          className={`font-serif italic text-sm text-blog-accent hover:text-blog-title transition-colors duration-200 ${blogFocus}`}
        >
          Read all writing →
        </Link>
      </p>
    </div>
  );
}

// ─── Right: the tech explorer's terminal ──────────────────────────────────────

function PracticeTerminal() {
  return (
    <div className="term-grid border border-term-border rounded-[14px]">
      <p className="flex items-center gap-1 px-5 py-3.5 border-b border-term-border font-mono text-[13px] text-term-text">
        <span>
          <span className="text-term-accent">~</span> $ ls ~/practice
        </span>
        <span className="caret-blink inline-block w-2 h-3.5 bg-term-accent" aria-hidden />
      </p>
      <ul>
        {onlineProfiles.map((p) => (
          <li key={p.id} className="border-b border-term-border">
            <a
              href={p.profileUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-3 px-5 py-3 min-h-[56px] font-mono hover:bg-term-hover transition-colors duration-200 ${termFocus}`}
            >
              <span className="text-term-accent self-start sm:self-auto" aria-hidden>&gt;</span>
              <span className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                <span className="text-[15px] font-semibold text-term-text">{p.platform.toLowerCase()}</span>
                <span className="text-[13px] text-term-handle break-all">{p.username}</span>
              </span>
              <span
                className="shrink-0 text-term-accent transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden
              >
                ↗
              </span>
            </a>
          </li>
        ))}
        {pendingProfiles.map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-3 min-h-[56px] content-center border-b border-term-border font-mono"
          >
            <span>
              <span className="text-term-accent" aria-hidden>&gt; </span>
              <span className="text-[15px] font-semibold text-term-text">{p.platform.toLowerCase()}</span>
            </span>
            <span className="text-xs text-term-muted">[ coming soon ]</span>
          </li>
        ))}
      </ul>
      <p className="px-5 py-3 font-mono text-xs text-term-muted">
        {onlineProfiles.length} online · {pendingProfiles.length} pending
      </p>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

function WritingAndPractice() {
  return (
    <SectionShell id="blog">
      <SectionLabel n="04" name="writing & practice" className="mb-6 md:mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <section aria-labelledby="blog-title" className="min-w-0">
          <h2 id="blog-title" className={panelTitle}>From the blog</h2>
          <Notebook />
        </section>
        <section aria-labelledby="practice-title" className="min-w-0">
          <h2 id="practice-title" className={panelTitle}>Where I practice</h2>
          <PracticeTerminal />
        </section>
      </div>
    </SectionShell>
  );
}

export default WritingAndPractice;
