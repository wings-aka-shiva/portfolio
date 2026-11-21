import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BlogBackLink } from "../components/ui/BlogBackLink";
import { useFromHomeState } from "../hooks/useFromHome";
import KofiPanel from "../components/ui/KofiPanel";
import ThoughtButton from "../components/ui/ThoughtButton";
import PythonSwitchNotice from "../components/ui/PythonSwitchNotice";
import SolutionWriteup from "../components/neetcode/SolutionWriteup";
import CodeBlock from "../components/neetcode/CodeBlock";
import { getSolution } from "../data/neetcode-solutions";
import PremiumPlaceholder from "../components/neetcode/PremiumPlaceholder";
import {
  neetcodeProblems,
  getTopicGroups,
  getSolvedCount,
  getUnlockedCount,
  getProblemStatus,
  type NeetCodeProblem,
  type NeetCodeTopic,
  type Difficulty,
  type ProblemStatus,
} from "../data/neetcode-problems";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LOCKED_TOAST_TEXT =
  "Still locked. Each topic opens one question at a time - solve the one before it first. 🔒";

/** Open padlock (shackle swung open), stroke style. */
function OpenLockIcon({ className = "w-3.5 h-3.5 shrink-0 text-accent-text" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      role="img"
      aria-label="Unlocked"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 0 1 7.75-1.4" />
    </svg>
  );
}

function StatusLegend({ className = "" }: { className?: string }) {
  return (
    <p className={`font-mono text-[11px] text-muted flex items-center gap-1 ${className}`}>
      <span>✓ solved ·</span>
      <OpenLockIcon className="w-3 h-3 shrink-0 text-accent-text" />
      <span>unlocked · 🔒 locked</span>
    </p>
  );
}

/** "Solution - Java" label plus a note that it predates the Python switch. */
function JavaSolutionLabel() {
  return (
    <div className="mb-2">
      <p className="font-body text-xs uppercase tracking-wider text-muted">Solution - Java</p>
      <p className="font-mono text-[11px] text-muted mt-0.5">written before the switch to Python</p>
    </div>
  );
}

/** Three stacked up-chevrons that ripple upward (bottom first) in the bottom sheet's peek strip. */
function PullUpChevrons() {
  // Top to bottom; the bottom chevron animates first.
  const delays = ["0.3s", "0.15s", "0s"];
  return (
    <div className="flex flex-col items-center" aria-hidden="true">
      {delays.map((delay, i) => (
        <svg
          key={i}
          width="14"
          height="6"
          viewBox="0 0 14 6"
          fill="none"
          stroke="var(--color-accent-text)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`chevron-wave ${i > 0 ? "-mt-[2px]" : ""}`}
          style={{ animationDelay: delay }}
        >
          <path d="M1 5 L7 1 L13 5" />
        </svg>
      ))}
    </div>
  );
}

/** Premium problems look locked but stay clickable. */
function looksLocked(status: ProblemStatus): boolean {
  return status === "locked" || status === "premium";
}

/** "2026-11-21" -> "Nov 21, 2026", pinned to UTC so it never shifts a day. */
function formatSolutionDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

const DIFF_COLOR: Record<Difficulty, string> = {
  Easy: "#22c55e",
  Medium: "#f59e0b",
  Hard: "#ef4444",
};

