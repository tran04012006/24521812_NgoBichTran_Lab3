
import React, {
  memo,
} from "react";

import {
  calculateTotalPoints,
} from "../utils/leaderboardUtils";

/**
 * Memoized leaderboard table row.
 *
 * Props should contain stable primitive
 * values and a stable squad object.
 *
 * React.memo skips rerenders when
 * the props compare equal.
 */
function LeaderboardRow({
  squad,
  rank,
}) {
  const totalPoints =
    calculateTotalPoints(squad);

  const accessibleRank =
    `Rank ${rank}`;

  return (
    <tr
      className="virtual-row"
      aria-rowindex={rank + 1}
    >
      <td>
        <span
          className={
            rank <= 3
              ? "rank-badge top-rank"
              : "rank-badge"
          }
          aria-label={accessibleRank}
        >
          #{rank}
        </span>
      </td>

      <th scope="row">
        <span
          className="squad-name"
          title={squad.squadName}
        >
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
          {totalPoints}
        </strong>
      </td>
    </tr>
  );
}

export default memo(LeaderboardRow);
