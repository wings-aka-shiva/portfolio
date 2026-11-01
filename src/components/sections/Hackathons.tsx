import { useInView } from "../../hooks/useInView";
import { Section } from "../ui/Section";
import { TechChipList } from "../ui/TechChip";
import { DateText } from "../ui/DateText";
import { hackathons, type Hackathon } from "../../data/hackathons";

function FeaturedCard({ hackathon }: { hackathon: Hackathon }) {
  const { ref, inView } = useInView(0.1);

  return (
    <div
      ref={ref}
      className={[
        "relative transition-all duration-500 ease-out",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      ].join(" ")}
    >
      {/* Soft cyan glow behind the card */}
      <div className="absolute inset-6 rounded-full bg-cyan/5 blur-3xl pointer-events-none" aria-hidden />

      <article className="relative bg-surface border border-border rounded-2xl p-6 md:p-8">
        {/* Header + stat */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
          <div className="min-w-0">
            <h3 className="font-display text-xl md:text-2xl font-bold text-text leading-tight">
              {hackathon.name}
            </h3>
            <p className="font-body text-sm text-text/80 mt-1">{hackathon.theme}</p>
            <p className="font-body text-sm text-muted mt-2">
              {hackathon.role}
              <span className="mx-1.5 text-faint">·</span>
              <DateText value={hackathon.date} />
            </p>
            <p className="font-body text-xs text-muted mt-1">{hackathon.where}</p>
          </div>

          {hackathon.stat && (
            <div className="shrink-0 md:text-right">
              <p className="font-mono text-4xl md:text-5xl font-bold text-cyan leading-none">
                {hackathon.stat.value}
              </p>
              <p className="font-body text-xs text-muted mt-2 md:max-w-[12rem] md:ml-auto">
                {hackathon.stat.label}
              </p>
            </div>
          )}
        </div>

        {/* Builds */}
        <div className="border-t border-border mt-6 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0">
          {hackathon.builds.map((build, i) => (
            <div
              key={build.title}
              className={i > 0 ? "md:border-l md:border-border md:pl-8" : "md:pr-8"}
            >
              <p className="font-display text-xs uppercase tracking-[0.2em] text-accent mb-2">
                {build.challenge}
              </p>
              <h4 className="font-display text-base font-semibold text-text leading-snug">
                {build.title}
              </h4>
              <p className="font-body text-sm text-text/80 leading-relaxed mt-2">{build.body}</p>
            </div>
          ))}
        </div>

        {/* Stack */}
        <div className="border-t border-border mt-6 pt-5">
          <TechChipList items={hackathon.stack} />
        </div>
      </article>
    </div>
  );
}

function CompactRow({ hackathon }: { hackathon: Hackathon }) {
  const { ref, inView } = useInView(0.1);

  return (
    <li>
      <div
        ref={ref}
        className={[
          "flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6 py-4",
          "transition-all duration-500 ease-out",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        ].join(" ")}
      >
        <div className="min-w-0">
          <h3 className="font-display text-sm font-semibold text-text">{hackathon.name}</h3>
          <p className="font-body text-xs text-muted mt-0.5">
            {hackathon.role}
            <span className="mx-1.5 text-faint">·</span>
            {hackathon.builds.map((b) => b.title).join(", ")}
          </p>
        </div>
        <div className="shrink-0 flex items-baseline gap-4 font-body text-xs text-muted">
          {hackathon.stat && <span className="font-mono text-sm text-cyan">{hackathon.stat.value}</span>}
          <span><DateText value={hackathon.date} /></span>
        </div>
      </div>
    </li>
  );
}

function Hackathons() {
  if (hackathons.length === 0) return null;
  const [featured, ...older] = hackathons;

  return (
    <Section id="hackathons" label="Hackathons" title="Built in 48 hours">
      <FeaturedCard hackathon={featured} />

      {older.length > 0 && (
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {older.map((h) => (
            <CompactRow key={h.id} hackathon={h} />
          ))}
        </ul>
      )}
    </Section>
  );
}

export default Hackathons;