const DIFF_BG: Record<Difficulty, string> = {
  Easy: "bg-green-500/10 text-green-400 border-green-500/20",
  Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Hard: "bg-red-500/10   text-red-400   border-red-500/20",
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
  {
    topic: "Arrays & Hashing",
    label: ["Arrays &", "Hashing"],
    x: 180,
    y: 240,
    emoji: "🧮",
  },
  {
    topic: "Two Pointers",
    label: ["Two", "Pointers"],
    x: 430,
    y: 200,
    emoji: "👉",
  },
  {
    topic: "Sliding Window",
    label: ["Sliding", "Window"],
    x: 700,
    y: 230,
    emoji: "🪟",
  },
  { topic: "Stack", label: ["Stack"], x: 870, y: 380, emoji: "📚" },
  {
    topic: "Binary Search",
    label: ["Binary", "Search"],
    x: 740,
    y: 530,
    emoji: "🔍",
  },
  {
    topic: "Linked List",
    label: ["Linked", "List"],
    x: 480,
    y: 500,
    emoji: "🔗",
  },
  { topic: "Trees", label: ["Trees"], x: 230, y: 530, emoji: "🌳" },
  {
    topic: "Heap / Priority Queue",
    label: ["Heap /", "Priority Q"],
    x: 150,
    y: 690,
    emoji: "⛰️",
  },
  {
    topic: "Backtracking",
    label: ["Back-", "tracking"],
    x: 310,
    y: 830,
    emoji: "↩️",
  },
  { topic: "Tries", label: ["Tries"], x: 560, y: 800, emoji: "🌿" },
  { topic: "Graphs", label: ["Graphs"], x: 800, y: 830, emoji: "🕸️" },
  {
    topic: "Advanced Graphs",
    label: ["Advanced", "Graphs"],
    x: 860,
    y: 990,
    emoji: "🗺️",
  },
  { topic: "1-D DP", label: ["1-D DP"], x: 700, y: 1130, emoji: "📐" },
  { topic: "2-D DP", label: ["2-D DP"], x: 450, y: 1100, emoji: "📊" },
  { topic: "Greedy", label: ["Greedy"], x: 220, y: 1130, emoji: "🤑" },
  { topic: "Intervals", label: ["Intervals"], x: 180, y: 1290, emoji: "📏" },
  {
    topic: "Math & Geometry",
    label: ["Math &", "Geometry"],
    x: 430,
    y: 1400,
    emoji: "📐",
  },
  {
    topic: "Bit Manipulation",
    label: ["Bit", "Manipulation"],
    x: 700,
    y: 1380,
    emoji: "🔢",
  },
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
  const status = getProblemStatus(problem);
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
        looksLocked(status) ? "opacity-40" : "",
      ].join(" ")}
    >
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: DIFF_COLOR[problem.difficulty] }}
      />
      <span
        className={[
          "font-body text-xs leading-snug flex-1 min-w-0 truncate",
          status === "solved"
            ? selected
              ? "text-text"
              : "text-muted"
            : status === "unlocked"
              ? "text-text"
              : selected
                ? "text-text/70"
                : "text-muted/50",
        ].join(" ")}
      >
        {problem.title}
      </span>
      {status === "unlocked" ? (
        <OpenLockIcon />
      ) : status === "solved" ? (
        <svg
          className="w-3.5 h-3.5 shrink-0 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <span className="text-xs text-faint shrink-0">🔒</span>
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
  const total = problems.length;
  const pct = total > 0 ? (solved / total) * 100 : 0;

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between px-1 mb-1.5">
        <span className="font-display font-semibold text-[11px] text-text/70 uppercase tracking-wider">
          {name}
        </span>
        <span className="font-body text-[10px] text-faint">
          {solved}/{total}
        </span>
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
      total: probs.length,
    };
  }

  const expandedNode = expandedTopic
    ? TOPIC_NODES.find((n) => n.topic === expandedTopic)
    : null;
  const expandedProblems = expandedTopic
    ? neetcodeProblems.filter((p) => p.topic === expandedTopic)
    : [];
  const childPos = expandedNode
    ? getRadialPositions(
      expandedNode.x,
      expandedNode.y,
      expandedProblems.length,
    )
    : [];

  const NODE_R = 26;
  const CHILD_R = 18;

  return (
    <svg viewBox="0 0 1060 1580" width="100%" style={{ display: "block" }}>
      {/* ── Sequential path ── */}
      {TOPIC_NODES.slice(0, -1).map((node, idx) => {
        const next = TOPIC_NODES[idx + 1];
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
              opacity: isDimmed ? 0.25 : 1,
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
              opacity: childrenVisible ? 1 : 0,
              transition: `opacity 200ms ease ${i * 35}ms`,
            }}
          />
        ))}

      {/* ── Topic nodes ── */}
      {TOPIC_NODES.map((node) => {
        const stats = topicStats[node.topic] ?? { solved: 0, total: 0 };
        const done = stats.solved === stats.total && stats.total > 0;
        const active = expandedTopic === node.topic;
        const dimmed = expandedTopic !== null && !active;
        const anyDone = stats.solved > 0;

        return (
          <g
            key={node.topic}
            onClick={() => onTopicClick(node.topic)}
            style={{
              cursor: "pointer",
              opacity: dimmed ? 0.28 : 1,
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
                done
                  ? "rgba(79,70,229,0.28)"
                  : anyDone
                    ? "rgba(79,70,229,0.1)"
                    : "#0f0f1a"
              }
              stroke={
                done
                  ? "rgba(79,70,229,0.8)"
                  : active
                    ? "rgba(79,70,229,0.65)"
                    : "rgba(37,37,69,1)"
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
          const cp = childPos[i];
          const isSelected = selectedProblemId === problem.id;
          const status = getProblemStatus(problem);

          return (
            <g
              key={problem.id}
              onClick={(e) => {
                e.stopPropagation();
                onProblemClick(problem);
              }}
              style={{
                cursor: "pointer",
                transformOrigin: `${expandedNode.x}px ${expandedNode.y}px`,
                transform: `scale(${childrenVisible ? 1 : 0})`,
                opacity: childrenVisible ? (looksLocked(status) ? 0.45 : 1) : 0,
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
                fill={
                  problem.solved
                    ? `${DIFF_COLOR[problem.difficulty]}28`
                    : "#0d0d1c"
                }
                stroke={DIFF_COLOR[problem.difficulty]}
                strokeWidth={isSelected ? 2.5 : 1.5}
                strokeDasharray={status === "unlocked" ? "3 2" : undefined}
                opacity={looksLocked(status) ? 0.65 : 1}
              />
              {status === "unlocked" ? (
                <g
                  transform={`translate(${cp.x - 5} ${cp.y - 5}) scale(${10 / 24})`}
                  fill="none"
                  stroke="var(--color-accent-text, #a5b4fc)"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ pointerEvents: "none" }}
                  aria-label="Unlocked"
                >
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 7.75-1.4" />
                </g>
              ) : status === "solved" ? (
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
                  fontSize="9"
                  fill="rgba(107,114,128,0.6)"
                  style={{ userSelect: "none" }}
                >
                  🔒
                </text>
              )}
              <text
                x={cp.x}
                y={cp.y + CHILD_R + 5}
                textAnchor="middle"
                dominantBaseline="hanging"
                fontSize="7"
                fill={
                  looksLocked(status)
                    ? "rgba(107,114,128,0.65)"
                    : "rgba(209,213,219,0.8)"
                }
                fontFamily="Poppins, sans-serif"
                style={{ userSelect: "none" }}
              >
                {shortTitle(problem.title)}
              </text>
              <title>
                {problem.title} · {problem.difficulty}
              </title>
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
  const solution = getSolution(problem.id);
  return (
    <div className="flex flex-col">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-body text-[10px] text-faint">
              #{problem.id}
            </span>
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
          {solution && (
            <p className="font-mono text-[11px] text-muted mt-1">
              <time dateTime={solution.date}>{formatSolutionDate(solution.date)}</time> · LC #{solution.lcNumber} · TC {solution.tc}
            </p>
          )}
          <div className="mt-3">
            <p className="font-body text-xs text-text italic mb-1.5">
              Want to read the full problem statement first?
            </p>
            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-body text-xs text-text bg-surface-2 border border-white/30 rounded-lg px-3 py-1.5 hover:border-accent/40 hover:text-accent transition-all duration-200"
            >
              Open on LeetCode ↗
            </a>
          </div>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 p-1.5 rounded-lg hover:bg-white/6 text-muted hover:text-text transition-colors duration-150"
          aria-label="Back to map"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="h-px bg-border mb-6" />

      <div className="flex flex-col gap-5">
        {
          solution ? (
            <SolutionWriteup solution={solution} />
          ) : getProblemStatus(problem) === "premium" ? (
            <PremiumPlaceholder />
          ) : problem.solved && problem.id === 16 ? (
            <>
              {/* Problem Summary */}
              <div className="flex flex-col gap-1.5">
                <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Problem Summary</p>
                <p className="font-body text-sm text-text/80 leading-relaxed">
                  Given a string, find the length of the longest substring that contains
                  no duplicate characters. The answer must be a contiguous run of characters -
                  not a subsequence.
                </p>
              </div>

              {/* Approach */}
              <div className="flex flex-col gap-1.5">
                <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Approach</p>
                <p className="font-body text-sm text-text/80 leading-relaxed">
                  Brute force would be two nested loops - for each starting index, build a
                  character frequency array and scan forward while all counts stay at 0 or 1,
                  updating the max as you go. That's O(n²) and wasteful. The moment the problem
                  is about a contiguous range with a running constraint, sliding window is the
                  instinct. Maintain a left and right pointer with a frequency array of size 256
                  (covering all ASCII characters). Start with left at 0, right at 1. As the right
                  pointer advances, if the incoming character already has a count of 1, shrink from
                  the left - increment left until the duplicate is evicted. Then let right carry on.
                  At every step update the max length.
                </p>
              </div>

              {/* The Insight */}
              <div className="border-l-2 border-accent pl-3">
                <p className="font-body text-sm text-accent italic leading-relaxed">
                  When a duplicate is found at the right pointer, you don't need to restart the
                  window from scratch - just walk the left pointer forward until that specific
                  character is removed, then carry on. The valid window never fully collapses;
                  it just trims from the left until it's clean again.
                </p>
              </div>

              {/* Code */}
              <div className="flex flex-col gap-1.5">
                <JavaSolutionLabel />
                <CodeBlock language="java" code={`class Solution {
    public int lengthOfLongestSubstring(String s) {
        if (s.length() == 0) return 0;

        int[] alphabets = new int[256];
        int left = 0, right = 1;
        alphabets[s.charAt(left)]++;
        int length = 1;

        while (right < s.length()) {
            if (alphabets[s.charAt(right)] == 1) {
                while (s.charAt(left) != s.charAt(right)) {
                    alphabets[s.charAt(left)]--;
                    left++;
                }
                alphabets[s.charAt(left)]--;
                left++;
            }
            alphabets[s.charAt(right)]++;
            length = Math.max(length, right - left + 1);
            right++;
        }

        return length;
    }
}`} />
              </div>

              {/* What I Learned */}
              <div className="flex flex-col gap-1.5">
                <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">What I Learned</p>
                <p className="font-body text-sm text-text/80 leading-relaxed">
                  Sliding window is the instinct the moment a problem involves a contiguous range
                  with a running constraint - once you see the pattern, it clicks fast. The 256-size
                  integer array is a clean alternative to a HashMap when the character set is bounded
                  ASCII - faster in practice, which shows in the 97.59% runtime. The inner while loop
                  evicting from the left is the core mechanical insight: you're not resetting the
                  window, you're trimming it.
                </p>
              </div>

              {/* Gotchas */}
              <div className="flex flex-col gap-1.5">
                <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Gotchas</p>
                <p className="font-body text-sm text-text/80 leading-relaxed">
                  Empty string needs an explicit early return, right = 1 would immediately be out
                  of bounds otherwise. The frequency array must be size 256 to cover all ASCII
                  characters (letters, digits, symbols, spaces) - not just 26. The inner while loop
                  stops at the duplicate character but doesn't remove it yet - the two lines after
                  the inner while handle that final eviction explicitly before right advances.
                </p>
              </div>

              <KofiPanel firstLine="Enjoyed the breakdown?" />
            </>
          ) :
            problem.solved && problem.id === 15 ? (
              <>
                {/* Problem Summary */}
                <div className="flex flex-col gap-1.5">
                  <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Problem Summary</p>
                  <p className="font-body text-sm text-text/80 leading-relaxed">
                    Given an array of stock prices by day, find the maximum profit from
                    a single buy-then-sell transaction. You must buy before you sell.
                  </p>
                </div>

                {/* Approach */}
                <div className="flex flex-col gap-1.5">
                  <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Approach</p>
                  <p className="font-body text-sm text-text/80 leading-relaxed">
                    My first instinct was to precompute a "max to the right" array - for
                    every index, store the best price I could sell at from that point
                    forward. It works, but it's O(n) extra space and you're computing the
                    best future price for every position, most of which you never actually
                    need. The shift came when I stopped asking "what's the best I can do
                    from this position?" and started asking "what's the cheapest I could
                    have bought before now?" Scanning left to right, tracking the minimum
                    price seen so far, and at each step computing prices[i] - minLeft -
                    that's all you need.
                  </p>
                </div>

                {/* The Insight */}
                <div className="border-l-2 border-accent pl-3">
                  <p className="font-body text-sm text-accent italic leading-relaxed">
                    You're not finding the optimal profit at every i - you're trusting
                    that at the one moment when i lands on the global maximum after the
                    global minimum, prices[i] - minLeft quietly delivers the true answer.
                    Every other step is just a throwaway comparison.
                  </p>
                </div>

                {/* Code */}
                <div className="flex flex-col gap-1.5">
                  <JavaSolutionLabel />
                  <CodeBlock language="java" code={`class Solution {
    public int maxProfit(int[] prices) {
        int maxProfit = 0;
        int minLeft = prices[0];

        for (int i = 0; i < prices.length; ++i) {
            maxProfit = Math.max(maxProfit, prices[i] - minLeft);
            minLeft = Math.min(minLeft, prices[i]);
        }

        return maxProfit;
    }
}`} />
                </div>

                {/* What I Learned */}
                <div className="flex flex-col gap-1.5">
                  <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">What I Learned</p>
                  <p className="font-body text-sm text-text/80 leading-relaxed">
                    The O(n) space → O(1) space reduction wasn't just an optimisation -
                    it came from a genuine reframe of the problem. The greedy framing
                    obscures what's really happening. The running-min framing is more
                    honest: most steps are throwaway comparisons, and one step quietly
                    delivers the answer. Recognising that looking left with a single
                    variable is equivalent to looking right with a full array is the
                    real lesson here.
                  </p>
                </div>

                {/* Gotchas */}
                <div className="flex flex-col gap-1.5">
                  <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Gotchas</p>
                  <p className="font-body text-sm text-text/80 leading-relaxed">
                    A strictly decreasing array like [7,6,4,3,1] should return 0, not
                    a negative - initialising maxProfit = 0 handles this automatically.
                    The update order matters conceptually: calculate profit first, then
                    update minLeft. Otherwise you risk comparing a price against itself
                    (harmless here since prices[i] - prices[i] == 0, but bad habit).
                    The first instinct of a max-right array is valid and worth knowing -
                    it's the same idea, just from the other direction, and costs O(n) space.
                  </p>
                </div>

                <KofiPanel firstLine="Enjoyed the breakdown?" />
              </>
            ) : problem.solved && problem.id === 14 ? (
              <>
                {/* Problem Summary */}
                <div className="flex flex-col gap-1.5">
                  <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Problem Summary</p>
                  <p className="font-body text-sm text-text/80 leading-relaxed">
                    Given an elevation map as an array of bar heights, calculate the
                    total volume of rainwater that gets trapped between the bars
                    after it rains.
                  </p>
                </div>

                  {/* Approach */}
                  <div className="flex flex-col gap-1.5">
                    <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Approach</p>
                    <p className="font-body text-sm text-text/80 leading-relaxed">
                      For each position, the water it can hold is determined by the shorter
                      of the tallest bar to its left and the tallest bar to its right, minus
                      the height of the bar itself. I precomputed two arrays - maxLeftHeight
                      and maxRightHeight - by scanning left-to-right and right-to-left
                      respectively, tracking the running maximum at each index. Then a final
                      pass combines them: water at i = min(maxLeft[i], maxRight[i]) - height[i],
                      summed across all positions.
                    </p>
                  </div>

                  {/* The Insight */}
                  <div className="border-l-2 border-accent pl-3">
                    <p className="font-body text-sm text-accent italic leading-relaxed">
                      Water at any column is bounded by the shorter surrounding wall -
                      you can't fill higher than the lowest escape route on either side.
                    </p>
                  </div>

                  {/* Code */}
                  <div className="flex flex-col gap-1.5">
                    <JavaSolutionLabel />
                    <CodeBlock language="java" code={`class Solution {
    public int trap(int[] height) {
        int max = 0;
        int hLength = height.length;
        int totalRainWater = 0;
        int[] maxLeftHeight = new int[hLength];
        int[] maxRightHeight = new int[hLength];
        for (int i = 0; i < hLength; ++i) {
            max = Math.max(max, height[i]);
            maxLeftHeight[i] = max;
        }
        max = 0;
        for (int i = hLength - 1; i > -1; --i) {
            max = Math.max(max, height[i]);
            maxRightHeight[i] = max;
        }
        for (int i = 0; i < hLength; ++i) {
            if (height[i] < maxLeftHeight[i] && height[i] < maxRightHeight[i]) {
                totalRainWater += Math.min(maxLeftHeight[i], maxRightHeight[i]) - height[i];
            }
        }
        return totalRainWater;
    }
}`} />
                  </div>

                  {/* What I Learned */}
                  <div className="flex flex-col gap-1.5">
                    <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">What I Learned</p>
                    <p className="font-body text-sm text-text/80 leading-relaxed">
                      The "precompute prefix/suffix max" pattern appears often in array
                      problems where each position needs context from both sides. It converts
                      what feels like an O(n²) scan into three clean O(n) passes. The
                      two-pointer variant achieves O(1) space by maintaining running maxes
                      on the fly, but this array version is easier to reason about initially.
                    </p>
                  </div>

                  {/* Gotchas */}
                  <div className="flex flex-col gap-1.5">
                    <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Gotchas</p>
                    <p className="font-body text-sm text-text/80 leading-relaxed">
                      The guard condition (height[i] &lt; both maxes) is technically redundant -
                      when height[i] equals its surrounding max, min(maxLeft, maxRight) - height[i]
                      = 0 anyway - but it makes intent clear. maxLeftHeight[i] and maxRightHeight[i]
                      always include the current bar itself, so the subtraction can never go
                      negative. The two-pointer O(1) space optimisation is worth knowing for
                      follow-up questions: whichever side has the smaller running max is the
                      constraining wall, so you can process that side and advance inward.
                    </p>
                  </div>

                  <KofiPanel firstLine="Enjoyed the breakdown?" />
                </>
              ) : problem.solved && problem.id === 13 ? (
                <>
                  {/* Problem Summary */}
                  <div className="flex flex-col gap-1.5">
                    <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Problem Summary</p>
                    <p className="font-body text-sm text-text/80 leading-relaxed">
                      Given an array of line heights, find the two lines that form a
                      container holding the most water. Area is determined by the shorter
                      line × the distance between them.
                    </p>
                  </div>

                    {/* Approach */}
                    <div className="flex flex-col gap-1.5">
                      <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Approach</p>
                      <p className="font-body text-sm text-text/80 leading-relaxed">
                        Start with pointers at both ends to maximise width. At each step,
                        compute the current area and update the max. Then move the pointer
                        on the shorter side inward - the shorter line is the bottleneck, so
                        there's no point keeping it while width is shrinking. Repeat until
                        the pointers meet.
                      </p>
                    </div>

                    {/* The Insight */}
                    <div className="border-l-2 border-accent pl-3">
                      <p className="font-body text-sm text-accent italic leading-relaxed">
                        Always move the shorter pointer - moving the taller one can never
                        increase area, because width shrinks and height is still capped by
                        the shorter side anyway.
                      </p>
                    </div>

                    {/* Code */}
                    <div className="flex flex-col gap-1.5">
                      <JavaSolutionLabel />
                      <CodeBlock language="java" code={`class Solution {
    public int maxArea(int[] height) {
        int left = 0;
        int right = height.length - 1;
        int maxWater = 0;
        while (left < right) {
            maxWater = Math.max(maxWater, (right - left) * Math.min(height[left], height[right]));
            if (height[left] < height[right])
                left++;
            else
                right--;
        }
        return maxWater;
    }
}`} />
                    </div>

                    {/* What I Learned */}
                    <div className="flex flex-col gap-1.5">
                      <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">What I Learned</p>
                      <p className="font-body text-sm text-text/80 leading-relaxed">
                        The greedy argument is worth sitting with: starting wide and contracting
                        inward is provably correct because any inner pair with the same short
                        side will have strictly less area (same height cap, smaller width).
                        Recognising that pattern - "one variable strictly worsens, so greedily
                        eliminate it" - recurs across many two-pointer problems.
                      </p>
                    </div>

                    {/* Gotchas */}
                    <div className="flex flex-col gap-1.5">
                      <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Gotchas</p>
                      <p className="font-body text-sm text-text/80 leading-relaxed">
                        When both heights are equal it doesn't matter which pointer moves -
                        the else branch handles it fine since moving either is valid. The
                        temptation is to add skipping optimisations (advance past shorter
                        lines), but the plain version is already O(n) and the simpler code
                        is easier to reason about correctly.
                      </p>
                    </div>

                    <KofiPanel firstLine="Enjoyed the breakdown?" />
                  </>
                ) : problem.solved && problem.id === 12 ? (
                  <>
                    {/* Problem Summary */}
                    <div className="flex flex-col gap-1.5">
                      <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Problem Summary</p>
                      <p className="font-body text-sm text-text/80 leading-relaxed">
                        Given an integer array, find all unique triplets that sum to zero.
                        The result must not contain duplicate triplets.
                      </p>
                    </div>

                      {/* Approach */}
                      <div className="flex flex-col gap-1.5">
                        <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Approach</p>
                        <p className="font-body text-sm text-text/80 leading-relaxed">
                          Sort the array first - this is the key enabler for everything else.
                          Iterate through each element as the fixed anchor of the triplet, then
                          use a classic two-pointer sweep on the remaining subarray to find pairs
                          that sum to the negative of the anchor. Skip duplicate anchors with an
                          early continue, and after finding a valid triplet, skip over duplicate
                          left/right values before advancing the pointers to avoid duplicate
                          results in the output.
                        </p>
                      </div>

                      {/* The Insight */}
                      <div className="border-l-2 border-accent pl-3">
                        <p className="font-body text-sm text-accent italic leading-relaxed">
                          Sorting reduces the problem to a two-pointer scan per anchor, turning
                          what looks like an O(n³) brute-force into O(n²) with clean duplicate
                          elimination.
                        </p>
                      </div>

                      {/* Code */}
                      <div className="flex flex-col gap-1.5">
                        <JavaSolutionLabel />
                        <CodeBlock language="java" code={`class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        Arrays.sort(nums);
        for (int i = 0; i < nums.length; ++i) {
            if (nums[i] > 0) break;
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int left = i + 1;
            int right = nums.length - 1;
            while (left < right) {
                if (nums[i] + nums[left] + nums[right] == 0) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (right > left && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (nums[i] + nums[left] + nums[right] < 0) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        return result;
    }
}`} />
                      </div>

                      {/* What I Learned */}
                      <div className="flex flex-col gap-1.5">
                        <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">What I Learned</p>
                        <p className="font-body text-sm text-text/80 leading-relaxed">
                          The sort-then-two-pointer pattern is the canonical approach for k-sum
                          problems. Once you have it for 3Sum, 4Sum just wraps it in another loop.
                          The deduplication logic - skipping equal neighbours for both the anchor
                          and the two pointers - is the fiddly part worth internalising.
                        </p>
                      </div>

                      {/* Gotchas */}
                      <div className="flex flex-col gap-1.5">
                        <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Gotchas</p>
                        <p className="font-body text-sm text-text/80 leading-relaxed">
                          The if (nums[i] &gt; 0) break early exit only works because the array
                          is sorted - don't add that optimisation before the sort. Duplicate
                          skipping for the inner pointers must happen before the final left++;
                          right--, not after, otherwise you step past the duplicates and then
                          step one more time. The duplicate-skip while loops use
                          nums[left] == nums[left+1] not nums[left] == nums[i] - make sure
                          the indices are right.
                        </p>
                      </div>

                      <KofiPanel firstLine="Enjoyed the breakdown?" />
                    </>
                  ) : problem.solved && problem.id === 11 ? (
                    <>
                      {/* Problem Summary */}
                      <div className="flex flex-col gap-1.5">
                        <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Problem Summary</p>
                        <p className="font-body text-sm text-text/80 leading-relaxed">
                          Given a sorted array, find two numbers that add up to a target
                          and return their 1-indexed positions. Must use constant extra space.
                        </p>
                      </div>

                        {/* Approach */}
                        <div className="flex flex-col gap-1.5">
                          <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Approach</p>
                          <p className="font-body text-sm text-text/80 leading-relaxed">
                            Constant space ruled out a HashMap, and the sorted order was a strong
                            hint. I considered sliding window but wasn't sure which pointer to move
                            when the sum was off. Two pointers felt more natural - lowest values on
                            the left, highest on the right. Sum both ends: if the sum is less than
                            target move the left pointer right to increase it, if more move the right
                            pointer left to decrease it. At any point you're making the most informed
                            move possible - either getting closer to the target from below or above.
                            Since a solution is guaranteed to exist, the pointers will always meet it
                            before crossing.
                          </p>
                        </div>

                        {/* The Insight */}
                        <div className="border-l-2 border-accent pl-3">
                          <p className="font-body text-sm text-accent italic leading-relaxed">
                            By moving only the pointer that pushes the sum towards the target,
                            you're always making progress - never moving away from the answer.
                          </p>
                        </div>

                        {/* Code */}
                        <div className="flex flex-col gap-1.5">
                          <JavaSolutionLabel />
                          <CodeBlock language="java" code={`class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int left = 0, right = numbers.length-1;
        while(left < right) {
            if(numbers[left] + numbers[right] == target) return new int[]{left+1, right+1};
            if(numbers[left] + numbers[right] < target) left++;
            else right--;
        }
        return new int[]{};
    }
}`} />
                        </div>

                        {/* What I Learned */}
                        <div className="flex flex-col gap-1.5">
                          <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">What I Learned</p>
                          <p className="font-body text-sm text-text/80 leading-relaxed">
                            A sorted array gives you directional certainty - you know exactly
                            which way to move to get closer to your target, which is what makes
                            two pointers so clean here compared to the HashMap approach in the
                            unsorted version.
                          </p>
                        </div>

                        {/* Gotchas */}
                        <div className="flex flex-col gap-1.5">
                          <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Gotchas</p>
                          <p className="font-body text-sm text-text/80 leading-relaxed">
                            The problem guarantees exactly one solution, so the empty array return
                            at the end is just a compiler formality - the loop will always find
                            the answer. Return indices are 1-indexed, so both left and right
                            get +1 before returning.
                          </p>
                        </div>

                        <KofiPanel firstLine="Enjoyed the breakdown?" />
                      </>
                    ) : problem.solved && problem.id === 10 ? (
                      <>
                        {/* Problem Summary */}
                        <div className="flex flex-col gap-1.5">
                          <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Problem Summary</p>
                          <p className="font-body text-sm text-text/80 leading-relaxed">
                            Given a string, return true if it is a palindrome after converting
                            to lowercase and removing all non-alphanumeric characters.
                          </p>
                        </div>

                          {/* Approach */}
                          <div className="flex flex-col gap-1.5">
                            <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Approach</p>
                            <p className="font-body text-sm text-text/80 leading-relaxed">
                              My first instinct was to build a filtered char array by checking
                              ASCII ranges, then use two pointers to compare. A cleaner variation
                      was to build a filtered string and use a reverse method to compare -
                              but both approaches involve creating new data structures. I wanted to
                      avoid that entirely. Thinking about what a palindrome actually is -
                      equal when read from both sides - I realised I just needed two pointers
                              moving inward, skipping non-alphanumeric characters on the fly using
                              isLetterOrDigit. At each valid pair, convert both characters to lowercase
                              and compare. If they don't match, return false immediately for early exit.
                              If the pointers cross without a mismatch, it's a palindrome.
                            </p>
                          </div>

                          {/* The Insight */}
                          <div className="border-l-2 border-accent pl-3">
                            <p className="font-body text-sm text-accent italic leading-relaxed">
                              Once you visualise stripping non-essential characters as just skipping
                              them with a pointer rather than removing them, the whole solution becomes
                              a clean inward walk with no extra space needed.
                            </p>
                          </div>

                          {/* Code */}
                          <div className="flex flex-col gap-1.5">
                    <JavaSolutionLabel />
                            <CodeBlock language="java" code={`class Solution {
    public boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        while(left <= right) {
            while(left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
            while(right > left && !Character.isLetterOrDigit(s.charAt(right))) right--;
            if(Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) return false;
            left++;
            right--;
        }
        return true;
    }
}`} />
                          </div>

                          {/* What I Learned */}
                          <div className="flex flex-col gap-1.5">
                            <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">What I Learned</p>
                            <p className="font-body text-sm text-text/80 leading-relaxed">
                              Working with both char primitives and the Character wrapper class in
                      Java requires staying in sync - isLetterOrDigit and toLowerCase live
                              on Character, not on char directly. Also a good reminder that skipping
                              unwanted elements with a pointer is often cleaner than filtering them
                              out upfront.
                            </p>
                          </div>

                          {/* Gotchas */}
                          <div className="flex flex-col gap-1.5">
                            <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Gotchas</p>
                            <p className="font-body text-sm text-text/80 leading-relaxed">
                      Character.toLowerCase works safely on digits and symbols too - it just
                              returns them unchanged, so no need to guard against non-letter characters
                              before calling it. The inner while loops use left &lt; right not
                              left &lt;= right to avoid the pointers crossing inside the skip loop
                              before the comparison happens.
                            </p>
                          </div>

                          <KofiPanel firstLine="Enjoyed the breakdown?" />
                        </>
                                      ) : problem.solved ? (
                                        <>
                                          <p className="font-body text-sm text-text/80 leading-relaxed">
                                            You've solved this one. Notes and write-up coming soon.
                                          </p>
                                          <div className="bg-surface border border-border rounded-xl p-4">
                                            <p className="font-body text-xs text-faint italic">
                                              Solution notes will be added here as the blog evolves.
                                            </p>
                                          </div>
                                          <KofiPanel firstLine="Enjoyed the breakdown?" />
                                        </>
                                      ) : getProblemStatus(problem) === "unlocked" ? (
                                        <>
                                          <p className="font-body text-sm text-text/80 leading-relaxed">
                                            Unlocked and on my list. I'll be solving this one in Python.
                                            The write-up lands here once it's done.
                                          </p>
                                        </>
                                      ) : (
                                        <>
                                          <p className="font-body text-sm text-muted/60 italic leading-relaxed">
                                            {LOCKED_TOAST_TEXT}
                                          </p>
                                        </>
            )
        }
      </div>
    </div>
  );
}

// ─── Mobile helpers ───────────────────────────────────────────────────────────

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

type SheetState = "peek" | "half" | "full";
const PEEK_H = 84;

interface MobileBottomSheetProps {
  sheetState: SheetState;
  setSheetState: (s: SheetState) => void;
  topicGroups: NeetCodeTopic[];
  totalSolved: number;
  totalUnlocked: number;
  expandedTopic: string | null;
  onTopicToggle: (topic: string) => void;
  onOpenProblemSelect: (p: NeetCodeProblem) => void;
  onLockedProblemSelect: () => void;
}

function MobileBottomSheet({
  sheetState,
  setSheetState,
  topicGroups,
  totalSolved,
  totalUnlocked,
  expandedTopic,
  onTopicToggle,
  onOpenProblemSelect,
  onLockedProblemSelect,
}: MobileBottomSheetProps) {
  const startY = useRef(0);
  const startH = useRef(0);
  const dragging = useRef(false);
  const [dragH, setDragH] = useState<number | null>(null);

  function resolveH(state: SheetState): number {
    const vh = window.innerHeight;
    if (state === "peek") return PEEK_H;
    if (state === "half") return vh * 0.5;
    return vh * 0.9;
  }

  function snap(h: number): SheetState {
    const vh = window.innerHeight;
    if (h < (PEEK_H + vh * 0.5) / 2) return "peek";
    if (h < (vh * 0.5 + vh * 0.9) / 2) return "half";
    return "full";
  }

  function onTouchStart(e: React.TouchEvent) {
    startY.current = e.touches[0].clientY;
    startH.current = resolveH(sheetState);
    dragging.current = true;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!dragging.current) return;
    const delta = startY.current - e.touches[0].clientY;
    const vh = window.innerHeight;
    setDragH(Math.max(PEEK_H, Math.min(vh * 0.9, startH.current + delta)));
  }

  function onTouchEnd() {
    if (dragH !== null) {
      setSheetState(snap(dragH));
      setDragH(null);
    }
    dragging.current = false;
  }

  const h = dragH ?? resolveH(sheetState);
  const showPullHint = sheetState === "peek" && dragH === null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 bg-surface border-t border-border rounded-t-2xl overflow-hidden"
      style={{
        height: `${h}px`,
        transition: dragH !== null ? "none" : "height 300ms ease-out",
      }}
    >
      {/* Drag handle + peek strip */}
      <div
        className={[
          "flex flex-col items-center pb-2 cursor-grab active:cursor-grabbing select-none",
          showPullHint ? "pt-2" : "pt-3",
        ].join(" ")}
        style={{ height: `${PEEK_H}px` }}
        role="button"
        tabIndex={0}
        aria-expanded={sheetState !== "peek"}
        aria-label="Show the full problem list"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => {
          if (sheetState === "peek") setSheetState("half");
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (sheetState === "peek") setSheetState("half");
          }
        }}
      >
        {showPullHint ? (
          <>
            <PullUpChevrons />
            <p className="font-body text-[11px] leading-tight text-muted mt-0.5 mb-1">
              Pull up for the full list
            </p>
          </>
        ) : (
          <div className="w-10 h-1 bg-border rounded-full mb-2" />
        )}
        <p className="font-body text-xs text-muted">
          {totalSolved}/150 solved · {totalUnlocked} unlocked · {topicGroups.length} topics
        </p>
        <StatusLegend className="mt-0.5" />
      </div>

      {/* Accordion list */}
      <div
        className={[
          "overflow-y-auto",
          "[&::-webkit-scrollbar]:w-1",
          "[&::-webkit-scrollbar-thumb]:bg-border",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
        ].join(" ")}
        style={{ height: `calc(100% - ${PEEK_H}px)` }}
      >
        {topicGroups.map((group) => {
          const isOpen = expandedTopic === group.name;
          const solved = group.problems.filter((p) => p.solved).length;

          return (
            <div key={group.name}>
              <button
                className={[
                  "w-full flex items-center px-4 py-3 border-b border-border/40 text-left",
                  "transition-colors duration-150",
                  solved > 0 ? "bg-green-500/5" : "",
                ].join(" ")}
                onClick={() => onTopicToggle(group.name)}
              >
                <span className="font-body text-sm text-text">
                  {group.name}
                </span>
                <span className="font-body text-xs text-faint ml-auto mr-3">
                  {solved}/{group.problems.length}
                </span>
                <span className="font-body text-xs text-faint">
                  {isOpen ? "∨" : "›"}
                </span>
              </button>

              {isOpen && (
                <div>
                  {group.problems.map((problem) => {
                    const status = getProblemStatus(problem);
                    return (
                    <button
                      key={problem.id}
                      className={[
                        "w-full flex items-center gap-3 px-6 py-2.5 border-b border-border/20 text-left",
                        "transition-colors duration-150",
                        looksLocked(status) ? "opacity-40" : "hover:bg-white/4",
                      ].join(" ")}
                      onClick={() => {
                        if (status === "locked") {
                          onLockedProblemSelect();
                        } else {
                          onOpenProblemSelect(problem);
                        }
                      }}
                    >
                      {status === "unlocked" ? (
                        <OpenLockIcon />
                      ) : status === "solved" ? (
                        <svg
                          className="w-3.5 h-3.5 shrink-0 text-green-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <span className="text-xs shrink-0">🔒</span>
                      )}
                      <span
                        className={[
                          "font-body text-sm",
                          status === "solved"
                            ? "text-muted"
                            : status === "unlocked"
                              ? "text-text"
                              : "text-muted/50",
                        ].join(" ")}
                      >
                        {problem.title}
                      </span>
                      <span
                        className={[
                          "ml-auto shrink-0 font-body text-[10px] px-1.5 py-0.5 rounded-full border",
                          DIFF_BG[problem.difficulty],
                        ].join(" ")}
                      >
                        {problem.difficulty[0]}
                      </span>
                    </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const NAV_H = 64;
const TOPBAR_H = 48;
const PANEL_H = `calc(100vh - ${NAV_H + TOPBAR_H}px)`;

const SCROLLBAR_CLASSES = [
  "[&::-webkit-scrollbar]:w-1.5",
  "[&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:bg-border",
  "[&::-webkit-scrollbar-thumb]:rounded-full",
  "[&::-webkit-scrollbar-thumb:hover]:bg-accent/40",
].join(" ");

function NeetCodeMap() {
  const navigate = useNavigate();
  const blogState = useFromHomeState();
  const { slug } = useParams<{ slug?: string }>();

  const isMobile = useIsMobile();

  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [childrenVisible, setChildrenVisible] = useState(false);
  const [selectedProblem, setSelectedProblem] =
    useState<NeetCodeProblem | null>(null);
  const [lockedToast, setLockedToast] = useState(false);
  const [sheetState, setSheetState] = useState<SheetState>("peek");
  const listRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mobile pan/zoom
  const [mapXform, setMapXformState] = useState({ scale: 1, tx: 0, ty: 0 });
  const [isGesturing, setIsGesturing] = useState(false);
  const mapXformRef = useRef({ scale: 1, tx: 0, ty: 0 });
  const pinchRef = useRef<{
    dist: number;
    scale: number;
    cx: number;
    cy: number;
    initTx: number;
    initTy: number;
  } | null>(null);
  const panRef = useRef<{
    startX: number;
    startY: number;
    initTx: number;
    initTy: number;
  } | null>(null);
  const lastTapRef = useRef<number>(0);

  const topicGroups = getTopicGroups();
  const totalSolved = getSolvedCount();
  const totalUnlocked = getUnlockedCount();
  const totalPct = Math.round((totalSolved / 150) * 100);

  // Auto-open problem from URL slug on load
  useEffect(() => {
    if (!slug) return;
    const problem = neetcodeProblems.find(
      (p) => p.slug === slug && getProblemStatus(p) !== "locked",
    );
    if (!problem) return;
    setSelectedProblem(problem);
    setExpandedTopic(problem.topic);
  }, [slug]);

  // Trigger child-node expand animation one frame after topic is set
  useEffect(() => {
    if (expandedTopic) {
      const id = setTimeout(() => setChildrenVisible(true), 20);
      return () => clearTimeout(id);
    } else {
      setChildrenVisible(false);
    }
  }, [expandedTopic]);

  function showLockedToast() {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setLockedToast(true);
    toastTimer.current = setTimeout(() => setLockedToast(false), 5000);
  }

  // ── Mobile pan/zoom helpers ──
  function setMapXform(t: { scale: number; tx: number; ty: number }) {
    mapXformRef.current = t;
    setMapXformState(t);
  }

  function getTouchDist(touches: React.TouchList): number {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function onMapTouchStart(e: React.TouchEvent) {
    const curr = mapXformRef.current;
    setIsGesturing(true);
    if (e.touches.length === 2) {
      const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      pinchRef.current = {
        dist: getTouchDist(e.touches),
        scale: curr.scale,
        cx,
        cy,
        initTx: curr.tx,
        initTy: curr.ty,
      };
      panRef.current = null;
    } else if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        setMapXform({ scale: 1, tx: 0, ty: 0 });
        lastTapRef.current = 0;
        setIsGesturing(false);
        return;
      }
      lastTapRef.current = now;
      panRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        initTx: curr.tx,
        initTy: curr.ty,
      };
      pinchRef.current = null;
    }
  }

  function onMapTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2 && pinchRef.current) {
      const { dist: d0, scale: s0, cx, cy, initTx, initTy } = pinchRef.current;
      const d1 = getTouchDist(e.touches);
      const ns = Math.min(3, Math.max(0.5, (s0 * d1) / d0));
      setMapXform({
        scale: ns,
        tx: cx - ((cx - initTx) * ns) / s0,
        ty: cy - ((cy - initTy) * ns) / s0,
      });
    } else if (e.touches.length === 1 && panRef.current) {
      const { startX, startY, initTx, initTy } = panRef.current;
      setMapXform({
        scale: mapXformRef.current.scale,
        tx: initTx + e.touches[0].clientX - startX,
        ty: initTy + e.touches[0].clientY - startY,
      });
    }
  }

  function onMapTouchEnd() {
    setIsGesturing(false);
    pinchRef.current = null;
    panRef.current = null;
  }

  function handleTopicClick(topic: string) {
    if (expandedTopic === topic) {
      setExpandedTopic(null);
      setSelectedProblem(null);
      navigate("/blog/neetcode", { state: blogState });
    } else {
      setChildrenVisible(false);
      setExpandedTopic(topic);
      setSelectedProblem(null);
      navigate("/blog/neetcode", { state: blogState });
      requestAnimationFrame(() => {
        listRef.current
          ?.querySelector(`[data-topic="${topic}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function handleProblemClickOnMap(p: NeetCodeProblem) {
    if (getProblemStatus(p) === "locked") {
      setSelectedProblem(null);
      navigate("/blog/neetcode", { state: blogState });
      showLockedToast();
      return;
    }
    setSelectedProblem(p);
    navigate(`/blog/neetcode/${p.slug}`, { state: blogState });
    if (isMobile) {
      setSheetState("peek");
    } else {
      requestAnimationFrame(() => {
        listRef.current
          ?.querySelector(`[data-problem="${p.id}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }
  }

  function selectFromList(p: NeetCodeProblem) {
    if (getProblemStatus(p) === "locked") {
      setSelectedProblem(null);
      navigate("/blog/neetcode", { state: blogState });
      showLockedToast();
      return;
    }
    setSelectedProblem(p);
    navigate(`/blog/neetcode/${p.slug}`, { state: blogState });
    if (expandedTopic !== p.topic) {
      setChildrenVisible(false);
      setExpandedTopic(p.topic);
    }
  }

  function selectFromAccordion(p: NeetCodeProblem) {
    if (getProblemStatus(p) === "locked") {
      showLockedToast();
      return;
    }
    setSelectedProblem(p);
    navigate(`/blog/neetcode/${p.slug}`, { state: blogState });
    setSheetState("peek");
    if (expandedTopic !== p.topic) {
      setChildrenVisible(false);
      setExpandedTopic(p.topic);
    }
  }

  function closeProblem() {
    setSelectedProblem(null);
    navigate("/blog/neetcode", { state: blogState });
    if (isMobile) setSheetState("half");
  }

  // Shared toast (responsive positioning)
  const toastJSX = (
    <div
      className={[
        "fixed z-50 flex items-center gap-3",
        isMobile ? "left-1/2 -translate-x-1/2" : "left-[62%] -translate-x-1/2",
        "bg-surface border border-border rounded-xl px-5 py-3 shadow-glow",
        "transition-all duration-300 ease-in-out",
        lockedToast
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none",
      ].join(" ")}
      style={{ top: `${NAV_H + TOPBAR_H + 16}px` }}
      role="status"
      aria-live="polite"
    >
      <span className="font-body text-sm text-text">
        {LOCKED_TOAST_TEXT}
      </span>
      <button
        onClick={() => setLockedToast(false)}
        className="shrink-0 p-1 rounded-lg hover:bg-white/8 text-muted hover:text-text transition-colors duration-150"
        aria-label="Dismiss"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );

  // Shared top bar
  const topBarJSX = (
    <div
      className="border-b border-border bg-surface/70 backdrop-blur-md px-6 flex items-center justify-between gap-6 shrink-0"
      style={{ height: `${TOPBAR_H}px` }}
    >
      <div className="flex items-center gap-4">
        <BlogBackLink
          label="← Blog"
          className="inline-flex items-center gap-1.5 font-body text-xs text-muted hover:text-accent transition-colors duration-200"
        />
        <div className="h-4 w-px bg-border" />
        <span className="font-display font-bold text-sm text-text">
          NeetCode 150
        </span>
        <span className="font-body text-xs text-faint hidden sm:inline">
          {totalSolved}/150 solved · {totalUnlocked} unlocked
        </span>
      </div>
      <div className="flex items-center gap-3 flex-1 max-w-xs">
        <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-700"
            style={{ width: `${totalPct}%` }}
          />
        </div>
        <span className="font-body text-[10px] text-faint shrink-0">
          {totalPct}%
        </span>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: `${NAV_H}px` }}>
      <PythonSwitchNotice />
      {toastJSX}
      {topBarJSX}

      {isMobile ? (
        /* ── Mobile layout ─────────────────────────────────────── */
        <div style={{ height: `calc(100vh - ${NAV_H + TOPBAR_H}px)` }}>
          {/* SVG map - full area minus peek strip, with pinch-to-zoom and pan */}
          <div
            className="overflow-hidden"
            style={{
              height: `calc(100vh - ${NAV_H + TOPBAR_H + PEEK_H}px)`,
              touchAction: "none",
            }}
            onTouchStart={onMapTouchStart}
            onTouchMove={onMapTouchMove}
            onTouchEnd={onMapTouchEnd}
          >
            <div
              style={{
                transform: `translate(${mapXform.tx}px, ${mapXform.ty}px) scale(${mapXform.scale})`,
                transformOrigin: "0 0",
                transition: isGesturing ? "none" : "transform 200ms ease-out",
                willChange: "transform",
              }}
            >
              <SVGMap
                expandedTopic={expandedTopic}
                childrenVisible={childrenVisible}
                selectedProblemId={selectedProblem?.id ?? null}
                onTopicClick={handleTopicClick}
                onProblemClick={handleProblemClickOnMap}
              />
            </div>
          </div>

          {/* Mobile detail panel - slides up from bottom */}
          <div
            className={`fixed inset-x-0 z-30 bg-bg overflow-y-auto ${SCROLLBAR_CLASSES}`}
            style={{
              top: `${NAV_H + TOPBAR_H}px`,
              bottom: `${PEEK_H}px`,
              transform: selectedProblem ? "translateY(0)" : "translateY(100%)",
              transition: "transform 300ms ease-out",
            }}
          >
            {selectedProblem && (
              <div className="p-6 max-w-2xl mx-auto">
                <button
                  onClick={closeProblem}
                  className="inline-flex items-center gap-1.5 font-body text-sm text-muted hover:text-accent transition-colors duration-200 mb-6"
                >
                  ← Back
                </button>
                <DetailPanel problem={selectedProblem} onClose={closeProblem} />
              </div>
            )}
          </div>

          {/* Bottom sheet */}
          <MobileBottomSheet
            sheetState={sheetState}
            setSheetState={setSheetState}
            topicGroups={topicGroups}
            totalSolved={totalSolved}
            totalUnlocked={totalUnlocked}
            expandedTopic={expandedTopic}
            onTopicToggle={handleTopicClick}
            onOpenProblemSelect={selectFromAccordion}
            onLockedProblemSelect={showLockedToast}
          />
        </div>
      ) : (
        /* ── Desktop layout ─────────────────────────────────────── */
        <div className="flex" style={{ height: PANEL_H }}>
          {/* Left: problem list */}
          <aside
            className={`shrink-0 border-r border-border overflow-y-auto ${SCROLLBAR_CLASSES}`}
              style={{
                width: "28%",
                minWidth: "220px",
                maxWidth: "320px",
                height: PANEL_H,
              }}
          >
            <div ref={listRef} className="p-4">
              <StatusLegend className="px-1 mb-4" />
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
                          <span className="text-text/80 font-medium">
                            {expandedTopic}
                          </span>
                          {" - click a problem node to view it"}
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
      )}

      {selectedProblem?.solved && <ThoughtButton />}
    </div>
  );
}

export default NeetCodeMap;
