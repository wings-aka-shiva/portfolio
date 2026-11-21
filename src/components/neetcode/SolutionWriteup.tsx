import KofiPanel from "../ui/KofiPanel";
import CodeBlock from "./CodeBlock";
import type { NeetCodeSolution } from "../../data/neetcode-solutions";

/** Renders text, turning `backticked` segments into inline code. */
function InlineText({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) =>
        i % 2 === 1 ? (
          <code
            key={i}
            className="font-mono text-[12px] bg-surface-2 border border-border rounded px-1 py-0.5"
          >
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

const SECTION_LABEL = "font-body text-xs uppercase tracking-wider text-muted mb-2";
const BODY = "font-body text-sm text-text/80 leading-relaxed";

export default function SolutionWriteup({ solution }: { solution: NeetCodeSolution }) {
  return (
    <>
      {/* Problem Summary */}
      <div className="flex flex-col gap-1.5">
        <p className={SECTION_LABEL}>Problem Summary</p>
        <p className={BODY}>
          <InlineText text={solution.summary} />
        </p>
      </div>

      {/* Approach */}
      <div className="flex flex-col gap-1.5">
        <p className={SECTION_LABEL}>Approach</p>
        <ol className={`${BODY} list-decimal pl-5 flex flex-col gap-2`}>
          {solution.approach.map((step) => (
            <li key={step.label}>
              <span className="text-text font-semibold">{step.label}:</span>{" "}
              <InlineText text={step.text} />
            </li>
          ))}
        </ol>
      </div>

      {/* The Insight */}
      <div className="border-l-2 border-accent pl-3">
        <p className="font-body text-sm text-accent italic leading-relaxed">
          <InlineText text={solution.insight} />
        </p>
      </div>

      {/* Code */}
      <div className="flex flex-col gap-1.5">
        <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">
          Solution - Python
        </p>
        <CodeBlock code={solution.code} language={solution.language} />
      </div>

      {/* What I Learned */}
      {solution.learned && (
        <div className="flex flex-col gap-1.5">
          <p className={SECTION_LABEL}>What I Learned</p>
          {Array.isArray(solution.learned) ? (
            <ul className={`${BODY} list-disc pl-5 flex flex-col gap-2`}>
              {solution.learned.map((item, i) => (
                <li key={i}>
                  <InlineText text={item} />
                </li>
              ))}
            </ul>
          ) : (
            <p className={BODY}>
              <InlineText text={solution.learned} />
            </p>
          )}
        </div>
      )}

      {/* Gotchas */}
      {solution.gotchas.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className={SECTION_LABEL}>Gotchas</p>
          <ul className={`${BODY} list-disc pl-5 flex flex-col gap-2`}>
            {solution.gotchas.map((g, i) => (
              <li key={i}>
                <InlineText text={g} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <KofiPanel firstLine="Enjoyed the breakdown?" />
    </>
  );
}
