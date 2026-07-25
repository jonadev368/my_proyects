import React, { useState, useEffect, useRef, useCallback, useMemo, forwardRef, useImperativeHandle, createContext, useContext } from "react";
import {
  Link2, Upload, Zap, Flame, TrendingUp, Mic, Scissors, Sparkles,
  Check, Play, Pause, Smartphone, MonitorPlay, RotateCcw, AudioWaveform,
  MessageSquareText, Gauge, Film, SkipBack, SkipForward, Repeat, Music2,
  Volume2, VolumeX, ShieldCheck, Type, AlignStartVertical, AlignCenterVertical,
  AlignEndVertical, CaseUpper, Terminal, FileJson, FileText, Wand2,
  Move, Volume1, AlertTriangle, Radio, LayoutGrid, ArrowLeft, Trophy, Repeat2,
  Filter, Users, PlayCircle, Layers, Shield, Lock, FileUp, Download, Sparkle,
  Hash, Loader2, FileDown, Globe, Cpu,
} from "lucide-react";

/* ==================================================================== */
/* GLOBAL STYLE                                                          */
/* ==================================================================== */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;800;900&family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
    .scs-root { font-family:'Inter',sans-serif; background:#09090b; color:#e4e4e7; }
    .scs-display { font-family:'Orbitron',sans-serif; }
    .scs-rajdhani { font-family:'Rajdhani',sans-serif; }
    .scs-mono { font-family:'JetBrains Mono',monospace; }
    .scs-glass { background:linear-gradient(155deg,rgba(39,39,42,0.55),rgba(24,24,27,0.55)); border:1px solid rgba(139,92,246,0.18); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px); }
    .scs-glow-purple { box-shadow:0 0 0 1px rgba(139,92,246,0.25), 0 0 40px -12px rgba(139,92,246,0.55); }
    .scs-glow-fire { box-shadow:0 0 0 1px rgba(244,63,94,0.35), 0 0 40px -10px rgba(244,63,94,0.6); }
    .scs-glow-cyan { box-shadow:0 0 0 1px rgba(6,182,212,0.35), 0 0 30px -10px rgba(6,182,212,0.55); }
    .scs-grid-bg { background-image:linear-gradient(rgba(139,92,246,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.06) 1px,transparent 1px); background-size:42px 42px; }
    @keyframes scs-pulse-ring { 0%{opacity:.9;} 50%{opacity:.4;} 100%{opacity:.9;} }
    .scs-pulse-ring { animation:scs-pulse-ring 2.2s ease-in-out infinite; }
    @keyframes scs-scan { 0%{transform:translateY(-100%);} 100%{transform:translateY(100%);} }
    .scs-scanline { animation:scs-scan 2.4s linear infinite; }
    @keyframes scs-pop { 0%{transform:scale(.6);opacity:0;} 55%{transform:scale(1.14);opacity:1;} 100%{transform:scale(1);opacity:1;} }
    .scs-pop { animation:scs-pop .3s cubic-bezier(.2,1.4,.4,1) both; }
    @keyframes scs-slidein { 0%{transform:translateY(12px);opacity:0;} 100%{transform:translateY(0);opacity:1;} }
    .scs-slidein { animation:scs-slidein .25s ease-out both; }
    @keyframes scs-float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-6px);} }
    .scs-float { animation:scs-float 4s ease-in-out infinite; }
    @keyframes scs-spin { to { transform: rotate(360deg); } }
    .scs-spin { animation: scs-spin 1s linear infinite; }
    @keyframes scs-stagger-in { 0%{transform:translateY(10px) scale(.98);opacity:0;} 100%{transform:translateY(0) scale(1);opacity:1;} }
    .scs-stagger { animation: scs-stagger-in .35s cubic-bezier(.2,1,.3,1) both; }
    .scs-tap { transition: transform .12s cubic-bezier(.34,1.56,.64,1), filter .12s ease; }
    .scs-tap:active { transform: scale(0.95); }
    .scs-glow-trail { position:relative; }
    .scs-glow-trail::before { content:''; position:absolute; inset:-1px; border-radius:inherit; background:radial-gradient(180px circle at var(--gx,50%) var(--gy,50%), rgba(139,92,246,0.35), transparent 60%); opacity:0; transition:opacity .25s ease; pointer-events:none; }
    .scs-glow-trail:hover::before { opacity:1; }
    .scs-scrollbar::-webkit-scrollbar { width:6px; height:6px; }
    .scs-scrollbar::-webkit-scrollbar-thumb { background:rgba(139,92,246,0.4); border-radius:4px; }
    .scs-scrollbar::-webkit-scrollbar-track { background:transparent; }
    .scs-focus:focus-visible { outline:2px solid #8b5cf6; outline-offset:2px; }
    input[type=range].scs-slider { -webkit-appearance:none; appearance:none; height:4px; border-radius:4px; background:#27272a; }
    input[type=range].scs-slider::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:#8b5cf6; box-shadow:0 0 10px rgba(139,92,246,0.8); cursor:pointer; margin-top:-5px; }
    input[type=range].scs-slider::-moz-range-thumb { width:14px; height:14px; border:none; border-radius:50%; background:#8b5cf6; box-shadow:0 0 10px rgba(139,92,246,0.8); cursor:pointer; }
    @media (prefers-reduced-motion: reduce) { .scs-pulse-ring,.scs-scanline,.scs-pop,.scs-slidein,.scs-float,.scs-spin,.scs-stagger { animation:none !important; } }
  `}</style>
);

/* ==================================================================== */
/* SECURITY LAYER                                                        */
/* ==================================================================== */
/** Defense-in-depth text sanitizer. React already escapes every {value} it
 * renders, so classic XSS via JSX text needs dangerouslySetInnerHTML (never
 * used here). DOMPurify isn't installable in this sandbox (fixed import
 * allowlist, doesn't include it), so this strips tags/control/zero-width
 * chars and caps length at every trust boundary instead. */
function sanitizeText(input, maxLen = 200) {
  if (typeof input !== "string") return "";
  return input.replace(/<[^>]*>/g, "").replace(/[\u0000-\u001F\u007F]/g, "").replace(/[\u200B-\u200D\uFEFF]/g, "").trim().slice(0, maxLen);
}
/** Exported FFmpeg commands are plain text a user pastes into a real
 * terminal — an unescaped filename with shell metacharacters could break
 * out of the quoted argument. Strips to a conservative safe set. */
function shellSafeFilename(name, fallback = "input.mp4") {
  const cleaned = sanitizeText(name, 120).replace(/[^a-zA-Z0-9 ._-]/g, "_");
  return cleaned.length ? cleaned : fallback;
}
/** No real external API is called anywhere in this build (channel-handle
 * path is synthetic demo data) — this scaffolds rate-limiting/backoff so a
 * future real YouTube Data API integration doesn't start unguarded. */
function createRateLimiter({ maxPerMinute = 20 } = {}) {
  const timestamps = [];
  return async function limited(fn, { retries = 3 } = {}) {
    const now = Date.now();
    while (timestamps.length && now - timestamps[0] > 60000) timestamps.shift();
    if (timestamps.length >= maxPerMinute) await new Promise((r) => setTimeout(r, Math.max(0, 60000 - (now - timestamps[0]))));
    timestamps.push(Date.now());
    let attempt = 0;
    while (true) { try { return await fn(); } catch (e) { attempt++; if (attempt > retries) throw e; await new Promise((r) => setTimeout(r, 300 * 2 ** attempt)); } }
  };
}
const channelFetchLimiter = createRateLimiter({ maxPerMinute: 20 });
/** Hand-rolled schema validator (Zod isn't in this sandbox's import
 * allowlist either) — rejects malformed/out-of-range imported project JSON
 * outright rather than partially trusting it. */
function inRange(v, min, max) { return typeof v === "number" && Number.isFinite(v) && v >= min && v <= max; }
function validateAuditImport(raw) {
  const errors = [];
  if (!raw || typeof raw !== "object") return { ok: false, errors: ["Root must be an object"] };
  if (!Array.isArray(raw.sources)) errors.push("`sources` must be an array");
  if (!Array.isArray(raw.clips)) errors.push("`clips` must be an array");
  if (errors.length) return { ok: false, errors };
  const sourceIds = new Set();
  raw.sources.forEach((s, i) => {
    if (typeof s?.id !== "string" || !s.id) errors.push(`sources[${i}].id invalid`); else sourceIds.add(s.id);
    if (typeof s?.label !== "string") errors.push(`sources[${i}].label invalid`);
    if (s?.type !== "file" && s?.type !== "demo") errors.push(`sources[${i}].type invalid`);
  });
  raw.clips.forEach((c, i) => {
    if (typeof c?.id !== "string" || !c.id) errors.push(`clips[${i}].id invalid`);
    if (typeof c?.sourceId !== "string" || !sourceIds.has(c.sourceId)) errors.push(`clips[${i}].sourceId invalid`);
    if (!inRange(c?.start, 0, 100000)) errors.push(`clips[${i}].start invalid`);
    if (!inRange(c?.end, 0, 100000) || c.end <= c.start) errors.push(`clips[${i}].end invalid`);
    if (!inRange(c?.score, 0, 100)) errors.push(`clips[${i}].score invalid`);
    const b = c?.breakdown || {};
    ["retentionIndex", "peakReactionDensity", "loopability"].forEach((k) => { if (!inRange(b[k], 0, 100)) errors.push(`clips[${i}].breakdown.${k} invalid`); });
    if (!Array.isArray(c?.words) || c.words.some((w) => typeof w !== "string")) errors.push(`clips[${i}].words invalid`);
  });
  return { ok: errors.length === 0, errors: errors.slice(0, 12) };
}
const REFERENCE_SECURITY_DOC = `# StreamClip Studio — deployment security reference

This sandboxed preview can't enforce real HTTP headers, run Web Workers with
full confidence across all embedding contexts, or install npm packages — so
here's what to apply for a real deployment.

## Content-Security-Policy (real server header, not just a meta tag —
## meta tags cannot set frame-ancestors)
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'wasm-unsafe-eval';
  object-src 'none';
  frame-ancestors 'none';
  base-uri 'self';
  img-src 'self' data: blob:;
  media-src 'self' blob:;
  connect-src 'self' https://api.anthropic.com;
  worker-src 'self' blob:;

## Real packages this build stands in for
  npm install dompurify zod
Swap sanitizeText()/validateAuditImport() for the real libraries.

## API keys
Never ship a secret API key client-side, masked or not — proxy real calls
through a server you control.

## Storage
This preview uses the platform's own persistent key-value storage API in
place of localStorage/IndexedDB, since neither works reliably inside this
sandbox. A real deployment can use either directly.
`;

/* ==================================================================== */
/* i18n — core strings only, not exhaustive                             */
/* ==================================================================== */
const STRINGS = {
  en: {
    tagline: "Hardened. Still honest.", dashboard: "Channel Audit Dashboard", newAudit: "New audit",
    import: "Import", videosAnalyzed: "Videos analyzed", avgScore: "Average score", topScore: "Top score found",
    allClips: "All Clips", bestHooks: "Best Hooks", funniest: "Funniest Moments", highEnergy: "High-Energy Plays", retention: "Longest Retention",
    dropFiles: "Drop multiple MP4 / WEBM files here, or click to browse", realBatch: "Real batch peak-detection across every file",
    audit: "Audit", channelPlaceholder: "@channelname or channel URL (generates demo data)", leaderboard: "Leaderboard",
  },
  es: {
    tagline: "Reforzado. Sigue siendo honesto.", dashboard: "Panel de Auditoría de Canal", newAudit: "Nueva auditoría",
    import: "Importar", videosAnalyzed: "Videos analizados", avgScore: "Puntuación media", topScore: "Puntuación máxima",
    allClips: "Todos los Clips", bestHooks: "Mejores Ganchos", funniest: "Momentos Más Graciosos", highEnergy: "Jugadas de Alta Energía", retention: "Mayor Retención",
    dropFiles: "Suelta varios archivos MP4 / WEBM aquí, o haz clic para buscar", realBatch: "Detección de picos real en cada archivo",
    audit: "Auditar", channelPlaceholder: "@canal o URL del canal (genera datos de demostración)", leaderboard: "Clasificación",
  },
};
const LangContext = createContext({ lang: "en", t: (k) => STRINGS.en[k] || k, setLang: () => {} });
function useLang() { return useContext(LangContext); }
function LangProvider({ children }) {
  const [lang, setLang] = useState("en");
  const t = useCallback((k) => STRINGS[lang][k] ?? STRINGS.en[k] ?? k, [lang]);
  return <LangContext.Provider value={{ lang, t, setLang }}>{children}</LangContext.Provider>;
}

/* ==================================================================== */
/* SFX SYNTHESIZER — native Web Audio oscillators, zero audio files      */
/* ==================================================================== */
const SfxContext = createContext(null);
function useSfx() { return useContext(SfxContext); }
function SfxProvider({ children }) {
  const ctxRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await window.storage?.get?.("sfx-prefs", false);
        if (saved?.value) { const v = JSON.parse(saved.value); if (typeof v.muted === "boolean") setMuted(v.muted); if (typeof v.volume === "number") setVolume(v.volume); }
      } catch { /* no saved prefs yet, or storage unavailable — defaults stand */ }
      setLoaded(true);
    })();
  }, []);
  useEffect(() => { if (!loaded) return; window.storage?.set?.("sfx-prefs", JSON.stringify({ muted, volume }), false).catch(() => {}); }, [muted, volume, loaded]);

  const ensureCtx = () => {
    if (!ctxRef.current) { const Ctx = window.AudioContext || window.webkitAudioContext; ctxRef.current = new Ctx(); }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  };
  const blip = useCallback((f0, f1, dur, type, peak) => {
    if (muted || volume <= 0) return;
    try {
      const ctx = ensureCtx(); const t0 = ctx.currentTime;
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = type; osc.frequency.setValueAtTime(f0, t0); osc.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur);
      gain.gain.setValueAtTime(0.0001, t0); gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak * volume), t0 + 0.01); gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(t0); osc.stop(t0 + dur + 0.02);
    } catch { /* audio unavailable — fail silently, never block the UI action */ }
  }, [muted, volume]);
  const playHover = useCallback(() => blip(1800, 2600, 0.045, "sine", 0.05), [blip]);
  const playClick = useCallback(() => blip(650, 210, 0.09, "square", 0.12), [blip]);
  const playViralAlert = useCallback(() => {
    if (muted || volume <= 0) return;
    try {
      const ctx = ensureCtx(); const t0 = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.type = "sawtooth"; osc.frequency.value = freq;
        const start = t0 + i * 0.07;
        gain.gain.setValueAtTime(0.0001, start); gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.16 * volume), start + 0.02); gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);
        osc.connect(gain); gain.connect(ctx.destination); osc.start(start); osc.stop(start + 0.6);
      });
    } catch { /* fail silently */ }
  }, [muted, volume]);

  return <SfxContext.Provider value={{ playHover, playClick, playViralAlert, muted, setMuted, volume, setVolume }}>{children}</SfxContext.Provider>;
}
function SfxBar() {
  const sfx = useSfx();
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      {open && <input type="range" min={0} max={1} step={0.05} value={sfx.volume} onChange={(e) => sfx.setVolume(Number(e.target.value))} className="scs-slider w-20 scs-glass rounded-full px-2 py-1" />}
      <button onClick={() => setOpen((o) => !o)} onMouseEnter={sfx.playHover} className="scs-focus scs-tap scs-glass rounded-full p-2.5" title="Sound settings"><AudioWaveform size={14} className="text-zinc-300" /></button>
      <button onClick={() => sfx.setMuted((m) => !m)} onMouseEnter={sfx.playHover} className="scs-focus scs-tap scs-glass rounded-full p-2.5" title={sfx.muted ? "Unmute" : "Mute"}>{sfx.muted ? <VolumeX size={14} className="text-zinc-400" /> : <Volume2 size={14} className="text-violet-300" />}</button>
    </div>
  );
}

/* ==================================================================== */
/* CONFETTI — hand-rolled canvas burst (canvas-confetti isn't importable  */
/* in this sandbox's fixed library allowlist)                            */
/* ==================================================================== */
function ConfettiBurst({ triggerKey }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!triggerKey) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = (canvas.width = window.innerWidth), h = (canvas.height = window.innerHeight);
    const colors = ["#8b5cf6", "#06b6d4", "#f43f5e", "#facc15", "#22c55e"];
    const particles = Array.from({ length: 90 }, () => ({
      x: w / 2 + (Math.random() - 0.5) * 140, y: h * 0.28,
      vx: (Math.random() - 0.5) * 11, vy: -Math.random() * 11 - 4,
      size: 4 + Math.random() * 5, color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3, life: 1,
    }));
    let raf;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      let alive = false;
      particles.forEach((p) => {
        p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 0.011;
        if (p.life > 0) {
          alive = true;
          ctx.save(); ctx.globalAlpha = Math.max(0, p.life); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });
      if (alive) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [triggerKey]);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[200]" />;
}

/* ==================================================================== */
/* SHARED HELPERS                                                        */
/* ==================================================================== */
const TRANSCRIPT_BANK = [
  "no way that actually just happened right now", "okay okay wait wait watch this watch this",
  "I have never seen anything like that in my life", "let's go let's go let's GO that's insane",
  "chat is this real I need someone to confirm", "we are so back this is the greatest comeback ever",
  "absolutely not there's no way he pulls this off", "hold on hold on rewind that immediately",
  "this is why I love this game so much honestly", "everybody needs to see this clip right now",
];
function seededRandom(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
const fmtTime = (secs) => { const m = Math.floor(secs / 60).toString().padStart(2, "0"); const s = Math.floor(secs % 60).toString().padStart(2, "0"); const cs = Math.floor((secs % 1) * 100).toString().padStart(2, "0"); return `${m}:${s}.${cs}`; };
const fmtShort = (secs) => `${Math.floor(secs / 60)}:${Math.floor(secs % 60).toString().padStart(2, "0")}`;
const scoreTier = (score) => { if (score >= 90) return { label: "Guaranteed Feed Placement", color: "#f43f5e", icon: Flame, glow: "scs-glow-fire" }; if (score >= 75) return { label: "Strong Engagement", color: "#8b5cf6", icon: TrendingUp, glow: "scs-glow-purple" }; return { label: "Solid Moment", color: "#06b6d4", icon: Gauge, glow: "scs-glow-cyan" }; };
function download(filename, content, type = "text/plain") { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url); }
function csvEscape(v) { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }

/* ==================================================================== */
/* REAL AUDIO ANALYSIS + WEB WORKER OFFLOAD                               */
/* ==================================================================== */
function averageChannels(buffer) {
  if (buffer.numberOfChannels === 1) return buffer.getChannelData(0);
  const a = buffer.getChannelData(0), b = buffer.getChannelData(1);
  const out = new Float32Array(a.length);
  for (let i = 0; i < a.length; i++) out[i] = (a[i] + b[i]) / 2;
  return out;
}
function movingAverage(arr, radius) {
  const out = new Float32Array(arr.length);
  for (let i = 0; i < arr.length; i++) { let sum = 0, n = 0; for (let k = -radius; k <= radius; k++) { const idx = i + k; if (idx >= 0 && idx < arr.length) { sum += arr[idx]; n++; } } out[i] = sum / n; }
  return out;
}
/** Pure, shared math: same logic runs on the main thread (fallback) and is
 * duplicated as a string for the Worker below (Workers can't import this
 * function directly — in a real repo this would be one shared module
 * imported by both main.js and worker.js; the sandbox's single-file
 * constraint forces this copy). */
function analyzeChannelPeaks(channelData, sampleRate, duration, seedBase) {
  const windowSec = 0.5;
  const windowSize = Math.max(1, Math.floor(sampleRate * windowSec));
  const numWindows = Math.floor(channelData.length / windowSize);
  if (numWindows < 4) return { clips: [], totalDuration: duration };
  const energy = new Float32Array(numWindows);
  const stride = 4;
  for (let w = 0; w < numWindows; w++) { let sum = 0, n = 0; const offset = w * windowSize; for (let i = 0; i < windowSize; i += stride) { const v = channelData[offset + i]; sum += v * v; n++; } energy[w] = Math.sqrt(sum / Math.max(1, n)); }
  const smoothed = movingAverage(energy, 3);
  let max = 1e-6; for (let i = 0; i < smoothed.length; i++) if (smoothed[i] > max) max = smoothed[i];
  const norm = smoothed.map((v) => v / max);
  const rand = seededRandom(seedBase + 11);
  const lenPool = [30, 40, 50, 60];
  const clipCount = Math.min(6, Math.max(1, Math.floor(duration / 22)));
  const used = new Array(numWindows).fill(false);
  const found = [];
  for (let c = 0; c < clipCount; c++) {
    const lenSec = Math.min(lenPool[Math.floor(rand() * lenPool.length)], Math.max(5, duration - 1));
    const lenW = Math.max(2, Math.round(lenSec / windowSec));
    let bestStart = -1, bestScore = -1;
    for (let s = 0; s <= numWindows - lenW; s++) {
      let blocked = false;
      for (let k = 0; k < lenW; k += 4) if (used[s + k]) { blocked = true; break; }
      if (blocked) continue;
      let sum = 0; for (let k = 0; k < lenW; k++) sum += norm[s + k];
      const avg = sum / lenW;
      if (avg > bestScore) { bestScore = avg; bestStart = s; }
    }
    if (bestStart === -1) break;
    for (let k = 0; k < lenW; k++) used[bestStart + k] = true;
    let regionPeak = 1e-6; for (let k = 0; k < lenW; k++) if (norm[bestStart + k] > regionPeak) regionPeak = norm[bestStart + k];
    let sustainCount = 0; for (let k = 0; k < lenW; k++) if (norm[bestStart + k] >= regionPeak * 0.65) sustainCount++;
    const retentionIndex = Math.round(Math.min(100, bestScore * 60 + (sustainCount / lenW) * 40));
    let peakCount = 0;
    for (let k = 1; k < lenW - 1; k++) { const v = norm[bestStart + k]; if (v > norm[bestStart + k - 1] && v > norm[bestStart + k + 1] && v > bestScore * 1.25) peakCount++; }
    const peakReactionDensity = Math.round(Math.min(100, 32 + peakCount * 11));
    const edgeSamples = Math.max(1, Math.round(1 / windowSec));
    let startAvg = 0, endAvg = 0;
    for (let k = 0; k < edgeSamples; k++) { startAvg += norm[bestStart + k] || 0; endAvg += norm[bestStart + lenW - 1 - k] || 0; }
    startAvg /= edgeSamples; endAvg /= edgeSamples;
    const loopability = Math.round(Math.max(0, 100 - Math.abs(startAvg - endAvg) * 140));
    const startSec = bestStart * windowSec, endSec = Math.min(duration, startSec + lenW * windowSec);
    found.push({ startSec, endSec, retentionIndex, peakReactionDensity, loopability });
  }
  found.sort((a, b) => a.startSec - b.startSec);
  return { clips: found, totalDuration: duration };
}
const PEAK_WORKER_SOURCE = `
self.onmessage = function(e){
  const { channelBuffer, sampleRate, duration, seedBase } = e.data;
  const channelData = new Float32Array(channelBuffer);
  function seededRandom(seed){ let s=seed%2147483647; if(s<=0)s+=2147483646; return ()=>{ s=(s*16807)%2147483647; return (s-1)/2147483646; }; }
  function movingAverage(arr,radius){ const out=new Float32Array(arr.length); for(let i=0;i<arr.length;i++){ let sum=0,n=0; for(let k=-radius;k<=radius;k++){ const idx=i+k; if(idx>=0&&idx<arr.length){sum+=arr[idx];n++;} } out[i]=sum/n; } return out; }
  const windowSec=0.5, windowSize=Math.max(1,Math.floor(sampleRate*windowSec));
  const numWindows=Math.floor(channelData.length/windowSize);
  if(numWindows<4){ self.postMessage({clips:[],totalDuration:duration}); return; }
  const energy=new Float32Array(numWindows), stride=4;
  for(let w=0;w<numWindows;w++){ let sum=0,n=0; const offset=w*windowSize; for(let i=0;i<windowSize;i+=stride){ const v=channelData[offset+i]; sum+=v*v; n++; } energy[w]=Math.sqrt(sum/Math.max(1,n)); }
  const smoothed=movingAverage(energy,3);
  let max=1e-6; for(let i=0;i<smoothed.length;i++) if(smoothed[i]>max) max=smoothed[i];
  const norm=smoothed.map(v=>v/max);
  const rand=seededRandom(seedBase+11), lenPool=[30,40,50,60];
  const clipCount=Math.min(6,Math.max(1,Math.floor(duration/22)));
  const used=new Array(numWindows).fill(false), found=[];
  for(let c=0;c<clipCount;c++){
    const lenSec=Math.min(lenPool[Math.floor(rand()*lenPool.length)], Math.max(5,duration-1));
    const lenW=Math.max(2,Math.round(lenSec/windowSec));
    let bestStart=-1,bestScore=-1;
    for(let s=0;s<=numWindows-lenW;s++){
      let blocked=false;
      for(let k=0;k<lenW;k+=4) if(used[s+k]){blocked=true;break;}
      if(blocked) continue;
      let sum=0; for(let k=0;k<lenW;k++) sum+=norm[s+k];
      const avg=sum/lenW;
      if(avg>bestScore){bestScore=avg;bestStart=s;}
    }
    if(bestStart===-1) break;
    for(let k=0;k<lenW;k++) used[bestStart+k]=true;
    let regionPeak=1e-6; for(let k=0;k<lenW;k++) if(norm[bestStart+k]>regionPeak) regionPeak=norm[bestStart+k];
    let sustainCount=0; for(let k=0;k<lenW;k++) if(norm[bestStart+k]>=regionPeak*0.65) sustainCount++;
    const retentionIndex=Math.round(Math.min(100,bestScore*60+(sustainCount/lenW)*40));
    let peakCount=0;
    for(let k=1;k<lenW-1;k++){ const v=norm[bestStart+k]; if(v>norm[bestStart+k-1] && v>norm[bestStart+k+1] && v>bestScore*1.25) peakCount++; }
    const peakReactionDensity=Math.round(Math.min(100,32+peakCount*11));
    const edgeSamples=Math.max(1,Math.round(1/windowSec));
    let startAvg=0,endAvg=0;
    for(let k=0;k<edgeSamples;k++){ startAvg+=norm[bestStart+k]||0; endAvg+=norm[bestStart+lenW-1-k]||0; }
    startAvg/=edgeSamples; endAvg/=edgeSamples;
    const loopability=Math.round(Math.max(0,100-Math.abs(startAvg-endAvg)*140));
    const startSec=bestStart*windowSec, endSec=Math.min(duration,startSec+lenW*windowSec);
    found.push({startSec,endSec,retentionIndex,peakReactionDensity,loopability});
  }
  found.sort((a,b)=>a.startSec-b.startSec);
  self.postMessage({ clips: found, totalDuration: duration });
};`;
/** Runs the heavy peak-detection pass on a background thread via a Blob
 * Worker, falling back to the main thread if Worker creation fails for any
 * reason (restricted sandbox, unsupported browser, etc). */
function analyzePeaksInWorker(channelData, sampleRate, duration, seedBase) {
  return new Promise((resolve) => {
    try {
      if (!window.Worker) throw new Error("Workers unavailable");
      const blob = new Blob([PEAK_WORKER_SOURCE], { type: "application/javascript" });
      const workerUrl = URL.createObjectURL(blob);
      const worker = new Worker(workerUrl);
      const cleanup = () => { worker.terminate(); URL.revokeObjectURL(workerUrl); };
      worker.onmessage = (e) => { cleanup(); resolve(e.data); };
      worker.onerror = () => { cleanup(); resolve(analyzeChannelPeaks(channelData, sampleRate, duration, seedBase)); };
      const buf = channelData.buffer.slice(0);
      worker.postMessage({ channelBuffer: buf, sampleRate, duration, seedBase }, [buf]);
    } catch { resolve(analyzeChannelPeaks(channelData, sampleRate, duration, seedBase)); }
  });
}
const overallScore = (b) => Math.round(b.retentionIndex * 0.4 + b.peakReactionDensity * 0.35 + b.loopability * 0.25);
function buildClipsFromPeaks(peakResult, seedBase, source) {
  const rand = seededRandom(seedBase + 29);
  return peakResult.clips.map((p, i) => {
    const breakdown = { retentionIndex: p.retentionIndex, peakReactionDensity: p.peakReactionDensity, loopability: p.loopability };
    const words = Array.from({ length: 5 }, () => TRANSCRIPT_BANK[Math.floor(rand() * TRANSCRIPT_BANK.length)]).join(" ").split(" ");
    return { id: `clip-${source.id}-${i}`, sourceId: source.id, sourceLabel: source.label, index: i, title: `Highlight ${i + 1}`, start: p.startSec, end: p.endSec, duration: p.endSec - p.startSec, score: overallScore(breakdown), breakdown, words, real: true };
  }).sort((a, b) => b.score - a.score);
}
function buildDemoChannel(handleRaw) {
  const handle = sanitizeText(handleRaw, 60);
  const seedBase = Array.from(handle).reduce((a, c) => a + c.charCodeAt(0), 0) || 42;
  const rand = seededRandom(seedBase);
  const channelName = sanitizeText(handle.replace(/^@/, "").replace(/^https?:\/\/(www\.)?youtube\.com\/(channel|c|@)?/, ""), 40) || "Channel";
  const videoCount = 5 + Math.floor(rand() * 4);
  const sources = [], clips = [];
  for (let v = 0; v < videoCount; v++) {
    const vRand = seededRandom(seedBase + v * 97 + 3);
    const totalDurationSec = 480 + Math.floor(vRand() * 3600);
    const hue = 200 + Math.floor(vRand() * 160);
    const source = { id: `demo-${seedBase}-${v}`, type: "demo", label: `${channelName} — VOD #${v + 1}`, totalDurationSec, hue };
    sources.push(source);
    const clipCount = 3 + Math.floor(vRand() * 3);
    let cursor = 15;
    for (let i = 0; i < clipCount; i++) {
      const duration = 30 + Math.floor(vRand() * 30);
      const start = cursor, end = start + duration;
      cursor = end + Math.floor(20 + vRand() * 90);
      if (end > totalDurationSec) break;
      const breakdown = { retentionIndex: Math.round(42 + vRand() * 58), peakReactionDensity: Math.round(35 + vRand() * 65), loopability: Math.round(30 + vRand() * 70) };
      const words = Array.from({ length: 5 }, () => TRANSCRIPT_BANK[Math.floor(vRand() * TRANSCRIPT_BANK.length)]).join(" ").split(" ");
      clips.push({ id: `clip-${source.id}-${i}`, sourceId: source.id, sourceLabel: source.label, index: i, title: `Highlight ${i + 1}`, start, end, duration, score: overallScore(breakdown), breakdown, words, real: false });
    }
  }
  return { sources, clips: clips.sort((a, b) => b.score - a.score) };
}

/* ==================================================================== */
/* CAPTION PRESETS                                                       */
/* ==================================================================== */
const CAPTION_PRESETS = {
  mrbeast: { label: "MrBeast", active: "#facc15", inactive: "#ffffff", mode: "stroke", swatch: "linear-gradient(135deg,#facc15,#ffffff)" },
  hormozi: { label: "Hormozi", active: "#052e12", activeBg: "#22c55e", inactive: "#ffffff", mode: "highlight", swatch: "linear-gradient(135deg,#22c55e,#ffffff)" },
  neon: { label: "Neon Cyber", active: "#e9d5ff", glow: "#8b5cf6", inactive: "#d4d4d8", mode: "glow", swatch: "linear-gradient(135deg,#8b5cf6,#06b6d4)" },
};
const POSITIONS = { top: "top-6", center: "top-1/2 -translate-y-1/2", bottom: "bottom-6" };
const ASS_ALIGN = { top: 8, center: 5, bottom: 2 };
function hexToAss(hex) { const h = hex.replace("#", ""); return `&H00${h.slice(4, 6)}${h.slice(2, 4)}${h.slice(0, 2)}`.toUpperCase(); }

/* ==================================================================== */
/* TOAST                                                                 */
/* ==================================================================== */
function useToast() {
  const [toast, setToast] = useState(null);
  const show = useCallback((msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); }, []);
  const node = toast ? <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] scs-slidein"><div className="scs-glass scs-glow-purple rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm text-white max-w-sm"><Check size={15} style={{ color: "#8b5cf6" }} className="shrink-0" /> {toast}</div></div> : null;
  return { show, node };
}

