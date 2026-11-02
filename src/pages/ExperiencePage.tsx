import { Link } from "react-router-dom";
import { PageShell } from "../components/ui/PageShell";
import { DateText } from "../components/ui/DateText";
import { LifeMarker, TechMarker, TimelineFrame, TimelineLegend } from "../components/sections/Timeline";
import { timelineByYear, type TimelineEntry } from "../data/timeline";
import { usePageMeta } from "../hooks/usePageMeta";

const COLUMNS = "md:grid-cols-[1fr_120px_1fr]";

/** Marker on the left-hand line, phones only (the card sits 18px right of it) */
const mobileMarker = "md:hidden absolute top-7 -left-[18px] -translate-x-1/2";

function TechCard({ entry }: { entry: TimelineEntry }) {
  return (
    <article
      id={entry.id}
      className="relative w-full max-w-[500px] bg-surface border border-border rounded-[14px] p-6 text-left scroll-mt-24"
    >
      <TechMarker className={mobileMarker} />
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <div className="min-w-0">
          <h2 className="font-display font-bold text-[19px] leading-snug text-text">{entry.role}</h2>
          <p className="font-body text-sm text-muted mt-0.5">{entry.orgFull}</p>
        </div>
        {entry.dates && (
          <p className="shrink-0 font-mono text-xs text-muted pt-1.5">
            <DateText value={entry.dates} />
          </p>
        )}
      </div>

      {entry.bullets && (
        <ul className="mt-4 space-y-2.5">
          {entry.bullets.map((point, i) => (
            <li key={i} className="flex gap-3 font-body text-sm leading-relaxed text-body">
              <span className="mt-[0.6em] shrink-0 w-1.5 h-1.5 bg-accent-dot" aria-hidden />
              {point}
            </li>
          ))}
        </ul>
      )}

      {entry.award && (
        <div className="mt-4 rounded-lg border border-[#312e81] bg-[#14132a] px-4 py-3">
          <p className="font-body text-sm font-semibold text-[#c7d2fe]">{entry.award.title}</p>
          <p className="font-body text-xs text-muted mt-1">
            <span className="italic">"{entry.award.description}"</span> · {entry.award.praisedBy}, {entry.award.date}
          </p>
        </div>
      )}

      {entry.tech && (
        <p className="mt-4 font-mono text-xs text-muted">{entry.tech.map((t) => t.toLowerCase()).join(" · ")}</p>
      )}

      {entry.link && (
        <Link
          to={entry.link.to}
          className={[
            "inline-block mt-3 font-mono text-[13px] hover:text-text transition-colors duration-200",
            entry.link.to === "/hackathons" ? "text-cyan-text" : "text-accent-text",
          ].join(" ")}
        >
          {entry.link.label}
        </Link>
      )}
    </article>
  );
}

function LifeCard({ entry }: { entry: TimelineEntry }) {
  return (
    <article
      id={entry.id}
      className="relative w-full max-w-[500px] bg-life-panel border border-life-border rounded-[14px] px-5 py-[18px] scroll-mt-24"
    >
      <LifeMarker className={mobileMarker} />
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
        <h2 className="font-serif font-semibold text-base text-life-strong">
          {entry.role}
          {entry.org && `, ${entry.org}`}
        </h2>
        {entry.dates && (
          <p className="font-serif italic text-[13px] text-life-date">
            <DateText value={entry.dates} />
          </p>
        )}
      </div>
      {entry.text && <p className="mt-1.5 font-serif text-[15px] leading-relaxed text-life-text">{entry.text}</p>}
    </article>
  );
}

function ExperiencePage() {
  usePageMeta(
    "Experience | Shiva Kumar Tirupathi",
    "Engineering roles at FSANZ (Food Systems Collective), IFFA and KEKA, a hackathon team lead role, and the jobs and teams outside tech that shaped how Shiva Kumar Tirupathi works."
  );

  return (
    <PageShell>
      <h1 className="font-display font-extrabold text-[36px] md:text-[56px] leading-[1.05] tracking-[-0.01em] text-text">
        Two sides of the same story
      </h1>
      <p className="mt-5 max-w-[680px] font-body text-lg leading-relaxed text-body">
        On the left, the engineering. On the right, the jobs, teams and people that taught me everything else: how to
        talk to anyone and step in wherever help is needed.
      </p>

      <div className="mt-12">
        <TimelineLegend columns={COLUMNS} />
        <TimelineFrame>
          <ol aria-label="Experience by year, newest first" className="py-8 flex flex-col gap-12">
            {timelineByYear.map(({ year, tech, life }) => (
              <li key={year} className={`grid grid-cols-[36px_1fr] ${COLUMNS} gap-y-5 pr-4 md:pr-0`}>
                {/* Year pill: on the centre line (md+), on the left line on phones */}
                <div className="col-span-2 row-start-1 md:col-span-1 md:col-start-2 flex md:justify-center md:self-start">
                  <span className="relative rounded-full border border-border bg-bg px-3 py-1 font-mono text-[13px] font-semibold text-text">
                    <time dateTime={year}>{year}</time>
                  </span>
                </div>

                {tech.length > 0 && (
                  <div className="col-start-2 row-start-2 md:col-start-1 md:row-start-1 flex flex-col gap-4 md:items-end md:pl-6">
                    {tech.map((e) => (
                      <TechCard key={e.id} entry={e} />
                    ))}
                  </div>
                )}

                {life.length > 0 && (
                  <div
                    className={[
                      "col-start-2 md:col-start-3 md:row-start-1 flex flex-col gap-4 md:items-start md:pr-6",
                      tech.length > 0 ? "row-start-3" : "row-start-2",
                    ].join(" ")}
                  >
                    {life.map((e) => (
                      <LifeCard key={e.id} entry={e} />
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </TimelineFrame>
      </div>
    </PageShell>
  );
}

export default ExperiencePage;
