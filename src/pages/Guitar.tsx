import { useState, useRef, useCallback, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// ── Types ──────────────────────────────────────────────────────────────────

type View = "metronome" | "chords";

interface ChordPosition {
  string: number;
  fret: number;
}
interface ChordDef {
  name: string;
  positions: ChordPosition[];
  /** O/X markers for strings that have no fretted position */
  markers: Record<number, "O" | "X">;
}

interface NavItem {
  id: View | null;
  emoji: string;
  label: string;
  locked: boolean;
}
interface NavGroup {
  section: string;
  items: NavItem[];
}

// ── Constants ──────────────────────────────────────────────────────────────

const CHORD_DEFS: ChordDef[] = [
  {
    name: "G",
    positions: [
      { string: 6, fret: 3 },
      { string: 5, fret: 2 },
      { string: 1, fret: 3 },
    ],
    // fretted: 6,5,1 - remaining open strings
    markers: { 4: "O", 3: "O", 2: "O" },
  },
  {
    name: "C",
    positions: [
      { string: 5, fret: 3 },
      { string: 4, fret: 2 },
      { string: 2, fret: 1 },
    ],
    // fretted: 5,4,2 - low E muted, G open, high E open
    markers: { 6: "X", 3: "O", 1: "O" },
  },
  {
    name: "D",
    positions: [
      { string: 3, fret: 2 },
      { string: 2, fret: 3 },
      { string: 1, fret: 2 },
    ],
    // fretted: 3,2,1 - low E & A muted, D open
    markers: { 6: "X", 5: "X", 4: "O" },
  },
  {
    name: "Em",
    positions: [
      { string: 5, fret: 2 },
      { string: 4, fret: 2 },
    ],
    // fretted: 5,4 - all other strings open
    markers: { 6: "O", 3: "O", 2: "O", 1: "O" },
  },
];

const DEFAULT_SELECTED = ["G", "C", "D", "Em"];

const CHORD_MAP = new Map(CHORD_DEFS.map((c) => [c.name, c]));

const NAV: NavGroup[] = [
  {
    section: "TOOLS",
    items: [
      { id: "metronome", emoji: "🎵", label: "Metronome", locked: false },
    ],
  },
  {
    section: "ROUTINES",
    items: [
      { id: "chords", emoji: "🎸", label: "Beginner Progression", locked: false },
      { id: null, emoji: "🔒", label: "Scales Practice", locked: true },
      { id: null, emoji: "🔒", label: "Fingerpicking Patterns", locked: true },
    ],
  },
];

const VIEW_PATHS: Record<View, string> = {
  metronome: "/guitar/metronome",
  chords: "/guitar/beginner-progression",
};

// ── Helpers ────────────────────────────────────────────────────────────────

function strX(s: number) {
  return 10 + (6 - s) * 12;
}
function frtY(f: number) {
  return 25 + (f - 1) * 20;
}

// ── ChordDiagram ───────────────────────────────────────────────────────────

function ChordDiagram({
  positions,
  markers = {},
  size = 64,
}: {
  positions: ChordPosition[];
  markers?: Record<number, "O" | "X">;
  size?: number;
}) {
  const opens = positions.filter((p) => p.fret === 0);
  const fretted = positions.filter((p) => p.fret > 0);
  const h = Math.round(size * 1.25);
  return (
    <svg viewBox="0 0 80 100" width={size} height={h} className="mx-auto mt-1">
      {/* O / X string markers above the nut */}
      {Object.entries(markers).map(([strKey, mark]) => (
        <text
          key={strKey}
          x={strX(Number(strKey))}
          y="10"
          textAnchor="middle"
          fontSize="8"
          fill="#6b7280"
        >
          {mark}
        </text>
      ))}

      {/* Nut */}
      <line x1="10" y1="15" x2="70" y2="15" stroke="#f59e0b" strokeWidth="3" />
      {[1, 2, 3, 4].map((f) => (
        <line
          key={f}
          x1="10"
          y1={15 + f * 20}
          x2="70"
          y2={15 + f * 20}
          stroke="#4b5563"
          strokeWidth="1"
        />
      ))}
      {[1, 2, 3, 4, 5, 6].map((s) => (
        <line
          key={s}
          x1={strX(s)}
          y1="15"
          x2={strX(s)}
          y2="95"
          stroke="#4b5563"
          strokeWidth="1"
        />
      ))}
      {opens.map((p) => (
        <circle
          key={p.string}
          cx={strX(p.string)}
          cy="8"
          r="3"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.5"
        />
      ))}
      {fretted.map((p, i) => (
        <circle key={i} cx={strX(p.string)} cy={frtY(p.fret)} r="5" fill="#f59e0b" />
      ))}
    </svg>
  );
}

// ── useMetronome ───────────────────────────────────────────────────────────

interface MetronomeReturn {
  bpm: number;
  setBpm: (v: number) => void;
  running: boolean;
  beating: boolean;
  start: () => void;
  stop: () => void;
}

function useMetronome(onTick?: () => void): MetronomeReturn {
  const [bpm, setBpm] = useState(80);
  const [running, setRunning] = useState(false);
  const [beating, setBeating] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextTickRef = useRef(0);
  const runningRef = useRef(false);
  const bpmRef = useRef(bpm);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  const playClick = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 1000;
    osc.type = "sine";
    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.02);
  }, []);

  const tick = useCallback(() => {
    if (!runningRef.current) return;
    onTickRef.current?.();
    playClick();
    setBeating(true);
    setTimeout(() => setBeating(false), 100);
    const interval = (60 / bpmRef.current) * 1000;
    nextTickRef.current += interval;
    const delay = Math.max(0, nextTickRef.current - Date.now());
    timeoutRef.current = setTimeout(tick, delay);
  }, [playClick]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = useCallback(async () => {
    // Create AudioContext on first use (browsers require user gesture)
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
      // Silent 1ms burst to prime the audio pipeline before the first real click
      const ctx = audioCtxRef.current;
      const warmGain = ctx.createGain();
      warmGain.gain.setValueAtTime(0, ctx.currentTime);
      const warmOsc = ctx.createOscillator();
      warmOsc.connect(warmGain);
      warmGain.connect(ctx.destination);
      warmOsc.start(ctx.currentTime);
      warmOsc.stop(ctx.currentTime + 0.001);
    }
    // Await resume so the context is fully running before the first tick
    if (audioCtxRef.current.state === "suspended") {
      await audioCtxRef.current.resume();
    }
    runningRef.current = true;
    setRunning(true);
    nextTickRef.current = Date.now();
    tick();
  }, [tick]);

  const stop = useCallback(() => {
    runningRef.current = false;
    setRunning(false);
    setBeating(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      audioCtxRef.current?.close();
    },
    []
  );

  return { bpm, setBpm, running, beating, start, stop };
}

