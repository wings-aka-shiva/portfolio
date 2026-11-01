import { useId } from "react";
import { PageShell } from "../components/ui/PageShell";
import { EmailLink } from "../components/ui/EmailLink";
import { fsanz, type DiagramBox } from "../data/case-studies/fsanz";
import { usePageMeta } from "../hooks/usePageMeta";

// ─── Architecture diagram ─────────────────────────────────────────────────────

interface Placed {
  box: DiagramBox;
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize: number;
}

function Box({ box, x, y, w, h, fontSize }: Placed) {
  const lineHeight = fontSize * 1.3;
  const firstBaseline = y + h / 2 - ((box.lines.length - 1) * lineHeight) / 2 + fontSize * 0.35;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} className="fill-surface-2 stroke-border" strokeWidth={1} />
      <text textAnchor="middle" fontSize={fontSize} className="fill-body font-body">
        {box.lines.map((line, i) => (
          <tspan key={i} x={x + w / 2} y={firstBaseline + i * lineHeight}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

function Arrow({ d, marker }: { d: string; marker: string }) {
  return <path d={d} fill="none" strokeWidth={1.5} className="stroke-accent-text" markerEnd={`url(#${marker})`} />;
}

function ArrowMarker({ id }: { id: string }) {
  return (
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" className="fill-accent-text" />
      </marker>
    </defs>
  );
}

const DIAGRAM_DESC =
  "A question or label image goes through multi-query expansion into 4 queries, Pinecone semantic search with Titan v2 embeddings and a jurisdiction filter, Reciprocal Rank Fusion with neighbouring chunks, and evidence-only generation on AWS Bedrock (Nova Lite, with vision for labels). The result has 3 statuses, 6 reason codes and citations. Separately, the Food Standards Code goes through structure-aware ingestion into 3,163 chunks, which feed the Pinecone index.";

// The ingestion branch joins the pipeline at the Pinecone search step
const searchBox = fsanz.pipeline.find((b) => b.id === "search")!;

/** Left to right, with the ingestion branch above the search step (lg+) */
function HorizontalDiagram() {
  const uid = useId();
  const marker = `${uid}-arrow`;
  const W = 160, GAP = 28, Y = 170, H = 116;
  const xAt = (i: number) => i * (W + GAP);
  const searchIndex = fsanz.pipeline.indexOf(searchBox);
  const [code, ingest] = fsanz.ingestion;

  return (
    <svg viewBox="0 0 1100 300" role="img" aria-labelledby={`${uid}-t ${uid}-d`} className="w-full h-auto">
      <title id={`${uid}-t`}>FSANZ Regulatory Assistant architecture</title>
      <desc id={`${uid}-d`}>{DIAGRAM_DESC}</desc>
      <ArrowMarker id={marker} />

      {fsanz.pipeline.map((box, i) => (
        <Box key={box.id} box={box} x={xAt(i)} y={Y} w={W} h={H} fontSize={13} />
      ))}
      {fsanz.pipeline.slice(1).map((box, i) => (
        <Arrow key={box.id} d={`M${xAt(i) + W + 2} ${Y + H / 2} H${xAt(i + 1) - 2}`} marker={marker} />
      ))}

      {/* Ingestion branch into the Pinecone index */}
      <Box box={code} x={xAt(searchIndex - 1)} y={16} w={W} h={84} fontSize={13} />
      <Box box={ingest} x={xAt(searchIndex)} y={16} w={W} h={84} fontSize={13} />
      <Arrow d={`M${xAt(searchIndex - 1) + W + 2} 58 H${xAt(searchIndex) - 2}`} marker={marker} />
      <Arrow d={`M${xAt(searchIndex) + W / 2} 102 V${Y - 2}`} marker={marker} />
    </svg>
  );
}

/** Top to bottom, with the ingestion branch beside the search step (below lg) */
function VerticalDiagram() {
  const uid = useId();
  const marker = `${uid}-arrow`;
  const MAIN_W = 212, GAP = 30, BRANCH_X = 240, BRANCH_W = 100;
  const heightFor = (b: DiagramBox, lh: number) => b.lines.length * lh + 24;

  let y = 0;
  const placed = fsanz.pipeline.map((box) => {
    const h = heightFor(box, 17);
    const p = { box, x: 0, y, w: MAIN_W, h, fontSize: 13 };
    y += h + GAP;
    return p;
  });
  const total = y - GAP;

  const search = placed.find((p) => p.box === searchBox)!;
  const [code, ingest] = fsanz.ingestion;
  const ingestH = heightFor(ingest, 15);
  const ingestY = search.y + search.h / 2 - ingestH / 2;
  const codeH = heightFor(code, 15);
  const codeY = ingestY - GAP - codeH;

  return (
    <svg viewBox={`0 0 340 ${total}`} role="img" aria-labelledby={`${uid}-t ${uid}-d`} className="w-full h-auto">
      <title id={`${uid}-t`}>FSANZ Regulatory Assistant architecture</title>
      <desc id={`${uid}-d`}>{DIAGRAM_DESC}</desc>
      <ArrowMarker id={marker} />

      {placed.map((p) => (
        <Box key={p.box.id} {...p} />
      ))}
      {placed.slice(1).map((p, i) => (
        <Arrow key={p.box.id} d={`M${MAIN_W / 2} ${placed[i].y + placed[i].h + 2} V${p.y - 2}`} marker={marker} />
      ))}

      <Box box={code} x={BRANCH_X} y={codeY} w={BRANCH_W} h={codeH} fontSize={11.5} />
      <Box box={ingest} x={BRANCH_X} y={ingestY} w={BRANCH_W} h={ingestH} fontSize={11.5} />
      <Arrow d={`M${BRANCH_X + BRANCH_W / 2} ${codeY + codeH + 2} V${ingestY - 2}`} marker={marker} />
      <Arrow d={`M${BRANCH_X - 2} ${search.y + search.h / 2} H${MAIN_W + 2}`} marker={marker} />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="font-display font-extrabold text-2xl md:text-[28px] leading-tight text-text">{children}</h2>;
}

const prose = "font-body text-base md:text-[17px] leading-relaxed text-body";

function CaseStudyFsanz() {
  usePageMeta(
    "FSANZ Regulatory Assistant case study | Shiva Kumar Tirupathi",
    "Case study: an AI assistant that checks food labels against the Food Standards Code with cited, reason-coded results. Retrieval pipeline, design decisions and an honest evaluation."
  );

  const walkthrough = `subject=${encodeURIComponent(`Walkthrough: ${fsanz.title}`)}`;

  return (
    <PageShell width="max-w-3xl">
      <article>
        {/* 1. Header */}
        <header>
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-accent-text">CASE STUDY</p>
          <h1 className="mt-3 font-display font-extrabold text-[34px] md:text-[48px] leading-[1.08] tracking-[-0.01em] text-text">
            {fsanz.title}
          </h1>
          <p className="mt-4 font-body text-lg md:text-xl leading-relaxed text-body">{fsanz.subtitle}</p>
          <p className="mt-5 font-mono text-[13px] text-muted">{fsanz.meta.join(" · ")}</p>
          <p className="mt-2 font-body text-[15px] text-body">
            <span className="text-muted">Role: </span>
            {fsanz.role}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center bg-surface-2 border border-border rounded px-2 py-0.5 font-mono text-xs text-muted">
              {fsanz.privacy}
            </span>
            <EmailLink query={walkthrough} className="font-mono text-[13px] text-accent-text hover:text-text transition-colors duration-200">
              Ask me for a walkthrough →
            </EmailLink>
          </div>
        </header>

        {/* 2. Problem */}
        <section className="mt-14" aria-labelledby="cs-problem">
          <H2 id="cs-problem">The problem</H2>
          <p className={`mt-4 ${prose}`}>{fsanz.problem}</p>
        </section>

        {/* 3. Architecture */}
        <section className="mt-14" aria-labelledby="cs-how">
          <H2 id="cs-how">How it works</H2>
          <figure className="mt-6">
            <div className="hidden lg:block relative left-1/2 -translate-x-1/2 w-[min(1100px,calc(100vw-5rem))]">
              <HorizontalDiagram />
            </div>
            <div className="lg:hidden max-w-[420px] mx-auto">
              <VerticalDiagram />
            </div>
            <figcaption className="mt-5 font-mono text-xs leading-relaxed text-muted">
              Stack: {fsanz.stack.join(" · ")}
            </figcaption>
          </figure>
        </section>

        {/* 4. Decisions */}
        <section className="mt-14" aria-labelledby="cs-decisions">
          <H2 id="cs-decisions">Decisions I made, and why</H2>
          <div className="mt-6 flex flex-col gap-6">
            {fsanz.decisions.map((d) => (
              <div key={d.title}>
                <h3 className="font-body font-semibold text-base md:text-[17px] text-text">{d.title}</h3>
                <p className={`mt-1.5 ${prose}`}>{d.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Evaluation: the standout section */}
        <section className="mt-14 border-l-2 border-cyan-text/60 pl-5 md:pl-6" aria-labelledby="cs-eval">
          <H2 id="cs-eval">Measuring it honestly</H2>
          <p className={`mt-4 ${prose}`}>{fsanz.evaluation}</p>
        </section>

        {/* 6. Delivery */}
        <section className="mt-14" aria-labelledby="cs-delivery">
          <H2 id="cs-delivery">Frontend and delivery</H2>
          <ul className="mt-4 space-y-3">
            {fsanz.delivery.map((point) => (
              <li key={point} className={`flex gap-3 ${prose}`}>
                <span className="mt-[0.65em] shrink-0 w-1.5 h-1.5 bg-accent-dot" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </section>

        {/* 7. Next */}
        <section className="mt-14" aria-labelledby="cs-next">
          <H2 id="cs-next">What I'd do next</H2>
          <p className={`mt-4 ${prose}`}>{fsanz.next}</p>
        </section>
      </article>
    </PageShell>
  );
}

export default CaseStudyFsanz;
