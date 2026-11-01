import { Link } from "react-router-dom";
import { HomeSection } from "../ui/Section";
import { blogCategories } from "../../data/blog-categories";

const live = blogCategories.filter((c) => c.live);

const TECH_FOLDERS = ["neetcode", "ai"];

const folderName = (name: string) => `${name.toLowerCase().replace(/\s+/g, "-")}/`;
const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

function FolderIcon({ className }: { className: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function Writing() {
  return (
    <HomeSection id="blog" n="04" label="writing" title="From the blog" more={{ to: "/blog", label: "all writing →" }}>
      <div className="bg-tech-panel border border-border rounded-[14px] overflow-hidden">
        <p className="px-5 py-3.5 border-b border-border font-mono text-[13px] text-muted">
          <span className="text-cyan-text">~/blog</span> $ ls
        </p>
        <ul>
          {live.map((c) => (
            <li key={c.id} className="border-b border-border-soft last:border-0">
              <Link
                to={`/blog/${c.slug}`}
                className="grid grid-cols-[24px_1fr_auto] sm:grid-cols-[28px_minmax(160px,220px)_1fr_auto] items-center gap-x-4 gap-y-1 px-4 sm:px-5 py-3.5 sm:py-[18px] hover:bg-surface transition-colors duration-200"
              >
                <FolderIcon
                  className={`row-span-2 sm:row-span-1 ${TECH_FOLDERS.includes(c.id) ? "text-accent-text" : "text-life-accent"}`}
                />
                <span className="font-mono text-[15px] font-semibold text-text">{folderName(c.name)}</span>
                <span className="col-start-2 row-start-2 sm:col-start-auto sm:row-start-auto font-body text-[15px] text-body">
                  {capitalise(c.caption)}
                </span>
                <span className="col-start-3 row-start-1 row-span-2 sm:col-start-auto sm:row-start-auto sm:row-span-1 font-mono text-[13px] text-accent-text">
                  open →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </HomeSection>
  );
}

export default Writing;
