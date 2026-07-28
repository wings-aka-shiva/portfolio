import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";

// module-level so the intro popup never reappears if the route remounts
// within the same page session (only a hard reload resets it)
let introShownThisSession = false;

// ─── Placeholder texts ────────────────────────────────────────────────────────
// PLACEHOLDER — swap these 15 strings for the real paragraphs. Keep them short
// (2–3 sentences). They are rendered onto canvas textures, so plain text only.
const TEXTS: string[] = [
  // PLACEHOLDER 1
  "You are not behind.\nThe timeline you measure yourself against was never real.\nBreathe, and begin from here.",
  // PLACEHOLDER 2
  "Some doors only open once you stop knocking.\nStep back. Let the quiet do its work.",
  // PLACEHOLDER 3
  "The version of you that gave up would have arrived here too.\nBut you didn't. That difference is everything.",
  // PLACEHOLDER 4
  "Drifting is not the same as being lost.\nSometimes the current knows a route the map forgot.",
  // PLACEHOLDER 5
  "What you call a detour, the future calls the reason.\nTrust the parts you can't yet see.",
  // PLACEHOLDER 6
  "You survived every day you were sure you couldn't.\nThat is not luck. That is a pattern.",
  // PLACEHOLDER 7
  "Let the old story go incomplete.\nNot every thread needs to be tied to be finished.",
  // PLACEHOLDER 8
  "The stars you're floating through are already dead.\nAnd still, their light travels to reach you.\nSo does everything you've ever loved.",
  // PLACEHOLDER 9
  "Rest is not a reward for finishing.\nIt is the ground the finishing grows from.",
  // PLACEHOLDER 10
  "You do not have to become someone else.\nYou have to remember who you were before the fear.",
  // PLACEHOLDER 11
  "Distance is only cruel when you forget it's temporary.\nEverything orbits back.",
  // PLACEHOLDER 12
  "The silence after the question is not rejection.\nSometimes it is the universe still deciding to say yes.",
  // PLACEHOLDER 13
  "You are allowed to change your mind\nabout the life you thought you wanted.\nGrowth looks like contradiction from the outside.",
  // PLACEHOLDER 14
  "Hold things lightly enough to keep them.\nThe tightest grip loses the most.",
  // PLACEHOLDER 15
  "In between who you were and who you're becoming,\nthere is this. Just this.\nAnd it is enough.",
];

// ─── Text → CanvasTexture ─────────────────────────────────────────────────────

function makeTextTexture(text: string): {
  texture: THREE.CanvasTexture;
  aspect: number;
} {
  const W = 1024;
  const H = 512;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#e8e6f0";
  ctx.font = "44px Georgia, 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(120,140,255,0.55)";
  ctx.shadowBlur = 22;

  const lines = text.split("\n");
  const lineHeight = 62;
  const startY = H / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, W / 2, startY + i * lineHeight);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  return { texture, aspect: W / H };
}

// ─── Ray–box radius ───────────────────────────────────────────────────────────
// Distance from the centre of a halfWidth×halfHeight box to its edge along a
// given angle — used so sunburst trail lines reach the actual screen edge
// (side edge near-horizontal, top/bottom edge near-vertical) rather than a
// fixed-radius circle that overshoots corners or falls short of edges.
function rayBoxRadius(halfWidth: number, halfHeight: number, angle: number): number {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const rx = Math.abs(cos) > 1e-6 ? halfWidth / Math.abs(cos) : Infinity;
  const ry = Math.abs(sin) > 1e-6 ? halfHeight / Math.abs(sin) : Infinity;
  return Math.min(rx, ry);
}

// ─── Mobile detection ─────────────────────────────────────────────────────────

function isMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.matchMedia("(max-width: 820px), (pointer: coarse)").matches
  );
}

// ─── The 3D scene ─────────────────────────────────────────────────────────────

function BetweenScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const mapCanvasRef = useRef<HTMLCanvasElement>(null);
  const trailsCanvasRef = useRef<HTMLCanvasElement>(null);
  const [showHint, setShowHint] = useState(true);
  const [showControlsButton, setShowControlsButton] = useState(false);
  const [controlsModalOpen, setControlsModalOpen] = useState(false);
  const [introMounted, setIntroMounted] = useState(!introShownThisSession);
  const [introVisible, setIntroVisible] = useState(false);

  // hint bar visible for 10s, then fades over 1s; once fully gone, the
  // permanent "Controls" button fades in at the same spot
  useEffect(() => {
    const hideHint = setTimeout(() => setShowHint(false), 10000);
    const revealButton = setTimeout(() => setShowControlsButton(true), 11000);
    return () => {
      clearTimeout(hideHint);
      clearTimeout(revealButton);
    };
  }, []);

  // one-time intro popup — fades in, auto-dismisses after 4s or on any key/click
  useEffect(() => {
    if (!introMounted) return;
    introShownThisSession = true;
    let dismissed = false;

    const raf = requestAnimationFrame(() => setIntroVisible(true));
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      setIntroVisible(false);
      setTimeout(() => setIntroMounted(false), 650);
    };
    const autoDismiss = setTimeout(dismiss, 4000);
    window.addEventListener("keydown", dismiss);
    window.addEventListener("pointerdown", dismiss);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(autoDismiss);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("pointerdown", dismiss);
    };
  }, [introMounted]);

  // Escape closes the controls modal
  useEffect(() => {
    if (!controlsModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") setControlsModalOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [controlsModalOpen]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // ── overlay canvases (plain 2D, drawn alongside the three.js scene) ──
    const trailsCanvas = trailsCanvasRef.current;
    if (trailsCanvas) {
      trailsCanvas.width = window.innerWidth;
      trailsCanvas.height = window.innerHeight;
    }
    const trailsCtx = trailsCanvas?.getContext("2d") ?? null;

    const mapCanvas = mapCanvasRef.current;
    const mapCtx = mapCanvas?.getContext("2d") ?? null;

    // ── scene ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#09090f");
    scene.fog = new THREE.FogExp2(0x0b0b2a, 0.0016);

    // ── camera ──
    const camera = new THREE.PerspectiveCamera(
      72,
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    );
    camera.position.set(0, 0, 0);

    // yaw rig — no mouse look, so the camera only ever turns on Y (no pitch/roll)
    const yawObject = new THREE.Object3D();
    yawObject.position.set(0, 0, 0); // player spawns at the origin
    yawObject.add(camera);
    scene.add(yawObject);

    // ── star field (1000 points) ──
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1000;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      // uniform-ish distribution in a large shell
      const r = 900 + Math.random() * 900;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x8890c0,
      size: 2,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── 15 text planes scattered in a cluster (radius 600–800) ──
    type TextMesh = {
      mesh: THREE.Mesh;
      material: THREE.MeshBasicMaterial;
    };
    const textMeshes: TextMesh[] = [];
    const disposables: (THREE.Texture | THREE.Material | THREE.BufferGeometry)[] =
      [];

    // first few planes are guaranteed to sit directly ahead of the origin
    // spawn (camera looks down -Z at yaw 0) so something is visible immediately
    const GUARANTEED_AHEAD = 3;
    const SCATTER_MIN_RADIUS = 600;
    const SCATTER_MAX_RADIUS = 800;
    const MIN_TEXT_DISTANCE = 150; // no two planes may spawn closer than this
    const MAX_SPAWN_ATTEMPTS = 40;

    const placedPositions: THREE.Vector3[] = [];
    const isFarEnough = (pos: THREE.Vector3) =>
      placedPositions.every((p) => p.distanceTo(pos) >= MIN_TEXT_DISTANCE);

    TEXTS.forEach((text, index) => {
      const { texture, aspect } = makeTextTexture(text);
      disposables.push(texture);

      const planeH = 60;
      const planeW = planeH * aspect;
      const geo = new THREE.PlaneGeometry(planeW, planeH);
      disposables.push(geo);

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.05,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      disposables.push(material);

      const mesh = new THREE.Mesh(geo, material);

      const candidate = new THREE.Vector3();
      for (let attempt = 0; attempt < MAX_SPAWN_ATTEMPTS; attempt++) {
        if (index < GUARANTEED_AHEAD) {
          // straight ahead of spawn, within 200 units total, with some spread
          candidate.set(
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 50,
            -(50 + Math.random() * 130)
          );
        } else {
          // random point inside a 600–800 radius shell (avoid dead centre)
          const r =
            SCATTER_MIN_RADIUS +
            Math.random() * (SCATTER_MAX_RADIUS - SCATTER_MIN_RADIUS);
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          candidate.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
          );
        }
        if (isFarEnough(candidate)) break;
      }

      mesh.position.copy(candidate);
      placedPositions.push(candidate.clone());

      scene.add(mesh);
      textMeshes.push({ mesh, material });
    });

    console.log(
      "Between: text plane spawn positions",
      textMeshes.map(({ mesh }, i) => ({
        index: i,
        position: mesh.position.toArray(),
        distanceFromOrigin: mesh.position.length(),
      }))
    );

    // ── input state ──
    const keys: Record<string, boolean> = {};

    const onKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false;
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    // ── resize ──
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (trailsCanvas) {
        trailsCanvas.width = window.innerWidth;
        trailsCanvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", onResize);

    // ── animation loop ──
    const MOVE_SPEED = 140; // units per second, forward/back
    const VERTICAL_SPEED = 100; // units per second, up/down (Q/E)
    const TURN_SPEED = 1.6; // radians per second (yaw)
    const SMOOTHING = 8; // higher = snappier velocity response, lower = floatier
    const BOB_AMPLITUDE = 0.3; // camera bob height while moving
    const MAX_ROLL = THREE.MathUtils.degToRad(5); // bank angle when turning
    const MAP_SIZE = 150; // minimap canvas size, px
    const MAP_WORLD_RADIUS = 800; // world units the minimap edge represents
    const MAP_DOT_RADIUS = 65; // px radius the world radius maps to

    // current (smoothed) velocities — lerped toward target input each frame
    let curForward = 0;
    let curVertical = 0;
    let curTurn = 0;
    let bobPhase = 0;

    // speed-trail streaks — persistent per-line state, normalized 0 (inner) .. 1 (outer)
    const TRAIL_COUNT = 40;
    const trailLines = Array.from({ length: TRAIL_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      t: Math.random(),
    }));

    // vertical speed trails (Q/E) — normalized 0 (centre) .. 1 (top/bottom edge),
    // xOffset in [-1, 1] gives each streak its own fan-out drift
    const V_TRAIL_COUNT = 22;
    const qTrailLines = Array.from({ length: V_TRAIL_COUNT }, () => ({
      xOffset: (Math.random() - 0.5) * 2,
      t: Math.random(),
    }));
    const eTrailLines = Array.from({ length: V_TRAIL_COUNT }, () => ({
      xOffset: (Math.random() - 0.5) * 2,
      t: Math.random(),
    }));

    // horizontal turn trails (A/D) — streaks radiating from centre out to the
    // screen edge, confined to a 90° diagonal wedge (as if the screen were
    // divided by an X into 4 triangles) so they never spread into the full
    // top/bottom half — just the near-horizontal diagonal quadrants
    const H_TRAIL_COUNT = 26;
    const aTrailLines = Array.from({ length: H_TRAIL_COUNT }, () => ({
      angle: -Math.PI / 4 + Math.random() * (Math.PI / 2), // -45°..+45°, right wedge
      t: Math.random(),
    }));
    const dTrailLines = Array.from({ length: H_TRAIL_COUNT }, () => ({
      angle: (3 * Math.PI) / 4 + Math.random() * (Math.PI / 2), // 135°..225°, left wedge
      t: Math.random(),
    }));

    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    const worldPos = new THREE.Vector3();
    const edgeDelta = new THREE.Vector3();
    const timer = new THREE.Timer();
    let raf = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      timer.update();
      const dt = Math.min(timer.getDelta(), 0.05);
      const lerpAmt = 1 - Math.exp(-SMOOTHING * dt);

      // target inputs from currently-held keys
      const targetForward =
        (keys["KeyW"] || keys["ArrowUp"] ? 1 : 0) -
        (keys["KeyS"] || keys["ArrowDown"] ? 1 : 0);
      const targetVertical =
        (keys["KeyE"] ? 1 : 0) - (keys["KeyQ"] ? 1 : 0);
      const targetTurn =
        (keys["KeyA"] || keys["ArrowLeft"] ? 1 : 0) -
        (keys["KeyD"] || keys["ArrowRight"] ? 1 : 0);

      // smooth toward targets so motion has weight, without feeling floaty
      curForward = THREE.MathUtils.lerp(curForward, targetForward, lerpAmt);
      curVertical = THREE.MathUtils.lerp(curVertical, targetVertical, lerpAmt);
      curTurn = THREE.MathUtils.lerp(curTurn, targetTurn, lerpAmt);

      // turning (yaw only — A/D and left/right arrows both rotate, no strafing)
      yawObject.rotation.y += curTurn * TURN_SPEED * dt;

      // forward/back relative to current facing, plus independent vertical
      forward.set(0, 0, -1).applyQuaternion(yawObject.quaternion);
      right.set(1, 0, 0).applyQuaternion(yawObject.quaternion);
      yawObject.position.addScaledVector(forward, curForward * MOVE_SPEED * dt);
      yawObject.position.y += curVertical * VERTICAL_SPEED * dt;

      // camera bob — subtle vertical sine bob while moving, settles when still
      const speedMag = Math.min(1, Math.hypot(curForward, curVertical));
      if (speedMag > 0.02) {
        bobPhase += dt * (6 + speedMag * 10);
        camera.position.y = Math.sin(bobPhase) * BOB_AMPLITUDE * speedMag;
      } else {
        camera.position.y = THREE.MathUtils.lerp(
          camera.position.y,
          0,
          1 - Math.exp(-6 * dt)
        );
      }

      // turn tilt — bank into turns, lerp level again once turning stops
      const targetRoll = curTurn * MAX_ROLL;
      camera.rotation.z = THREE.MathUtils.lerp(
        camera.rotation.z,
        targetRoll,
        1 - Math.exp(-6 * dt)
      );

      // distance-based opacity (full within 200, fading from 200-400, gone by 400)
      // + face the camera every frame
      camera.getWorldPosition(worldPos);
      for (const { mesh, material } of textMeshes) {
        const d = mesh.position.distanceTo(worldPos);
        let o: number;
        if (d <= 200) o = 1;
        else if (d >= 400) o = 0;
        else o = 1 - (d - 200) / 200;
        material.opacity = o;
        mesh.lookAt(worldPos);
      }

      // gentle star drift for a sense of depth
      stars.rotation.y += dt * 0.006;

      renderer.render(scene, camera);

      // ── minimap: top-down (x/z) projection of text-plane and player positions ──
      if (mapCtx && mapCanvas) {
        mapCtx.clearRect(0, 0, MAP_SIZE, MAP_SIZE);
        const cx = MAP_SIZE / 2;
        const cy = MAP_SIZE / 2;
        const scale = MAP_DOT_RADIUS / MAP_WORLD_RADIUS;

        mapCtx.fillStyle = "rgba(230,230,240,0.75)";
        for (const { mesh } of textMeshes) {
          const x = cx + mesh.position.x * scale;
          const y = cy + mesh.position.z * scale;
          mapCtx.beginPath();
          mapCtx.arc(x, y, 1.6, 0, Math.PI * 2);
          mapCtx.fill();
        }

        // player — small triangle pointing along the current yaw, clamped to
        // the map edge if far out. Points up by default (yaw = 0) and is
        // rotated to match the yaw object's rotation.y each frame.
        const px = worldPos.x * scale;
        const py = worldPos.z * scale;
        const pr = Math.hypot(px, py);
        const clamp = pr > MAP_DOT_RADIUS ? MAP_DOT_RADIUS / pr : 1;
        const ARROW_SIZE = 8;
        const yaw = yawObject.rotation.y;

        mapCtx.save();
        mapCtx.translate(cx + px * clamp, cy + py * clamp);
        // negated so the canvas rotation matches world-space yaw direction
        // (canvas rotation and three.js's Y-axis rotation wind opposite ways)
        mapCtx.rotate(-yaw);
        mapCtx.fillStyle = "#4f46e5";
        mapCtx.beginPath();
        mapCtx.moveTo(0, -ARROW_SIZE);
        mapCtx.lineTo(ARROW_SIZE * 0.6, ARROW_SIZE * 0.5);
        mapCtx.lineTo(-ARROW_SIZE * 0.6, ARROW_SIZE * 0.5);
        mapCtx.closePath();
        mapCtx.fill();
        mapCtx.restore();
      }

      // ── speed trails: short streaks flowing toward/away from centre — fwd/back only ──
      if (trailsCtx && trailsCanvas) {
        trailsCtx.clearRect(0, 0, trailsCanvas.width, trailsCanvas.height);
        const moveSpeed = Math.abs(curForward);
        if (moveSpeed > 0.05) {
          const tcx = trailsCanvas.width / 2;
          const tcy = trailsCanvas.height / 2;
          const baseR = Math.min(trailsCanvas.width, trailsCanvas.height) / 2;
          // keep the centre 60% of the screen completely clear of trail lines
          const outerR = baseR * 0.925;
          const innerR = baseR * 0.6;
          const segFrac = 0.12; // streak length as a fraction of the inner..outer span
          const flowRate = 2.2; // full inner<->outer traverse in ~0.45s at full speed
          const forwardMoving = curForward > 0;
          const alpha = 0.15 + moveSpeed * 0.1; // 0.15–0.25

          trailsCtx.lineWidth = 1;

          for (const line of trailLines) {
            // forward: streaks flow outward (60% line → edge). backward: flow inward.
            line.t += (forwardMoving ? 1 : -1) * moveSpeed * flowRate * dt;
            if (line.t < 0) line.t = 1;
            if (line.t > 1) line.t = 0;

            const t2 = forwardMoving
              ? Math.min(1, line.t + segFrac)
              : Math.max(0, line.t - segFrac);

            const r1 = innerR + line.t * (outerR - innerR);
            const r2 = innerR + t2 * (outerR - innerR);
            const x1 = tcx + Math.cos(line.angle) * r1;
            const y1 = tcy + Math.sin(line.angle) * r1;
            const x2 = tcx + Math.cos(line.angle) * r2;
            const y2 = tcy + Math.sin(line.angle) * r2;

            // leading edge (direction of travel) is brightest; tail fades out fast
            const gradient = trailsCtx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, `rgba(210,225,255,${alpha})`);
            gradient.addColorStop(1, "rgba(210,225,255,0)");
            trailsCtx.strokeStyle = gradient;

            trailsCtx.beginPath();
            trailsCtx.moveTo(x1, y1);
            trailsCtx.lineTo(x2, y2);
            trailsCtx.stroke();
          }
        }
      }

      // ── vertical speed trails: Q fans upward from centre, E fans downward ──
      if (trailsCtx && trailsCanvas) {
        const tcx = trailsCanvas.width / 2;
        const tcy = trailsCanvas.height / 2;
        const maxFanX = trailsCanvas.width * 0.1; // keep streaks in the centre strip
        const vSegFrac = 0.14;
        const vFlowRate = 1.6; // full centre→edge traverse in ~0.6s
        const vAlpha = 0.18;

        trailsCtx.lineWidth = 1;

        if (keys["KeyQ"]) {
          const edgeY = trailsCanvas.height * 0.05;
          for (const line of qTrailLines) {
            line.t += vFlowRate * dt;
            if (line.t > 1) line.t = 0;
            const t2 = Math.max(0, line.t - vSegFrac);

            const y1 = tcy + (edgeY - tcy) * line.t;
            const y2 = tcy + (edgeY - tcy) * t2;
            const x1 = tcx + line.xOffset * maxFanX * line.t;
            const x2 = tcx + line.xOffset * maxFanX * t2;

            const gradient = trailsCtx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, `rgba(210,225,255,${vAlpha})`);
            gradient.addColorStop(1, "rgba(210,225,255,0)");
            trailsCtx.strokeStyle = gradient;

            trailsCtx.beginPath();
            trailsCtx.moveTo(x1, y1);
            trailsCtx.lineTo(x2, y2);
            trailsCtx.stroke();
          }
        }

        if (keys["KeyE"]) {
          const edgeY = trailsCanvas.height * 0.95;
          for (const line of eTrailLines) {
            line.t += vFlowRate * dt;
            if (line.t > 1) line.t = 0;
            const t2 = Math.max(0, line.t - vSegFrac);

            const y1 = tcy + (edgeY - tcy) * line.t;
            const y2 = tcy + (edgeY - tcy) * t2;
            const x1 = tcx + line.xOffset * maxFanX * line.t;
            const x2 = tcx + line.xOffset * maxFanX * t2;

            const gradient = trailsCtx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, `rgba(210,225,255,${vAlpha})`);
            gradient.addColorStop(1, "rgba(210,225,255,0)");
            trailsCtx.strokeStyle = gradient;

            trailsCtx.beginPath();
            trailsCtx.moveTo(x1, y1);
            trailsCtx.lineTo(x2, y2);
            trailsCtx.stroke();
          }
        }
      }

      // ── horizontal turn trails: a sunburst covering the full screen height on
      // one side. World sweeps opposite the turn direction — A/← turns the view
      // left, so the world (and these streaks) sweep right; D/→ sweeps left. ──
      if (trailsCtx && trailsCanvas) {
        const tcx = trailsCanvas.width / 2;
        const tcy = trailsCanvas.height / 2;
        const hw = trailsCanvas.width / 2;
        const hh = trailsCanvas.height / 2;
        const hSegFrac = 0.14;
        const hFlowRate = 1.6; // full centre→edge traverse in ~0.6s
        const hAlpha = 0.18;

        trailsCtx.lineWidth = 1;

        const drawSunburst = (lines: { angle: number; t: number }[]) => {
          for (const line of lines) {
            line.t += hFlowRate * dt;
            if (line.t > 1) line.t = 0;
            const t2 = Math.max(0, line.t - hSegFrac);

            // distance from centre to the screen edge along this line's angle,
            // so near-horizontal lines reach the side edge and near-vertical
            // lines reach the top/bottom edge
            const maxR = rayBoxRadius(hw, hh, line.angle) * 0.95;
            const r1 = maxR * line.t;
            const r2 = maxR * t2;
            const x1 = tcx + Math.cos(line.angle) * r1;
            const y1 = tcy + Math.sin(line.angle) * r1;
            const x2 = tcx + Math.cos(line.angle) * r2;
            const y2 = tcy + Math.sin(line.angle) * r2;

            const gradient = trailsCtx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, `rgba(210,225,255,${hAlpha})`);
            gradient.addColorStop(1, "rgba(210,225,255,0)");
            trailsCtx.strokeStyle = gradient;

            trailsCtx.beginPath();
            trailsCtx.moveTo(x1, y1);
            trailsCtx.lineTo(x2, y2);
            trailsCtx.stroke();
          }
        };

        if (keys["KeyA"] || keys["ArrowLeft"]) drawSunburst(aTrailLines);
        if (keys["KeyD"] || keys["ArrowRight"]) drawSunburst(dTrailLines);
      }

      // ── edge navigation arcs: compass hints toward off-screen text clusters.
      // Drawn last, on top of every trail effect above. ──
      if (trailsCtx && trailsCanvas) {
        let closestTop = Infinity;
        let closestBottom = Infinity;
        let closestLeft = Infinity;
        let closestRight = Infinity;

        for (const { mesh } of textMeshes) {
          edgeDelta.copy(mesh.position).sub(worldPos);
          const distance = edgeDelta.length();
          if (distance < 1) continue;

          const localRight = edgeDelta.dot(right);
          const localUp = edgeDelta.y;

          if (Math.abs(localUp) > Math.abs(localRight)) {
            if (localUp > 0) closestTop = Math.min(closestTop, distance);
            else closestBottom = Math.min(closestBottom, distance);
          } else if (localRight > 0) {
            closestRight = Math.min(closestRight, distance);
          } else {
            closestLeft = Math.min(closestLeft, distance);
          }
        }

        const NAV_NEAR = 150;
        const NAV_FAR = 700;
        const intensityFor = (d: number) =>
          Number.isFinite(d)
            ? THREE.MathUtils.clamp(1 - (d - NAV_NEAR) / (NAV_FAR - NAV_NEAR), 0, 1)
            : 0;

        // slow breathing pulse, 0..1, shared by all four arcs
        const pulse = (Math.sin(timer.getElapsed() * 1.3) + 1) / 2;
        const alphaFor = (intensity: number) =>
          intensity <= 0 ? 0 : intensity * THREE.MathUtils.lerp(0.1, 0.5, pulse);

        const navHw = trailsCanvas.width / 2;
        const navHh = trailsCanvas.height / 2;
        const arcCx = navHw;
        const arcCy = navHh;
        const arcSpan = 0.35; // radians either side of the cardinal direction

        trailsCtx.lineCap = "round";
        // soft neon glow — reset after drawing so it doesn't bleed into the
        // sharp trail lines drawn earlier next frame
        trailsCtx.shadowColor = "#4f46e5";
        trailsCtx.shadowBlur = 15;

        const drawEdgeArc = (centreAngle: number, radius: number, alpha: number) => {
          if (alpha <= 0.003) return;
          trailsCtx.beginPath();
          trailsCtx.arc(arcCx, arcCy, radius, centreAngle - arcSpan, centreAngle + arcSpan);
          trailsCtx.strokeStyle = `rgba(79,70,229,${alpha})`;
          trailsCtx.lineWidth = 2;
          trailsCtx.stroke();
        };

        drawEdgeArc(-Math.PI / 2, navHh * 0.94, alphaFor(intensityFor(closestTop)));
        drawEdgeArc(Math.PI / 2, navHh * 0.94, alphaFor(intensityFor(closestBottom)));
        drawEdgeArc(0, navHw * 0.94, alphaFor(intensityFor(closestRight)));
        drawEdgeArc(Math.PI, navHw * 0.94, alphaFor(intensityFor(closestLeft)));

        trailsCtx.shadowBlur = 0;
        trailsCtx.shadowColor = "transparent";
      }
    };
    animate();

    // ── cleanup ──
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
      starGeo.dispose();
      starMat.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: "#09090f",
      }}
    >
      <div ref={mountRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      {/* speed-trail streaks — plain 2D canvas overlay, not three.js post-processing */}
      <canvas
        ref={trailsCanvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* cockpit frame: edge vignette + sill lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "8%",
          right: "8%",
          bottom: 46,
          height: 1,
          background: "rgba(255,255,255,0.06)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "4%",
          right: "4%",
          bottom: 34,
          height: 1,
          background: "rgba(255,255,255,0.04)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* top-left back link */}
      <Link
        to="/blog"
        style={{
          position: "absolute",
          top: 20,
          left: 24,
          fontFamily: "Georgia, serif",
          fontSize: 13,
          letterSpacing: "0.12em",
          color: "rgba(180,178,200,0.45)",
          textDecoration: "none",
          zIndex: 10,
        }}
      >
        ← /blog
      </Link>

      {/* bottom-centre controls hint (visible 10s, fades over 1s) */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "Georgia, serif",
          fontSize: 11,
          letterSpacing: "0.16em",
          color: "rgba(150,150,180,0.5)",
          pointerEvents: "none",
          opacity: showHint ? 1 : 0,
          transition: "opacity 1000ms ease",
          zIndex: 10,
        }}
      >
        ↑/W forward · ↓/S back · ←/A turn left · →/D turn right · Q/E up/down
      </div>

      {/* bottom-centre permanent Controls button, fades in once the hint is gone */}
      <button
        onClick={() => setControlsModalOpen(true)}
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "Georgia, serif",
          fontSize: 11,
          letterSpacing: "0.14em",
          color: "rgba(180,178,210,0.7)",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(180,178,210,0.2)",
          borderRadius: 999,
          padding: "6px 16px",
          cursor: "pointer",
          opacity: showControlsButton ? 1 : 0,
          pointerEvents: showControlsButton ? "auto" : "none",
          transition: "opacity 1000ms ease",
          zIndex: 10,
        }}
      >
        ⌨ Controls
      </button>

      {/* bottom-right minimap */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          width: 150,
          height: 150,
          background: "rgba(10,10,20,0.5)",
          border: "1px solid rgba(180,178,210,0.22)",
          borderRadius: 8,
          overflow: "hidden",
          zIndex: 10,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 5,
            left: 7,
            fontFamily: "Georgia, serif",
            fontSize: 9,
            letterSpacing: "0.18em",
            color: "rgba(160,158,190,0.6)",
            zIndex: 1,
          }}
        >
          MAP
        </div>
        <canvas
          ref={mapCanvasRef}
          width={150}
          height={150}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>

      {/* controls modal */}
      {controlsModalOpen && (
        <div
          onClick={() => setControlsModalOpen(false)}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(5,5,12,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#12121c",
              border: "1px solid rgba(180,178,210,0.2)",
              borderRadius: 12,
              padding: "28px 36px",
              fontFamily: "Georgia, serif",
              color: "rgba(220,218,235,0.9)",
              minWidth: 260,
            }}
          >
            <div
              style={{
                fontSize: 13,
                letterSpacing: "0.16em",
                color: "rgba(180,178,210,0.6)",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              CONTROLS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["W / ↑", "move forward"],
                ["S / ↓", "move backward"],
                ["A / ←", "turn left"],
                ["D / →", "turn right"],
                ["Q", "move up"],
                ["E", "move down"],
              ].map(([key, action]) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "rgba(220,218,235,0.95)" }}>{key}</span>
                  <span style={{ color: "rgba(160,158,185,0.7)" }}>{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* one-time centred intro popup */}
      {introMounted && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 30,
          }}
        >
          <div
            style={{
              maxWidth: 360,
              textAlign: "center",
              fontFamily: "Georgia, serif",
              fontSize: 14,
              lineHeight: 1.7,
              color: "rgba(225,222,238,0.9)",
              background: "rgba(10,10,20,0.55)",
              border: "1px solid rgba(180,178,210,0.15)",
              borderRadius: 12,
              padding: "20px 28px",
              opacity: introVisible ? 1 : 0,
              transition: "opacity 600ms ease",
            }}
          >
            Between is best explored with a keyboard.
            <br />
            Use your keys to drift through.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Between() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(isMobile());
  }, []);

  if (mobile) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 32,
          background: "#09090f",
          textAlign: "center",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 18,
            letterSpacing: "0.14em",
            color: "rgba(220,218,235,0.8)",
          }}
        >
          Best experienced on desktop
        </div>
        <div
          style={{
            fontSize: 13,
            lineHeight: 1.7,
            maxWidth: 320,
            color: "rgba(150,150,180,0.6)",
          }}
        >
          Between is a first-person float through a field of drifting words. It
          needs a keyboard and mouse to explore.
        </div>
        <Link
          to="/blog"
          style={{
            marginTop: 8,
            fontSize: 13,
            letterSpacing: "0.12em",
            color: "rgba(180,178,200,0.55)",
            textDecoration: "none",
          }}
        >
          ← /blog
        </Link>
      </div>
    );
  }

  return <BetweenScene />;
}
