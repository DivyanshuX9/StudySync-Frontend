import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, onAuthStateChanged } from "./firebase";
import GuestBanner from "./GuestBanner";
import Navbar from "./Navbar";
import PageBackground from "./PageBackground";
import "./PomodoroTimer.css";

/* ── Full-screen floating paths ─────────────────────── */
function FloatingPaths({ position, color }) {
  const paths = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.3 + i * 0.035,
    opacity: 0.04 + i * 0.016,
  }));

  return (
    <svg
      className="pomo-paths-svg"
      viewBox="0 0 696 316"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      style={{ color }}
    >
      {paths.map((p) => (
        <motion.path
          key={p.id}
          d={p.d}
          stroke="currentColor"
          strokeWidth={p.width}
          strokeOpacity={p.opacity}
          initial={{ pathLength: 0.2, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: [p.opacity * 0.4, p.opacity * 1.2, p.opacity * 0.4],
            pathOffset: [0, 1, 0],
          }}
          transition={{
            duration: 16 + p.id * 0.7,
            repeat: Infinity,
            ease: "linear",
            delay: p.id * 0.12,
          }}
        />
      ))}
    </svg>
  );
}

const MODE_LABELS = { pomodoro: "Focus", short: "Short Break", long: "Long Break" };
const MODE_COLORS = { pomodoro: "#10b981", short: "#6366f1", long: "#f59e0b" };
const MODE_GLOW   = { pomodoro: "rgba(16,185,129,0.35)", short: "rgba(99,102,241,0.35)", long: "rgba(245,158,11,0.35)" };

const spring = { type: "spring", stiffness: 140, damping: 20 };