// ── MetronomeView ──────────────────────────────────────────────────────────

function MetronomeView() {
  const { bpm, setBpm, running, beating, start, stop } = useMetronome();

  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 gap-8 max-w-md mx-auto">
      {/* Beat circle */}
      <div
        className="w-16 h-16 rounded-full"
        style={{
          backgroundColor: beating ? "#f59e0b" : "#374151",
          transform: beating ? "scale(1.3)" : "scale(1)",
          boxShadow: beating ? "0 0 24px #f59e0b80" : "none",
          transition:
            "transform 100ms ease, background-color 100ms ease, box-shadow 100ms ease",
        }}
      />

      {/* BPM display */}
      <div className="text-center">
        <div className="font-display font-bold text-6xl text-text">{bpm}</div>
        <div className="text-muted text-sm mt-1">BPM</div>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={1}
        max={180}
        step={1}
        value={bpm}
        onChange={(e) => setBpm(Number(e.target.value))}
        className="w-full accent-amber-500"
      />

      {/* Number input */}
      <input
        type="number"
        min={1}
        max={180}
        value={bpm}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!isNaN(v)) setBpm(Math.min(180, Math.max(1, v)));
        }}
        className="w-24 text-center bg-surface border border-border rounded-lg px-3 py-2 text-text focus:outline-none focus:border-amber-500"
      />

      {/* Start / Stop */}
      <button
        onClick={running ? stop : start}
        className={`rounded-xl px-8 py-3 font-semibold text-white transition-colors ${
          running ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"
        }`}
      >
        {running ? "■ Stop" : "▶ Start"}
      </button>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ── ChordView ──────────────────────────────────────────────────────────────

