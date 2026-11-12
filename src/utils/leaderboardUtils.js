
/**
 * PUBG leaderboard utilities.
 *
 * Pure functions for:
 * - Total score calculation
 * - Squad searching
 * - Category filtering
 * - Sorting
 * - Kill-feed filtering
 */

export const SORT_OPTIONS = [
  {
    value: "total",
    label: "Total Points",
  },
  {
    value: "wwcd",
    label: "WWCD",
  },
  {
    value: "placement",
    label: "Placement Points",
  },
  {
    value: "kills",
    label: "Kill Points",
  },
  {
    value: "name",
    label: "Squad Name",
  },
];

/**
 * Compute total score.
 *
 * In the mock scoring system:
 *
 * Total = Placement Points + Kill Points
 */
export function calculateTotalPoints(squad) {
  return (
    squad.placementPts +
    squad.killPts
  );
}

/**
 * Return the comparison value for
 * the selected sorting option.
 */
export function getSortValue(squad, sortBy) {
  switch (sortBy) {
    case "wwcd":
      return squad.wwcdCount;

    case "placement":
      return squad.placementPts;

    case "kills":
      return squad.killPts;

    case "name":
      return squad.squadName;

    case "total":
    default:
      return calculateTotalPoints(squad);
  }
}

/**
 * Sort a list of squads without
 * mutating the original array.
 *
 * direction:
 * - "desc": highest values first
 * - "asc": lowest values first
 *
 * Equal values are ordered by
 * squad name for deterministic results.
 */
export function sortSquads(
  squads,
  sortBy = "total",
  direction = "desc"
) {
  const multiplier =
    direction === "asc" ? 1 : -1;

  return [...squads].sort((a, b) => {
    const valueA =
      getSortValue(a, sortBy);

    const valueB =
      getSortValue(b, sortBy);

    let comparison = 0;

    if (
      typeof valueA === "string" &&
      typeof valueB === "string"
    ) {
      comparison = valueA.localeCompare(
        valueB,
        undefined,
        { sensitivity: "base" }
      );
    } else {
      comparison = valueA - valueB;
    }

    if (comparison !== 0) {
      return comparison * multiplier;
    }

    /**
     * Stable tie-breaking:
     * - Squad name
     * - Timestamp
     *
     * We do not use random values.
     */
    const nameComparison =
      a.squadName.localeCompare(
        b.squadName,
        undefined,
        { sensitivity: "base" }
      );

    if (nameComparison !== 0) {
      return nameComparison;
    }

    return a.ts.localeCompare(b.ts);
  });
}

/**
 * Filter and sort squad standings.
 */
export function filterAndSortSquads(
  squads,
  {
    search = "",
    category = "ALL",
    sortBy = "total",
    direction = "desc",
  } = {}
) {
  const normalizedSearch =
    search.trim().toLowerCase();

  const filtered = squads.filter(
    (squad) => {
      const matchesSearch =
        squad.squadName
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesCategory =
        category === "ALL" ||
        squad.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  return sortSquads(
    filtered,
    sortBy,
    direction
  );
}

/**
 * Filter kill-feed events.
 *
 * The search query matches:
 * - Attacker squad
 * - Victim squad
 * - Weapon
 *
 * type can be:
 * - ALL
 * - KILL
 * - KNOCK
 */
export function filterKillFeed(
  events,
  {
    search = "",
    type = "ALL",
  } = {}
) {
  const normalizedSearch =
    search.trim().toLowerCase();

  return events.filter((event) => {
    const searchableText = [
      event.attacker,
      event.victim,
      event.weapon,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      searchableText.includes(
        normalizedSearch
      );

    const matchesType =
      type === "ALL" ||
      event.eventType === type;

    return (
      matchesSearch &&
      matchesType
    );
  });
}

/**
 * Display a kill-feed timestamp
 * in Vietnam local time.
 */
export function formatEventTime(timestamp) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "--:--:--";
  }

  return date.toLocaleTimeString(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    }
  );
}
