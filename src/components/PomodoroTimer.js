import React, { useState, useEffect, useRef, useCallback } from "react";
import { auth, onAuthStateChanged } from "./firebase";
import Navbar from "./Navbar";
import "./PomodoroTimer.css";

const PomodoroTimer = () => {
  const [user, setUser] = useState(null);
  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeMode, setActiveMode] = useState("pomodoro");
  const [showSettings, setShowSettings] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(require("../assets/notification-off-269282.mp3"));
    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  const getDuration = useCallback((mode) => {
    if (mode === "short") return shortBreak * 60;
    if (mode === "long") return longBreak * 60;
    return pomodoroTime * 60;
  }, [pomodoroTime, shortBreak, longBreak]);

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft === 0) {
      audioRef.current?.play().catch(() => {});
      setIsRunning(false);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const switchMode = (mode) => {
    setIsRunning(false);
    setActiveMode(mode);
    setTimeLeft(getDuration(mode));
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(getDuration(activeMode));
  };

  const saveSettings = () => {
    setTimeLeft(getDuration(activeMode));
    setShowSettings(false);
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const maxTime = getDuration(activeMode);
  const progress = ((maxTime - timeLeft) / maxTime) * 100;
  const circumference = 2 * Math.PI * 90;

  return (
    <div className="page-wrapper">
      <Navbar user={user} />
      <div className="pomodoro-page">
        <h1 className="page-title">Pomodoro Timer</h1>

        <div className="mode-tabs">
          {[["pomodoro", "Focus"], ["short", "Short Break"], ["long", "Long Break"]].map(([mode, label]) => (
            <button key={mode} className={activeMode === mode ? "active" : ""} onClick={() => switchMode(mode)}>
              {label}
            </button>
          ))}
        </div>

        <div className="timer-card">
          <svg className="timer-ring" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" className="ring-bg" />
            <circle
              cx="100" cy="100" r="90"
              className="ring-progress"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (progress / 100) * circumference}
            />
          </svg>
          <div className="timer-display">
            <span className="time-text">{formatTime(timeLeft)}</span>
            <span className="mode-label">{activeMode === "pomodoro" ? "Focus" : activeMode === "short" ? "Short Break" : "Long Break"}</span>
          </div>
        </div>

        <div className="controls">
          {!isRunning ? (
            <button className="btn-start" onClick={() => setIsRunning(true)}>▶ Start</button>
          ) : (
            <button className="btn-pause" onClick={() => setIsRunning(false)}>⏸ Pause</button>
          )}
          <button className="btn-reset" onClick={reset}>↺ Reset</button>
          <button className="btn-settings" onClick={() => setShowSettings(true)}>⚙ Settings</button>
        </div>

        {showSettings && (
          <div className="modal-overlay" onClick={() => setShowSettings(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Timer Settings</h2>
                <button className="modal-close" onClick={() => setShowSettings(false)}>✕</button>
              </div>
              <div className="modal-body">
                <label>
                  Focus Duration (min)
                  <input type="number" min="1" max="90" value={pomodoroTime} onChange={(e) => setPomodoroTime(+e.target.value)} />
                </label>
                <label>
                  Short Break (min)
                  <input type="number" min="1" max="30" value={shortBreak} onChange={(e) => setShortBreak(+e.target.value)} />
                </label>
                <label>
                  Long Break (min)
                  <input type="number" min="1" max="60" value={longBreak} onChange={(e) => setLongBreak(+e.target.value)} />
                </label>
                <button className="btn-save" onClick={saveSettings}>Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PomodoroTimer;
