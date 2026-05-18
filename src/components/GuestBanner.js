import { Link } from "react-router-dom";
import "./GuestBanner.css";

export default function GuestBanner() {
  return (
    <div className="guest-banner">
      <span>👋 You're exploring in guest mode - data is saved locally only.</span>
      <Link to="/signin" className="guest-banner-cta">Sign in to sync →</Link>
    </div>
  );
}