/* ==================================================================== */
/* SCORE RING + MINI BARS                                                */
/* ==================================================================== */
function ScoreRing({ score, color, size = 58 }) {
  const r = (size - 8) / 2, c = 2 * Math.PI * r, offset = c - (score / 100) * c;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="5" fill="none" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease-out" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center"><span className="scs-mono font-bold text-sm text-white">{score}</span></div>
    </div>
  );
}
function MiniBar({ label, value, color }) { return <div className="flex items-center gap-1.5"><span className="text-[9px] text-zinc-500 w-6 shrink-0">{label}</span><div className="h-1 flex-1 rounded-full bg-zinc-800 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} /></div></div>; }

/* ==================================================================== */
/* CAPTIONS (DOM + canvas)                                               */
/* ==================================================================== */
function CaptionOverlay({ words, relTime, duration, preset, fontSize, uppercase, position }) {
  const cfg = CAPTION_PRESETS[preset];
  const idx = Math.min(words.length - 1, Math.max(0, Math.floor((relTime / Math.max(0.01, duration)) * words.length)));
  const startAt = Math.max(0, idx - 1);
  const visible = words.slice(startAt, startAt + 4);
  return (
    <div className={`absolute inset-x-0 flex justify-center px-4 pointer-events-none ${POSITIONS[position]}`}>
      <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 max-w-[92%]">
        {visible.map((w, i) => {
          const g = startAt + i, active = g === idx;
          const text = uppercase ? w.toUpperCase() : w;
          const size = active ? fontSize : fontSize * 0.78;
          let style = { fontSize: size, fontFamily: "'Rajdhani',sans-serif", fontWeight: 800, letterSpacing: 0.3, padding: cfg.mode === "highlight" && active ? "2px 8px" : 0, borderRadius: 6, transition: "font-size .15s ease" };
          if (cfg.mode === "stroke") { style.color = active ? cfg.active : cfg.inactive; style.textShadow = "-1.5px -1.5px 0 #000,1.5px -1.5px 0 #000,-1.5px 1.5px 0 #000,1.5px 1.5px 0 #000,0 3px 10px rgba(0,0,0,.7)"; }
          else if (cfg.mode === "highlight") { style.color = active ? cfg.active : cfg.inactive; style.background = active ? cfg.activeBg : "transparent"; style.textShadow = active ? "none" : "0 2px 8px rgba(0,0,0,.8)"; }
          else { style.color = active ? cfg.active : cfg.inactive; style.textShadow = active ? `0 0 10px ${cfg.glow},0 0 22px ${cfg.glow},0 2px 6px rgba(0,0,0,.8)` : "0 2px 8px rgba(0,0,0,.8)"; }
          return <span key={`${g}-${w}`} className={active ? "scs-pop" : ""} style={style}>{text}</span>;
        })}
      </div>
    </div>
  );
}
function drawCaptionsOnCanvas(ctx2d, canvas, clip, relTime, settings) {
  const cfg = CAPTION_PRESETS[settings.preset];
  const idx = Math.min(clip.words.length - 1, Math.max(0, Math.floor((relTime / clip.duration) * clip.words.length)));
  const word = settings.uppercase ? clip.words[idx].toUpperCase() : clip.words[idx];
  const fontPx = Math.round(settings.fontSize * (canvas.width / 300));
  ctx2d.font = `800 ${fontPx}px Rajdhani, sans-serif`; ctx2d.textAlign = "center"; ctx2d.textBaseline = "middle";
  const x = canvas.width / 2;
  const y = settings.position === "top" ? canvas.height * 0.12 : settings.position === "center" ? canvas.height * 0.5 : canvas.height * 0.86;
  if (cfg.mode === "highlight") {
    const padding = fontPx * 0.3, w = ctx2d.measureText(word).width;
    ctx2d.fillStyle = cfg.activeBg; ctx2d.fillRect(x - w / 2 - padding, y - fontPx / 2 - padding / 2, w + padding * 2, fontPx + padding);
    ctx2d.fillStyle = cfg.active; ctx2d.fillText(word, x, y);
  } else if (cfg.mode === "stroke") {
    ctx2d.lineWidth = fontPx * 0.09; ctx2d.strokeStyle = "#000"; ctx2d.strokeText(word, x, y);
    ctx2d.fillStyle = cfg.active; ctx2d.fillText(word, x, y);
  } else {
    ctx2d.shadowColor = cfg.glow; ctx2d.shadowBlur = fontPx * 0.5; ctx2d.fillStyle = cfg.active; ctx2d.fillText(word, x, y); ctx2d.shadowBlur = 0;
  }
}
function drawVideoCover(ctx2d, video, canvas, focusX, isVertical) {
  const vw = video.videoWidth, vh = video.videoHeight; if (!vw || !vh) return;
  const targetRatio = canvas.width / canvas.height, srcRatio = vw / vh;
  let sx, sy, sw, sh;
  if (srcRatio > targetRatio) { sh = vh; sw = vh * targetRatio; sy = 0; const maxX = vw - sw; sx = isVertical ? maxX * focusX : maxX / 2; }
  else { sw = vw; sh = vw / targetRatio; sx = 0; sy = (vh - sh) / 2; }
  ctx2d.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
}

/* ==================================================================== */
/* LIVE WAVEFORM                                                         */
/* ==================================================================== */
function LiveWaveform({ data, bars = 28, color = "#8b5cf6", height = 32 }) {
  const arr = data && data.length === bars ? data : Array.from({ length: bars }, () => 6);
  return <div className="flex items-end justify-center gap-[3px]" style={{ height }}>{arr.map((v, i) => <div key={i} className="rounded-full" style={{ width: 3, height: `${Math.max(8, v)}%`, background: color, opacity: 0.9, transition: "height 60ms linear" }} />)}</div>;
}
function bucketize(byteArr, buckets) {
  const out = new Array(buckets).fill(0);
  const chunk = Math.floor(byteArr.length / buckets) || 1;
  for (let b = 0; b < buckets; b++) { let sum = 0, n = 0; for (let i = b * chunk; i < (b + 1) * chunk && i < byteArr.length; i++) { sum += byteArr[i]; n++; } out[b] = n ? (sum / n / 255) * 100 : 0; }
  return out;
}

/* ==================================================================== */
/* REAL PLAYER — stable <video>, real Web Audio graph, real local render */
/* ==================================================================== */
const RealPlayer = forwardRef(function RealPlayer({ file, clip, settings, setSettings, playback, setPlayback, toast }, ref) {
  const sfx = useSfx();
  const videoRef = useRef(null);
  const audioCtxRef = useRef(null);
  const gainRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);

  const [audioReady, setAudioReady] = useState(false);
  const [waveData, setWaveData] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const [relTime, setRelTime] = useState(0);
  const [rendering, setRendering] = useState(false);

  const videoUrl = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(videoUrl), [videoUrl]);

  const absStart = clip.start + playback.trimStart;
  const absEnd = clip.start + playback.trimEnd;

  const ensureGraph = useCallback(() => {
    if (audioCtxRef.current) return audioCtxRef.current;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const node = ctx.createMediaElementSource(videoRef.current);
      const gain = ctx.createGain(); const analyser = ctx.createAnalyser();
      analyser.fftSize = 128; gain.gain.value = settings.masterVolume;
      node.connect(gain); gain.connect(analyser); analyser.connect(ctx.destination);
      audioCtxRef.current = ctx; gainRef.current = gain; analyserRef.current = analyser;
      return ctx;
    } catch (e) { console.error("Audio graph error", e); toast.show("Couldn't initialize audio — try again"); return null; }
  }, [settings.masterVolume, toast]);

  const enableSound = async () => { const ctx = ensureGraph(); if (!ctx) return; if (ctx.state === "suspended") await ctx.resume(); if (videoRef.current) videoRef.current.muted = false; setAudioReady(true); };
  const play = async () => {
    await enableSound();
    if (videoRef.current) {
      if (videoRef.current.currentTime < absStart || videoRef.current.currentTime >= absEnd) videoRef.current.currentTime = absStart;
      try { await videoRef.current.play(); setPlayback((p) => ({ ...p, playing: true })); }
      catch (e) { console.error(e); toast.show("Playback blocked — click again to allow audio"); }
    }
  };
  const pause = () => { videoRef.current?.pause(); setPlayback((p) => ({ ...p, playing: false })); };

  useEffect(() => {
    const onKey = (e) => { if (e.code !== "Space") return; const tag = document.activeElement?.tagName; if (tag === "INPUT" || tag === "TEXTAREA") return; e.preventDefault(); playback.playing ? pause() : play(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playback.playing, absStart, absEnd]);

  useEffect(() => { if (videoRef.current) { videoRef.current.currentTime = clip.start; setRelTime(0); } setPlayback((p) => ({ ...p, playing: false })); setVideoError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clip.id, videoUrl]);
  useEffect(() => { if (videoRef.current) videoRef.current.playbackRate = playback.speed; }, [playback.speed]);
  useEffect(() => { if (gainRef.current) gainRef.current.gain.value = settings.muted ? 0 : settings.masterVolume; }, [settings.masterVolume, settings.muted]);

  useEffect(() => {
    if (!playback.playing || rendering) return;
    const tick = () => {
      const v = videoRef.current;
      if (v) {
        let t = v.currentTime;
        if (t >= absEnd) { if (playback.loop) { v.currentTime = absStart; t = absStart; } else { v.pause(); setPlayback((p) => ({ ...p, playing: false })); t = absEnd; } }
        setRelTime(Math.max(0, t - clip.start));
        if (analyserRef.current) { const arr = new Uint8Array(analyserRef.current.frequencyBinCount); analyserRef.current.getByteFrequencyData(arr); setWaveData(bucketize(arr, 26)); }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playback.playing, playback.loop, absStart, absEnd, clip.id, rendering]);

  const frameStep = (dir) => { if (!videoRef.current) return; videoRef.current.pause(); const t = Math.min(absEnd, Math.max(absStart, videoRef.current.currentTime + dir * (1 / 30))); videoRef.current.currentTime = t; setRelTime(t - clip.start); setPlayback((p) => ({ ...p, playing: false })); };
  const seekRel = (rel) => { if (!videoRef.current) return; const t = clip.start + Math.min(playback.trimEnd, Math.max(playback.trimStart, rel)); videoRef.current.currentTime = t; setRelTime(t - clip.start); };

  const renderClip = useCallback(async (onProgress) => {
    const video = videoRef.current; if (!video) throw new Error("No video element");
    ensureGraph(); const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") await ctx.resume();
    const isVertical = settings.aspect === "9:16";
    const canvas = document.createElement("canvas");
    canvas.width = isVertical ? 540 : 960; canvas.height = isVertical ? 960 : 540;
    const ctx2d = canvas.getContext("2d");
    const streamDest = ctx.createMediaStreamDestination();
    gainRef.current.connect(streamDest);
    const canvasStream = canvas.captureStream(30);
    const combined = new MediaStream([...canvasStream.getVideoTracks(), ...streamDest.stream.getAudioTracks()]);
    const mimeCandidates = ["video/mp4;codecs=avc1", "video/webm;codecs=vp9,opus", "video/webm"];
    const mimeType = mimeCandidates.find((m) => window.MediaRecorder && MediaRecorder.isTypeSupported(m)) || "";
    const recorder = new MediaRecorder(combined, mimeType ? { mimeType } : undefined);
    const chunks = []; recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    video.pause(); video.currentTime = absStart;
    await new Promise((resolve) => { video.onseeked = resolve; });
    return new Promise((resolve, reject) => {
      recorder.onstop = () => { gainRef.current.disconnect(streamDest); const outMime = mimeType || "video/webm"; resolve({ blob: new Blob(chunks, { type: outMime }), ext: outMime.includes("mp4") ? "mp4" : "webm" }); };
      recorder.onerror = (e) => { gainRef.current.disconnect(streamDest); reject(e); };
      recorder.start(); video.play().catch(reject);
      const drawFrame = () => {
        if (video.currentTime >= absEnd || video.ended) { video.pause(); recorder.stop(); return; }
        drawVideoCover(ctx2d, video, canvas, settings.focusX, isVertical);
        drawCaptionsOnCanvas(ctx2d, canvas, clip, video.currentTime - clip.start, settings);
        onProgress?.(Math.min(1, (video.currentTime - absStart) / Math.max(0.01, absEnd - absStart)));
        requestAnimationFrame(drawFrame);
      };
      requestAnimationFrame(drawFrame);
    });
  }, [absStart, absEnd, clip, settings, ensureGraph]);

  useImperativeHandle(ref, () => ({ renderClip: async (onProgress) => { setRendering(true); try { return await renderClip(onProgress); } finally { setRendering(false); } } }), [renderClip]);

  const focusPct = `${settings.focusX * 100}% 50%`;
  const isVertical = settings.aspect === "9:16";

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className={`transition-all duration-300 ${isVertical ? "p-3 rounded-[2rem] bg-zinc-900 border border-zinc-700 shadow-2xl" : "p-0"}`}>
        <div className={`relative overflow-hidden bg-black scs-glow-purple transition-all duration-300 ${isVertical ? "w-[260px] aspect-[9/16] rounded-[1.4rem]" : "w-full max-w-3xl aspect-video rounded-2xl"}`}>
          <video ref={videoRef} src={videoUrl} crossOrigin="anonymous" playsInline muted preload="metadata"
            onError={() => setVideoError("This browser couldn't decode the video file. Try an H.264 MP4 or VP9 WEBM.")}
            onClick={() => (playback.playing ? pause() : play())}
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            style={{ objectPosition: isVertical ? focusPct : "50% 50%" }} />
          {isVertical && <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-zinc-900/90 pointer-events-none z-10" />}
          {!isVertical && <FocusGuide focusX={settings.focusX} setFocusX={(v) => setSettings((s) => ({ ...s, focusX: v }))} />}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/55 rounded-md px-2 py-1 pointer-events-none"><Film size={12} className="text-zinc-300" /><span className="scs-mono text-[10px] text-zinc-300">{settings.aspect}</span></div>
          <div className="absolute top-3 right-3 bg-black/55 rounded-md px-2 py-1 scs-mono text-[10px] text-zinc-300 pointer-events-none">{fmtShort(relTime)} / {fmtShort(clip.duration)}</div>
          <div className="absolute inset-x-0 bottom-[15%] pointer-events-none px-6"><LiveWaveform data={waveData} bars={isVertical ? 16 : 26} color="rgba(139,92,246,0.9)" height={24} /></div>
          <CaptionOverlay words={clip.words} relTime={relTime} duration={clip.duration} preset={settings.preset} fontSize={settings.fontSize} uppercase={settings.uppercase} position={settings.position} />
          {videoError && <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 px-6 text-center"><AlertTriangle size={22} className="text-amber-400" /><span className="text-xs text-zinc-300">{videoError}</span></div>}
          {!videoError && !audioReady && !rendering && (
            <button onClick={() => { sfx.playClick(); enableSound(); }} className="scs-focus scs-tap absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/45 hover:bg-black/35 transition-colors">
              <div className="w-14 h-14 rounded-full flex items-center justify-center scs-pulse-ring" style={{ background: "rgba(139,92,246,0.35)" }}><Volume2 size={22} className="text-white" /></div>
              <span className="text-xs text-zinc-200 scs-mono">Click to enable sound &amp; play</span>
            </button>
          )}
          {audioReady && !playback.playing && !videoError && !rendering && (
            <button onClick={() => { sfx.playClick(); play(); }} className="scs-focus scs-tap absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition-colors"><Play size={22} className="text-white ml-1" /></div>
            </button>
          )}
          {rendering && <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70"><Loader2 size={22} className="text-violet-300 scs-spin" /><span className="text-xs text-zinc-200 scs-mono">Rendering in browser...</span></div>}
        </div>
      </div>

      <div className="w-full max-w-lg flex items-center justify-center flex-wrap gap-2.5">
        <button disabled={rendering} onClick={() => { sfx.playClick(); frameStep(-1); }} className="scs-focus scs-tap p-2 rounded-lg bg-zinc-800/70 text-zinc-300 hover:text-white disabled:opacity-30"><SkipBack size={15} /></button>
        <button disabled={rendering} onClick={() => { sfx.playClick(); playback.playing ? pause() : play(); }} className="scs-focus scs-tap p-3 rounded-full text-white hover:brightness-110 disabled:opacity-30" style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>{playback.playing ? <Pause size={17} /> : <Play size={17} className="ml-0.5" />}</button>
        <button disabled={rendering} onClick={() => { sfx.playClick(); frameStep(1); }} className="scs-focus scs-tap p-2 rounded-lg bg-zinc-800/70 text-zinc-300 hover:text-white disabled:opacity-30"><SkipForward size={15} /></button>
        <div className="h-6 w-px bg-zinc-700 mx-0.5" />
        {[1, 1.25, 1.5].map((s) => <button key={s} disabled={rendering} onClick={() => { sfx.playClick(); setPlayback((p) => ({ ...p, speed: s })); }} className={`scs-focus scs-tap scs-mono text-xs px-2 py-1.5 rounded-lg transition-colors disabled:opacity-30 ${playback.speed === s ? "bg-violet-500/25 text-violet-200 border border-violet-500/40" : "bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"}`}>{s}x</button>)}
        <button disabled={rendering} onClick={() => { sfx.playClick(); setPlayback((p) => ({ ...p, loop: !p.loop })); }} className={`scs-focus scs-tap p-2 rounded-lg transition-colors disabled:opacity-30 ${playback.loop ? "bg-violet-500/25 text-violet-200" : "bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"}`}><Repeat size={15} /></button>
        <div className="h-6 w-px bg-zinc-700 mx-0.5" />
        <button disabled={rendering} onClick={() => setSettings((s) => ({ ...s, muted: !s.muted }))} className="scs-focus scs-tap p-2 rounded-lg bg-zinc-800/60 text-zinc-300 hover:text-white disabled:opacity-30">{settings.muted || settings.masterVolume === 0 ? <VolumeX size={15} /> : settings.masterVolume < 0.6 ? <Volume1 size={15} /> : <Volume2 size={15} />}</button>
        <input disabled={rendering} type="range" min={0} max={1.5} step={0.01} value={settings.muted ? 0 : settings.masterVolume} onChange={(e) => setSettings((s) => ({ ...s, masterVolume: Number(e.target.value), muted: false }))} className="scs-slider w-24 disabled:opacity-30" />
      </div>

      <ClipTimeline clip={clip} playback={playback} setPlayback={setPlayback} relTime={relTime} onSeek={seekRel} disabled={rendering} />
    </div>
  );
});

function FocusGuide({ focusX, setFocusX }) {
  const containerRef = useRef(null);
  const dragging = useRef(false);
  const onMove = useCallback((clientX) => { const el = containerRef.current?.parentElement; if (!el) return; const rect = el.getBoundingClientRect(); setFocusX(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))); }, [setFocusX]);
  useEffect(() => {
    const move = (e) => { if (dragging.current) onMove(e.touches ? e.touches[0].clientX : e.clientX); };
    const up = () => { dragging.current = false; };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up); window.addEventListener("touchmove", move); window.addEventListener("touchend", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); window.removeEventListener("touchmove", move); window.removeEventListener("touchend", up); };
  }, [onMove]);
  const boxWidthPct = 56.25;
  const leftPct = Math.min(100 - boxWidthPct, Math.max(0, focusX * 100 - boxWidthPct / 2));
  return (
    <div ref={containerRef} className="absolute top-0 bottom-0 border-2 rounded-md cursor-ew-resize flex items-start justify-center" style={{ left: `${leftPct}%`, width: `${boxWidthPct}%`, borderColor: "#8b5cf6", background: "rgba(139,92,246,0.06)", boxShadow: "0 0 0 2000px rgba(0,0,0,0.5)" }}
      onMouseDown={(e) => { dragging.current = true; onMove(e.clientX); }} onTouchStart={(e) => { dragging.current = true; onMove(e.touches[0].clientX); }}>
      <div className="mt-1 flex items-center gap-1 rounded-full bg-violet-600/90 px-2 py-0.5 text-[10px] text-white scs-mono"><Move size={10} /> 9:16 focus</div>
    </div>
  );
}
function ClipTimeline({ clip, playback, setPlayback, relTime, onSeek, disabled }) {
  const ref = useRef(null);
  const dragRef = useRef(null);
  const duration = clip.duration;
  const hookSeconds = Math.min(3, duration);
  const fracToTime = (clientX) => { const el = ref.current; if (!el) return 0; const rect = el.getBoundingClientRect(); return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) * duration; };
  useEffect(() => {
    const move = (e) => {
      if (!dragRef.current) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const t = fracToTime(x);
      if (dragRef.current === "start") setPlayback((p) => ({ ...p, trimStart: Math.min(t, p.trimEnd - 1) }));
      else if (dragRef.current === "end") setPlayback((p) => ({ ...p, trimEnd: Math.max(t, p.trimStart + 1) }));
      else onSeek(t);
    };
    const up = () => { dragRef.current = null; };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up); window.addEventListener("touchmove", move); window.addEventListener("touchend", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); window.removeEventListener("touchmove", move); window.removeEventListener("touchend", up); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);
  const pct = (t) => `${(t / duration) * 100}%`;
  return (
    <div className={`w-full max-w-lg ${disabled ? "opacity-40 pointer-events-none" : ""}`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="flex items-center gap-1 text-[11px] scs-mono text-rose-400"><Flame size={11} /> Hook Zone — first {hookSeconds.toFixed(0)}s</span>
        <span className="text-[11px] scs-mono text-zinc-500">Trim: {fmtShort(playback.trimStart)}–{fmtShort(playback.trimEnd)}</span>
      </div>
      <div ref={ref} className="relative h-9 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer select-none" onMouseDown={(e) => { dragRef.current = "scrub"; onSeek(fracToTime(e.clientX)); }}>
        <div className="absolute top-0 bottom-0 left-0 rounded-l-lg" style={{ width: pct(hookSeconds), background: "repeating-linear-gradient(45deg, rgba(244,63,94,0.25) 0 6px, rgba(244,63,94,0.12) 6px 12px)", borderRight: "1px solid rgba(244,63,94,0.5)" }} />
        <div className="absolute top-0 bottom-0 left-0 bg-black/60" style={{ width: pct(playback.trimStart) }} />
        <div className="absolute top-0 bottom-0 right-0 bg-black/60" style={{ width: `calc(100% - ${pct(playback.trimEnd)})` }} />
        <div className="absolute top-0 bottom-0" style={{ left: pct(playback.trimStart), width: `calc(${pct(playback.trimEnd)} - ${pct(playback.trimStart)})`, background: "linear-gradient(90deg, rgba(139,92,246,0.18), rgba(139,92,246,0.08))" }} />
        <div className="absolute top-0 bottom-0 w-[2px] bg-violet-300" style={{ left: pct(relTime), boxShadow: "0 0 8px #a78bfa" }} />
        <div onMouseDown={(e) => { e.stopPropagation(); dragRef.current = "start"; }} onTouchStart={(e) => { e.stopPropagation(); dragRef.current = "start"; }} className="absolute top-0 bottom-0 w-2.5 -ml-1.5 bg-violet-500 rounded cursor-ew-resize" style={{ left: pct(playback.trimStart) }} />
        <div onMouseDown={(e) => { e.stopPropagation(); dragRef.current = "end"; }} onTouchStart={(e) => { e.stopPropagation(); dragRef.current = "end"; }} className="absolute top-0 bottom-0 w-2.5 -ml-1 bg-violet-500 rounded cursor-ew-resize" style={{ left: pct(playback.trimEnd) }} />
      </div>
    </div>
  );
}
function SimulatedPlayer({ clip, settings }) {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => { if (!playing) return; const id = setInterval(() => setT((p) => (p + 0.1 >= clip.duration ? 0 : p + 0.1)), 100); return () => clearInterval(id); }, [playing, clip.duration]);
  const isVertical = settings.aspect === "9:16";
  const hue = 258 + (clip.index * 17) % 50;
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className={`transition-all duration-300 ${isVertical ? "p-3 rounded-[2rem] bg-zinc-900 border border-zinc-700 shadow-2xl" : "p-0"}`}>
        <div className={`relative overflow-hidden bg-black scs-glow-purple transition-all duration-300 ${isVertical ? "w-[260px] aspect-[9/16] rounded-[1.4rem]" : "w-full max-w-3xl aspect-video rounded-2xl"}`}>
          <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 35% 30%, hsl(${hue} 80% 22%), #09090b 70%)` }} />
          <div className="absolute inset-0 scs-grid-bg opacity-25" />
          {isVertical && <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-zinc-900/90 pointer-events-none z-10" />}
          <CaptionOverlay words={clip.words} relTime={t} duration={clip.duration} preset={settings.preset} fontSize={settings.fontSize} uppercase={settings.uppercase} position={settings.position} />
          <button onClick={() => setPlaying((p) => !p)} className="scs-focus scs-tap absolute inset-0 flex items-center justify-center bg-black/20">{!playing && <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur flex items-center justify-center"><Play size={22} className="text-white ml-1" /></div>}</button>
        </div>
      </div>
      <div className="w-full max-w-lg rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2 flex items-center gap-2 text-[11px] text-amber-300"><AlertTriangle size={13} className="shrink-0" /> Estimated clip — no video/audio available. Upload the source file for real playback and rendering.</div>
    </div>
  );
}

