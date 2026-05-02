import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import KofiPanel from "../components/ui/KofiPanel";
import {
  neetcodeProblems,
  getTopicGroups,
  getSolvedCount,
  type NeetCodeProblem,
  type Difficulty,
} from "../data/neetcode-problems";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DIFF_COLOR: Record<Difficulty, string> = {
  Easy:   "#22c55e",
  Medium: "#f59e0b",
  Hard:   "#ef4444",
};

const DIFF_BG: Record<Difficulty, string> = {
  Easy:   "bg-green-500/10 text-green-400 border-green-500/20",
  Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Hard:   "bg-red-500/10   text-red-400   border-red-500/20",
};

function shortTitle(s: string, n = 13): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

// ─── Map data ─────────────────────────────────────────────────────────────────

interface TopicNode {
  topic: string;
  label: string[];
  x: number;
  y: number;
  emoji: string;
}

// Sequential winding-road layout. ViewBox "0 0 1060 1580".
// 150px clearance on each edge for radial child expansion.
const TOPIC_NODES: TopicNode[] = [
  { topic: "Arrays & Hashing",     label: ["Arrays &", "Hashing"],    x: 180,  y: 240,  emoji: "🧮" },
  { topic: "Two Pointers",          label: ["Two", "Pointers"],         x: 430,  y: 200,  emoji: "👉" },
  { topic: "Sliding Window",        label: ["Sliding", "Window"],       x: 700,  y: 230,  emoji: "🪟" },
  { topic: "Stack",                 label: ["Stack"],                   x: 870,  y: 380,  emoji: "📚" },
  { topic: "Binary Search",         label: ["Binary", "Search"],        x: 740,  y: 530,  emoji: "🔍" },
  { topic: "Linked List",           label: ["Linked", "List"],          x: 480,  y: 500,  emoji: "🔗" },
  { topic: "Trees",                 label: ["Trees"],                   x: 230,  y: 530,  emoji: "🌳" },
  { topic: "Heap / Priority Queue", label: ["Heap /", "Priority Q"],    x: 150,  y: 690,  emoji: "⛰️" },
  { topic: "Backtracking",          label: ["Back-", "tracking"],       x: 310,  y: 830,  emoji: "↩️" },
  { topic: "Tries",                 label: ["Tries"],                   x: 560,  y: 800,  emoji: "🌿" },
  { topic: "Graphs",                label: ["Graphs"],                  x: 800,  y: 830,  emoji: "🕸️" },
  { topic: "Advanced Graphs",       label: ["Advanced", "Graphs"],      x: 860,  y: 990,  emoji: "🗺️" },
  { topic: "1-D DP",                label: ["1-D DP"],                  x: 700,  y: 1130, emoji: "📐" },
  { topic: "2-D DP",                label: ["2-D DP"],                  x: 450,  y: 1100, emoji: "📊" },
  { topic: "Greedy",                label: ["Greedy"],                  x: 220,  y: 1130, emoji: "🤑" },
  { topic: "Intervals",             label: ["Intervals"],               x: 180,  y: 1290, emoji: "📏" },
  { topic: "Math & Geometry",       label: ["Math &", "Geometry"],      x: 430,  y: 1400, emoji: "📐" },
  { topic: "Bit Manipulation",      label: ["Bit", "Manipulation"],     x: 700,  y: 1380, emoji: "🔢" },
];

function getRadialPositions(
  cx: number,
  cy: number,
  count: number,
): { x: number; y: number }[] {
  const radius = Math.max(120, count * 10);
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });
}

function buildPathD(a: TopicNode, b: TopicNode, idx: number): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const px = (-dy / len) * 50;
  const py = (dx / len) * 50;
  const side = idx % 2 === 0 ? 1 : -1;
  return `M ${a.x} ${a.y} Q ${mx + px * side} ${my + py * side} ${b.x} ${b.y}`;
}

// ─── Left panel ───────────────────────────────────────────────────────────────

interface ProblemRowProps {
  problem: NeetCodeProblem;
  selected: boolean;
  onClick: () => void;
}

