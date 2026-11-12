
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

describe("pubgClaimApi", () => {
  let claimPubgReward;
  let getServerStock;

  const DROP_ID = "airdrop-001";

  beforeEach(async () => {
    vi.resetModules();
    vi.useFakeTimers();

    const api = await import(
      "../src/services/pubgClaimApi.js"
    );

    claimPubgReward =
      api.claimPubgReward;

    getServerStock =
      api.getServerStock;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  async function settleRequest(promise) {
    /**
     * Run the simulated network delay.
     */
    await vi.advanceTimersByTimeAsync(
      1200
    );

    return promise;
  }

  it("loads the initial server stock", () => {
    expect(
      getServerStock(DROP_ID)
    ).toBe(25);
  });

  it("successfully claims a reward", async () => {
    const promise =
      claimPubgReward({
        dropId: DROP_ID,
        expectedStock: 25,
      });

    const response =
      await settleRequest(promise);

    expect(
      response.success
    ).toBe(true);

    expect(
      response.remainingStock
    ).toBe(24);

    expect(
      getServerStock(DROP_ID)
    ).toBe(24);
  });

  it("returns HTTP 409 for a simulated conflict", async () => {
    const promise =
      claimPubgReward({
        dropId: DROP_ID,
        expectedStock: 25,
        simulateConflict: true,
      });

    /**
     * Attach rejection handling before
     * advancing timers to avoid unhandled
     * promise rejection warnings.
     */
    const assertion =
      expect(promise).rejects
        .toMatchObject({
          status: 409,
          remainingStock: 25,
        });

    await vi.advanceTimersByTimeAsync(
      1200
    );

    await assertion;

    expect(
      getServerStock(DROP_ID)
    ).toBe(25);
  });

  it("detects stale inventory", async () => {
    const firstClaim =
      claimPubgReward({
        dropId: DROP_ID,
        expectedStock: 25,
      });

    await settleRequest(firstClaim);

    expect(
      getServerStock(DROP_ID)
    ).toBe(24);

    const staleClaim =
      claimPubgReward({
        dropId: DROP_ID,
        expectedStock: 25,
      });

    const assertion =
      expect(staleClaim).rejects
        .toMatchObject({
          status: 409,
          remainingStock: 24,
        });

    await vi.advanceTimersByTimeAsync(
      1200
    );

    await assertion;
  });

  it("rejects sold-out inventory", async () => {
    /**
     * Consume all 25 available rewards.
     */
    for (let index = 0; index < 25; index++) {
      const currentStock =
        getServerStock(DROP_ID);

      const promise =
        claimPubgReward({
          dropId: DROP_ID,
          expectedStock:
            currentStock,
        });

      await settleRequest(promise);
    }

    expect(
      getServerStock(DROP_ID)
    ).toBe(0);

    const soldOutClaim =
      claimPubgReward({
        dropId: DROP_ID,
        expectedStock: 0,
      });

    const assertion =
      expect(soldOutClaim).rejects
        .toMatchObject({
          status: 409,
          remainingStock: 0,
        });

    await vi.advanceTimersByTimeAsync(
      1200
    );

    await assertion;
  });

  it("rejects unknown reward IDs", async () => {
    const promise =
      claimPubgReward({
        dropId: "unknown-drop",
        expectedStock: 1,
      });

    const assertion =
      expect(promise).rejects
        .toMatchObject({
          status: 404,
        });

    await vi.advanceTimersByTimeAsync(
      1200
    );

    await assertion;
  });

  it("supports request cancellation", async () => {
    const controller =
      new AbortController();

    const promise =
      claimPubgReward({
        dropId: DROP_ID,
        expectedStock: 25,
        signal: controller.signal,
      });

    const assertion =
      expect(promise).rejects
        .toMatchObject({
          name: "AbortError",
        });

    controller.abort();

    await assertion;

    expect(
      getServerStock(DROP_ID)
    ).toBe(25);
  });
});
