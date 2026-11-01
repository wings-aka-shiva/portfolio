import githubIcon from "../../assets/github.svg";
import { codingProfiles } from "../../data/coding-profiles";

interface Pill {
  id: string;
  name: string;
  handle: string;
  icon: string;
  url: string | null; // null = coming soon
  /** Monochrome black icons need inverting on the dark background */
  invert?: boolean;
}

const pills: Pill[] = [
  {
    id: "github",
    name: "GitHub",
    handle: "@wings-aka-shiva",
    icon: githubIcon,
    url: "https://github.com/wings-aka-shiva",
    invert: true,
  },
  ...codingProfiles.map((p) => ({
    id: p.id,
    name: p.platform,
    handle: p.profileUrl ? p.username : "Coming soon",
    icon: p.icon,
    url: p.profileUrl,
  })),
];

function PillContent({ pill }: { pill: Pill }) {
  return (
    <>
      <img src={pill.icon} alt="" width={20} height={20} className={`w-5 h-5 object-contain shrink-0 ${pill.invert ? "invert" : ""}`} />
      <span className="font-display text-sm font-semibold text-text">{pill.name}</span>
      <span className="font-mono text-xs text-muted">{pill.handle}</span>
    </>
  );
}

function Elsewhere() {
  return (
    <section
      id="elsewhere"
      aria-labelledby="elsewhere-title"
      className="py-20 md:py-28 max-w-5xl mx-auto px-4"
    >
      <h2
        id="elsewhere-title"
        className="font-display text-xs uppercase tracking-[0.2em] text-accent mb-6"
      >
        Find me elsewhere
      </h2>

      <ul className="flex flex-wrap gap-3">
        {pills.map((pill) => {
          const base = "flex items-center gap-2.5 bg-surface border border-border rounded-lg px-4 py-3";
          return (
            <li key={pill.id}>
              {pill.url ? (
                <a
                  href={pill.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${base} hover:border-accent/40 transition-colors duration-200`}
                >
                  <PillContent pill={pill} />
                </a>
              ) : (
                <span className={`${base} opacity-50`}>
                  <PillContent pill={pill} />
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Elsewhere;
