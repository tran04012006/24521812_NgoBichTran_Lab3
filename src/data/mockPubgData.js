
/**
 * Mock data for the PUBG VN Arena.
 *
 * Task 1 uses this data for rendering.
 * Task 2 will connect deadlines to
 * the anti-drift countdown hook.
 * Task 3 will implement claim behavior.
 * Task 4 will add filtering and sorting.
 */

const MINUTE = 60 * 1000;

// Fixed for the current module session.
// The countdown hook will use this absolute
// deadline instead of decrementing seconds.
const initialDeadline = Date.now() + 30 * MINUTE;

export const arenaInfo = {
  name: "KRAFTON x PUBG Vietnam",
  event: "Vietnam Championship 2026",
  season: "PVS Finals",
  description:
    "Compete, earn rewards, and follow the best PUBG Vietnam squads.",
};

export const initialAirdrops = [
  {
    id: "airdrop-001",
    title: "PVS Finals VIP Pass",
    description:
      "Exclusive finals access with 5,000 G-Coins.",
    priceVnd: 199000,
    remainingStock: 25,
    dropEpochMs: initialDeadline,
    reward: "5,000 G-Coins",
    category: "AIRDROP",
  },
  {
    id: "airdrop-002",
    title: "Championship Crate",
    description:
      "A limited championship-themed reward crate.",
    priceVnd: 79000,
    remainingStock: 50,
    dropEpochMs: initialDeadline + 15 * MINUTE,
    reward: "Premium Crate",
    category: "CRATE",
  },
  {
    id: "airdrop-003",
    title: "Finals Entry Ticket",
    description:
      "Reserve an entry ticket for the finals event.",
    priceVnd: 49000,
    remainingStock: 100,
    dropEpochMs: initialDeadline + 30 * MINUTE,
    reward: "Finals Ticket",
    category: "TICKET",
  },
];

export const initialSquadStandings = [
  {
    ts: "2026-11-12T14:00:00.000Z",
    squadName: "Cerberus Esports",
    wwcdCount: 4,
    placementPts: 65,
    killPts: 78,
    category: "ESPORTS",
  },
  {
    ts: "2026-11-12T14:00:00.000Z",
    squadName: "The Expendables",
    wwcdCount: 3,
    placementPts: 59,
    killPts: 71,
    category: "PRO",
  },
  {
    ts: "2026-11-12T14:00:00.000Z",
    squadName: "New Generation",
    wwcdCount: 2,
    placementPts: 53,
    killPts: 64,
    category: "AGG",
  },
  {
    ts: "2026-11-12T14:00:00.000Z",
    squadName: "Team Flash",
    wwcdCount: 2,
    placementPts: 48,
    killPts: 58,
    category: "ESPORTS",
  },
  {
    ts: "2026-11-12T14:00:00.000Z",
    squadName: "Unicorn Phoenix",
    wwcdCount: 1,
    placementPts: 42,
    killPts: 55,
    category: "PRO",
  },
  {
    ts: "2026-11-12T14:00:00.000Z",
    squadName: "Vikings Esports",
    wwcdCount: 1,
    placementPts: 38,
    killPts: 49,
    category: "ESPORTS",
  },
  {
    ts: "2026-11-12T14:00:00.000Z",
    squadName: "Dark Horse",
    wwcdCount: 1,
    placementPts: 33,
    killPts: 45,
    category: "AGG",
  },
  {
    ts: "2026-11-12T14:00:00.000Z",
    squadName: "Saigon Warriors",
    wwcdCount: 0,
    placementPts: 28,
    killPts: 39,
    category: "PRO",
  },
];

/**
 * Format VND prices for display.
 */
export function formatVnd(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Compute leaderboard points.
 *
 * This follows the simple mock scoring
 * rule used in the initial UI.
 */
export function getTotalPoints(squad) {
  return squad.placementPts + squad.killPts;
}
