
import {
  initialSquadStandings,
} from "./mockPubgData";

/**
 * PUBG Vietnam leaderboard mock data.
 *
 * The first eight squads are preserved
 * from Task 1.
 *
 * Another 500 squads are generated to
 * demonstrate virtualization.
 *
 * All statistics are fictional.
 */

export const SQUAD_CATEGORIES = [
  "PRO",
  "ESPORTS",
  "AGG",
];

export const KILL_EVENT_TYPES = [
  "KILL",
  "KNOCK",
];

/**
 * Deterministic integer generator.
 *
 * The same seed always produces
 * the same value.
 */
function seededValue(seed, modulus) {
  const value =
    (Math.imul(seed, 9301) + 49297) >>> 0;

  return value % modulus;
}

/**
 * Generate additional mock squads.
 *
 * @param {number} count
 * @returns {Array}
 */
export function generateMockSquads(count = 500) {
  return Array.from(
    { length: count },
    (_, index) => {
      const squadNumber = index + 1;

      const category =
        SQUAD_CATEGORIES[
          index % SQUAD_CATEGORIES.length
        ];

      const wwcdCount =
        seededValue(squadNumber * 3, 8);

      const placementPts =
        10 + seededValue(
          squadNumber * 7,
          120
        );

      const killPts =
        5 + seededValue(
          squadNumber * 11,
          140
        );

      return {
        ts: new Date(
          Date.UTC(2026, 10, 12, 14, 0, 0)
        ).toISOString(),

        squadName:
          `PUBG VN Squad ${String(
            squadNumber
          ).padStart(3, "0")}`,

        category,
        wwcdCount,
        placementPts,
        killPts,
      };
    }
  );
}

/**
 * Complete leaderboard dataset.
 *
 * 8 original squads + 500 generated
 * squads = 508 demonstration squads.
 */
export const leaderboardSquads = [
  ...initialSquadStandings,
  ...generateMockSquads(500),
];

/**
 * Generate deterministic kill-feed events.
 *
 * An event represents a kill or knockdown
 * involving two squads.
 */
export function generateMockKillFeed(
  squads,
  count = 36
) {
  if (!squads.length) {
    return [];
  }

  const baseTimestamp = Date.UTC(
    2026,
    10,
    12,
    14,
    0,
    0
  );

  return Array.from(
    { length: count },
    (_, index) => {
      const attackerIndex =
        (index * 7 + 3) % squads.length;

      let victimIndex =
        (index * 13 + 11) % squads.length;

      if (victimIndex === attackerIndex) {
        victimIndex =
          (victimIndex + 1) % squads.length;
      }

      const attacker =
        squads[attackerIndex];

      const victim =
        squads[victimIndex];

      const eventType =
        index % 3 === 0
          ? "KNOCK"
          : "KILL";

      return {
        id: `kill-event-${index + 1}`,

        timestamp: new Date(
          baseTimestamp - index * 15000
        ).toISOString(),

        attacker: attacker.squadName,
        victim: victim.squadName,

        attackerCategory:
          attacker.category,

        victimCategory:
          victim.category,

        eventType,

        weapon:
          index % 2 === 0
            ? "M416"
            : "Mini14",
      };
    }
  );
}

export const mockKillFeed =
  generateMockKillFeed(
    leaderboardSquads,
    36
  );
