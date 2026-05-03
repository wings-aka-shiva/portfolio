import { useState } from "react";
import { useInView } from "../../hooks/useInView";
import { Section } from "../ui/Section";
import { interests, type Interest } from "../../data/interests";

interface TileProps {
  interest: Interest;
  index: number;
  inView: boolean;
}

function InterestTile({ interest, index, inView }: TileProps) {
  const [hovered, setHovered] = useState(false);
  const { glowColor } = interest;

  return (
    <div
      className="transition-[opacity,transform] duration-700 ease-out"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${index * 110}ms`,
      }}
    >
      <div
        className="bg-surface border border-border rounded-2xl p-8 flex flex-col items-center text-center gap-4 h-full transition-[border-color,box-shadow] duration-300 cursor-default"
        style={
          hovered
            ? {
                borderColor: `${glowColor}55`,
                boxShadow: `0 0 32px ${glowColor}1a`,
              }
            : {}
        }
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Emoji */}
        <span
          className="text-5xl leading-none select-none"
          role="img"
          aria-label={interest.category}
        >
          {interest.emoji}
        </span>

        {/* Category badge — uses tile's own accent color */}
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-body font-medium border transition-colors duration-300"
          style={{
            backgroundColor: `${glowColor}18`,
            color: glowColor,
            borderColor: `${glowColor}35`,
          }}
        >
          {interest.category}
        </span>

        {/* Headline */}
        <h3 className="font-display font-semibold text-sm text-text leading-snug">
          {interest.headline}
        </h3>

        {/* Detail */}
        <p className="font-body text-xs text-muted leading-relaxed">
          {interest.detail}
        </p>
      </div>
    </div>
  );
}

function BeyondTheCode() {
  const { ref, inView } = useInView(0.1);

  return (
    <Section
      id="about"
      label="Beyond the Code"
      title="The person behind the terminal"
    >
      <div
        ref={ref}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {interests.map((interest, index) => (
          <InterestTile
            key={interest.id}
            interest={interest}
            index={index}
            inView={inView}
          />
        ))}
      </div>
    </Section>
  );
}

export default BeyondTheCode;
