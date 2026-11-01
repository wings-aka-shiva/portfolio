import { Link } from "react-router-dom";
import { HomeSection } from "../ui/Section";

interface DeepDive {
  to: string;
  eyebrow: string;
  title: string;
  body: string;
  stat: string;
  statLabel: string;
  cta: string;
  /** Text colour for the eyebrow and the call to action */
  tone: string;
}

const DIVES: DeepDive[] = [
  {
    to: "/work/fsanz-regulatory-assistant",
    eyebrow: "CASE STUDY",
    title: "FSANZ Regulatory Assistant",
    body: "An AI assistant that checks food labels against the Food Standards Code and cites the exact clause. Architecture, decisions, and an honest evaluation.",
    stat: "3,163",
    statLabel: "citation-ready chunks",
    cta: "read the case study →",
    tone: "text-accent-text",
  },
  {
    to: "/hackathons",
    eyebrow: "HACKATHON",
    title: "RMIT Hackathon 2026",
    body: "Led Team ULTRON across 3 campuses in 48 hours: a TideCloak approval prototype and fine-tuned XLM-RoBERTa and mmBERT models.",
    stat: "0.96660",
    statLabel: "team-best Kaggle score",
    cta: "see the build →",
    tone: "text-cyan-text",
  },
];

function DeepDives() {
  return (
    <HomeSection id="highlights" n="02" label="highlights" title="Deep dives">
      <ul className="flex flex-wrap gap-5">
        {DIVES.map((d) => (
          <li key={d.to} className="flex-[1_1_420px] min-w-0">
            <Link
              to={d.to}
              className="group h-full bg-surface border border-border rounded-2xl p-5 sm:p-8 flex flex-col gap-3 sm:gap-4 hover:border-accent-text/50 transition-colors duration-200"
            >
              <p className={`font-mono text-xs uppercase tracking-[0.08em] ${d.tone}`}>{d.eyebrow}</p>
              <h3 className="font-display font-bold text-[22px] leading-snug text-text">{d.title}</h3>
              <p className="font-body text-[15px] leading-relaxed text-body">{d.body}</p>
              <p className="mt-auto flex flex-wrap items-baseline gap-x-3">
                <span className="font-mono font-semibold text-[34px] sm:text-[40px] leading-none text-text">{d.stat}</span>
                <span className="font-body text-sm text-muted">{d.statLabel}</span>
              </p>
              <p className={`font-mono text-sm ${d.tone} group-hover:underline underline-offset-4`}>{d.cta}</p>
            </Link>
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}

export default DeepDives;
