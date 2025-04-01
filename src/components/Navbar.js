import React from "react";
import { Link } from "react-router-dom";
import { auth, signOut } from "./firebase"; // Ensure correct import
import "./Navbar.css";

const Navbar = ({ user }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
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
  );
};

export default Navbar;