function ChordView() {
  const [selectedChords, setSelectedChords] = useState<string[]>(DEFAULT_SELECTED);
  const [currentChordIdx, setCurrentChordIdx] = useState(-1);
  const [randomize, setRandomize] = useState(false);
  const [practiceOrder, setPracticeOrder] = useState<string[]>([...DEFAULT_SELECTED]);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerMode, setTimerMode] = useState<"up" | "countdown">("up");
  const [countdownDuration, setCountdownDuration] = useState<number | null>(null);
  const [timerOpen, setTimerOpen] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const selectedChordsRef = useRef(selectedChords);
  const currentChordIdxRef = useRef(-1);
  const randomizeRef = useRef(false);
  const practiceOrderRef = useRef<string[]>([...DEFAULT_SELECTED]);
  // Canonical order: selected chords in CHORD_DEFS definition order — never shuffled
  const baseOrderRef = useRef<string[]>([...DEFAULT_SELECTED]);
  const timerModeRef = useRef<"up" | "countdown">("up");
  const runningRef = useRef(false);
  const countdownDurationRef = useRef<number | null>(null);
  const timerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    selectedChordsRef.current = selectedChords;
    baseOrderRef.current = CHORD_DEFS.map((c) => c.name).filter((n) =>
      selectedChords.includes(n)
    );
  }, [selectedChords]);
  useEffect(() => {
    randomizeRef.current = randomize;
    if (!randomize) {
      // Turning OFF: restore practice order to the canonical unshuffled list
      const order = [...baseOrderRef.current];
      practiceOrderRef.current = order;
      setPracticeOrder(order);
    }
  }, [randomize]);

  const handleTick = useCallback(() => {
    const order = practiceOrderRef.current;
    const len = order.length;
    if (len === 0) return;
    const next = (currentChordIdxRef.current + 1) % len;
    if (next === 0 && randomizeRef.current) {
      const newOrder = shuffle(baseOrderRef.current);
      practiceOrderRef.current = newOrder;
      setPracticeOrder(newOrder);
    }
    currentChordIdxRef.current = next;
    setCurrentChordIdx(next);
  }, []);

  const { bpm, setBpm, running, beating, start, stop } = useMetronome(handleTick);

  const handleStart = useCallback(() => {
    const base = baseOrderRef.current;
    const order = randomizeRef.current ? shuffle(base) : [...base];
    practiceOrderRef.current = order;
    setPracticeOrder(order);
    currentChordIdxRef.current = -1;
    setCurrentChordIdx(-1);
    setTimerSeconds(countdownDurationRef.current ?? 0);
    setSessionComplete(false);
    setTimerOpen(false);
    start();
  }, [start]);

  const handleStop = useCallback(() => {
    stop();
    currentChordIdxRef.current = -1;
    setCurrentChordIdx(-1);
  }, [stop]);

  // ── Timer effects (placed after handleStop — countdown completion calls it) ──
  useEffect(() => { timerModeRef.current = timerMode; }, [timerMode]);
  useEffect(() => { runningRef.current = running; }, [running]);
  useEffect(() => { countdownDurationRef.current = countdownDuration; }, [countdownDuration]);

  // Tick: increment (count-up) or decrement (countdown) each second while running
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setTimerSeconds((s) => {
        if (timerModeRef.current === "countdown") return s > 0 ? s - 1 : 0;
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  // Countdown completion — fires on every timerSeconds change; acts only at zero
  useEffect(() => {
    if (timerMode !== "countdown" || timerSeconds !== 0 || !runningRef.current) return;
    handleStop();
    setSessionComplete(true);
    setTimerMode("up");
    setCountdownDuration(null);
  }, [timerSeconds]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-clear the session-complete message after 3 s
  useEffect(() => {
    if (!sessionComplete) return;
    const id = setTimeout(() => setSessionComplete(false), 3000);
    return () => clearTimeout(id);
  }, [sessionComplete]);

  // Close timer popover on outside click
  useEffect(() => {
    if (!timerOpen) return;
    const handler = (e: MouseEvent) => {
      if (timerContainerRef.current && !timerContainerRef.current.contains(e.target as Node)) {
        setTimerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [timerOpen]);

  const toggleChord = (name: string) =>
    setSelectedChords((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );

  const len = practiceOrder.length;
  const showQueue = running && currentChordIdx >= 0 && len > 0;
  const OFFSETS = [-2, -1, 0, 1, 2] as const;

  return (
    <div className="px-6 py-8 pt-14 max-w-2xl mx-auto">
      {/* ── Compact metronome ── */}
      <div className="flex items-center gap-3 mb-8 p-4 bg-surface rounded-xl border border-border flex-wrap">
        {/* Beat dot */}
        <div
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{
            backgroundColor: beating ? "#f59e0b" : "#374151",
            transform: beating ? "scale(1.3)" : "scale(1)",
            boxShadow: beating ? "0 0 10px #f59e0b80" : "none",
            transition: "transform 100ms ease, background-color 100ms ease",
          }}
        />

        {/* BPM readout */}
        <span className="font-display font-bold text-lg text-text w-9 text-right flex-shrink-0">
          {bpm}
        </span>

        {/* Slider */}
        <input
          type="range"
          min={1}
          max={180}
          step={1}
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="flex-1 min-w-[80px] accent-amber-500"
        />

        {/* Number input */}
        <input
          type="number"
          min={1}
          max={180}
          value={bpm}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!isNaN(v)) setBpm(Math.min(180, Math.max(1, v)));
          }}
          className="w-16 text-center bg-bg border border-border rounded-lg px-2 py-1 text-text text-sm focus:outline-none focus:border-amber-500 flex-shrink-0"
        />

        {/* Start / Stop */}
        <button
          onClick={running ? handleStop : handleStart}
          className={`rounded-xl px-4 py-1.5 text-sm font-semibold text-white transition-colors flex-shrink-0 ${
            running ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"
          }`}
        >
          {running ? "■ Stop" : "▶ Start"}
        </button>

        {/* Practice timer */}
        <div ref={timerContainerRef} className="relative flex-shrink-0 ml-1">
          {sessionComplete ? (
            <span className="font-body text-sm text-amber-400 whitespace-nowrap">
              Session complete! 🎸
            </span>
          ) : (
            <button
              onClick={() => setTimerOpen((o) => !o)}
              className={`font-body text-sm tabular-nums transition-all duration-200 border rounded-lg px-2 py-1 cursor-pointer ${
                timerMode === "countdown"
                  ? "text-amber-400 hover:text-amber-300 border-amber-500/30 hover:border-amber-400/60"
                  : "text-muted hover:text-text border-border hover:border-accent/40"
              }`}
            >
              ⏱ {formatTime(timerSeconds)}
            </button>
          )}

          {timerOpen && (
            <div className="absolute top-full right-0 mt-1 z-10 bg-surface border border-border rounded-xl shadow-lg overflow-hidden min-w-[110px]">
              {timerMode === "countdown" && (
                <button
                  onClick={() => {
                    setTimerMode("up");
                    setCountdownDuration(null);
                    setTimerSeconds(0);
                    setTimerOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 font-body text-sm text-muted hover:text-text hover:bg-bg transition-colors"
                >
                  Count up
                </button>
              )}
              {([5, 10, 15, 20] as const).map((min) => (
                <button
                  key={min}
                  onClick={() => {
                    setTimerMode("countdown");
                    setCountdownDuration(min * 60);
                    setTimerSeconds(min * 60);
                    setTimerOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 font-body text-sm transition-colors hover:bg-bg ${
                    countdownDuration === min * 60
                      ? "text-amber-400"
                      : "text-muted hover:text-text"
                  }`}
                >
                  {min} min
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Chord selector ── */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <p className="font-body text-xs text-muted opacity-60">
          Tap to unselect chords — fewer chords make switches easier to master.
          Only selected chords appear in the practice loop below.
        </p>
        <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => setRandomize((r) => !r)}>
          <span className="font-body text-sm text-muted whitespace-nowrap select-none">Randomize</span>
          <div
            role="switch"
            aria-checked={randomize}
            className={`relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${
              randomize ? "bg-amber-500" : "bg-border"
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                randomize ? "translate-x-[18px]" : "translate-x-0.5"
              }`}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 mb-10">
        {CHORD_DEFS.map((chord) => {
          const isSelected = selectedChords.includes(chord.name);
          return (
            <button
              key={chord.name}
              onClick={() => toggleChord(chord.name)}
              className={`rounded-xl p-3 border text-center transition-all ${
                isSelected
                  ? "border-amber-500 bg-amber-500/10"
                  : "border-border bg-surface opacity-50"
              }`}
            >
              <ChordDiagram positions={chord.positions} markers={chord.markers} />
              <div className="font-display font-bold text-xl text-text mt-1">
                {chord.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Scrolling chord window ── */}
      <div className={`flex items-center justify-center overflow-x-auto ${running ? "min-h-64" : ""}`}>
        {!running ? (
          <p className="py-6 text-sm text-muted opacity-40">
            Press Start to begin practicing
          </p>
        ) : len === 0 ? (
          <p className="text-muted text-sm opacity-60">
            Select at least one chord above
          </p>
        ) : !showQueue ? null : (
          <div className="flex items-end justify-center gap-3">
            {OFFSETS.map((offset) => {
              const idx = ((currentChordIdx + offset) % len + len) % len;
              const chordName = practiceOrder[idx];
              const def = CHORD_MAP.get(chordName);
              const dist = Math.abs(offset);

              if (!def) return null;

              // ── Center: NOW (green) ──
              if (offset === 0) {
                return (
                  <div
                    key={offset}
                    className="border border-green-500/50 bg-green-500/10 rounded-2xl p-3 flex-shrink-0 text-center"
                    style={{
                      transform: beating ? "scale(1.05)" : "scale(1)",
                      transition: "transform 100ms ease",
                    }}
                  >
                    <ChordDiagram positions={def.positions} markers={def.markers} size={120} />
                    <div className="font-display font-bold text-lg text-green-400 mt-2">
                      {chordName}
                    </div>
                  </div>
                );
              }

              // ── Left: played (grey) ──
              if (offset < 0) {
                return (
                  <div
                    key={offset}
                    className="rounded-xl p-2 flex-shrink-0 text-center"
                    style={{
                      opacity: dist === 1 ? 0.3 : 0.15,
                      filter: "grayscale(1)",
                    }}
                  >
                    <ChordDiagram positions={def.positions} markers={def.markers} size={dist === 1 ? 90 : 70} />
                    <div className="font-display text-muted text-sm mt-1">{chordName}</div>
                  </div>
                );
              }

              // ── Right: upcoming (amber) ──
              return (
                <div
                  key={offset}
                  className={`rounded-xl p-2 flex-shrink-0 text-center ${
                    dist === 1
                      ? "border border-amber-500/30 bg-amber-500/5 opacity-80"
                      : "opacity-50"
                  }`}
                >
                  <ChordDiagram positions={def.positions} size={dist === 1 ? 90 : 70} />
                  <div
                    className={`font-display text-amber-400 mt-1 ${
                      dist === 1 ? "text-sm" : "text-xs"
                    }`}
                  >
                    {chordName}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Why These 4 Chords ── */}
      <div className="mt-10 space-y-4">
        <h3 className="font-display font-semibold text-lg text-text">
          Why These 4 Chords?
        </h3>

        <p className="font-body text-sm text-muted leading-relaxed">
          G, C, D, and Em form what's known in music theory as the I-V-vi-IV
          progression - and it's everywhere. Ed Sheeran famously demonstrated
          this on Dutch TV, playing through snippets of hits by Passenger, the
          Spice Girls, and Beyoncé using just these four chords. His own song
          'Perfect' cycles through exactly this progression.
        </p>

        <p className="font-body text-sm text-muted leading-relaxed">
          The reason this works so well for beginners isn't just that the chords
          are easy - it's that the transitions between them are smooth. Several
          fingers stay close to the same frets as you move from one chord to the
          next, so your hand doesn't have to jump around.
        </p>

        <h4 className="font-display font-semibold text-base text-text mt-4">
          How to Practice
        </h4>

        <ul className="space-y-2">
          {[
            "Start really slow - 30 BPM is a great starting point. Clean chord changes matter more than speed. Once switches feel smooth, gradually work your way up to 60 BPM.",
            "Practice the transitions, not just the chords. G → Em → C → D is the loop - focus on the switch, not just holding each shape.",
            "Use the metronome above and let the chord display guide your hand - green is now, yellow is what's coming.",
            "Once it feels smooth, try strumming along to 'Perfect' by Ed Sheeran - it uses this exact progression.",
          ].map((tip, i) => (
            <li key={i} className="flex gap-3 font-body text-sm text-muted">
              <span className="text-amber-500 flex-shrink-0 select-none">–</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>

        <h4 className="font-display font-semibold text-base text-text mt-6">
          Master the Switches - Anchor Fingers
        </h4>

        <p className="font-body text-sm text-muted leading-relaxed">
          One of the biggest speed-ups in switching chords comes from noticing
          which fingers don't need to move at all. Look at G and Em — both use
          a finger on the A string, 2nd fret. When switching between them, that
          finger can stay anchored in place while the others reposition. It's a
          small thing, but spotting these shared positions across chords is what
          makes switches start to feel instant.
        </p>

        <ul className="space-y-2">
          <li className="flex gap-3 font-body text-sm text-muted">
            <span className="text-amber-500 flex-shrink-0 select-none">–</span>
            <span>
              Before switching, glance at both chord diagrams above and ask:
              which fingers are already in the right place? Those stay put -
              only move what has to move.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// ── Nav helpers ────────────────────────────────────────────────────────────

function NavItems({
  activeView,
  onSelect,
}: {
  activeView: View;
  onSelect: (v: View) => void;
}) {
  return (
    <>
      {NAV.map((group) => (
        <div key={group.section} className="mb-6">
          <p className="text-faint text-xs uppercase tracking-wider px-4 mb-1">
            {group.section}
          </p>
          {group.items.map((item, i) => {
            if (item.locked) {
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-muted opacity-40 cursor-not-allowed border-l-2 border-transparent"
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </div>
              );
            }
            const isActive = activeView === item.id;
            return (
              <button
                key={i}
                onClick={() => {
                  if (item.id) onSelect(item.id);
                }}
                className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors border-l-2 ${
                  isActive
                    ? "border-amber-500 bg-amber-500/10 text-text"
                    : "border-transparent text-muted hover:text-text"
                }`}
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      ))}
    </>
  );
}

// ── Guitar (main page) ─────────────────────────────────────────────────────

export default function Guitar() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeView: View =
    location.pathname === "/guitar/beginner-progression" ? "chords" : "metronome";

  const handleSelect = (view: View) => navigate(VIEW_PATHS[view]);

  return (
    <div className="bg-bg text-text" style={{ paddingTop: 64 }}>
      <div className="flex" style={{ height: "calc(100vh - 64px)" }}>
      {/* ── Left panel (desktop) ── */}
      <aside className="hidden md:flex flex-col flex-shrink-0 w-60 overflow-y-auto border-r border-border">
        <div className="px-4 pb-5">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-body text-xs text-muted hover:text-accent transition-colors duration-200"
          >
            ← Portfolio
          </Link>
        </div>
        <nav className="flex-1 pb-6">
          <NavItems activeView={activeView} onSelect={handleSelect} />
        </nav>
      </aside>

      {/* ── Right content ── */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Mobile tab bar */}
        <div className="md:hidden flex items-center border-b border-border overflow-x-auto flex-shrink-0">
          <Link
            to="/"
            className="text-muted hover:text-amber-400 text-sm px-4 py-3 flex-shrink-0 border-r border-border transition-colors"
          >
            ←
          </Link>
          {NAV.flatMap((g) => g.items)
            .filter((item) => !item.locked)
            .map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id) handleSelect(item.id);
                }}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex-shrink-0 ${
                  activeView === item.id
                    ? "border-amber-500 text-text"
                    : "border-transparent text-muted hover:text-text"
                }`}
              >
                {item.emoji} {item.label}
              </button>
            ))}
        </div>

        {/* View content */}
        <div className="flex-1">
          {activeView === "metronome" ? <MetronomeView /> : <ChordView />}
        </div>
      </div>
      </div>
    </div>
  );
}
