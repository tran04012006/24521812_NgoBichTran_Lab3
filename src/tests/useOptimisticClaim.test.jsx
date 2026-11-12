
import {
  act,
  renderHook,
  waitFor,
} from "@testing-library/react";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import useOptimisticClaim from
  "../src/hooks/useOptimisticClaim";

import {
  claimPubgReward,
} from "../src/services/pubgClaimApi";

/**
 * Mock the network service.
 */
vi.mock(
  "../src/services/pubgClaimApi",
  () => ({
    claimPubgReward: vi.fn(),
  })
);

const drop = {
  id: "airdrop-test",
  remainingStock: 10,
};

function createDeferredPromise() {
  let resolve;
  let reject;

  const promise = new Promise(
    (resolvePromise, rejectPromise) => {
      resolve = resolvePromise;
      reject = rejectPromise;
    }
  );

  return {
    promise,
    resolve,
    reject,
  };
}

describe("useOptimisticClaim", () => {
  beforeEach(() => {
    vi.mocked(
      claimPubgReward
    ).mockReset();
  });

  it("starts with the initial inventory", () => {
    const { result } = renderHook(
      () =>
        useOptimisticClaim(drop)
    );

    expect(
      result.current.remainingStock
    ).toBe(10);

    expect(
      result.current.isClaiming
    ).toBe(false);

    expect(
      result.current.claimStatus
    ).toBe("idle");
  });

  it("deducts stock immediately", async () => {
    const deferred =
      createDeferredPromise();

    vi.mocked(
      claimPubgReward
    ).mockReturnValue(
      deferred.promise
    );

    const { result } = renderHook(
      () =>
        useOptimisticClaim(drop)
    );

    let claimPromise;

    act(() => {
      claimPromise =
        result.current.claim();
    });

    expect(
      result.current.remainingStock
    ).toBe(9);

    expect(
      result.current.isClaiming
    ).toBe(true);

    expect(
      result.current.claimStatus
    ).toBe("pending");

    await act(async () => {
      deferred.resolve({
        success: true,
        remainingStock: 9,
        message:
          "Reward claimed successfully!",
      });

      await claimPromise;
    });

    expect(
      result.current.remainingStock
    ).toBe(9);

    expect(
      result.current.claimStatus
    ).toBe("success");
  });

  it("uses authoritative stock after success", async () => {
    vi.mocked(
      claimPubgReward
    ).mockResolvedValue({
      success: true,
      remainingStock: 7,
      message: "Claim confirmed.",
    });

    const { result } = renderHook(
      () =>
        useOptimisticClaim(drop)
    );

    await act(async () => {
      await result.current.claim();
    });

    expect(
      result.current.remainingStock
    ).toBe(7);
  });

  it("rolls back after HTTP 409", async () => {
    const deferred =
      createDeferredPromise();

    vi.mocked(
      claimPubgReward
    ).mockReturnValue(
      deferred.promise
    );

    const { result } = renderHook(
      () =>
        useOptimisticClaim(drop)
    );

    let claimPromise;

    act(() => {
      claimPromise =
        result.current.claim({
          simulateConflict: true,
        });
    });

    expect(
      result.current.remainingStock
    ).toBe(9);

    await act(async () => {
      deferred.reject(
        Object.assign(
          new Error(
            "HTTP 409: Claim conflict."
          ),
          {
            status: 409,
            remainingStock: 10,
          }
        )
      );

      await claimPromise;
    });

    expect(
      result.current.remainingStock
    ).toBe(10);

    expect(
      result.current.claimStatus
    ).toBe("conflict");

    expect(
      result.current.isClaiming
    ).toBe(false);
  });

  it("reconciles changed stock on conflict", async () => {
    vi.mocked(
      claimPubgReward
    ).mockRejectedValue(
      Object.assign(
        new Error(
          "Inventory changed."
        ),
        {
          status: 409,
          remainingStock: 6,
        }
      )
    );

    const { result } = renderHook(
      () =>
        useOptimisticClaim(drop)
    );

    await act(async () => {
      await result.current.claim();
    });

    expect(
      result.current.remainingStock
    ).toBe(6);

    expect(
      result.current.claimStatus
    ).toBe("conflict");
  });

  it("prevents duplicate pending claims", async () => {
    const deferred =
      createDeferredPromise();

    vi.mocked(
      claimPubgReward
    ).mockReturnValue(
      deferred.promise
    );

    const { result } = renderHook(
      () =>
        useOptimisticClaim(drop)
    );

    let firstClaim;
    let secondClaim;

    act(() => {
      firstClaim =
        result.current.claim();

      secondClaim =
        result.current.claim();
    });

    expect(
      claimPubgReward
    ).toHaveBeenCalledTimes(1);

    expect(
      result.current.remainingStock
    ).toBe(9);

    await expect(
      secondClaim
    ).resolves.toBe(false);

    await act(async () => {
      deferred.resolve({
        success: true,
        remainingStock: 9,
        message: "Success",
      });

      await firstClaim;
    });
  });

  it("prevents stock from going negative", async () => {
    const soldOutDrop = {
      id: "sold-out",
      remainingStock: 0,
    };

    const { result } = renderHook(
      () =>
        useOptimisticClaim(
          soldOutDrop
        )
    );

    let success;

    await act(async () => {
      success =
        await result.current.claim();
    });

    expect(success).toBe(false);

    expect(
      result.current.remainingStock
    ).toBe(0);

    expect(
      claimPubgReward
    ).not.toHaveBeenCalled();
  });

  it("cancels a pending request on unmount", () => {
    vi.mocked(
      claimPubgReward
    ).mockImplementation(
      () => new Promise(() => {})
    );

    const { result, unmount } =
      renderHook(
        () =>
          useOptimisticClaim(drop)
      );

    act(() => {
      void result.current.claim();
    });

    const signal =
      vi.mocked(
        claimPubgReward
      ).mock.calls[0][0].signal;

    expect(
      signal.aborted
    ).toBe(false);

    unmount();

    expect(
      signal.aborted
    ).toBe(true);
  });

  it("clears feedback", async () => {
    vi.mocked(
      claimPubgReward
    ).mockResolvedValue({
      success: true,
      remainingStock: 9,
      message: "Success",
    });

    const { result } = renderHook(
      () =>
        useOptimisticClaim(drop)
    );

    await act(async () => {
      await result.current.claim();
    });

    act(() => {
      result.current.clearFeedback();
    });

    await waitFor(() => {
      expect(
        result.current.claimStatus
      ).toBe("idle");
    });

    expect(
      result.current.message
    ).toBe("");
  });
});
