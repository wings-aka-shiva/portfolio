import { nowData } from "../data/now";

// short git-log-style codes for each category label
const CATEGORY_CODE: Record<string, string> = {
  Building: "build",
  Learning: "learn",
  Reading:  "read",
  Life:     "life",
};

function Now() {
  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-2xl mx-auto px-6">

        {/* Header */}
        <div className="mb-1 flex items-baseline gap-3">
          <span className="inline-flex items-center gap-2 font-display font-bold text-4xl md:text-5xl text-text">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] pulse-dot shrink-0" />
            Now
          </span>
          <span className="font-mono text-xs text-muted">
            (tracking since Jul 8, 5PM AEST)
          </span>
        </div>
        <p className="font-mono text-xs text-muted mb-6">
          Last updated: {nowData.lastUpdated}
        </p>

        <div className="border-b border-border" />

        {/* Log entries */}
        <div>
          {nowData.sections.map((section) => (
            <div
              key={section.category}
              className="flex gap-4 py-4 border-b border-border hover:bg-surface transition-colors duration-150"
            >
              <span className="w-20 shrink-0 font-mono text-xs text-muted lowercase">
                {CATEGORY_CODE[section.category] ?? section.category.toLowerCase()}
              </span>
              <span className="font-body text-sm text-text/80">
                {section.items.join(" · ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Now;