/* ==================================================================== */
/* FFMPEG / EXPORT                                                       */
/* ==================================================================== */
function buildSrt(clip, settings) {
  const words = clip.words, wordsPerLine = 6, perWordSec = clip.duration / words.length;
  let srt = "", idx = 1;
  for (let i = 0; i < words.length; i += wordsPerLine) {
    const chunk = words.slice(i, i + wordsPerLine);
    const t0 = i * perWordSec, t1 = Math.min(clip.duration, (i + chunk.length) * perWordSec);
    const fmt = (s) => { const ms = Math.floor((s % 1) * 1000).toString().padStart(3, "0"); const hh = Math.floor(s / 3600).toString().padStart(2, "0"); const mm = Math.floor((s % 3600) / 60).toString().padStart(2, "0"); const ss = Math.floor(s % 60).toString().padStart(2, "0"); return `${hh}:${mm}:${ss},${ms}`; };
    const text = settings.uppercase ? chunk.join(" ").toUpperCase() : chunk.join(" ");
    srt += `${idx}\n${fmt(t0)} --> ${fmt(t1)}\n${text}\n\n`; idx++;
  }
  return srt;
}
function buildFfmpegCommand(clip, settings, playback, sourceFileRaw) {
  const inputName = shellSafeFilename(sourceFileRaw, "input.mp4");
  const srtName = shellSafeFilename(`captions_${clip.id}.srt`);
  const outName = shellSafeFilename(`${clip.id}_${settings.aspect === "9:16" ? "vertical" : "horizontal"}.mp4`);
  const exportStart = clip.start + playback.trimStart, exportEnd = clip.start + playback.trimEnd;
  const cfg = CAPTION_PRESETS[settings.preset];
  const primary = hexToAss(cfg.mode === "highlight" ? cfg.activeBg : cfg.active);
  const align = ASS_ALIGN[settings.position];
  const subStyle = `FontName=Rajdhani,FontSize=${Math.round(settings.fontSize * 0.8)},PrimaryColour=${primary},OutlineColour=&H00000000,BorderStyle=1,Outline=2,Bold=1,Alignment=${align}`;
  const cropExpr = settings.aspect === "9:16" ? `crop=ih*9/16:ih:(iw-ih*9/16)*${settings.focusX.toFixed(2)}:0,scale=1080:1920` : `scale=1920:1080`;
  const afParts = [`volume=${settings.exportGain >= 0 ? "+" : ""}${settings.exportGain}dB`];
  if (settings.noiseSuppression) afParts.push(`afftdn=nf=-25`);
  const bgmTrack = shellSafeFilename(settings.bgmTrack, "bgm.mp3");
  if (settings.bgm) {
    return ["ffmpeg -y", `-i "${inputName}"`, `-i "${bgmTrack}"`, `-ss ${fmtTime(exportStart)} -to ${fmtTime(exportEnd)}`,
      `-filter_complex "[0:v]${cropExpr},subtitles=${srtName}:force_style='${subStyle}'[v];[0:a]${afParts.join(",")}[a0];[1:a]volume=0.15[a1];[a0][a1]amix=inputs=2:duration=first:dropout_transition=2[aout]"`,
      `-map "[v]" -map "[aout]"`, `-c:v libx264 -preset veryfast -crf 20 -c:a aac -b:a 128k`, `"${outName}"`].join(" \\\n  ");
  }
  return ["ffmpeg -y", `-i "${inputName}"`, `-ss ${fmtTime(exportStart)} -to ${fmtTime(exportEnd)}`,
    `-vf "${cropExpr},subtitles=${srtName}:force_style='${subStyle}'"`, `-af "${afParts.join(",")}"`,
    `-c:v libx264 -preset veryfast -crf 20 -c:a aac -b:a 128k`, `"${outName}"`].join(" \\\n  ");
}

