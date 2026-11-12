
import {
  act,
  renderHook,
} from "@testing-library/react";

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import usePubgAirdropTimer from
  "../src/hooks/usePubgAirdropTimer";

describe("usePubgAirdropTimer", () => {
  const INITIAL_TIME =
    new Date(
      "2026-11-12T12:00:00.000Z"
    );

  beforeEach(() => {
    vi.useFakeTimers();

    vi.setSystemTime(
      INITIAL_TIME
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes from an absolute deadline", () => {
    const target =
      Date.now() + 10000;

    const { result } = renderHook(
      () =>
        usePubgAirdropTimer(
          target
        )
    );

    expect(
      result.current.remainingMs
    ).toBe(10000);

    expect(
      result.current.formattedTime
    ).toBe("00:00:10");

    expect(
      result.current.isExpired
    ).toBe(false);
  });

  it("updates as actual time passes", () => {
    const target =
      Date.now() + 10000;

    const { result } = renderHook(
      () =>
        usePubgAirdropTimer(
          target
        )
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(
      result.current.remainingMs
    ).toBe(7000);

    expect(
      result.current.formattedTime
    ).toBe("00:00:07");
  });

  it("uses the server offset", () => {
    const target =
      Date.now() + 10000;

    const { result } = renderHook(
      () =>
        usePubgAirdropTimer(
          target,
          2000
        )
    );

    expect(
      result.current.remainingMs
    ).toBe(8000);
  });

  it("responds to changes in server offset", () => {
    const target =
      Date.now() + 10000;

    const { result, rerender } =
      renderHook(
        ({ offset }) =>
          usePubgAirdropTimer(
            target,
            offset
          ),
        {
          initialProps: {
            offset: 0,
          },
        }
      );

    expect(
      result.current.remainingMs
    ).toBe(10000);

    rerender({
      offset: 3000,
    });

    expect(
      result.current.remainingMs
    ).toBe(7000);
  });

  it("responds to changed deadlines", () => {
    const initialTarget =
      Date.now() + 10000;

    const { result, rerender } =
      renderHook(
        ({ target }) =>
          usePubgAirdropTimer(
            target
          ),
        {
          initialProps: {
            target: initialTarget,
          },
        }
      );

    expect(
      result.current.remainingMs
    ).toBe(10000);

    rerender({
      target:
        Date.now() + 20000,
    });

    expect(
      result.current.remainingMs
    ).toBe(20000);
  });

  it("resynchronizes on window focus", () => {
    const target =
      Date.now() + 10000;

    const { result } = renderHook(
      () =>
        usePubgAirdropTimer(
          target
        )
    );

    /**
     * Move the system clock forward
     * without advancing interval callbacks.
     */
    act(() => {
      vi.setSystemTime(
        Date.now() + 5000
      );

      window.dispatchEvent(
        new Event("focus")
      );
    });

    expect(
      result.current.remainingMs
    ).toBe(5000);
  });

  it("resynchronizes on visibilitychange", () => {
    const target =
      Date.now() + 10000;

    const originalDescriptor =
      Object.getOwnPropertyDescriptor(
        document,
        "visibilityState"
      );

    Object.defineProperty(
      document,
      "visibilityState",
      {
        configurable: true,
        value: "visible",
      }
    );

    try {
      const { result } =
        renderHook(
          () =>
            usePubgAirdropTimer(
              target
            )
        );

      act(() => {
        vi.setSystemTime(
          Date.now() + 7000
        );

        document.dispatchEvent(
          new Event(
            "visibilitychange"
          )
        );
      });

      expect(
        result.current.remainingMs
      ).toBe(3000);
    } finally {
      if (originalDescriptor) {
        Object.defineProperty(
          document,
          "visibilityState",
          originalDescriptor
        );
      } else {
        delete document.visibilityState;
      }
    }
  });

  it("expires at zero", () => {
    const target =
      Date.now() + 1000;

    const { result } = renderHook(
      () =>
        usePubgAirdropTimer(
          target
        )
    );

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(
      result.current.remainingMs
    ).toBe(0);

    expect(
      result.current.isExpired
    ).toBe(true);

    expect(
      result.current.formattedTime
    ).toBe("00:00:00");
  });

  it("rejects invalid deadlines", () => {
    const { result } = renderHook(
      () =>
        usePubgAirdropTimer(
          NaN
        )
    );

    expect(
      result.current.isValid
    ).toBe(false);

    expect(
      result.current.isExpired
    ).toBe(false);
  });

  it("cleans up the interval on unmount", () => {
    const clearSpy =
      vi.spyOn(
        window,
        "clearInterval"
      );

    const target =
      Date.now() + 10000;

    const { unmount } = renderHook(
      () =>
        usePubgAirdropTimer(
          target
        )
    );

    unmount();

    expect(
      clearSpy
    ).toHaveBeenCalled();
  });
});
