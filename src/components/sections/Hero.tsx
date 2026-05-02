import profilePng from "../../assets/profile.png";
import { Button } from "../ui/Button";

function Hero() {
  const scrollToWork = () => {
    document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">

      {/* Ambient gradient orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 -left-20 w-[560px] h-[560px] rounded-full bg-accent/8 blur-[140px]" />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] rounded-full bg-cyan/5 blur-[120px]" />
      </div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        aria-hidden
        style={{
          backgroundImage: "radial-gradient(circle, #f1f1f3 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-24 w-full">
        <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">

          {/* ── Image — top on mobile, right on desktop ─────────── */}
          <div className="md:order-2 md:w-[42%] shrink-0">
            {/*
              Tilt wrapper: rotate-2 on desktop, flat on mobile.
              Hover un-tilts and lifts slightly for an interactive feel.
            */}
            <div className="transition-transform duration-500 ease-out md:rotate-2 md:hover:rotate-0 md:hover:scale-[1.02]">
              {/*
                Gradient border: 2px gradient ring around the image.
                Box-shadow creates the ambient glow + deep drop shadow.
              */}
              <div
                className="p-[2px] rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(79,70,229,0.75) 0%, rgba(6,182,212,0.45) 100%)",
                  boxShadow:
                    "0 0 40px rgba(79,70,229,0.2), 0 0 80px rgba(6,182,212,0.08), 0 24px 60px rgba(0,0,0,0.55)",
                }}
              >
                <img
                  src={profilePng}
                  alt="Shiva Kumar Tirupathi"
                  className={[
                    "rounded-2xl w-full object-cover",
                    // Mobile: full-width strip, no tilt
                    "h-[280px]",
                    // Desktop: tall portrait card
                    "md:h-[460px]",
                  ].join(" ")}
                  // Focus center-left of the cinematic image where the person sits
                  style={{ objectPosition: "35% center" }}
                />
              </div>
            </div>
          </div>

          {/* ── Text — bottom on mobile, left on desktop ─────────── */}
          <div className="md:order-1 md:flex-1">
            {/* Eyebrow */}
            <p className="font-body text-xs text-muted tracking-[0.3em] uppercase mb-6">
              Hello, I'm
            </p>

            {/* Name */}
            <h1 id="hero-name" className="font-display font-bold leading-[1.05] tracking-tight mb-5">
              <span className="block text-5xl sm:text-6xl text-text">
                Shiva Kumar
              </span>
              <span className="block text-5xl sm:text-6xl text-accent">
                Tirupathi
              </span>
            </h1>

            {/* Title + location */}
            <p className="font-body text-base text-muted mb-3">
              Software Engineer{" "}
              <span className="text-border mx-1">·</span>{" "}
              Melbourne, AU
            </p>

            {/* Bio */}
            <p className="font-body text-sm text-muted/80 leading-relaxed max-w-lg mb-10">
              Building scalable web applications and solving hard problems with
              clean code. Previously at{" "}
              <span className="text-text/70">Keka Technologies</span>.
              Currently open to new opportunities.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() =>
                  window.open("https://github.com/wings-aka-shiva", "_blank")
                }
              >
                GitHub
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() =>
                  window.open("https://www.linkedin.com/in/shiva4836/", "_blank")
                }
              >
                LinkedIn
              </Button>
              <Button variant="outline" size="lg" onClick={scrollToWork}>
                See my work ↓
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <span className="font-body text-[10px] text-muted tracking-[0.25em] uppercase">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-muted to-transparent" />
      </div>
    </section>
  );
}

export default Hero;
