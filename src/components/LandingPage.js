import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useWeather } from "../context/WeatherContext";
import "./LandingPage.css";
import Navbar from "./Navbar";

/* ── Orbital System: Earth spinning around the sun ────── */
function OrbitalSystem({ isNight }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const centerX = w / 2, centerY = h / 2;
    let time = 0;
    
    const animate = () => {
      time += 0.002;
      
      // Clear with space background
      ctx.fillStyle = isNight ? "#0a0e27" : "#1a1f3a";
      ctx.fillRect(0, 0, w, h);
      
      // Stars
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      for (let i = 0; i < 200; i++) {
        const x = (i * 73) % w, y = (i * 137) % h;
        const size = (i % 3) * 0.5;
        ctx.fillRect(x, y, size, size);
      }
      
      // Sun with glow
      ctx.fillStyle = "#FDB813";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.fill();
      
      const gradient = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, 60);
      gradient.addColorStop(0, "rgba(253, 184, 19, 0.3)");
      gradient.addColorStop(1, "rgba(253, 184, 19, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(centerX - 60, centerY - 60, 120, 120);
      
      // Orbit path
      ctx.strokeStyle = "rgba(255, 200, 100, 0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 100, 0, Math.PI * 2);
      ctx.stroke();
      
      // Earth orbiting
      const earthX = centerX + Math.cos(time) * 100;
      const earthY = centerY + Math.sin(time) * 100;
      
      ctx.fillStyle = "#4A90E2";
      ctx.beginPath();
      ctx.arc(earthX, earthY, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Earth continents (simple)
      ctx.fillStyle = "#2D8659";
      ctx.beginPath();
      ctx.arc(earthX - 2, earthY - 2, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(earthX + 3, earthY + 1, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Moon orbiting Earth
      const moonX = earthX + Math.cos(time * 12) * 15;
      const moonY = earthY + Math.sin(time * 12) * 15;
      ctx.fillStyle = "#D3D3D3";
      ctx.beginPath();
      ctx.arc(moonX, moonY, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Orbit trails (comet effect)
      ctx.strokeStyle = `rgba(74, 144, 226, ${0.3 * Math.sin(time * 2 + 1)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(earthX, earthY);
      ctx.stroke();
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [isNight]);
  
  return <canvas ref={canvasRef} width={1200} height={600} className="orbital-canvas" />;
}

/* ── Spacetime Curve: Einstein's curved spacetime ────── */
function SpacetimeCurve({ isNight }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    let time = 0;
    
    const animate = () => {
      time += 0.005;
      
      // Background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, w, h);
      bgGradient.addColorStop(0, isNight ? "#0a0e27" : "#1a1f3a");
      bgGradient.addColorStop(1, isNight ? "#2a2e47" : "#3a3f5a");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, w, h);
      
      // Draw curved spacetime grid
      const gridSize = 40;
      ctx.strokeStyle = "rgba(100, 150, 255, 0.3)";
      ctx.lineWidth = 1;
      
      // Vertical lines with curvature
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        for (let y = 0; y < h; y += 5) {
          const curve = Math.sin((x - w / 2) * 0.01) * 30 * Math.sin(time);
          const distFromCenter = Math.abs(x - w / 2) + Math.abs(y - h / 2);
          const warp = 1 + Math.sin(time) * 0.2 * (1 - distFromCenter / Math.hypot(w, h));
          ctx.lineTo(x + curve * warp, y);
        }
        ctx.stroke();
      }
      
      // Horizontal lines with curvature
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        for (let x = 0; x < w; x += 5) {
          const curve = Math.cos((y - h / 2) * 0.01) * 30 * Math.sin(time);
          const distFromCenter = Math.abs(x - w / 2) + Math.abs(y - h / 2);
          const warp = 1 + Math.sin(time) * 0.2 * (1 - distFromCenter / Math.hypot(w, h));
          ctx.lineTo(x, y + curve * warp);
        }
        ctx.stroke();
      }
      
      // Central mass point (black hole / Einstein mass)
      const massX = w / 2 + Math.sin(time * 0.3) * 50;
      const massY = h / 2 + Math.cos(time * 0.3) * 50;
      
      // Event horizon
      ctx.strokeStyle = "rgba(255, 100, 100, 0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(massX, massY, 30, 0, Math.PI * 2);
      ctx.stroke();
      
      // Mass center (glowing dot)
      ctx.fillStyle = "#FF6B6B";
      ctx.beginPath();
      ctx.arc(massX, massY, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Gravitational waves (pulsing circles)
      for (let i = 1; i <= 3; i++) {
        const waveRadius = (time * 100 + i * 40) % 250;
        ctx.strokeStyle = `rgba(255, 150, 150, ${(1 - waveRadius / 250) * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(massX, massY, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [isNight]);
  
  return <canvas ref={canvasRef} width={1200} height={600} className="spacetime-canvas" />;
}

/* ── Complex Math: Wave Function visualization ────── */
function WaveFunction({ isNight }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    let time = 0;
    
    const animate = () => {
      time += 0.01;
      
      // Background with gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
      bgGradient.addColorStop(0, isNight ? "#0a0e27" : "#1a1f3a");
      bgGradient.addColorStop(0.5, isNight ? "#1a1a3a" : "#2a2a4a");
      bgGradient.addColorStop(1, isNight ? "#0a0e27" : "#1a1f3a");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, w, h);
      
      // Draw multiple wave functions (superposition)
      const waves = [
        { freq: 0.01, phase: time * 0.5, color: "rgba(74, 144, 226, 0.6)", amp: 40 },
        { freq: 0.015, phase: time * 0.7, color: "rgba(138, 43, 226, 0.5)", amp: 30 },
        { freq: 0.008, phase: time * 0.3, color: "rgba(255, 100, 200, 0.4)", amp: 35 },
      ];
      
      waves.forEach(wave => {
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let x = 0; x < w; x += 5) {
          const y = h / 2 + 
            Math.sin(x * wave.freq + wave.phase) * wave.amp +
            Math.cos(x * wave.freq * 0.5 + wave.phase * 1.3) * wave.amp * 0.5;
          
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      
      // Probability density (filled area under wave)
      ctx.fillStyle = "rgba(74, 144, 226, 0.15)";
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      
      for (let x = 0; x < w; x += 5) {
        const y = h / 2 + 
          Math.sin(x * 0.01 + time * 0.5) * 40 +
          Math.cos(x * 0.008 + time * 0.3) * 35;
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();
      
      // Quantum particles (points on the wave)
      ctx.fillStyle = "#FFD700";
      for (let i = 0; i < 8; i++) {
        const x = (w / 8) * i + Math.sin(time + i) * 30;
        const y = h / 2 + 
          Math.sin(x * 0.01 + time * 0.5) * 40 +
          Math.cos(x * 0.008 + time * 0.3) * 35;
        
        ctx.beginPath();
        ctx.arc(x, y, 5 + Math.sin(time + i) * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Particle glow
        const particleGradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
        particleGradient.addColorStop(0, "rgba(255, 215, 0, 0.4)");
        particleGradient.addColorStop(1, "rgba(255, 215, 0, 0)");
        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Energy axis labels
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "12px monospace";
      ctx.fillText("Energy", 10, 20);
      ctx.fillText("Time →", w - 60, h - 10);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [isNight]);
  
  return <canvas ref={canvasRef} width={1200} height={400} className="wave-function-canvas" />;
}

/* ── Contextual hero copy ───────────────────────────── */
function getHeroCopy(user, weather, isNight) {
  const h    = new Date().getHours();
  const name = user?.displayName?.split(" ")[0] || null;
  const cond = weather?.condition?.label || "";
  const temp = weather?.temp;

  // Greeting line
  let greet;
  if (h >= 5  && h < 12) greet = name ? `Good morning, ${name} ☀️` : "Good morning ☀️";
  else if (h >= 12 && h < 17) greet = name ? `Good afternoon, ${name} 🌤️` : "Good afternoon 🌤️";
  else if (h >= 17 && h < 21) greet = name ? `Good evening, ${name} 🌆` : "Good evening 🌆";
  else greet = name ? `Guten Morgen, ${name} 🌙` : "Burning the midnight oil? 🌙";

  // Sub-line based on weather + time
  let sub;
  if (cond.toLowerCase().includes("rain") || cond.toLowerCase().includes("drizzle"))
    sub = "Perfect day to stay in and get ahead. Let's make it count.";
  else if (cond.toLowerCase().includes("thunder"))
    sub = "Storm outside, focus inside. Your goals don't pause for weather.";
  else if (cond.toLowerCase().includes("snow"))
    sub = "Snow day? Best kind of study day. Warm up with your goals.";
  else if (isNight)
    sub = "The world is quiet. Your best thinking happens now.";
  else if (temp !== undefined && temp > 30)
    sub = `${temp}°C out there — cool down with a focused session.`;
  else if (h >= 5 && h < 12)
    sub = "Fresh start. What are we conquering today?";
  else if (h >= 12 && h < 17)
    sub = "Afternoon momentum. Keep the streak alive.";
  else
    sub = "Evening grind. Finish strong — future you will thank you.";

  // Action prompt
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

const STATS = [
  { value: "50K+", label: "Students" },
  { value: "2M+",  label: "Tasks Done" },
  { value: "98%",  label: "Satisfaction" },
];

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
  const { weather, location, loading, error, searchCity, isNight, toneKey } = useWeather();
  const [cityInput,   setCityInput]   = useState("");
  const [showSearch,  setShowSearch]  = useState(false);
  const [activeViz, setActiveViz] = useState("orbital");
  
  // Apply tone to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-tone", toneKey);
  }, [toneKey]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (cityInput.trim()) { searchCity(cityInput.trim()); setCityInput(""); setShowSearch(false); }
  };

  const { greet, sub, action } = getHeroCopy(user, weather, isNight);

  return (
    <div className="landing">
      <Navbar user={user} />

      {/* ── Background: Complex Math Visualizations ─────────────────────────── */}
      <div className="viz-bg">
        <div className="viz-container">
          {activeViz === "orbital" && <OrbitalSystem isNight={isNight} />}
          {activeViz === "spacetime" && <SpacetimeCurve isNight={isNight} />}
          {activeViz === "wave" && <WaveFunction isNight={isNight} />}
        </div>
        
        {/* Visualization switcher */}
        <div className="viz-switcher">
          <button 
            className={`viz-btn ${activeViz === "orbital" ? "active" : ""}`}
            onClick={() => setActiveViz("orbital")}
            title="Earth orbiting Sun"
          >
            🌍 Orbital
          </button>
          <button 
            className={`viz-btn ${activeViz === "spacetime" ? "active" : ""}`}
            onClick={() => setActiveViz("spacetime")}
            title="Spacetime curvature"
          >
            🌌 Spacetime
          </button>
          <button 
            className={`viz-btn ${activeViz === "wave" ? "active" : ""}`}
            onClick={() => setActiveViz("wave")}
            title="Wave function"
          >
            〰️ Waves
          </button>
        </div>
        
        <div className="video-overlay" />
      </div>

      {/* ── Weather Panel ──────────────────────────── */}
      <div className={`weather-panel ${showSearch ? 'expanded' : 'compact'}`}>
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
              {showSearch ? '⌫' : '⛅'}
            </button>
          </>
        ) : null}
      </div>

      {/* ── Hero ───────────────────────────────────── */}
      <main className="hero-section">
        <div className="hero-inner">
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

          <div className="hero-stats">
            {STATS.map(({ value, label }) => (
              <div key={label} className="stat">
                <span className="stat-val">{value}</span>
                <span className="stat-lbl">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ── Feature orbit ──────────────────────────── */}
      <section className="feature-orbit-section">
        <h2 className="orbit-title">Your Study Universe</h2>
        <div className="feature-orbit">
          {FEATURES.map(({ icon, label, path, desc }) => (
            <Link key={path} to={user ? path : "/signin"} className="orbit-card">
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
          <a href="https://21stdev.com" target="_blank" rel="noopener noreferrer" className="footer-link">21stDev</a>
          <span className="footer-divider">•</span>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
          <span className="footer-divider">•</span>
          <span>Built with 💜</span>
        </div>
        <div className="footer-right">
          <p className="about-dev">
            Crafted by passionate developers building tools for modern learners. StudySync combines AI, beautiful design, and proven learning science.
          </p>
        </div>
      </footer>
    </div>
  );
}
