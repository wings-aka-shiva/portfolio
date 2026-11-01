import { EmailLink } from "../ui/EmailLink";
import { ResumeRequestTrigger } from "../ui/ResumeRequest";

const PROOF = [
  "Founding developer, KEKA Marketplace",
  "Above & Beyond Award",
  "Hackathon Team Lead",
];

const ghostLink =
  "inline-flex items-center gap-2 rounded-lg px-5 py-3 font-body font-medium text-sm text-text border border-border hover:border-accent/60 transition-colors duration-200";

function Hero() {
  const scrollToWork = () => {
    document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      aria-labelledby="hero-name"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Ambient gradient orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-accent/8 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-cyan/6 blur-3xl" />
      </div>

      {/* Monogram - faint depth layer on the right half */}
      <span
        className="absolute top-1/2 -right-16 -translate-y-1/2 hidden md:block font-display font-black text-[20rem] leading-none tracking-tighter text-white/3 select-none pointer-events-none"
        aria-hidden
      >
        SKT
      </span>

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-4 pt-28 pb-24 w-full">
        <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0">
          {/* Eyebrow */}
          <p className="font-body text-xs text-muted tracking-widest uppercase mb-6">
            Software Engineer <span className="text-faint mx-1" aria-hidden>·</span> Melbourne
          </p>

          {/* Name */}
          <h1
            id="hero-name"
            className="font-display font-black leading-none tracking-tight text-text"
            style={{ fontSize: "clamp(2.8rem, 6vw, 4.5rem)" }}
          >
            Shiva Kumar <span className="text-accent">Tirupathi</span>
          </h1>

          {/* Summary */}
          <p className="font-body text-lg text-muted max-w-xl mt-5 mx-auto md:mx-0 leading-relaxed">
            Software engineer with 2 years in industry, building AI features
            with React, Python and AWS. Graduating from RMIT in Dec 2026.
          </p>

          {/* Proof line */}
          <p className="font-body text-sm text-faint mt-4">
            {PROOF.map((item, i) => (
              <span key={item}>
                {/* Real spaces around the dot give the line somewhere to wrap */}
                {i > 0 && <> <span className="mx-1" aria-hidden>·</span> </>}
                <span className="whitespace-nowrap">{item}</span>
              </span>
            ))}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <ResumeRequestTrigger className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-body font-medium text-sm text-white bg-accent hover:bg-accent/90 transition-colors duration-200 cursor-pointer" />
            <EmailLink className={ghostLink}>Email</EmailLink>
            <a href="https://github.com/wings-aka-shiva" target="_blank" rel="noopener noreferrer" className={ghostLink}>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/shiva4836/" target="_blank" rel="noopener noreferrer" className={ghostLink}>
              LinkedIn
            </a>
          </div>

          <button
            onClick={scrollToWork}
            className="group mt-6 inline-flex items-center gap-2 py-2 font-body text-sm text-muted hover:text-text transition-colors duration-200 cursor-pointer"
          >
            <span className="inline-block transition-transform duration-300 group-hover:translate-y-1" aria-hidden>
              ↓
            </span>
            See my work
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
