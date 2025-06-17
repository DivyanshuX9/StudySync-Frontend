import React from "react";
import { Link } from "react-router-dom";
import { auth, signOut } from "./firebase"; // Ensure correct import
import "./LandingPage.css";

function LandingPage({ user }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">📚 StudySync</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <div className="features-dropdown">
            <button className="features-btn">Features</button>
            <div className="features-content">
              <Link to="/tasks">Task Management</Link>
              <Link to={user ? "/pomodoro" : "/signin"}>Pomodoro Timer</Link>
              <Link to="/timetable">TimeTable</Link>
              <Link to="/subject-manager">Subject Manager</Link>
            </div>
          </div>

          {/* User Authentication UI */}
          {user ? (
            <div className="user-info">
              <span>Welcome, {user.displayName || "User"}!</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link to="/signin">
              <button className="sign-in-btn">Sign In</button>
            </Link>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <h1>Welcome to StudySync</h1>
        <p>
          "Organize, track, and excel—your all-in-one digital study planner for
          smarter learning and productivity! 📚✨"
        </p>

        <div className="features-showcase">
          <FeatureCard title="Task Management" description="Organize your tasks efficiently and track your progress." link={user? "/tasks" : "/signin"}/>
          <FeatureCard title="Pomodoro Timer" description="Stay focused with our customizable Pomodoro timer." link={user ? "/pomodoro" : "/signin"} />
          <FeatureCard title="TimeTable" description="Make your customizable TimeTable and always be on time." link={user ?  "/timetable": "/signin"} />
          <FeatureCard title="Subject Manager" description="Get exam ready!" link= {user ?  "/subject-manager": "/signin"} />
          <FeatureCard title="Darwin" description="AI for Help!" link={user ?  "/Chatbot": "/signin"} />
        </div>
      </main>

      {/* Embedded 3D View */}
      <iframe
        title="Lightroom"
        src="https://my.spline.design/miniroomartcopy-57064fc1caf4042f3405e1d92c322081/"
        frameBorder="0"
        width="100%"
        height="800px"
      ></iframe>
    </div>
  );
}

const FeatureCard = ({ title, description, link }) => (
  <div className="feature-card">
    <h2>{title}</h2>
    <p>{description}</p>
    <Link to={link} className="feature-link">Get Started</Link>
  </div>
);

export default LandingPage;
