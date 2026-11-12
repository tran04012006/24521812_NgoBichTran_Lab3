
import {
  initialAirdrops,
} from "../data/mockPubgData";

/**
 * Mock PUBG claim API.
 *
 * This service simulates:
 * - Server-side inventory
 * - Network latency
 * - Successful claims
 * - HTTP 409 conflicts
 * - Request cancellation
 *
 * Inventory exists only in memory.
 * Refreshing the application resets it.
 */

const NETWORK_DELAY_MS = 1200;

/**
 * This Map represents inventory stored
 * by the mock backend.
 *
 * React components must not modify
 * these values directly.
 */
const serverInventory = new Map(
  initialAirdrops.map((drop) => [
    drop.id,
    drop.remainingStock,
  ])
);

/**
 * Create an API-like error object.
 */
export class PubgApiError extends Error {
  constructor(
    message,
    status,
    remainingStock = null
  ) {
    super(message);

    this.name = "PubgApiError";
    this.status = status;
    this.remainingStock = remainingStock;
  }
}

/**
 * Simulate asynchronous network latency.
 *
 * Supports AbortSignal so requests can
 * be canceled when components unmount.
 */
function simulateNetworkDelay(signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(
        new DOMException(
          "Request aborted",
          "AbortError"
        )
      );
      return;
    }

    let timeoutId;

    const cleanup = () => {
      signal?.removeEventListener(
        "abort",
        handleAbort
      );
    };

    const handleAbort = () => {
      clearTimeout(timeoutId);
      cleanup();

      reject(
        new DOMException(
          "Request aborted",
          "AbortError"
        )
      );
    };

    timeoutId = setTimeout(() => {
      cleanup();
      resolve();
    }, NETWORK_DELAY_MS);

    signal?.addEventListener(
      "abort",
      handleAbort,
      { once: true }
    );
  });
}

/**
 * Fetch authoritative inventory for
 * a particular PUBG reward.
 */
export function getServerStock(dropId) {
  if (!serverInventory.has(dropId)) {
    throw new PubgApiError(
      "Reward not found.",
      404
    );
  }

  return serverInventory.get(dropId);
}

/**
 * Submit a reward claim.
 *
 * @param {{
 *   dropId: string,
 *   expectedStock: number,
 *   simulateConflict?: boolean,
 *   signal?: AbortSignal
 * }} options
 *
 * @returns {Promise<{
 *   success: boolean,
 *   dropId: string,
 *   remainingStock: number,
 *   message: string
 * }>}
 */
export async function claimPubgReward({
  dropId,
  expectedStock,
  simulateConflict = false,
  signal,
}) {
  /**
   * Simulate an asynchronous API call.
   */
  await simulateNetworkDelay(signal);

  if (signal?.aborted) {
    throw new DOMException(
      "Request aborted",
      "AbortError"
    );
  }

  /**
   * Verify reward existence.
   */
  if (!serverInventory.has(dropId)) {
    throw new PubgApiError(
      "The requested reward does not exist.",
      404
    );
  }

  const currentServerStock =
    serverInventory.get(dropId);

  /**
   * Test-only conflict simulation.
   *
   * A real backend may return 409 because
   * of competing inventory changes.
   *
   * Here we deliberately reject the
   * request without changing inventory
   * so the rollback is easy to observe.
   */
  if (simulateConflict) {
    throw new PubgApiError(
      "HTTP 409: Reward claim conflict. Inventory has been restored.",
      409,
      currentServerStock
    );
  }

  /**
   * Check that the client used the same
   * inventory version as the server.
   *
   * For this mock, expectedStock acts
   * as a simple concurrency check.
   *
   * A production backend should use
   * transactional or atomic inventory
   * updates instead.
   */
  if (expectedStock !== currentServerStock) {
    throw new PubgApiError(
      "HTTP 409: Inventory changed. Please try again.",
      409,
      currentServerStock
    );
  }

  /**
   * Reject claims when inventory is zero.
   */
  if (currentServerStock <= 0) {
    throw new PubgApiError(
      "HTTP 409: This reward is sold out.",
      409,
      currentServerStock
    );
  }

  /**
   * Successful server-side deduction.
   *
   * In this synchronous mock section,
   * no other asynchronous operation runs
   * between reading and writing stock.
   */
  const updatedStock = currentServerStock - 1;

  serverInventory.set(
    dropId,
    updatedStock
  );

  return {
    success: true,
    dropId,
    remainingStock: updatedStock,
    message: "Reward claimed successfully!",
  };
}
