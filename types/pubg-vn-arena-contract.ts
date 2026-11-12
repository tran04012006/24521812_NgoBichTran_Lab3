
/**
 * PUBG Vietnam Arena
 * Shared domain data contracts.
 *
 * Task 1:
 * Define the domain types.
 *
 * Later tasks:
 * Use these contracts in timer, claim,
 * leaderboard, and API implementations.
 */

export type DropPhase =
  | "WARMUP"
  | "AIRDROP_LIVE"
  | "LOOTED_OUT"
  | "EXPIRED";

/**
 * A limited-stock PUBG airdrop.
 */
export interface PubgCrateDrop {
  readonly id: string;

  readonly title: string;

  /**
   * Example:
   * PVS Finals VIP Pass + 5,000 G-Coin
   */
  readonly priceVnd: number;

  /**
   * Server-authoritative remaining stock.
   */
  readonly remainingStock: number;

  /**
   * Deadline represented as Unix
   * epoch milliseconds.
   */
  readonly dropEpochMs: number;
}

/**
 * Live PUBG Vietnam squad standings.
 */
export interface PubgVnSquadStanding {
  readonly ts: string;

  readonly squadName: string;

  /**
   * Winner Winner Chicken Dinner count.
   */
  readonly wwcdCount: number;

  readonly placementPts: number;

  readonly killPts: number;
}

/**
 * Additional metadata for filtering.
 *
 * This extends the required contract
 * without changing its original fields.
 */
export type SquadCategory =
  | "PRO"
  | "ESPORTS"
  | "AGG";

/**
 * Leaderboard display record.
 */
export interface PubgVnSquadRecord
  extends PubgVnSquadStanding {
  readonly category: SquadCategory;
}

/**
 * Derived total score.
 */
export function calculateTotalPoints(
  squad: PubgVnSquadStanding
): number {
  return squad.placementPts + squad.killPts;
}
