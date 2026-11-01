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

const panelTitle = "mb-4 font-display font-extrabold text-[28px] leading-tight text-text";

// ─── Left: the blogger's notebook ─────────────────────────────────────────────

function Notebook() {
  return (
    <div className="bg-life-panel border border-[#2a251d] rounded-[14px] px-6 py-5">
      <p className="pb-3 border-b border-[#2a251d] font-serif">
        <span className="italic text-[15px] text-life-accent">The notebook</span>
        <span className="text-[13px] text-life-date"> · {collections.length} collections</span>
      </p>
      <ul>
        {homeCollections.map((c) => (
          <li key={c.id} className="border-b border-[#2a251d]">
            <Link to={`/blog/${c.slug}`} className="group flex items-center gap-4 py-4">
              <span className="flex-1 min-w-0">
                <span className="block font-serif text-[17px] font-semibold text-life-strong group-hover:text-[#fff7ea] transition-colors duration-200">
                  {c.name}
                </span>
                <span className="block mt-0.5 font-serif italic text-sm text-life-text">{tidyCaption(c.caption)}</span>
              </span>
              <span
                className="shrink-0 font-serif text-life-accent transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="pt-4 text-right">
        <Link to="/blog" className="font-serif italic text-sm text-life-accent hover:text-life-strong transition-colors duration-200">
          Read all writing →
        </Link>
      </p>
    </div>
  );
}

// ─── Right: the tech explorer's terminal ──────────────────────────────────────

function PracticeTerminal() {
  return (
    <div className="tech-grid border border-border rounded-[14px] overflow-hidden">
      <p className="flex items-center gap-1 px-5 py-3.5 border-b border-border-soft font-mono text-[13px] text-muted">
        <span>
          <span className="text-cyan-text">~</span> $ ls ~/practice
        </span>
        <span className="caret-blink inline-block w-2 h-3.5 bg-cyan-text" aria-hidden />
      </p>
      <ul>
        {onlineProfiles.map((p) => (
          <li key={p.id} className="border-b border-border-soft">
            <a
              href={p.profileUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 min-h-[56px] font-mono hover:bg-surface transition-colors duration-200"
            >
              <span className="text-cyan-text self-start sm:self-auto" aria-hidden>&gt;</span>
              <span className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                <span className="text-[15px] font-semibold text-text">{p.platform.toLowerCase()}</span>
                <span className="text-[13px] text-accent-text break-all">{p.username}</span>
              </span>
              <span className="shrink-0 text-cyan-text" aria-hidden>↗</span>
            </a>
          </li>
        ))}
        {pendingProfiles.map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-3 min-h-[56px] content-center border-b border-border-soft font-mono"
          >
            <span>
              <span className="text-cyan-text" aria-hidden>&gt; </span>
              <span className="text-[15px] font-semibold text-text">{p.platform.toLowerCase()}</span>
            </span>
            <span className="text-xs text-muted">[ coming soon ]</span>
          </li>
        ))}
      </ul>
      <p className="px-5 py-3 font-mono text-xs text-muted">
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