function ProblemRow({ problem, selected, onClick }: ProblemRowProps) {
  return (
    <button
      data-problem={problem.id}
      onClick={onClick}
      className={[
        "w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left",
        "transition-colors duration-150",
        selected
          ? "bg-accent/15 border border-accent/30"
          : "hover:bg-white/4 border border-transparent",
      ].join(" ")}
    >
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: DIFF_COLOR[problem.difficulty] }}
      />
      <span
        className={[
          "font-body text-xs leading-snug flex-1 min-w-0 truncate",
          problem.solved
            ? selected ? "text-text" : "text-muted"
            : selected ? "text-text/70" : "text-muted/50",
        ].join(" ")}
      >
        {problem.title}
      </span>
      {problem.solved && (
        <svg className="w-3.5 h-3.5 shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
}

interface TopicGroupProps {
  name: string;
  problems: NeetCodeProblem[];
  selectedId: number | null;
  onSelect: (p: NeetCodeProblem) => void;
}

function TopicGroup({ name, problems, selectedId, onSelect }: TopicGroupProps) {
  const solved = problems.filter((p) => p.solved).length;
  const total  = problems.length;
  const pct    = total > 0 ? (solved / total) * 100 : 0;

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between px-1 mb-1.5">
        <span className="font-display font-semibold text-[11px] text-text/70 uppercase tracking-wider">
          {name}
        </span>
        <span className="font-body text-[10px] text-faint">{solved}/{total}</span>
      </div>
      <div className="h-[2px] bg-border rounded-full mb-2 overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex flex-col gap-0.5">
        {problems.map((p) => (
          <ProblemRow
            key={p.id}
            problem={p}
            selected={selectedId === p.id}
            onClick={() => onSelect(p)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── SVG Map ──────────────────────────────────────────────────────────────────

interface SVGMapProps {
  expandedTopic: string | null;
  childrenVisible: boolean;
  selectedProblemId: number | null;
  onTopicClick: (topic: string) => void;
  onProblemClick: (p: NeetCodeProblem) => void;
}

function SVGMap({
  expandedTopic,
  childrenVisible,
  selectedProblemId,
  onTopicClick,
  onProblemClick,
}: SVGMapProps) {
  const topicStats: Record<string, { solved: number; total: number }> = {};
  for (const node of TOPIC_NODES) {
    const probs = neetcodeProblems.filter((p) => p.topic === node.topic);
    topicStats[node.topic] = {
      solved: probs.filter((p) => p.solved).length,
      total:  probs.length,
    };
  }

  const expandedNode     = expandedTopic ? TOPIC_NODES.find((n) => n.topic === expandedTopic) : null;
  const expandedProblems = expandedTopic ? neetcodeProblems.filter((p) => p.topic === expandedTopic) : [];
  const childPos         = expandedNode
    ? getRadialPositions(expandedNode.x, expandedNode.y, expandedProblems.length)
    : [];

  const NODE_R  = 26;
  const CHILD_R = 18;

  return (
    <svg viewBox="0 0 1060 1580" width="100%" style={{ display: "block" }}>
      {/* ── Sequential path ── */}
      {TOPIC_NODES.slice(0, -1).map((node, idx) => {
        const next   = TOPIC_NODES[idx + 1];
        const isDimmed =
          expandedTopic !== null &&
          expandedTopic !== node.topic &&
          expandedTopic !== next.topic;
        return (
          <path
            key={idx}
            d={buildPathD(node, next, idx)}
            fill="none"
            stroke="rgba(79,70,229,0.28)"
            strokeWidth="2"
            strokeDasharray="6 5"
            strokeLinecap="round"
            style={{
              opacity:    isDimmed ? 0.25 : 1,
              transition: "opacity 300ms ease",
            }}
          />
        );
      })}

      {/* ── Radial spokes (when topic expanded) ── */}
      {expandedNode &&
        expandedProblems.map((_, i) => (
          <line
            key={i}
            x1={expandedNode.x}
            y1={expandedNode.y}
            x2={childPos[i].x}
            y2={childPos[i].y}
            stroke="rgba(79,70,229,0.18)"
            strokeWidth="1"
            style={{
              opacity:    childrenVisible ? 1 : 0,
              transition: `opacity 200ms ease ${i * 35}ms`,
            }}
          />
        ))}

      {/* ── Topic nodes ── */}
      {TOPIC_NODES.map((node) => {
        const stats   = topicStats[node.topic] ?? { solved: 0, total: 0 };
        const done    = stats.solved === stats.total && stats.total > 0;
        const active  = expandedTopic === node.topic;
        const dimmed  = expandedTopic !== null && !active;
        const anyDone = stats.solved > 0;

        return (
          <g
            key={node.topic}
            onClick={() => onTopicClick(node.topic)}
            style={{
              cursor:     "pointer",
              opacity:    dimmed ? 0.28 : 1,
              transition: "opacity 300ms ease",
            }}
          >
            {active && (
              <circle
                cx={node.x}
                cy={node.y}
                r={NODE_R + 13}
                fill="rgba(79,70,229,0.1)"
                stroke="rgba(79,70,229,0.45)"
                strokeWidth="1.5"
              />
            )}
            <circle
              cx={node.x}
              cy={node.y}
              r={NODE_R}
              fill={
                done    ? "rgba(79,70,229,0.28)" :
                anyDone ? "rgba(79,70,229,0.1)" :
                          "#0f0f1a"
              }
              stroke={
                done   ? "rgba(79,70,229,0.8)" :
                active ? "rgba(79,70,229,0.65)" :
                         "rgba(37,37,69,1)"
              }
              strokeWidth={done ? 2 : 1.5}
            />
            <text
              x={node.x}
              y={node.y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="17"
              style={{ userSelect: "none" }}
            >
              {node.emoji}
            </text>
            {node.label.map((line, li) => (
              <text
                key={li}
                x={node.x}
                y={node.y + NODE_R + 11 + li * 11}
                textAnchor="middle"
                dominantBaseline="hanging"
                fontSize="9"
                fill={active ? "rgba(129,140,248,1)" : "rgba(156,163,175,0.9)"}
                fontFamily="Poppins, sans-serif"
              >
                {line}
              </text>
            ))}
            <text
              x={node.x}
              y={node.y + NODE_R + 11 + node.label.length * 11}
              textAnchor="middle"
              dominantBaseline="hanging"
              fontSize="8"
              fill={done ? "rgba(99,102,241,0.85)" : "rgba(75,85,99,0.9)"}
              fontFamily="Poppins, sans-serif"
            >
              {stats.solved}/{stats.total}
            </text>
          </g>
        );
      })}

      {/* ── Child problem nodes ── */}
      {expandedNode &&
        expandedProblems.map((problem, i) => {
          const cp         = childPos[i];
          const isSelected = selectedProblemId === problem.id;

          return (
            <g
              key={problem.id}
              onClick={(e) => {
                e.stopPropagation();
                onProblemClick(problem);
              }}
              style={{
                cursor:          "pointer",
                transformOrigin: `${expandedNode.x}px ${expandedNode.y}px`,
                transform:       `scale(${childrenVisible ? 1 : 0})`,
                opacity:         childrenVisible ? 1 : 0,
                transition: [
                  `transform 320ms cubic-bezier(0.34,1.56,0.64,1) ${i * 42}ms`,
                  `opacity 220ms ease ${i * 42}ms`,
                ].join(", "),
              }}
            >
              {isSelected && (
                <circle
                  cx={cp.x}
                  cy={cp.y}
                  r={CHILD_R + 6}
                  fill="none"
                  stroke={DIFF_COLOR[problem.difficulty]}
                  strokeWidth="1.5"
                  opacity="0.55"
                />
              )}
              <circle
                cx={cp.x}
                cy={cp.y}
                r={CHILD_R}
                fill={problem.solved ? `${DIFF_COLOR[problem.difficulty]}28` : "#0d0d1c"}
                stroke={DIFF_COLOR[problem.difficulty]}
                strokeWidth={isSelected ? 2.5 : 1.5}
                opacity={problem.solved ? 1 : 0.65}
              />
              {problem.solved ? (
                <text
                  x={cp.x}
                  y={cp.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill={DIFF_COLOR[problem.difficulty]}
                  style={{ userSelect: "none" }}
                >
                  ✓
                </text>
              ) : (
                <text
                  x={cp.x}
                  y={cp.y + 0.5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="7.5"
                  fill="rgba(107,114,128,0.7)"
                  fontFamily="Poppins, sans-serif"
                  style={{ userSelect: "none" }}
                >
                  {i + 1}
                </text>
              )}
              <text
                x={cp.x}
                y={cp.y + CHILD_R + 5}
                textAnchor="middle"
                dominantBaseline="hanging"
                fontSize="7"
                fill={
                  problem.solved
                    ? "rgba(209,213,219,0.8)"
                    : "rgba(107,114,128,0.65)"
                }
                fontFamily="Poppins, sans-serif"
                style={{ userSelect: "none" }}
              >
                {shortTitle(problem.title)}
              </text>
              <title>{problem.title} · {problem.difficulty}</title>
            </g>
          );
        })}
    </svg>
  );
}

// ─── Detail panel ─────────────────────────────────────────────────────────────

function DetailPanel({
  problem,
  onClose,
}: {
  problem: NeetCodeProblem;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-body text-[10px] text-faint">#{problem.id}</span>
            <span
              className={[
                "font-body text-[10px] px-2 py-0.5 rounded-full border",
                DIFF_BG[problem.difficulty],
              ].join(" ")}
            >
              {problem.difficulty}
            </span>
            {problem.solved && (
              <span className="font-body text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                Solved
              </span>
            )}
          </div>
          <h2 className="font-display font-bold text-xl text-text leading-tight">
            {problem.title}
          </h2>
          <p className="font-body text-xs text-faint mt-1">{problem.topic}</p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 p-1.5 rounded-lg hover:bg-white/6 text-muted hover:text-text transition-colors duration-150"
          aria-label="Back to map"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="h-px bg-border mb-6" />

      <div className="flex flex-col gap-5">
        {problem.solved ? (
          <>
            <p className="font-body text-sm text-muted leading-relaxed">
              You've solved this one. Notes and write-up coming soon.
            </p>
            <div className="bg-surface border border-border rounded-xl p-4">
              <p className="font-body text-xs text-faint italic">
                Solution notes will be added here as the blog evolves.
              </p>
            </div>
            <KofiPanel firstLine="Enjoyed the breakdown?" />
          </>
        ) : (
          <p className="font-body text-sm text-muted/60 leading-relaxed">
            Not yet solved — come back when you've cracked it.
          </p>
        )}

        <a
          href={problem.leetcodeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={[
            "inline-flex items-center gap-2 font-body text-sm w-fit",
            "border border-border rounded-lg px-4 py-2.5 text-muted",
            "hover:border-accent/40 hover:text-accent transition-all duration-200",
          ].join(" ")}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Open on LeetCode
        </a>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const NAV_H    = 64;
const TOPBAR_H = 48;
const PANEL_H  = `calc(100vh - ${NAV_H + TOPBAR_H}px)`;

const SCROLLBAR_CLASSES = [
  "[&::-webkit-scrollbar]:w-1.5",
  "[&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:bg-border",
  "[&::-webkit-scrollbar-thumb]:rounded-full",
  "[&::-webkit-scrollbar-thumb:hover]:bg-accent/40",
].join(" ");

function NeetCodeMap() {
  const [expandedTopic,    setExpandedTopic]    = useState<string | null>(null);
  const [childrenVisible,  setChildrenVisible]  = useState(false);
  const [selectedProblem,  setSelectedProblem]  = useState<NeetCodeProblem | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const topicGroups = getTopicGroups();
  const totalSolved = getSolvedCount();
  const totalPct    = Math.round((totalSolved / 150) * 100);

  // Trigger child-node expand animation one frame after topic is set
  useEffect(() => {
    if (expandedTopic) {
      const id = setTimeout(() => setChildrenVisible(true), 20);
      return () => clearTimeout(id);
    } else {
      setChildrenVisible(false);
    }
  }, [expandedTopic]);

  function handleTopicClick(topic: string) {
    if (expandedTopic === topic) {
      // Collapse
      setExpandedTopic(null);
      setSelectedProblem(null);
    } else {
      // Expand (reset child visibility first so animation re-runs)
      setChildrenVisible(false);
      setExpandedTopic(topic);
      setSelectedProblem(null);
      // Sync left panel scroll
      requestAnimationFrame(() => {
        listRef.current
          ?.querySelector(`[data-topic="${topic}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function handleProblemClickOnMap(p: NeetCodeProblem) {
    setSelectedProblem(p);
    // Sync left panel highlight
    requestAnimationFrame(() => {
      listRef.current
        ?.querySelector(`[data-problem="${p.id}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  function selectFromList(p: NeetCodeProblem) {
    setSelectedProblem(p);
    if (expandedTopic !== p.topic) {
      setChildrenVisible(false);
      setExpandedTopic(p.topic);
    }
  }

  function closeProblem() {
    setSelectedProblem(null);
  }

  return (
    <div style={{ paddingTop: `${NAV_H}px` }}>
      {/* ── Top bar ── */}
      <div
        className="border-b border-border bg-surface/70 backdrop-blur-md px-6 flex items-center justify-between gap-6 shrink-0"
        style={{ height: `${TOPBAR_H}px` }}
      >
        <div className="flex items-center gap-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 font-body text-xs text-muted hover:text-accent transition-colors duration-200"
          >
            ← Blog
          </Link>
          <div className="h-4 w-px bg-border" />
          <span className="font-display font-bold text-sm text-text">NeetCode 150</span>
          <span className="font-body text-xs text-faint">{totalSolved}/150 solved</span>
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-xs">
          <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-700"
              style={{ width: `${totalPct}%` }}
            />
          </div>
          <span className="font-body text-[10px] text-faint shrink-0">{totalPct}%</span>
        </div>
      </div>

      {/* ── Two panels ── */}
      <div className="flex" style={{ height: PANEL_H }}>

        {/* Left: problem list */}
        <aside
          className={`shrink-0 border-r border-border overflow-y-auto ${SCROLLBAR_CLASSES}`}
          style={{ width: "28%", minWidth: "220px", maxWidth: "320px", height: PANEL_H }}
        >
          <div ref={listRef} className="p-4">
            {topicGroups.map((group) => (
              <div key={group.name} data-topic={group.name}>
                <TopicGroup
                  name={group.name}
                  problems={group.problems}
                  selectedId={selectedProblem?.id ?? null}
                  onSelect={selectFromList}
                />
              </div>
            ))}
          </div>
        </aside>

        {/* Right: map or detail */}
        <main
          className={`flex-1 overflow-y-auto ${SCROLLBAR_CLASSES}`}
          style={{ height: PANEL_H }}
        >
          {selectedProblem ? (
            <div className="p-8 max-w-2xl">
              <DetailPanel problem={selectedProblem} onClose={closeProblem} />
            </div>
          ) : (
            <div className="p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between min-h-[20px]">
                {expandedTopic ? (
                  <p className="font-body text-xs text-muted">
                    <span className="text-text/80 font-medium">{expandedTopic}</span>
                    {" — click a problem node to view it"}
                  </p>
                ) : (
                  <p className="font-body text-xs text-faint">
                    Select a topic to explore its problems
                  </p>
                )}
                {expandedTopic && (
                  <button
                    onClick={() => {
                      setExpandedTopic(null);
                      setSelectedProblem(null);
                    }}
                    className="font-body text-xs text-muted hover:text-accent transition-colors duration-150 shrink-0 ml-4"
                  >
                    Collapse ↑
                  </button>
                )}
              </div>

              <SVGMap
                expandedTopic={expandedTopic}
                childrenVisible={childrenVisible}
                selectedProblemId={null}
                onTopicClick={handleTopicClick}
                onProblemClick={handleProblemClickOnMap}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default NeetCodeMap;
