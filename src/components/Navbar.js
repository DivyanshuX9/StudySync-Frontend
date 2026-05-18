import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useWeather } from "../context/WeatherContext";
import { auth, signOut } from "./firebase";
import Logo from "./Logo";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Home",       path: "/" },
  { label: "Learn",      path: "/tasks" },
  { label: "Focus",      path: "/pomodoro" },
  { label: "Plan",       path: "/timetable" },
  { label: "Tools",      path: "/subject-manager" },
  { label: "AI",         path: "/chatbot" },
];

export default function Navbar({ user }) {
  const { isNight, setIsNight } = useWeather();
  const location = useLocation();
  const handleLogout = () => signOut(auth).catch(console.error);

  return (
    <>
      {/* Desktop: pure floating text — no bg, no border */}
      <nav className={`navbar-desktop ${isNight ? 'text-white' : 'text-black'}`}>
        <Link to="/" className="nav-logo text-inherit">
          <Logo size={28} />
          <span>StudySync</span>
        </Link>
        <div className="nav-links-row">
          {NAV_LINKS.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? "active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="nav-end">
          <label className="ray-toggle" title={isNight ? "Switch to day" : "Switch to night"}>
            <input type="checkbox" checked={isNight} onChange={() => setIsNight(n => !n)} />
            <span className="ray-track" />
            <span className="ray-thumb">{isNight ? "🌙" : "☀️"}</span>
          </label>
          {user
            ? <button className="nav-logout" onClick={handleLogout}>Logout</button>
            : <Link to="/signin" className="nav-signin">Sign In</Link>
          }
        </div>
      </nav>

      {/* Mobile: Dynamic Island */}
      <DynamicIsland user={user} isNight={isNight} setIsNight={setIsNight} handleLogout={handleLogout} />
    </>
  );
}

function getGreeting(name) {
  const h = new Date().getHours();
  const first = name?.split(" ")[0] || "there";
  if (h >= 5  && h < 12) return `Good morning, ${first}`;
  if (h >= 12 && h < 17) return `Good afternoon, ${first}`;
  if (h >= 17 && h < 21) return `Good evening, ${first}`;
  return `Good night, ${first}`;
}

function DynamicIsland({ user, isNight, setIsNight, handleLogout }) {
  const [expanded, setExpanded] = useState(false);
  const [visible,  setVisible]  = useState(true);
  const lastY    = useRef(0);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < lastY.current || y < 60);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setExpanded(false), [location]);

  return (
    <div className={`island-wrap ${visible ? "island-visible" : "island-hidden"}`}>
      <div
        className={`dynamic-island ${expanded ? "island-expanded" : ""}`}
        onClick={() => !expanded && setExpanded(true)}
      >
        {!expanded ? (
          <div className="island-pill">
            <Logo size={20} />
            <span className="island-label">StudySync</span>
            <span className="island-dot" />
          </div>
        ) : (
          <div className="island-menu">
            <div className="island-top">
              <span className="island-brand">📚 StudySync</span>
              <div className="island-top-right">
                <label className="ray-toggle" onClick={e => e.stopPropagation()}>
                  <input type="checkbox" checked={isNight} onChange={() => setIsNight(n => !n)} />
                  <span className="ray-track" />
                  <span className="ray-thumb">{isNight ? "🌙" : "☀️"}</span>
                </label>
                <button className="island-close" onClick={e => { e.stopPropagation(); setExpanded(false); }}>✕</button>
              </div>
            </div>
            {user && <p className="island-greeting">{getGreeting(user.displayName)}</p>}
            <div className="island-grid">
              {NAV_LINKS.map(({ label, path }) => (
                <Link key={path} to={path} className="island-link" onClick={() => setExpanded(false)}>
                  {label}
                </Link>
              ))}
            </div>
            <div className="island-foot">
              {user
                ? <button className="island-logout" onClick={handleLogout}>Logout</button>
                : <Link to="/signin" className="island-signin" onClick={() => setExpanded(false)}>Sign In</Link>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
