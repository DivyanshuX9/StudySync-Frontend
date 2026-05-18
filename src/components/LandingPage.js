import { useState } from "react";
import { Link } from "react-router-dom";
import { useWeather } from "../context/WeatherContext";
import "./LandingPage.css";
import Navbar from "./Navbar";
import { AnimatedAIChat } from "./ui/animated-ai-chat";

function getHeroCopy(user, weather, isNight) {
  const h    = new Date().getHours();
  const name = user?.displayName?.split(" ")[0] || null;
  const cond = weather?.condition?.label || "";
  const temp = weather?.temp;

  let greet;
  if      (h >= 5  && h < 12) greet = name ? `Good morning, ${name} ☀️`  : "Good morning ☀️";
  else if (h >= 12 && h < 17) greet = name ? `Good afternoon, ${name} 🌤️` : "Good afternoon 🌤️";
  else if (h >= 17 && h < 21) greet = name ? `Good evening, ${name} 🌆`   : "Good evening 🌆";
  else                         greet = name ? `Good night, ${name} 🌙`     : "Burning the midnight oil? 🌙";

  let sub;
  if      (cond.toLowerCase().includes("rain") || cond.toLowerCase().includes("drizzle"))
    sub = "Perfect day to stay in and get ahead. Let's make it count.";
  else if (cond.toLowerCase().includes("thunder"))
    sub = "Storm outside, focus inside. Your goals don't pause for weather.";
  else if (cond.toLowerCase().includes("snow"))
    sub = "Snow day? Best kind of study day. Warm up with your goals.";
  else if (isNight)
    sub = "The world is quiet. Your best thinking happens now.";
  else if (temp !== undefined && temp > 30)
    sub = `${temp}°C out there - cool down with a focused session.`;
  else if (h >= 5 && h < 12)
    sub = "Fresh start. What are we conquering today?";
  else if (h >= 12 && h < 17)
    sub = "Afternoon momentum. Keep the streak alive.";
  else
    sub = "Evening grind. Finish strong - future you will thank you.";

  const actions = [
    "What are we studying today?",
    "Ready to level up?",
    "Let's build something great today.",
    "Your goals are waiting.",
    "One focused session changes everything.",
  ];
  const action = actions[new Date().getDate() % actions.length];

  return { greet, sub, action };
}

const FEATURES = [
  { icon: "✅", label: "Tasks",      path: "/tasks",           desc: "Prioritize & track" },
  { icon: "⏱️", label: "Pomodoro",   path: "/pomodoro",        desc: "Deep focus sessions" },
  { icon: "📅", label: "Timetable",  path: "/timetable",       desc: "Weekly schedule" },
  { icon: "📂", label: "Subjects",   path: "/subject-manager", desc: "Organize materials" },
  { icon: "🃏", label: "Flashcards", path: "/flashcards",      desc: "Spaced repetition" },
  { icon: "📝", label: "Notes",      path: "/notes",           desc: "Smart note-taking" },
  { icon: "🤖", label: "Darwin AI",  path: "/chatbot",         desc: "AI study assistant" },
];

export default function LandingPage({ user }) {
  const { weather, location, loading, error, searchCity, isNight } = useWeather();
  const [cityInput,  setCityInput]  = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (cityInput.trim()) { searchCity(cityInput.trim()); setCityInput(""); setShowSearch(false); }
  };

  const { greet, sub, action } = getHeroCopy(user, weather, isNight);

  return (
    <div className="landing">
      <Navbar user={user} />

      {/* ── Full-screen background ── */}
      <div className="hero-bg">
        <AnimatedAIChat />
      </div>

      {/* ── Weather Panel ── */}
      <div className={`weather-panel ${showSearch ? "expanded" : "compact"}`}>
        {loading ? (
          <div className="weather-loading">⛅ Fetching weather…</div>
        ) : error ? (
          <div className="weather-error">⚠️ {error}</div>
        ) : weather ? (
          <>
            {showSearch ? (
              <div className="weather-expanded">
                <div className="weather-main">
                  <div className="weather-icon-big">{weather.condition.icon}</div>
                  <div className="weather-info">
                    <div className="weather-temp">{weather.temp}°C</div>
                    <div className="weather-condition">{weather.condition.label}</div>
                    <div className="weather-location">{location}</div>
                  </div>
                </div>
                <div className="weather-details">
                  <div className="detail-item">
                    <span className="detail-icon">💧</span>
                    <span className="detail-value">{weather.precip}mm</span>
                    <span className="detail-label">Precipitation</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">💨</span>
                    <span className="detail-value">{weather.wind}m/s</span>
                    <span className="detail-label">Wind Speed</span>
                  </div>
                </div>
                <form className="weather-search" onSubmit={handleSearch}>
                  <input autoFocus type="text" placeholder="Search city…" value={cityInput} onChange={e => setCityInput(e.target.value)} />
                  <button type="submit">Search</button>
                </form>
              </div>
            ) : (
              <div className="weather-compact">
                <span className="w-icon">{weather.condition.icon}</span>
                <div className="w-quick">
                  <div className="w-temp">{weather.temp}°C</div>
                  <div className="w-loc">{location}</div>
                </div>
              </div>
            )}
            <button className="weather-toggle-btn" onClick={() => setShowSearch(s => !s)} title={showSearch ? "Collapse" : "Expand"}>
              {showSearch ? "⌫" : "⛅"}
            </button>
          </>
        ) : null}
      </div>

      {/* ── Hero ── */}
      <main className="hero-section">
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            AI-Powered Study Platform
          </div>
          <p className="hero-greet">{greet}</p>

          <h1 className="hero-h1">
            Study Smarter.<br />
            <span className="hero-hl">Achieve More.</span>
          </h1>

          <p className="hero-action">{action}</p>
          <p className="hero-sub">{sub}</p>

          <div className="hero-cta">
            {user ? (
              <Link to="/tasks" className="cta-primary">Open Dashboard →</Link>
            ) : (
              <>
                <Link to="/signin" className="cta-primary">Get Started Free</Link>
                <Link to="/signin" className="cta-ghost">Sign In</Link>
              </>
            )}
          </div>
        </div>
      </main>

      {/* ── Features ── */}
      <section className="feature-orbit-section">
        <h2 className="orbit-title">Everything You Need to Study Better</h2>
        <div className="feature-orbit">
          {FEATURES.map(({ icon, label, path, desc }) => (
            <Link key={path} to={path} className="orbit-card">
              <span className="orbit-icon">{icon}</span>
              <span className="orbit-label">{label}</span>
              <span className="orbit-desc">{desc}</span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-left">
          <span>© {new Date().getFullYear()} StudySync</span>
        </div>
        <div className="footer-center">
          <span>Built with 💜 for students</span>
        </div>
        <div className="footer-right">
          <p className="about-dev">
            An open-source study platform combining AI, beautiful design, and proven learning science.
          </p>
        </div>
      </footer>
    </div>
  );
}
