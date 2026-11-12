
import React from "react";

import {
  getTotalPoints,
} from "../data/mockPubgData";

export default function Leaderboard({
  squads,
}) {
  const rankedSquads = [...squads].sort(
    (a, b) => {
      const pointDifference =
        getTotalPoints(b) - getTotalPoints(a);

      if (pointDifference !== 0) {
        return pointDifference;
      }

      return b.wwcdCount - a.wwcdCount;
    }
  );

  return (
    <section
      id="leaderboard"
      className="leaderboard-section"
      aria-labelledby="leaderboard-heading"
    >
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">
            CHAMPIONSHIP STANDINGS
          </span>

          <h2 id="leaderboard-heading">
            PUBG Vietnam Leaderboard
          </h2>

          <p>
            Follow the performance of
            competing squads.
          </p>
        </div>

        <span className="preview-tag">
          MOCK DATA
        </span>
      </div>

      <div className="leaderboard-card">
        <div className="leaderboard-toolbar">
          <div className="toolbar-title">
            <span className="status-dot"></span>

            <strong>
              Squad Standings
            </strong>
          </div>

          <span className="toolbar-count">
            {rankedSquads.length} SQUADS
          </span>
        </div>

        <div className="table-scroll">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th scope="col">RANK</th>
                <th scope="col">SQUAD</th>
                <th scope="col">CATEGORY</th>
                <th scope="col">WWCD</th>
                <th scope="col">PLACEMENT</th>
                <th scope="col">KILLS</th>
                <th scope="col">TOTAL</th>
              </tr>
            </thead>

            <tbody>
              {rankedSquads.map(
                (squad, index) => (
                  <tr
                    key={squad.squadName}
                  >
                    <td>
                      <span
                        className={
                          index < 3
                            ? "rank-badge top-rank"
                            : "rank-badge"
                        }
                      >
                        #{index + 1}
                      </span>
                    </td>

                    <th scope="row">
                      <span className="squad-name">
                        {squad.squadName}
                      </span>
                    </th>

                    <td>
                      <span className="category-badge">
                        {squad.category}
                      </span>
                    </td>

                    <td>
                      {squad.wwcdCount}
                    </td>

                    <td>
                      {squad.placementPts}
                    </td>

                    <td>
                      {squad.killPts}
                    </td>

                    <td>
                      <strong className="total-points">
                        {getTotalPoints(squad)}
                      </strong>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="leaderboard-footer">
          <span>
            Static preview standings
          </span>

          <span>
            Filtering and virtualization:
            Task 4
          </span>
        </div>
      </div>
    </section>
  );
}
