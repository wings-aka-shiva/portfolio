import { Link } from "react-router-dom";
import { useInView } from "../../hooks/useInView";
import { Section } from "../ui/Section";
import { travels } from "../../data/travel";
import { novels } from "../../data/novels";

interface TileData {
  id: string;
  icon: string;
  title: string;
  body: string;
  /** Per-tile hover border tint */
  hover: string;
  link?: { to: string; label: string };
}

function Tile({ tile }: { tile: TileData }) {
  const { ref, inView } = useInView(0.1);

  return (
    <div
      ref={ref}
      className={[
        "bg-surface border border-border rounded-xl p-5 h-full flex flex-col",
        "transition-all duration-500 ease-out",
        tile.hover,
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      ].join(" ")}
    >
      <span className="text-2xl leading-none select-none" aria-hidden>
        {tile.icon}
      </span>
      <h3 className="font-display text-sm font-semibold text-text leading-snug mt-4">
        {tile.title}
      </h3>
      <p className="font-body text-sm text-muted leading-relaxed mt-1.5">{tile.body}</p>
      {tile.link && (
        <Link
          to={tile.link.to}
          className="mt-auto pt-4 font-body text-xs text-accent hover:underline underline-offset-2 self-start"
        >
          {tile.link.label}
        </Link>
      )}
    </div>
  );
}

function BeyondTheCode() {
  const reading = novels
    .filter((n) => n.status === "reading")
    .map((n) => n.title)
    .join(" & ");

  const recentPlaces = travels
    .slice(0, 3)
    .map((t) => t.place)
    .join(" · ");

  const tiles: TileData[] = [
    {
      id: "soccer",
      icon: "⚽",
      title: "Right back, Redbacks FC",
      body: "Weekend football — the one hour when code doesn't exist.",
      hover: "hover:border-green-500/30",
    },
    {
      id: "reading",
      icon: "📖",
      title: reading ? `Currently reading: ${reading}` : "Currently reading",
      body: "Novels are my escape — always mid-book, always one chapter past bedtime.",
      hover: "hover:border-cyan/30",
      link: { to: "/blog/novels", label: "See the shelf →" },
    },
    {
      id: "travel",
      icon: "🌍",
      title: "Exploring",
      body: recentPlaces ? `Lately: ${recentPlaces}.` : "Chasing beaches, conquering trails.",
      hover: "hover:border-yellow-500/30",
    },
    {
      id: "guitar",
      icon: "🎸",
      title: "Learning guitar",
      body: "G, C, D, Em. Six strings, zero calluses.",
      hover: "hover:border-orange-500/30",
      link: { to: "/guitar", label: "Practice tool →" },
    },
    {
      id: "community",
      icon: "👥",
      title: "Building community",
      body: "Peer mentor for Algorithms at RMIT. Started a coding community for competitions. CodeChef chapter board alum.",
      hover: "hover:border-accent/30",
    },
    {
      id: "food",
      icon: "🍜",
      title: "One cuisine at a time",
      body: "Melbourne is an embarrassment of riches. Working through it systematically.",
      hover: "hover:border-red-400/30",
    },
  ];

  return (
    <Section id="about" label="The human part" title="Beyond the Code">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map((tile) => (
          <Tile key={tile.id} tile={tile} />
        ))}
      </div>
    </Section>
  );
}

export default BeyondTheCode;
