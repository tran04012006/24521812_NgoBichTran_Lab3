
import React from "react";

/**
 * Application header.
 *
 * Task 5 accessibility improvements:
 * - Skip-to-content navigation
 * - Accessible brand link
 * - Semantic navigation
 * - Visible keyboard focus via CSS
 */
export default function Header() {
  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
      >
        Skip to main content
      </a>

      <header className="site-header">
        <div className="container header-content">
          <a
            href="#home"
            className="brand"
            aria-label="PUBG VN Arena home"
          >
            <span
              className="brand-icon"
              aria-hidden="true"
            >
              P
            </span>

            <span className="brand-text">
              <strong>PUBG VN</strong>
              <small>ARENA</small>
            </span>
          </a>

          <nav
            className="main-nav"
            aria-label="Primary navigation"
          >
            <a href="#airdrops">
              Airdrops
            </a>

            <a href="#leaderboard">
              Leaderboard
            </a>
          </nav>

          <div
            className="header-status"
            aria-label="Arena demonstration mode"
          >
            <span
              className="status-dot"
              aria-hidden="true"
            />

            <span>ARENA DEMO</span>
          </div>
        </div>
      </header>
    </>
  );
}
