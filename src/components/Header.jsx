
import React from "react";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-content">
        <a
          href="#home"
          className="brand"
          aria-label="PUBG VN Arena Home"
        >
          <span className="brand-icon">
            P
          </span>

          <span className="brand-text">
            <strong>PUBG VN</strong>
            <small>ARENA</small>
          </span>
        </a>

        <nav
          className="main-nav"
          aria-label="Main navigation"
        >
          <a href="#airdrops">
            Airdrops
          </a>

          <a href="#leaderboard">
            Leaderboard
          </a>
        </nav>

        <div className="header-status">
          <span className="status-dot"></span>
          <span>ARENA DEMO</span>
        </div>
      </div>
    </header>
  );
}
