import { EmailLink } from "../ui/EmailLink";
import { ResumeRequestTrigger } from "../ui/ResumeRequest";
import { btnGhost, btnPrimary, container } from "../ui/styles";

// ─── Terminal card ────────────────────────────────────────────────────────────

const Key = ({ children }: { children: string }) => <span className="text-accent-text">"{children}"</span>;
const Str = ({ children }: { children: string }) => <span className="text-code-string">"{children}"</span>;
const Prompt = () => <span className="text-cyan-text">$</span>;

function TerminalCard() {
  return (
    <figure
      aria-label="Profile summary as JSON"
      className="bg-surface border border-border rounded-[14px] overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        {/* macOS window controls: close, minimise, zoom */}
        {["#ff5f57", "#febc2e", "#28c840"].map((color) => (
          <span key={color} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} aria-hidden />
        ))}
        <span className="ml-2 font-mono text-xs text-muted">shiva.json</span>
      </div>
      <pre className="px-5 py-4 font-mono text-[13px] lg:text-sm leading-[1.85] text-muted overflow-x-auto">
        <Prompt /> <span className="text-text">cat shiva.json</span>{"\n"}
        {"{\n"}
        {"  "}<Key>role</Key>: <Str>Software Engineer</Str>,{"\n"}
        {"  "}<Key>based_in</Key>: <Str>Melbourne, AU</Str>,{"\n"}
        {"  "}<Key>industry</Key>: <Str>2 years</Str>,{"\n"}
        {"  "}<Key>stack</Key>: [<Str>TypeScript</Str>, <Str>React</Str>,{"\n"}
        {"            "}<Str>Angular</Str>, <Str>Next.js</Str>,{"\n"}
        {"            "}<Str>Node.js</Str>, <Str>Python</Str>, <Str>AWS</Str>],{"\n"}
        {"  "}<Key>building_with</Key>: <Str>RAG, LLM APIs, MCP</Str>,{"\n"}
        {"  "}<Key>graduating</Key>: <Str>RMIT, Dec 2026</Str>{"\n"}
        {"}\n"}
        <Prompt /> <span className="caret-blink text-text" aria-hidden>_</span>
      </pre>
    </figure>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-name">
      <div className={`${container} pt-24 pb-12 md:pt-32 md:pb-20 flex flex-wrap items-center gap-x-14 gap-y-12`}>
        {/* Text */}
        <div className="flex-[999_1_520px] min-w-0">
          <p className="font-mono text-[13px] text-cyan-text">// hello, world</p>

          <h1
            id="hero-name"
            className="mt-4 font-display font-extrabold text-[42px] md:text-[72px] leading-[1.02] tracking-[-0.02em] text-text"
          >
            Shiva Kumar
            <br />
            <span className="text-accent-text">Tirupathi</span>
          </h1>

          <p className="mt-5 max-w-[560px] font-body text-base md:text-[19px] leading-relaxed text-body">
            From solving sudokus to solving real problems, I levelled up one problem at a time. Angular or Node,
            fine-tuning a model or stopping a prompt injection, I learnt every skill chasing a problem.
          </p>
          <p className="mt-3 max-w-[560px] font-body font-medium text-base md:text-[19px] leading-relaxed text-text">
            Hi, I'm a software engineer. Nice to meet you ;)
          </p>

          <div className="mt-7 flex flex-col sm:flex-row sm:flex-wrap gap-3">
            <ResumeRequestTrigger className={`${btnPrimary} w-full sm:w-auto`} />
            <div className="grid grid-cols-3 sm:flex gap-3">
              <EmailLink className={btnGhost}>Email</EmailLink>
              <a href="https://github.com/wings-aka-shiva" target="_blank" rel="noopener noreferrer" className={btnGhost}>
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/shiva4836/" target="_blank" rel="noopener noreferrer" className={btnGhost}>
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Terminal: hidden on phones so the hero stays one screen tall */}
        <div className="hidden sm:block flex-[1_1_400px] min-w-0">
          <TerminalCard />
        </div>
      </div>
    </section>
  );
}

export default Hero;
