import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import KofiPanel from "../components/ui/KofiPanel";
import {
  neetcodeProblems,
  getTopicGroups,
  getSolvedCount,
  type NeetCodeProblem,
  type NeetCodeTopic,
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
        !problem.solved ? "opacity-40" : "",
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
      {problem.solved ? (
        <svg className="w-3.5 h-3.5 shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
                opacity:         childrenVisible ? (problem.solved ? 1 : 0.45) : 0,
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
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="h-px bg-border mb-6" />

      <div className="flex flex-col gap-5">
        {problem.solved && problem.id === 3 ? (
          <>
            {/* Problem Summary */}
            <div className="flex flex-col gap-1.5">
              <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Problem Summary</p>
              <p className="font-body text-sm text-text/80 leading-relaxed">
                Given an array of integers and a target, return the indices of the two
                numbers that add up to the target. Exactly one valid pair is guaranteed.
              </p>
            </div>

            {/* Approach */}
            <div className="flex flex-col gap-1.5">
              <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Approach</p>
              <p className="font-body text-sm text-text/80 leading-relaxed">
                The brute force is obvious — for each number, scan the rest of the array
                for its partner. That's O(n²). The smarter move comes from rearranging
                num1 + num2 = target into num1 = target - num2. So for every number I
                look at, I already know exactly what its partner needs to be. I need a
                data structure that can answer "have I seen this value before, and what
                was its index?" in O(1) — that's a HashMap with the number as key and
                its index as value. As I iterate, I check if target - current number
                already exists in the map. If it does, I've found the pair and return
                both indices immediately. If not, I store the current number and its
                index for future iterations.
              </p>
            </div>

            {/* The Insight */}
            <div className="border-l-2 border-accent pl-3">
              <p className="font-body text-sm text-accent italic leading-relaxed">
                Rearranging num1 + num2 = target tells you exactly what you're looking
                for at every step — HashMap then lets you check for it in O(1), turning
                a search problem into a lookup problem.
              </p>
            </div>

            {/* Code */}
            <div className="flex flex-col gap-1.5">
              <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Solution — Java</p>
              <pre className="bg-surface-2 border border-border rounded-xl p-4 font-mono text-xs text-text overflow-x-auto leading-relaxed">{`class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> numsIndices = new HashMap<>();
        for(int i=0; i<nums.length; ++i) {
            if(numsIndices.containsKey(target-nums[i])) {
                return new int[] {numsIndices.get(target-nums[i]), i};
            }
            else {
                numsIndices.put(nums[i], i);
            }
        }
        return new int[] {};
    }
}`}</pre>
            </div>

            {/* What I Learned */}
            <div className="flex flex-col gap-1.5">
              <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">What I Learned</p>
              <p className="font-body text-sm text-text/80 leading-relaxed">
                When you need both a value and its index, HashMap is the tool — HashSet
                won't cut it. Also, algebraic rearrangement (num1 = target - num2) is a
                recurring trick that converts "find a pair" problems into single-pass lookups.
              </p>
            </div>

            {/* Gotchas */}
            <div className="flex flex-col gap-1.5">
              <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Gotchas</p>
              <p className="font-body text-sm text-text/80 leading-relaxed">
                Inserting after checking (not before) is crucial — it prevents a number
                from matching with itself when the same index appears twice in the array.
                The problem guarantees exactly one solution, so the empty array return at
                the end is just a compiler formality.
              </p>
            </div>

            <KofiPanel firstLine="Enjoyed the breakdown?" />
          </>
        ) : problem.solved && problem.id === 2 ? (
          <>
            {/* Problem Summary */}
            <div className="flex flex-col gap-1.5">
              <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Problem Summary</p>
              <p className="font-body text-sm text-text/80 leading-relaxed">
                Given two strings, return true if they are anagrams of each other — meaning
                both strings contain the same characters with the same frequencies.
              </p>
            </div>

            {/* Approach */}
            <div className="flex flex-col gap-1.5">
              <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Approach</p>
              <p className="font-body text-sm text-text/80 leading-relaxed">
                Two strings are anagrams when their character counts match exactly. My first
                thought was two HashMaps — one per string — but comparing them felt tedious
                since HashMaps don't preserve order and the code got long. The problem
                constraints mentioned lowercase letters only, so just 26 possible characters.
                That meant I could use a fixed-size int array of 26 instead. I iterate both
                strings simultaneously: for each index I increment the counter for the
                character in s and decrement for the character in t. If the strings are true
                anagrams, every slot cancels out to zero. A final pass checks for any
                non-zero value — if found, the counts were unbalanced and it's not an anagram.
              </p>
            </div>

            {/* The Insight */}
            <div className="border-l-2 border-accent pl-3">
              <p className="font-body text-sm text-accent italic leading-relaxed">
                Imagine writing out all letters of s, then crossing them off one by one as
                you read t — a true anagram leaves nothing uncrossed. The +1/-1 counter
                array mimics exactly that striking-off process.
              </p>
            </div>

            {/* Code */}
            <div className="flex flex-col gap-1.5">
              <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Solution — Java</p>
              <pre className="bg-surface-2 border border-border rounded-xl p-4 font-mono text-xs text-text overflow-x-auto leading-relaxed">{`class Solution {
    public boolean isAnagram(String s, String t) {
        if(s.length() != t.length())
            return false;
        int[] counter = new int[26];
        for(int i=0; i<s.length(); ++i){
            counter[s.charAt(i)-'a']++;
            counter[t.charAt(i)-'a']--;
        }
        for(int val: counter)
            if(val!=0)
                return false;
        return true;
    }
}`}</pre>
            </div>

            {/* What I Learned */}
            <div className="flex flex-col gap-1.5">
              <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">What I Learned</p>
              <p className="font-body text-sm text-text/80 leading-relaxed">
                When the input is constrained to a known alphabet (e.g. 26 lowercase
                letters), a fixed-size count array is cleaner and faster than a HashMap —
                O(1) space effectively, no hashing overhead.
              </p>
            </div>

            {/* Gotchas */}
            <div className="flex flex-col gap-1.5">
              <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Gotchas</p>
              <p className="font-body text-sm text-text/80 leading-relaxed">
                The early length check is a smart short-circuit — different lengths can
                never be anagrams, no need to even build the counter. Making it work for
                mixed characters or Unicode is straightforward — resize the array to cover
                the full character range and replace the 'a' offset with the actual char
                value to calculate the index. Same logic, wider alphabet.
              </p>
            </div>

            <KofiPanel firstLine="Enjoyed the breakdown?" />
          </>
        ) : problem.solved && problem.id === 1 ? (
          <>
            {/* Problem Summary */}
            <div className="flex flex-col gap-1.5">
              <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Problem Summary</p>
              <p className="font-body text-sm text-text/80 leading-relaxed">
                Given an integer array, return true if any value appears at least twice,
                and false if every element is distinct.
              </p>
            </div>

            {/* Approach */}
            <div className="flex flex-col gap-1.5">
              <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Approach</p>
              <p className="font-body text-sm text-text/80 leading-relaxed">
                My first instinct was to pick each number and scan the rest of the array
                for a match — but that's O(n²). To get it down to O(n), I needed a data
                structure where membership checks are O(1). A HashSet fits perfectly:
                before inserting each number I check whether it already exists. If it
                does, I've found a duplicate and return true immediately.
              </p>
            </div>

            {/* The Insight */}
            <div className="border-l-2 border-accent pl-3">
              <p className="font-body text-sm text-accent italic leading-relaxed">
                A HashSet enforces uniqueness for free — checking membership before
                insert gives you early-exit duplicate detection in a single linear pass.
              </p>
            </div>

            {/* Code */}
            <div className="flex flex-col gap-1.5">
              <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Solution — Java</p>
              <pre className="bg-surface-2 border border-border rounded-xl p-4 font-mono text-xs text-text overflow-x-auto leading-relaxed">{`class Solution {
    public boolean containsDuplicate(int[] nums) {
        if(nums.length == 1)
            return false;
        HashSet<Integer> numbers = new HashSet<>();
        for(int num: nums) {
            if(numbers.contains(num))
                return true;
            numbers.add(num);
        }
        return false;
    }
}`}</pre>
            </div>

            {/* What I Learned */}
            <div className="flex flex-col gap-1.5">
              <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">What I Learned</p>
              <p className="font-body text-sm text-text/80 leading-relaxed">
                HashSet is the go-to when you need O(1) average-case lookup and only
                care about existence, not counts or order. It's the building block for
                a huge number of "have I seen this before?" problems.
              </p>
            </div>

            {/* Gotchas */}
            <div className="flex flex-col gap-1.5">
              <p className="font-body text-xs uppercase tracking-wider text-muted mb-2">Gotchas</p>
              <p className="font-body text-sm text-text/80 leading-relaxed">
                An alternative is comparing nums.length vs the size of a HashSet built
                from the array, but the early-exit loop is faster in practice when
                duplicates appear early.
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
        ) : (
          <>
            <p className="font-body text-sm text-muted/60 italic leading-relaxed">
              Still locked. Working through these one at a time — check back soon. 🔒
            </p>
          </>
        )}
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
const PEEK_H = 60;

interface MobileBottomSheetProps {
  sheetState: SheetState;
  setSheetState: (s: SheetState) => void;
  topicGroups: NeetCodeTopic[];
  totalSolved: number;
  expandedTopic: string | null;
  onTopicToggle: (topic: string) => void;
  onSolvedProblemSelect: (p: NeetCodeProblem) => void;
  onLockedProblemSelect: () => void;
}

function MobileBottomSheet({
  sheetState,
  setSheetState,
  topicGroups,
  totalSolved,
  expandedTopic,
  onTopicToggle,
  onSolvedProblemSelect,
  onLockedProblemSelect,
}: MobileBottomSheetProps) {
  const startY   = useRef(0);
  const startH   = useRef(0);
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
    startY.current   = e.touches[0].clientY;
    startH.current   = resolveH(sheetState);
    dragging.current = true;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!dragging.current) return;
    const delta = startY.current - e.touches[0].clientY;
    const vh    = window.innerHeight;
    setDragH(Math.max(PEEK_H, Math.min(vh * 0.9, startH.current + delta)));
  }

  function onTouchEnd() {
    if (dragH !== null) { setSheetState(snap(dragH)); setDragH(null); }
    dragging.current = false;
  }

  const h = dragH ?? resolveH(sheetState);

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
        className="flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing select-none"
        style={{ height: `${PEEK_H}px` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => { if (sheetState === "peek") setSheetState("half"); }}
      >
        <div className="w-10 h-1 bg-border rounded-full mb-3" />
        <p className="font-body text-xs text-muted">
          {totalSolved}/150 solved · {topicGroups.length} topics
        </p>
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
                <span className="font-body text-sm text-text">{group.name}</span>
                <span className="font-body text-xs text-faint ml-auto mr-3">
                  {solved}/{group.problems.length}
                </span>
                <span className="font-body text-xs text-faint">{isOpen ? "∨" : "›"}</span>
              </button>

              {isOpen && (
                <div>
                  {group.problems.map((problem) => (
                    <button
                      key={problem.id}
                      className={[
                        "w-full flex items-center gap-3 px-6 py-2.5 border-b border-border/20 text-left",
                        "transition-colors duration-150",
                        problem.solved ? "hover:bg-white/4" : "opacity-40",
                      ].join(" ")}
                      onClick={() => {
                        if (!problem.solved) {
                          onLockedProblemSelect();
                        } else {
                          onSolvedProblemSelect(problem);
                        }
                      }}
                    >
                      {problem.solved ? (
                        <svg className="w-3.5 h-3.5 shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-xs shrink-0">🔒</span>
                      )}
                      <span className={[
                        "font-body text-sm",
                        problem.solved ? "text-muted" : "text-muted/50",
                      ].join(" ")}>
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
                  ))}
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
  const navigate    = useNavigate();
  const { slug }    = useParams<{ slug?: string }>();

  const isMobile = useIsMobile();

  const [expandedTopic,    setExpandedTopic]    = useState<string | null>(null);
  const [childrenVisible,  setChildrenVisible]  = useState(false);
  const [selectedProblem,  setSelectedProblem]  = useState<NeetCodeProblem | null>(null);
  const [lockedToast,      setLockedToast]      = useState(false);
  const [sheetState,       setSheetState]       = useState<SheetState>("peek");
  const listRef    = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mobile pan/zoom
  const [mapXform,    setMapXformState] = useState({ scale: 1, tx: 0, ty: 0 });
  const [isGesturing, setIsGesturing]   = useState(false);
  const mapXformRef = useRef({ scale: 1, tx: 0, ty: 0 });
  const pinchRef    = useRef<{
    dist: number; scale: number; cx: number; cy: number; initTx: number; initTy: number;
  } | null>(null);
  const panRef      = useRef<{
    startX: number; startY: number; initTx: number; initTy: number;
  } | null>(null);
  const lastTapRef  = useRef<number>(0);

  const topicGroups = getTopicGroups();
  const totalSolved = getSolvedCount();
  const totalPct    = Math.round((totalSolved / 150) * 100);

  // Auto-open problem from URL slug on load
  useEffect(() => {
    if (!slug) return;
    const problem = neetcodeProblems.find((p) => p.slug === slug && p.solved);
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
      pinchRef.current = { dist: getTouchDist(e.touches), scale: curr.scale, cx, cy, initTx: curr.tx, initTy: curr.ty };
      panRef.current   = null;
    } else if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        setMapXform({ scale: 1, tx: 0, ty: 0 });
        lastTapRef.current = 0;
        setIsGesturing(false);
        return;
      }
      lastTapRef.current = now;
      panRef.current   = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, initTx: curr.tx, initTy: curr.ty };
      pinchRef.current = null;
    }
  }

  function onMapTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2 && pinchRef.current) {
      const { dist: d0, scale: s0, cx, cy, initTx, initTy } = pinchRef.current;
      const d1 = getTouchDist(e.touches);
      const ns = Math.min(3, Math.max(0.5, s0 * d1 / d0));
      setMapXform({
        scale: ns,
        tx: cx - (cx - initTx) * ns / s0,
        ty: cy - (cy - initTy) * ns / s0,
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
    panRef.current   = null;
  }

  function handleTopicClick(topic: string) {
    if (expandedTopic === topic) {
      setExpandedTopic(null);
      setSelectedProblem(null);
      navigate("/blog/neetcode");
    } else {
      const hasAnySolved = neetcodeProblems.some((p) => p.topic === topic && p.solved);
      if (!hasAnySolved) {
        showLockedToast();
        return;
      }
      setChildrenVisible(false);
      setExpandedTopic(topic);
      setSelectedProblem(null);
      navigate("/blog/neetcode");
      requestAnimationFrame(() => {
        listRef.current
          ?.querySelector(`[data-topic="${topic}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function handleProblemClickOnMap(p: NeetCodeProblem) {
    if (!p.solved) {
      setSelectedProblem(null);
      navigate("/blog/neetcode");
      showLockedToast();
      return;
    }
    setSelectedProblem(p);
    navigate(`/blog/neetcode/${p.slug}`);
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
    if (!p.solved) { setSelectedProblem(null); navigate("/blog/neetcode"); showLockedToast(); return; }
    setSelectedProblem(p);
    navigate(`/blog/neetcode/${p.slug}`);
    if (expandedTopic !== p.topic) {
      setChildrenVisible(false);
      setExpandedTopic(p.topic);
    }
  }

  function selectFromAccordion(p: NeetCodeProblem) {
    setSelectedProblem(p);
    navigate(`/blog/neetcode/${p.slug}`);
    setSheetState("peek");
    if (expandedTopic !== p.topic) {
      setChildrenVisible(false);
      setExpandedTopic(p.topic);
    }
  }

  function closeProblem() {
    setSelectedProblem(null);
    navigate("/blog/neetcode");
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
        Still locked. Working through these one at a time — check back soon. 🔒
      </span>
      <button
        onClick={() => setLockedToast(false)}
        className="shrink-0 p-1 rounded-lg hover:bg-white/8 text-muted hover:text-text transition-colors duration-150"
        aria-label="Dismiss"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 font-body text-xs text-muted hover:text-accent transition-colors duration-200"
        >
          ← Blog
        </Link>
        <div className="h-4 w-px bg-border" />
        <span className="font-display font-bold text-sm text-text">NeetCode 150</span>
        <span className="font-body text-xs text-faint hidden sm:inline">{totalSolved}/150 solved</span>
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
  );

  return (
    <div style={{ paddingTop: `${NAV_H}px` }}>
      {toastJSX}
      {topBarJSX}

      {isMobile ? (
        /* ── Mobile layout ─────────────────────────────────────── */
        <div style={{ height: `calc(100vh - ${NAV_H + TOPBAR_H}px)` }}>
          {/* SVG map — full area minus peek strip, with pinch-to-zoom and pan */}
          <div
            className="overflow-hidden"
            style={{ height: `calc(100vh - ${NAV_H + TOPBAR_H + PEEK_H}px)`, touchAction: "none" }}
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

          {/* Mobile detail panel — slides up from bottom */}
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
            expandedTopic={expandedTopic}
            onTopicToggle={handleTopicClick}
            onSolvedProblemSelect={selectFromAccordion}
            onLockedProblemSelect={showLockedToast}
          />
        </div>
      ) : (
        /* ── Desktop layout ─────────────────────────────────────── */
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
      )}
    </div>
  );
}

export default NeetCodeMap;