/* ==================================================================== */
/* AI GROWTH COPY — real Anthropic API call from within the artifact     */
/* ==================================================================== */
async function generateGrowthCopy(clip) {
  const prompt = `You are a YouTube Shorts growth expert. Given this clip:
Video: "${clip.sourceLabel}"
Clip: "${clip.title}", duration ${Math.round(clip.duration)}s, engagement score ${clip.score}/100
Transcript (may be a placeholder): "${clip.words.join(" ")}"

Write: 1) three high-CTR Shorts titles under 60 chars, 2) one hook sentence for the first 3 seconds, 3) eight hashtags including #Shorts.
Respond ONLY with JSON, no markdown fences: {"titles":["...","...","..."],"hook":"...","hashtags":["...", "..."]}`;
  const response = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 500, messages: [{ role: "user", content: prompt }] }) });
  if (!response.ok) throw new Error(`API error ${response.status}`);
  const data = await response.json();
  const text = data.content.map((b) => b.text || "").join("");
  const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
  return { titles: (parsed.titles || []).slice(0, 3).map((t) => sanitizeText(t, 80)), hook: sanitizeText(parsed.hook || "", 160), hashtags: (parsed.hashtags || []).slice(0, 10).map((h) => sanitizeText(h, 30)) };
}

/* ==================================================================== */
/* EDITOR TABS                                                           */
/* ==================================================================== */
function TabButton({ active, onClick, icon: Icon, label }) {
  const sfx = useSfx();
  return <button onClick={() => { sfx.playClick(); onClick(); }} onMouseEnter={sfx.playHover} className={`scs-focus scs-tap flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium rounded-lg transition-colors ${active ? "bg-violet-500/20 text-violet-200 border border-violet-500/40" : "text-zinc-500 hover:text-zinc-300 border border-transparent"}`}><Icon size={14} /> {label}</button>;
}
function CaptionsTab({ settings, setSettings }) {
  return (
    <div className="flex flex-col gap-5">
      <div><span className="text-xs text-zinc-500 mb-2 block">Preset</span>
        <div className="grid grid-cols-3 gap-2">{Object.entries(CAPTION_PRESETS).map(([key, cfg]) => (
          <button key={key} onClick={() => setSettings((s) => ({ ...s, preset: key }))} className={`scs-focus scs-tap rounded-xl p-2.5 border transition-all ${settings.preset === key ? "border-violet-500 scs-glow-purple" : "border-zinc-800 hover:border-zinc-700"}`}>
            <div className="w-full h-6 rounded-md mb-1.5" style={{ background: cfg.swatch }} /><span className="text-[11px] text-zinc-300">{cfg.label}</span>
          </button>
        ))}</div>
      </div>
      <div><div className="flex items-center justify-between mb-1.5"><span className="text-xs text-zinc-500 flex items-center gap-1"><Type size={12} /> Font size</span><span className="scs-mono text-xs text-violet-300">{settings.fontSize}px</span></div>
        <input type="range" min={14} max={34} value={settings.fontSize} onChange={(e) => setSettings((s) => ({ ...s, fontSize: Number(e.target.value) }))} className="scs-slider w-full" /></div>
      <div className="flex items-center justify-between"><span className="text-xs text-zinc-500 flex items-center gap-1"><CaseUpper size={13} /> Uppercase</span>
        <button onClick={() => setSettings((s) => ({ ...s, uppercase: !s.uppercase }))} className={`scs-focus scs-tap w-10 h-6 rounded-full relative transition-colors ${settings.uppercase ? "bg-violet-600" : "bg-zinc-700"}`}><span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${settings.uppercase ? "translate-x-[18px]" : "translate-x-0.5"}`} /></button></div>
      <div><span className="text-xs text-zinc-500 mb-2 block">Position</span>
        <div className="grid grid-cols-3 gap-2">{[["top", AlignStartVertical], ["center", AlignCenterVertical], ["bottom", AlignEndVertical]].map(([pos, Icon]) => (
          <button key={pos} onClick={() => setSettings((s) => ({ ...s, position: pos }))} className={`scs-focus scs-tap flex flex-col items-center gap-1 rounded-lg py-2 border transition-colors ${settings.position === pos ? "border-violet-500 bg-violet-500/10 text-violet-200" : "border-zinc-800 text-zinc-500 hover:text-zinc-300"}`}><Icon size={15} /><span className="text-[10px] capitalize">{pos}</span></button>
        ))}</div>
      </div>
    </div>
  );
}
function AudioTab({ settings, setSettings }) {
  const tracks = ["hype_trap_loop.mp3", "tension_riser.mp3", "cinematic_pulse.mp3"];
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between"><span className="text-xs text-zinc-300 flex items-center gap-1.5"><Music2 size={14} /> Auto-BGM overlay (export only)</span>
        <button onClick={() => setSettings((s) => ({ ...s, bgm: !s.bgm }))} className={`scs-focus scs-tap w-10 h-6 rounded-full relative transition-colors ${settings.bgm ? "bg-violet-600" : "bg-zinc-700"}`}><span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${settings.bgm ? "translate-x-[18px]" : "translate-x-0.5"}`} /></button></div>
      {settings.bgm && <div className="flex flex-col gap-1.5">{tracks.map((t) => <button key={t} onClick={() => setSettings((s) => ({ ...s, bgmTrack: t }))} className={`scs-focus scs-tap text-left rounded-lg px-3 py-2 text-xs scs-mono transition-colors border ${settings.bgmTrack === t ? "border-violet-500 bg-violet-500/10 text-violet-200" : "border-zinc-800 text-zinc-500 hover:text-zinc-300"}`}>{t}</button>)}</div>}
      <div><div className="flex items-center justify-between mb-1.5"><span className="text-xs text-zinc-500 flex items-center gap-1"><Radio size={13} /> Export voice gain</span><span className="scs-mono text-xs text-violet-300">{settings.exportGain > 0 ? "+" : ""}{settings.exportGain} dB</span></div>
        <input type="range" min={-6} max={12} value={settings.exportGain} onChange={(e) => setSettings((s) => ({ ...s, exportGain: Number(e.target.value) }))} className="scs-slider w-full" /></div>
      <div className="flex items-center justify-between"><span className="text-xs text-zinc-300 flex items-center gap-1.5"><ShieldCheck size={14} /> Noise suppression</span>
        <button onClick={() => setSettings((s) => ({ ...s, noiseSuppression: !s.noiseSuppression }))} className={`scs-focus scs-tap w-10 h-6 rounded-full relative transition-colors ${settings.noiseSuppression ? "bg-violet-600" : "bg-zinc-700"}`}><span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${settings.noiseSuppression ? "translate-x-[18px]" : "translate-x-0.5"}`} /></button></div>
    </div>
  );
}
function GrowthTab({ clip, toast }) {
  const [loading, setLoading] = useState(false);
  const [copy, setCopy] = useState(null);
  const [error, setError] = useState(null);
  const generate = async () => { setLoading(true); setError(null); try { setCopy(await generateGrowthCopy(clip)); } catch (e) { console.error(e); setError("Couldn't generate right now — try again in a moment."); } finally { setLoading(false); } };
  return (
    <div className="flex flex-col gap-4">
      <button onClick={generate} disabled={loading} className="scs-focus scs-tap flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60" style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>{loading ? <Loader2 size={15} className="scs-spin" /> : <Sparkle size={15} />} {loading ? "Generating..." : "Generate titles, hook & hashtags"}</button>
      {error && <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-2 text-[11px] text-rose-300 flex items-center gap-2"><AlertTriangle size={13} className="shrink-0" /> {error}</div>}
      {copy && (
        <div className="flex flex-col gap-3">
          <div><span className="text-xs text-zinc-500 mb-1.5 block">Titles</span><div className="flex flex-col gap-1.5">{copy.titles.map((t, i) => <button key={i} onClick={() => { navigator.clipboard?.writeText(t).catch(() => {}); toast.show("Title copied"); }} className="scs-focus scs-tap text-left rounded-lg bg-zinc-900/60 border border-zinc-800 px-3 py-2 text-xs text-zinc-200 hover:border-violet-500/50 transition-colors">{t}</button>)}</div></div>
          <div><span className="text-xs text-zinc-500 mb-1.5 block">Opening hook</span><div className="rounded-lg bg-zinc-900/60 border border-zinc-800 px-3 py-2 text-xs text-zinc-200">{copy.hook}</div></div>
          <div><span className="text-xs text-zinc-500 mb-1.5 flex items-center gap-1"><Hash size={11} /> Hashtags</span><div className="flex flex-wrap gap-1.5">{copy.hashtags.map((h, i) => <span key={i} className="scs-mono text-[11px] rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 px-2 py-1">#{h.replace(/^#/, "")}</span>)}</div></div>
        </div>
      )}
      <p className="text-[11px] text-zinc-600 leading-relaxed">Generated live by Claude from this clip's transcript — since transcripts here are demo placeholders, treat the copy as a style example, not a literal summary of real speech.</p>
    </div>
  );
}
function ExportTab({ clip, settings, playback, sourceFile, toast, playerRef, isReal, sfx }) {
  const [copied, setCopied] = useState(false);
  const [renderProgress, setRenderProgress] = useState(null);
  const [renderResult, setRenderResult] = useState(null);
  const cmd = buildFfmpegCommand(clip, settings, playback, sourceFile);
  const handleCopy = async () => { try { await navigator.clipboard.writeText(cmd); } catch {} setCopied(true); toast.show("FFmpeg command copied"); if (clip.score >= 90) sfx.playViralAlert(); setTimeout(() => setCopied(false), 1600); };
  const handleRender = async () => {
    if (!playerRef.current) return;
    setRenderResult(null); setRenderProgress(0);
    try {
      const { blob, ext } = await playerRef.current.renderClip((p) => setRenderProgress(p));
      const url = URL.createObjectURL(blob);
      setRenderResult({ url, ext, size: blob.size });
      toast.show(`Rendered ${ext.toUpperCase()} — ${(blob.size / 1024 / 1024).toFixed(1)}MB`);
      if (clip.score >= 90) sfx.playViralAlert();
    } catch (e) { console.error(e); toast.show("Render failed — your browser may not support MediaRecorder capture"); }
    finally { setRenderProgress(null); }
  };
  return (
    <div className="flex flex-col gap-3">
      {isReal && (
        <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-3 flex flex-col gap-2">
          <span className="text-xs text-violet-200 font-medium flex items-center gap-1.5"><Film size={13} /> Render locally in this browser</span>
          <p className="text-[11px] text-zinc-500">Real capture via canvas + MediaRecorder (your browser's hardware encoder, not raw WebCodecs muxing) — plays through in real time (~{Math.round(playback.trimEnd - playback.trimStart)}s).</p>
          {renderProgress !== null ? <div className="h-2 rounded-full bg-zinc-800 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${renderProgress * 100}%`, background: "linear-gradient(90deg,#6d28d9,#8b5cf6)" }} /></div>
            : <button onClick={handleRender} className="scs-focus scs-tap flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium bg-violet-600/80 text-white hover:bg-violet-600"><Film size={13} /> Render clip now</button>}
          {renderResult && <a href={renderResult.url} download={`${clip.id}.${renderResult.ext}`} className="scs-focus scs-tap flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs bg-emerald-600/80 text-white hover:bg-emerald-600"><Download size={13} /> Download {renderResult.ext.toUpperCase()} ({(renderResult.size / 1024 / 1024).toFixed(1)}MB)</a>}
        </div>
      )}
      <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3 max-h-56 overflow-auto scs-scrollbar"><pre className="scs-mono text-[11px] text-violet-200 whitespace-pre-wrap leading-relaxed">{cmd}</pre></div>
      <button onClick={handleCopy} className="scs-focus scs-tap flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110" style={{ background: copied ? "#16a34a" : "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>{copied ? <Check size={15} /> : <Terminal size={15} />} {copied ? "Copied!" : "Copy FFmpeg Command"}</button>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => { download(`${clip.id}.srt`, buildSrt(clip, settings), "text/plain"); toast.show("Subtitles (.srt) downloaded"); }} className="scs-focus scs-tap flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs bg-zinc-800/60 text-zinc-300 hover:text-white"><FileText size={13} /> Export SRT</button>
        <button onClick={() => { download(`${clip.id}.json`, JSON.stringify({ ...clip, settings, playback }, null, 2), "application/json"); toast.show("Clip data (.json) downloaded"); }} className="scs-focus scs-tap flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs bg-zinc-800/60 text-zinc-300 hover:text-white"><FileJson size={13} /> Export JSON</button>
      </div>
      <p className="text-[11px] text-zinc-600 leading-relaxed">Filenames are stripped of shell metacharacters before insertion — safe to paste into a real terminal.</p>
    </div>
  );
}

