import React, { useState, useEffect } from "react";
import "./PomodoroTimer.css"; // External CSS file


const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("pomodoro"); // "pomodoro" or "stopwatch"
  const [showSettings, setShowSettings] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);

  // Create audio instance dynamically
  const notificationSound = new Audio(require("../assets/notification-off-269282.mp3"));

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      notificationSound.play(); // Play sound when timer reaches zero
      alert("Time's up!");
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(pomodoroTime * 60);
  };

  const openSettings = () => setShowSettings(true);
  const closeSettings = () => setShowSettings(false);

  const saveSettings = () => {
    setTimeLeft(pomodoroTime * 60);
    setShowSettings(false);
  };

  return (
    <div>
      

      <div className="pomodoro-container">
        <div className="timer-box">
          <h1>Pomodoro Timer</h1>
          <div className="timer-display">{formatTime(timeLeft)}</div>
          <progress className="progress-bar" value={timeLeft} max={pomodoroTime * 60}></progress>
          <div className="controls">
            <button onClick={startTimer}>Start</button>
            <button onClick={pauseTimer}>Pause</button>
            <button onClick={resetTimer}>Reset</button>
            <button onClick={openSettings}>⚙️</button>
          </div>
        </div>

        {showSettings && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeSettings}>&times;</span>
              <h2>Settings</h2>
              <label>Pomodoro Duration (minutes): <input type="number" value={pomodoroTime} onChange={(e) => setPomodoroTime(parseInt(e.target.value))} /></label>
              <label>Short Break (minutes): <input type="number" value={shortBreak} onChange={(e) => setShortBreak(parseInt(e.target.value))} /></label>
              <label>Long Break (minutes): <input type="number" value={longBreak} onChange={(e) => setLongBreak(parseInt(e.target.value))} /></label>
              <button onClick={saveSettings}>Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PomodoroTimer;