const PomodoroTimer = () => {
  const [user, setUser]                 = useState(null);
  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [shortBreak, setShortBreak]     = useState(5);
  const [longBreak, setLongBreak]       = useState(15);
  const [timeLeft, setTimeLeft]         = useState(25 * 60);
  const [isRunning, setIsRunning]       = useState(false);
  const [activeMode, setActiveMode]     = useState("pomodoro");
  const [showSettings, setShowSettings] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(require("../assets/notification-off-269282.mp3"));
    return () => { audioRef.current?.pause(); audioRef.current = null; };
  }, []);

  useEffect(() => { const u = onAuthStateChanged(auth, setUser); return u; }, []);

  const getDuration = useCallback((mode) => {
    if (mode === "short") return shortBreak * 60;
    if (mode === "long")  return longBreak * 60;
    return pomodoroTime * 60;
  }, [pomodoroTime, shortBreak, longBreak]);

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft === 0) {
      audioRef.current?.play().catch(() => {});
      setIsRunning(false);
      return;
    }
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [isRunning, timeLeft]);

  const switchMode   = (mode) => { setIsRunning(false); setActiveMode(mode); setTimeLeft(getDuration(mode)); };
  const reset        = ()     => { setIsRunning(false); setTimeLeft(getDuration(activeMode)); };
  const saveSettings = ()     => { setTimeLeft(getDuration(activeMode)); setShowSettings(false); };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const maxTime      = getDuration(activeMode);
  const progress     = ((maxTime - timeLeft) / maxTime) * 100;
  const circumference = 2 * Math.PI * 90;
  const color        = MODE_COLORS[activeMode];
  const glow         = MODE_GLOW[activeMode];

  return (
    <div className="page-wrapper">
      <PageBackground />
      <Navbar user={user} />
      {!user && <GuestBanner />}

      {/* ── Full-screen paths overlay ── */}
      <AnimatePresence>
        {isRunning && (
          <motion.div
            className="pomo-fullscreen-paths"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <FloatingPaths position={1}  color={color} />
            <FloatingPaths position={-1} color={color} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pomodoro-page">

        {/* Mode tabs — shrink when running */}
        <AnimatePresence mode="wait">
          {!isRunning ? (
            <motion.div
              key="tabs-full"
              className="mode-tabs"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={spring}
            >
              {Object.entries(MODE_LABELS).map(([mode, label]) => (
                <motion.button
                  key={mode}
                  className={activeMode === mode ? "active" : ""}
                  style={activeMode === mode ? { background: MODE_COLORS[mode] } : {}}
                  onClick={() => switchMode(mode)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {label}
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="tabs-mini"
              className="mode-tabs-mini"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={spring}
            >
              <span className="mode-mini-label" style={{ color }}>
                {MODE_LABELS[activeMode]}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timer card */}
        <motion.div
          className="timer-card"
          animate={isRunning
            ? { scale: 1.35, filter: `drop-shadow(0 0 60px ${glow})` }
            : { scale: 1,    filter: "drop-shadow(0 0 0px transparent)" }
          }
          transition={spring}
        >
          {/* SVG ring */}
          <svg className="timer-ring" viewBox="0 0 200 200">
            <defs>
              <filter id="glow-ring">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <circle cx="100" cy="100" r="90" className="ring-bg" />
            <motion.circle
              cx="100" cy="100" r="90"
              className="ring-progress"
              stroke={color}
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (progress / 100) * circumference}
              animate={{ stroke: color }}
              transition={{ duration: 0.4 }}
            />
            {isRunning && (
              <circle
                cx="100" cy="100" r="90"
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeOpacity="0.3"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (progress / 100) * circumference}
                filter="url(#glow-ring)"
              />
            )}
          </svg>

          {/* Time display */}
          <div className="timer-display">
            <motion.span
              className="time-text"
              animate={{
                color: isRunning ? color : "var(--text)",
                textShadow: isRunning ? `0 0 40px ${color}99` : "none",
              }}
              transition={{ duration: 0.4 }}
            >
              {fmt(timeLeft)}
            </motion.span>

            <AnimatePresence mode="wait">
              {isRunning && (
                <motion.span
                  key="live"
                  className="pomo-live-dot"
                  style={{ background: color }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [1, 0.3, 1], scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ opacity: { duration: 1.2, repeat: Infinity }, scale: spring }}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div className="controls" layout transition={spring}>
          <AnimatePresence mode="wait">
            {!isRunning ? (
              <motion.button
                key="start"
                className="btn-start"
                style={{ background: color, boxShadow: `0 4px 24px ${glow}` }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.06, boxShadow: `0 6px 32px ${glow}` }}
                whileTap={{ scale: 0.95 }}
                transition={spring}
                onClick={() => setIsRunning(true)}
              >
                ▶ Start
              </motion.button>
            ) : (
              <motion.button
                key="pause"
                className="btn-pause"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                transition={spring}
                onClick={() => setIsRunning(false)}
              >
                ⏸ Pause
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            className="btn-reset"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
          >
            ↺ Reset
          </motion.button>

          <AnimatePresence>
            {!isRunning && (
              <motion.button
                className="btn-settings"
                initial={{ opacity: 0, width: 0, padding: 0 }}
                animate={{ opacity: 1, width: "auto", padding: "0.7rem 1.6rem" }}
                exit={{ opacity: 0, width: 0, padding: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setShowSettings(true)}
              >
                ⚙ Settings
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Settings modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                className="modal"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={spring}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>Timer Settings</h2>
                  <button className="modal-close" onClick={() => setShowSettings(false)}>✕</button>
                </div>
                <div className="modal-body">
                  <label>Focus Duration (min)<input type="number" min="1" max="90" value={pomodoroTime} onChange={(e) => setPomodoroTime(+e.target.value)} /></label>
                  <label>Short Break (min)<input type="number" min="1" max="30" value={shortBreak} onChange={(e) => setShortBreak(+e.target.value)} /></label>
                  <label>Long Break (min)<input type="number" min="1" max="60" value={longBreak} onChange={(e) => setLongBreak(+e.target.value)} /></label>
                  <button className="btn-save" onClick={saveSettings}>Save Changes</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PomodoroTimer;
