import { useInView } from "../../hooks/useInView";
import { Section } from "../ui/Section";
import { codingProfiles, type CodingProfile } from "../../data/coding-profiles";

interface ProfileCardProps {
  profile: CodingProfile;
  index: number;
  inView: boolean;
}

function ProfileCard({ profile, index, inView }: ProfileCardProps) {
  const isLive = profile.profileUrl !== null;

  const cardContent = (
    <div
      className={[
        "group bg-surface border border-border rounded-2xl p-5",
        "flex flex-col items-center gap-3 text-center h-full",
        "transition-all duration-700 ease-out",
        isLive
          ? "hover:border-accent/35 hover:shadow-glow cursor-pointer"
          : "opacity-60 cursor-default",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
        // restore opacity for coming-soon after animation
        !isLive && inView ? "!opacity-50" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:border-accent/25">
        <img
          src={profile.icon}
          alt={profile.platform}
          className="w-7 h-7 object-contain"
        />
      </div>

      {/* Text */}
      <div className="flex-1 flex flex-col items-center gap-0.5">
        <p className="font-display font-semibold text-sm text-text leading-tight">
          {profile.platform}
        </p>
        <p className="font-body text-xs text-muted">{profile.tagline}</p>
        {isLive && (
          <p className="font-body text-[11px] text-faint mt-0.5">
            {profile.username}
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="mt-auto pt-1">
        {isLive ? (
          <span className="font-body text-xs text-accent group-hover:underline underline-offset-2">
            Visit →
          </span>
        ) : (
          <span className="font-body text-xs text-faint">Coming soon</span>
        )}
      </div>
    </div>
  );

  if (isLive) {
    return (
      <a
        href={profile.profileUrl!}
        target="_blank"
        rel="noreferrer"
        aria-label={`${profile.platform} profile`}
        className="block h-full"
        style={{ transitionDelay: `${index * 80}ms` }}
      >
        {cardContent}
      </a>
    );
  }

  return <div className="h-full">{cardContent}</div>;
}

function CodingProfiles() {
  const { ref, inView } = useInView(0.12);

  return (
    <Section id="coding" label="Coding" title="Where I practice">
      <div
        ref={ref}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {codingProfiles.map((profile, index) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            index={index}
            inView={inView}
          />
        ))}
      </div>
    </Section>
  );
}

export default CodingProfiles;