/* ==================================================================== */
/* SECURITY PANEL                                                        */
/* ==================================================================== */
function SecurityPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div className="scs-glass rounded-xl overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="scs-focus scs-tap w-full flex items-center justify-between px-4 py-3 text-left">
        <span className="flex items-center gap-2 text-sm text-white font-medium"><Shield size={15} style={{ color: "#10b981" }} /> Security &amp; Privacy</span>
        <span className="text-[11px] text-zinc-500">{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 flex flex-col gap-2.5 text-[12px] text-zinc-400">
          <div className="flex items-start gap-2"><Lock size={13} className="text-emerald-400 shrink-0 mt-0.5" /> Video/audio decoding is 100% local — never uploaded anywhere by this app.</div>
          <div className="flex items-start gap-2"><Shield size={13} className="text-emerald-400 shrink-0 mt-0.5" /> Filenames/handles sanitized and shell-escaped before use in generated commands.</div>
          <div className="flex items-start gap-2"><Cpu size={13} className="text-emerald-400 shrink-0 mt-0.5" /> Heavy peak-detection math runs on a background Web Worker where supported, with an automatic main-thread fallback.</div>
          <div className="flex items-start gap-2"><FileUp size={13} className="text-emerald-400 shrink-0 mt-0.5" /> Imported project files are schema-validated before touching app state.</div>
          <div className="flex items-start gap-2"><AlertTriangle size={13} className="text-amber-400 shrink-0 mt-0.5" /> No system is "unhackable" — this is defense-in-depth for a client-only demo, not an audit. CSP/headers below are reference for a real deployment.</div>
          <button onClick={() => download("streamclip_security_reference.md", REFERENCE_SECURITY_DOC, "text/markdown")} className="scs-focus scs-tap mt-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs bg-zinc-800/60 text-zinc-300 hover:text-white w-fit"><FileDown size={13} /> Download deployment security reference</button>
        </div>
      )}
    </div>
  );
}

