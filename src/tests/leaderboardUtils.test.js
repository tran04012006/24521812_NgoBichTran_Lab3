
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateTotalPoints,
  sortSquads,
  filterAndSortSquads,
  filterKillFeed,
  formatEventTime,
} from "../src/utils/leaderboardUtils";

const squads = [
  {
    ts: "2026-11-12T12:00:00Z",
    squadName: "Alpha Esports",
    category: "ESPORTS",
    wwcdCount: 3,
    placementPts: 40,
    killPts: 60,
  },
  {
    ts: "2026-11-12T12:00:00Z",
    squadName: "Bravo Pro",
    category: "PRO",
    wwcdCount: 5,
    placementPts: 60,
    killPts: 30,
  },
  {
    ts: "2026-11-12T12:00:00Z",
    squadName: "Charlie AGG",
    category: "AGG",
    wwcdCount: 1,
    placementPts: 20,
    killPts: 50,
  },
];

const events = [
  {
    id: "event-1",
    attacker: "Alpha Esports",
    victim: "Bravo Pro",
    weapon: "M416",
    eventType: "KILL",
  },
  {
    id: "event-2",
    attacker: "Charlie AGG",
    victim: "Alpha Esports",
    weapon: "Mini14",
    eventType: "KNOCK",
  },
];

describe("leaderboardUtils", () => {
  it("calculates total points", () => {
    expect(
      calculateTotalPoints(
        squads[0]
      )
    ).toBe(100);
  });

  it("searches squad names case-insensitively", () => {
    const result =
      filterAndSortSquads(
        squads,
        {
          search: "ALPHA",
        }
      );

    expect(result).toHaveLength(1);

    expect(
      result[0].squadName
    ).toBe("Alpha Esports");
  });

  it("filters by squad category", () => {
    const result =
      filterAndSortSquads(
        squads,
        {
          category: "PRO",
        }
      );

    expect(result).toHaveLength(1);

    expect(
      result[0].squadName
    ).toBe("Bravo Pro");
  });

  it("combines search and category filters", () => {
    const result =
      filterAndSortSquads(
        squads,
        {
          search: "alpha",
          category: "PRO",
        }
      );

    expect(result).toHaveLength(0);
  });

  it("sorts total points descending", () => {
    const result =
      sortSquads(
        squads,
        "total",
        "desc"
      );

    expect(
      result.map(
        (squad) =>
          squad.squadName
      )
    ).toEqual([
      "Alpha Esports",
      "Bravo Pro",
      "Charlie AGG",
    ]);
  });

  it("sorts total points ascending", () => {
    const result =
      sortSquads(
        squads,
        "total",
        "asc"
      );

    expect(
      result[0].squadName
    ).toBe("Charlie AGG");
  });

  it("sorts by WWCD", () => {
    const result =
      sortSquads(
        squads,
        "wwcd",
        "desc"
      );

    expect(
      result[0].squadName
    ).toBe("Bravo Pro");
  });

  it("sorts by placement points", () => {
    const result =
      sortSquads(
        squads,
        "placement",
        "desc"
      );

    expect(
      result[0].squadName
    ).toBe("Bravo Pro");
  });

  it("sorts by kill points", () => {
    const result =
      sortSquads(
        squads,
        "kills",
        "desc"
      );

    expect(
      result[0].squadName
    ).toBe("Alpha Esports");
  });

  it("sorts squad names ascending", () => {
    const result =
      sortSquads(
        squads,
        "name",
        "asc"
      );

    expect(
      result.map(
        (squad) =>
          squad.squadName
      )
    ).toEqual([
      "Alpha Esports",
      "Bravo Pro",
      "Charlie AGG",
    ]);
  });

  it("uses deterministic tie-breaking", () => {
    const tiedSquads = [
      {
        ...squads[0],
        squadName: "Zulu",
        killPts: 20,
      },
      {
        ...squads[1],
        squadName: "Alpha",
        killPts: 20,
      },
    ];

    const result =
      sortSquads(
        tiedSquads,
        "kills",
        "desc"
      );

    expect(
      result[0].squadName
    ).toBe("Alpha");
  });

  it("does not mutate the original array", () => {
    const originalNames =
      squads.map(
        (squad) =>
          squad.squadName
      );

    sortSquads(
      squads,
      "kills",
      "desc"
    );

    expect(
      squads.map(
        (squad) =>
          squad.squadName
      )
    ).toEqual(originalNames);
  });

  it("filters kill-feed event types", () => {
    const result =
      filterKillFeed(
        events,
        {
          type: "KNOCK",
        }
      );

    expect(result).toHaveLength(1);

    expect(
      result[0].eventType
    ).toBe("KNOCK");
  });

  it("searches attacker and victim names", () => {
    const result =
      filterKillFeed(
        events,
        {
          search: "alpha",
        }
      );

    expect(result).toHaveLength(2);
  });

  it("searches weapon names", () => {
    const result =
      filterKillFeed(
        events,
        {
          search: "M416",
        }
      );

    expect(result).toHaveLength(1);
  });

  it("formats event time in Vietnam", () => {
    expect(
      formatEventTime(
        "2026-11-12T12:00:00Z"
      )
    ).toBe("19:00:00");
  });

  it("handles invalid event timestamps", () => {
    expect(
      formatEventTime(
        "invalid-date"
      )
    ).toBe("--:--:--");
  });
});
