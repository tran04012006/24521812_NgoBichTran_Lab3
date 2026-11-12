
import React from "react";

import Header from "./components/Header";
import AirdropCountdown from "./components/AirdropCountdown";
import RewardClaimCard from "./components/RewardClaimCard";
import Leaderboard from "./components/Leaderboard";

import {
  arenaInfo,
  initialAirdrops,
  initialSquadStandings,
} from "./data/mockPubgData";

export default function App() {
  const featuredDrop = initialAirdrops[0];

  return (
    <div className="app-shell" id="home">
      <Header />

      <main
        id="main-content"
        tabIndex={-1}
      >
        <section
          className="hero-section"
          aria-labelledby="hero-heading"
        >
          <div className="container">
            <div className="hero-content">
              <span className="hero-badge">
                PUBG VIETNAM CHAMPIONSHIP
              </span>

              <h1 id="hero-heading">
                THE ARENA
                <br />
                <span>AWAITS.</span>
              </h1>

              <p className="hero-description">
                {arenaInfo.description}
              </p>

              <div className="hero-actions">
                <a
                  href="#airdrops"
                  className="primary-link"
                >
                  EXPLORE AIRDROPS
                </a>

                <a
                  href="#leaderboard"
                  className="secondary-link"
                >
                  VIEW LEADERBOARD
                </a>
              </div>

              <div className="hero-meta">
                <div>
                  <small>EVENT</small>
                  <strong>
                    {arenaInfo.event}
                  </strong>
                </div>

                <div>
                  <small>SEASON</small>
                  <strong>
                    {arenaInfo.season}
                  </strong>
                </div>

                <div>
                  <small>REWARDS</small>
                  <strong>
                    {initialAirdrops.length} DROPS
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="arena-section"
          id="airdrops"
          aria-labelledby="airdrops-heading"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-eyebrow">
                  LIMITED-TIME REWARDS
                </span>

                <h2 id="airdrops-heading">
                  Airdrop Arena
                </h2>

                <p>
                  Discover exclusive rewards
                  for PUBG Vietnam fans.
                </p>
              </div>
            </div>

            <AirdropCountdown
              targetEpochMs={
                featuredDrop.dropEpochMs
              }
            />

            <div className="rewards-grid">
              {initialAirdrops.map(
                (drop) => (
                  <RewardClaimCard
                    key={drop.id}
                    drop={drop}
                  />
                )
              )}
            </div>
          </div>
        </section>

        <div className="container">
          <Leaderboard
            squads={initialSquadStandings}
          />
        </div>
      </main>

      <footer className="site-footer">
        <div className="container footer-content">
          <div>
            <strong>
              PUBG VN ARENA
            </strong>

            <p>
              React 19 Homework 3 —
              Educational project.
            </p>
          </div>

          <span>
            Mock data. Not affiliated
            with KRAFTON or PUBG.
          </span>
        </div>
      </footer>
    </div>
  );
}