/* ==================================================================== */
/* EDITOR VIEW                                                           */
/* ==================================================================== */
function EditorView({ clip, sourcesById, onBack, onSelectClip, allClips }) {
  const source = sourcesById[clip.sourceId];
  const isReal = source?.type === "file" && !!source.file;
  const toast = useToast();
  const sfx = useSfx();
  const [tab, setTab] = useState("info");
  const playerRef = useRef(null);
  const [settings, setSettings] = useState({ aspect: "9:16", preset: "mrbeast", fontSize: 24, uppercase: true, position: "bottom", bgm: false, bgmTrack: "hype_trap_loop.mp3", exportGain: 3, noiseSuppression: true, focusX: 0.5, masterVolume: 1, muted: false });
  const [playbackByClip, setPlaybackByClip] = useState({});
  const playback = playbackByClip[clip.id] || { playing: false, speed: 1, loop: true, trimStart: 0, trimEnd: clip.duration };
  const setPlayback = (updater) => setPlaybackByClip((prev) => { const current = prev[clip.id] || { playing: false, speed: 1, loop: true, trimStart: 0, trimEnd: clip.duration }; const next = typeof updater === "function" ? updater(current) : updater; return { ...prev, [clip.id]: next }; });

  const alertedRef = useRef(new Set());
  useEffect(() => { if (clip.score >= 90 && !alertedRef.current.has(clip.id)) { alertedRef.current.add(clip.id); sfx.playViralAlert(); } }, [clip.id, clip.score, sfx]);

  const tier = scoreTier(clip.score);
  const TierIcon = tier.icon;
  const sameVideoClips = allClips.filter((c) => c.sourceId === clip.sourceId);

  return (
    <div className="min-h-screen scs-grid-bg pb-16">
      {toast.node}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-[#09090b]/85 border-b border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between gap-3">
          <button onClick={() => { sfx.playClick(); onBack(); }} className="scs-focus scs-tap flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs bg-zinc-800/70 text-zinc-300 hover:text-white"><ArrowLeft size={13} /> Leaderboard</button>
          <div className="min-w-0 text-right"><h2 className="scs-rajdhani font-bold text-white truncate leading-tight">{clip.sourceLabel}</h2>
            <span className="text-[11px] text-zinc-500 scs-mono flex items-center justify-end gap-1">{isReal ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Real playback</> : <><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Estimated clip</>}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 mt-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        <div className="scs-glass rounded-2xl p-5 flex flex-col items-center gap-5">
          <div className="w-full flex items-center justify-between flex-wrap gap-2">
            <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${tier.glow}`} style={{ background: `${tier.color}1A`, color: tier.color, border: `1px solid ${tier.color}55` }}><TierIcon size={13} /> {clip.score}/100 · {tier.label}</div>
            <div className="flex items-center gap-1 rounded-lg bg-zinc-900/60 border border-zinc-800 p-1">
              <button onClick={() => setSettings((s) => ({ ...s, aspect: "16:9" }))} className={`scs-focus scs-tap flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs transition-colors ${settings.aspect === "16:9" ? "bg-violet-500/20 text-violet-200" : "text-zinc-400 hover:text-zinc-200"}`}><MonitorPlay size={13} /> 16:9</button>
              <button onClick={() => setSettings((s) => ({ ...s, aspect: "9:16" }))} className={`scs-focus scs-tap flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs transition-colors ${settings.aspect === "9:16" ? "bg-violet-500/20 text-violet-200" : "text-zinc-400 hover:text-zinc-200"}`}><Smartphone size={13} /> 9:16</button>
            </div>
          </div>
          {isReal ? <RealPlayer ref={playerRef} file={source.file} clip={clip} settings={settings} setSettings={setSettings} playback={playback} setPlayback={setPlayback} toast={toast} /> : <SimulatedPlayer clip={clip} settings={settings} />}
        </div>

        <div className="scs-glass rounded-2xl p-4 flex flex-col gap-4 h-fit">
          <div className="flex gap-1 flex-wrap">
            <TabButton active={tab === "info"} onClick={() => setTab("info")} icon={Gauge} label="Score" />
            <TabButton active={tab === "captions"} onClick={() => setTab("captions")} icon={MessageSquareText} label="Captions" />
            <TabButton active={tab === "audio"} onClick={() => setTab("audio")} icon={AudioWaveform} label="Audio" />
            <TabButton active={tab === "growth"} onClick={() => setTab("growth")} icon={Sparkle} label="Growth" />
            <TabButton active={tab === "export"} onClick={() => setTab("export")} icon={Terminal} label="Export" />
          </div>
          <div className="scs-slidein" key={tab}>
            {tab === "info" && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-2.5">
                  <MiniBar label="RET" value={clip.breakdown.retentionIndex} color="#8b5cf6" />
                  <MiniBar label="PEAK" value={clip.breakdown.peakReactionDensity} color="#f43f5e" />
                  <MiniBar label="LOOP" value={clip.breakdown.loopability} color="#06b6d4" />
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">Retention = sustained energy. Peak Reaction = counted volume spikes. Loopability = opening/closing energy similarity. {clip.real ? "Computed from your uploaded file's real audio." : "Estimated — no source audio was available."}</p>
                {sameVideoClips.length > 1 && (
                  <div><span className="text-xs text-zinc-500 mb-2 block">Other highlights from this video</span>
                    <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto scs-scrollbar pr-1">{sameVideoClips.map((c) => (
                      <button key={c.id} onClick={() => onSelectClip(c)} className={`scs-focus scs-tap text-left rounded-lg px-2.5 py-2 text-xs flex items-center justify-between border ${c.id === clip.id ? "border-violet-500 bg-violet-500/10 text-violet-200" : "border-zinc-800 text-zinc-400 hover:border-zinc-700"}`}><span>{c.title} · {fmtShort(c.start)}–{fmtShort(c.end)}</span><span className="scs-mono">{c.score}</span></button>
                    ))}</div>
                  </div>
                )}
              </div>
            )}
            {tab === "captions" && <CaptionsTab settings={settings} setSettings={setSettings} />}
            {tab === "audio" && <AudioTab settings={settings} setSettings={setSettings} />}
            {tab === "growth" && <GrowthTab clip={clip} toast={toast} />}
            {tab === "export" && <ExportTab clip={clip} settings={settings} playback={playback} sourceFile={isReal ? source.label : "input.mp4"} toast={toast} playerRef={playerRef} isReal={isReal} sfx={sfx} />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================================================================== */
/* FILTERS + DASHBOARD                                                   */
/* ==================================================================== */
const FILTERS = [
  { key: "all", labelKey: "allClips", icon: LayoutGrid, weights: null },
  { key: "hooks", labelKey: "bestHooks", icon: Zap, weights: { retentionIndex: 0.25, peakReactionDensity: 0.55, loopability: 0.2 } },
  { key: "funny", labelKey: "funniest", icon: Sparkles, weights: { retentionIndex: 0.2, peakReactionDensity: 0.65, loopability: 0.15 } },
  { key: "energy", labelKey: "highEnergy", icon: Flame, weights: { retentionIndex: 0.5, peakReactionDensity: 0.4, loopability: 0.1 } },
  { key: "loop", labelKey: "retention", icon: Repeat2, weights: { retentionIndex: 0.6, peakReactionDensity: 0.15, loopability: 0.25 } },
];
function filterScore(clip, filter) { if (!filter.weights) return clip.score; const b = clip.breakdown; return Math.round(b.retentionIndex * filter.weights.retentionIndex + b.peakReactionDensity * filter.weights.peakReactionDensity + b.loopability * filter.weights.loopability); }
function sourceLookup(sources, id) { return sources.find((s) => s.id === id); }

function Dashboard({ sources, clips, onOpenClip, onReset, onImport }) {
  const { t, lang, setLang } = useLang();
  const sfx = useSfx();
  const [filterKey, setFilterKey] = useState("all");
  const filter = FILTERS.find((f) => f.key === filterKey);
  const ranked = useMemo(() => [...clips].sort((a, b) => filterScore(b, filter) - filterScore(a, filter)).slice(0, 20), [clips, filter]);
  const toast = useToast();
  const importInputRef = useRef(null);
  const [confettiKey, setConfettiKey] = useState(0);
  const firedRef = useRef(false);

  const realCount = sources.filter((s) => s.type === "file").length;
  const avgScore = clips.length ? Math.round(clips.reduce((a, c) => a + c.score, 0) / clips.length) : 0;
  const topScore = clips.length ? Math.max(...clips.map((c) => c.score)) : 0;

  useEffect(() => { if (!firedRef.current && topScore >= 90) { firedRef.current = true; setConfettiKey((k) => k + 1); sfx.playViralAlert(); } }, [topScore, sfx]);

  const exportJSON = () => { download("streamclip_channel_audit.json", JSON.stringify({ generatedAt: new Date().toISOString(), sources: sources.map(({ file, ...s }) => s), clips }, null, 2), "application/json"); toast.show("Audit exported as JSON"); };
  const exportCSV = () => {
    const header = ["source", "clip", "start", "end", "duration", "score", "retentionIndex", "peakReactionDensity", "loopability", "real"];
    const rows = clips.map((c) => [c.sourceLabel, c.title, fmtShort(c.start), fmtShort(c.end), Math.round(c.duration), c.score, c.breakdown.retentionIndex, c.breakdown.peakReactionDensity, c.breakdown.loopability, c.real].map(csvEscape).join(","));
    download("streamclip_channel_audit.csv", [header.join(","), ...rows].join("\n"), "text/csv");
    toast.show("Audit exported as CSV");
  };
  const handleImportFile = async (file) => {
    try {
      const json = JSON.parse(await file.text());
      const { ok, errors } = validateAuditImport(json);
      if (!ok) { toast.show(`Import rejected: ${errors[0]}`); console.warn("Import validation errors:", errors); return; }
      onImport(json.sources, json.clips);
      toast.show(`Imported ${json.sources.length} sources, ${json.clips.length} clips`);
    } catch (e) { console.error(e); toast.show("Import failed — not valid JSON"); }
  };

  return (
    <div className="min-h-screen scs-grid-bg pb-16">
      {toast.node}
      <ConfettiBurst triggerKey={confettiKey} />
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-[#09090b]/85 border-b border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg scs-glow-purple flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg,#8b5cf6,#4c1d95)" }}><Trophy size={15} className="text-white" /></div>
            <div><h2 className="scs-rajdhani font-bold text-white leading-tight">{t("dashboard")}</h2><span className="text-[11px] text-zinc-500 scs-mono">{sources.length} {t("videosAnalyzed").toLowerCase()} · {clips.length} clips · {realCount} real</span></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === "en" ? "es" : "en")} className="scs-focus scs-tap flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs bg-zinc-800/70 text-zinc-300 hover:text-white"><Globe size={13} /> {lang.toUpperCase()}</button>
            <input ref={importInputRef} type="file" accept="application/json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImportFile(f); e.target.value = ""; }} />
            <button onClick={() => importInputRef.current?.click()} className="scs-focus scs-tap flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs bg-zinc-800/70 text-zinc-300 hover:text-white"><FileUp size={13} /> {t("import")}</button>
            <button onClick={exportJSON} className="scs-focus scs-tap flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs bg-zinc-800/70 text-zinc-300 hover:text-white"><FileJson size={13} /> JSON</button>
            <button onClick={exportCSV} className="scs-focus scs-tap flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs bg-zinc-800/70 text-zinc-300 hover:text-white"><FileText size={13} /> CSV</button>
            <button onClick={onReset} className="scs-focus scs-tap flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs bg-zinc-800/70 text-zinc-300 hover:text-white"><RotateCcw size={13} /> {t("newAudit")}</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 mt-6 flex flex-col gap-6">
        <SecurityPanel />
        <div className="grid grid-cols-3 gap-3">
          <div className="scs-glass rounded-xl p-4 text-center"><div className="scs-rajdhani text-2xl font-bold text-white">{sources.length}</div><div className="text-[11px] text-zinc-500">{t("videosAnalyzed")}</div></div>
          <div className="scs-glass rounded-xl p-4 text-center"><div className="scs-rajdhani text-2xl font-bold" style={{ color: "#8b5cf6" }}>{avgScore}</div><div className="text-[11px] text-zinc-500">{t("avgScore")}</div></div>
          <div className="scs-glass rounded-xl p-4 text-center"><div className="scs-rajdhani text-2xl font-bold" style={{ color: "#f43f5e" }}>{topScore}</div><div className="text-[11px] text-zinc-500">{t("topScore")}</div></div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scs-scrollbar pb-1">
          <Filter size={14} className="text-zinc-500 shrink-0" />
          {FILTERS.map((f) => <button key={f.key} onClick={() => { sfx.playClick(); setFilterKey(f.key); }} onMouseEnter={sfx.playHover} className={`scs-focus scs-tap shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors border ${filterKey === f.key ? "bg-violet-500/20 text-violet-200 border-violet-500/50" : "bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-700"}`}><f.icon size={12} /> {t(f.labelKey)}</button>)}
        </div>

        <div className="flex flex-col gap-2.5">
          {ranked.map((clip, i) => {
            const source = sourceLookup(sources, clip.sourceId);
            const tier = scoreTier(filterScore(clip, filter));
            const displayScore = filterScore(clip, filter);
            return (
              <button key={clip.id} onClick={() => { sfx.playClick(); onOpenClip(clip); }} onMouseEnter={sfx.playHover}
                onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--gx", `${e.clientX - r.left}px`); e.currentTarget.style.setProperty("--gy", `${e.clientY - r.top}px`); }}
                style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }}
                className="scs-focus scs-tap scs-glass scs-glow-trail scs-stagger rounded-xl p-3.5 flex items-center gap-4 text-left hover:border-violet-500/40 transition-colors">
                <div className="w-9 text-center shrink-0">{i < 3 ? <Trophy size={18} style={{ color: i === 0 ? "#facc15" : i === 1 ? "#d4d4d8" : "#b45309" }} className="mx-auto" /> : <span className="scs-mono text-sm text-zinc-500">#{i + 1}</span>}</div>
                <div className="w-14 h-14 rounded-lg shrink-0 relative overflow-hidden" style={{ background: `radial-gradient(circle at 35% 30%, hsl(${(source?.hue ?? 258)} 75% 25%), #09090b 75%)` }}>
                  <PlayCircle size={18} className="absolute inset-0 m-auto text-white/70" />
                  {clip.real && <span className="absolute bottom-0.5 right-0.5 text-[8px] rounded bg-emerald-500/80 text-black font-bold px-1">REAL</span>}
                  {clip.score >= 90 && <span className="absolute top-0.5 left-0.5"><Flame size={12} className="text-rose-400" /></span>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-white scs-rajdhani font-semibold truncate">{clip.sourceLabel} — {clip.title}</div>
                  <div className="text-[11px] scs-mono text-zinc-500 flex items-center gap-2 flex-wrap"><span>{fmtShort(clip.start)}–{fmtShort(clip.end)}</span><span>{Math.round(clip.duration)}s</span></div>
                  <div className="grid grid-cols-3 gap-2 mt-1.5 max-w-[220px]">
                    <MiniBar label="R" value={clip.breakdown.retentionIndex} color="#8b5cf6" />
                    <MiniBar label="P" value={clip.breakdown.peakReactionDensity} color="#f43f5e" />
                    <MiniBar label="L" value={clip.breakdown.loopability} color="#06b6d4" />
                  </div>
                </div>
                <ScoreRing score={displayScore} color={tier.color} size={50} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ==================================================================== */
/* INPUT VIEW                                                            */
/* ==================================================================== */
function InputView({ onAnalyzeFiles, onAnalyzeChannel, onImport }) {
  const { t } = useLang();
  const sfx = useSfx();
  const [handle, setHandle] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const importInputRef = useRef(null);
  const toast = useToast();
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith("video/")); if (files.length) onAnalyzeFiles(files); };
  const handleImportFile = async (file) => {
    try { const json = JSON.parse(await file.text()); const { ok, errors } = validateAuditImport(json); if (!ok) { toast.show(`Import rejected: ${errors[0]}`); return; } onImport(json.sources, json.clips); }
    catch { toast.show("Import failed — not valid JSON"); }
  };
  return (
    <div className="min-h-screen scs-grid-bg relative overflow-hidden flex flex-col items-center justify-center px-6 py-16">
      {toast.node}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full blur-3xl opacity-25 pointer-events-none" style={{ background: "radial-gradient(circle,#8b5cf6,transparent 70%)" }} />
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full">
        <div className="scs-float flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl scs-glow-purple flex items-center justify-center" style={{ background: "linear-gradient(135deg,#8b5cf6,#4c1d95)" }}><Scissors size={18} className="text-white" /></div>
          <span className="scs-display text-lg tracking-widest text-white">STREAMCLIP</span><span className="scs-display text-lg tracking-widest" style={{ color: "#8b5cf6" }}>STUDIO</span>
        </div>
        <h1 className="scs-rajdhani text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">{t("tagline")}</h1>
        <p className="text-zinc-400 mb-10 max-w-md">Upload files for real batch peak analysis, try a channel handle for the demo dashboard, or reload a previously exported audit.</p>

        <label onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} className={`scs-focus w-full rounded-2xl border-2 border-dashed p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors ${dragOver ? "border-violet-400 bg-violet-500/5" : "border-zinc-700 hover:border-zinc-600"}`}>
          <input type="file" accept="video/mp4,video/webm" multiple className="hidden" onChange={(e) => { const files = Array.from(e.target.files || []); if (files.length) onAnalyzeFiles(files); }} />
          <Layers size={22} className="text-zinc-500" />
          <div className="text-sm text-zinc-400">{t("dropFiles")}</div>
          <span className="text-[11px] text-emerald-400/80 flex items-center gap-1"><Check size={11} /> {t("realBatch")}</span>
        </label>

        <div className="flex items-center gap-3 w-full my-5"><div className="h-px flex-1 bg-zinc-800" /><span className="text-xs text-zinc-600 scs-mono">OR</span><div className="h-px flex-1 bg-zinc-800" /></div>

        <div className="w-full scs-glass rounded-2xl p-2 flex items-center gap-2 scs-glow-purple">
          <Users size={18} className="text-zinc-500 ml-3 shrink-0" />
          <input className="scs-focus bg-transparent flex-1 py-3 outline-none text-sm placeholder-zinc-500 min-w-0" placeholder={t("channelPlaceholder")} value={handle} onChange={(e) => setHandle(e.target.value)} />
          <button disabled={handle.trim().length < 2} onClick={() => { sfx.playClick(); onAnalyzeChannel(handle); }} className="scs-focus scs-tap shrink-0 rounded-xl px-5 py-3 font-semibold text-sm text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110" style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}><span className="flex items-center gap-2"><Zap size={16} /> {t("audit")}</span></button>
        </div>

        <button onClick={() => importInputRef.current?.click()} className="scs-focus scs-tap mt-4 flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300"><FileUp size={13} /> or import a previously exported audit (.json)</button>
        <input ref={importInputRef} type="file" accept="application/json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImportFile(f); e.target.value = ""; }} />

        <div className="w-full mt-4 rounded-lg bg-amber-500/10 border border-amber-500/25 px-3 py-2 flex items-start gap-2 text-[11px] text-amber-300 text-left">
          <AlertTriangle size={13} className="shrink-0 mt-0.5" /> Channel scanning needs the YouTube Data API and a server to fetch/decode video, which this environment doesn't have — this generates realistic demo data instead, clearly marked.
        </div>
      </div>
    </div>
  );
}

/* ==================================================================== */
/* PROCESSING VIEW                                                       */
/* ==================================================================== */
function ProcessingView({ job, onDone }) {
  const [label, setLabel] = useState("Starting...");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function runFiles(files) {
      const sources = [], clips = [];
      for (let i = 0; i < files.length; i++) {
        if (cancelled) return;
        const file = files[i];
        const safeLabel = sanitizeText(file.name, 120);
        setLabel(`Analyzing ${i + 1} of ${files.length}: ${safeLabel}`);
        const baseProgress = (i / files.length) * 100;
        setProgress(baseProgress);
        try {
          const arrayBuffer = await file.arrayBuffer();
          const Ctx = window.AudioContext || window.webkitAudioContext;
          const ctx = new Ctx();
          let climber = baseProgress;
          const cap = baseProgress + (100 / files.length) * 0.85;
          const climb = setInterval(() => { climber = Math.min(cap, climber + 1.5); setProgress(climber); }, 100);
          const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
          const channelData = averageChannels(audioBuffer);
          const seed = Array.from(file.name).reduce((a, c) => a + c.charCodeAt(0), 0) + i * 1000;
          const peaks = await analyzePeaksInWorker(channelData, audioBuffer.sampleRate, audioBuffer.duration, seed);
          clearInterval(climb);
          ctx.close();
          const hue = 250 + (seed % 80);
          const source = { id: `file-${seed}`, type: "file", label: safeLabel, file, totalDurationSec: audioBuffer.duration, hue };
          sources.push(source);
          clips.push(...buildClipsFromPeaks(peaks, seed, source));
        } catch (e) { console.error(`Couldn't decode ${safeLabel}, skipping real analysis for it`, e); }
        setProgress(((i + 1) / files.length) * 100);
      }
      await new Promise((r) => setTimeout(r, 300));
      if (!cancelled) onDone(sources, clips);
    }
    async function runChannel(handle) {
      const labels = ["Resolving channel...", "Listing uploads (demo)...", "Generating highlight candidates...", "Scoring clips..."];
      for (let i = 0; i < labels.length; i++) {
        if (cancelled) return;
        setLabel(labels[i]);
        const start = (i / labels.length) * 100, end = ((i + 1) / labels.length) * 100;
        for (let t = start; t <= end; t += 3) { if (cancelled) return; setProgress(t); await new Promise((r) => setTimeout(r, 30)); }
      }
      setProgress(100);
      await new Promise((r) => setTimeout(r, 300));
      if (cancelled) return;
      const { sources, clips } = await channelFetchLimiter(async () => buildDemoChannel(handle));
      onDone(sources, clips);
    }
    if (job.type === "files") runFiles(job.files); else runChannel(job.handle);
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen scs-grid-bg flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle,#8b5cf6,transparent 70%)" }} />
      <div className="relative z-10 w-full max-w-lg scs-glass rounded-3xl p-8 scs-glow-purple">
        <div className="flex items-center justify-between mb-1"><span className="text-xs scs-mono text-zinc-500 uppercase tracking-wider">{job.type === "files" ? "Real batch analysis" : "Demo channel audit"}</span><span className="text-xs scs-mono text-violet-300">{Math.round(progress)}%</span></div>
        <p className="scs-rajdhani text-white text-lg font-semibold truncate mb-6">{label}</p>
        <div className="relative h-16 mb-8 rounded-xl overflow-hidden scs-glass flex items-center justify-center">
          <div className="scs-scanline absolute left-0 right-0 h-8 opacity-40" style={{ background: "linear-gradient(180deg,transparent,#8b5cf6,transparent)" }} />
          <LiveWaveform data={Array.from({ length: 34 }, () => 20 + Math.random() * 70)} bars={34} color="#8b5cf6" height={44} />
        </div>
        <div className="h-2 rounded-full bg-zinc-800 overflow-hidden"><div className="h-full rounded-full transition-all duration-150 ease-linear" style={{ width: `${progress}%`, background: "linear-gradient(90deg,#6d28d9,#8b5cf6,#c4b5fd)" }} /></div>
      </div>
    </div>
  );
}

/* ==================================================================== */
/* APP                                                                    */
/* ==================================================================== */
function AppInner() {
  const [stage, setStage] = useState("input");
  const [job, setJob] = useState(null);
  const [sources, setSources] = useState([]);
  const [clips, setClips] = useState([]);
  const [openClipId, setOpenClipId] = useState(null);

  useEffect(() => {
    if (document.querySelector('meta[http-equiv="Content-Security-Policy"]')) return;
    const meta = document.createElement("meta");
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; object-src 'none'; connect-src 'self' https://api.anthropic.com; worker-src 'self' blob:;";
    document.head.appendChild(meta);
  }, []);

  const handleAnalyzeFiles = useCallback((files) => { setJob({ type: "files", files }); setStage("processing"); }, []);
  const handleAnalyzeChannel = useCallback((handle) => { setJob({ type: "channel", handle: sanitizeText(handle, 60) }); setStage("processing"); }, []);
  const handleDone = useCallback((newSources, newClips) => { setSources(newSources); setClips(newClips); setStage("dashboard"); }, []);
  const handleImport = useCallback((importedSources, importedClips) => { setSources(importedSources); setClips(importedClips); setStage("dashboard"); }, []);
  const handleReset = () => { setStage("input"); setJob(null); setSources([]); setClips([]); setOpenClipId(null); };

  const sourcesById = useMemo(() => Object.fromEntries(sources.map((s) => [s.id, s])), [sources]);
  const openClip = clips.find((c) => c.id === openClipId);

  return (
    <div className="scs-root min-h-screen">
      <FontLoader />
      <SfxBar />
      {stage === "input" && <InputView onAnalyzeFiles={handleAnalyzeFiles} onAnalyzeChannel={handleAnalyzeChannel} onImport={handleImport} />}
      {stage === "processing" && job && <ProcessingView job={job} onDone={handleDone} />}
      {stage === "dashboard" && !openClip && <Dashboard sources={sources} clips={clips} onOpenClip={(c) => setOpenClipId(c.id)} onReset={handleReset} onImport={handleImport} />}
      {stage === "dashboard" && openClip && <EditorView clip={openClip} sourcesById={sourcesById} allClips={clips} onBack={() => setOpenClipId(null)} onSelectClip={(c) => setOpenClipId(c.id)} />}
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <SfxProvider>
        <AppInner />
      </SfxProvider>
    </LangProvider>
  );
}
