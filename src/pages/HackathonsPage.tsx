import { PageShell } from "../components/ui/PageShell";
import { CompactRow, FeaturedCard } from "../components/sections/Hackathons";
import { hackathons } from "../data/hackathons";
import { usePageMeta } from "../hooks/usePageMeta";

function HackathonsPage() {
  usePageMeta(
    "Hackathons | Shiva Kumar Tirupathi",
    "RMIT Hackathon 2026: Shiva Kumar Tirupathi led Team ULTRON across 3 campuses, building a TideCloak approval prototype and reaching a team-best 0.96660 on Kaggle."
  );

  const [featured, ...older] = hackathons;

  return (
    <PageShell>
      <h1 className="font-display font-extrabold text-[36px] md:text-[56px] leading-[1.05] tracking-[-0.01em] text-text">
        Built in 48 hours
      </h1>

      {featured && (
        <div className="mt-10">
          <FeaturedCard hackathon={featured} />
        </div>
      )}

      {older.length > 0 && (
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {older.map((h) => (
            <CompactRow key={h.id} hackathon={h} />
          ))}
        </ul>
      )}
    </PageShell>
  );
}

export default HackathonsPage;
