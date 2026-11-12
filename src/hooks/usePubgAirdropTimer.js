
import {
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  calculateRemainingMs,
  getCountdownParts,
  formatCountdown,
  isValidTimeValue,
} from "../utils/timerUtils";

/**
 * Refresh the displayed countdown
 * approximately five times per second.
 *
 * This interval only triggers recalculation.
 * It does NOT measure elapsed time.
 */
const REFRESH_INTERVAL_MS = 200;

/**
 * Anti-drift PUBG airdrop countdown hook.
 *
 * @param {number} targetEpochMs
 *   Absolute expiration timestamp
 *   in Unix epoch milliseconds.
 *
 * @param {number} serverOffsetMs
 *   Difference between server time
 *   and client time in milliseconds.
 *
 *   Positive: server is ahead.
 *   Negative: server is behind.
 *
 * @returns {{
 *   remainingMs: number,
 *   hours: number,
 *   minutes: number,
 *   seconds: number,
 *   formattedTime: string,
 *   isExpired: boolean,
 *   isValid: boolean
 * }}
 */
export default function usePubgAirdropTimer(
  targetEpochMs,
  serverOffsetMs = 0
) {
  /**
   * Validate the supplied deadline
   * and server clock offset.
   */
  const isValid =
    isValidTimeValue(targetEpochMs) &&
    isValidTimeValue(serverOffsetMs);

  /**
   * Initialize countdown from the
   * absolute target deadline.
   *
   * We do not initialize it with an
   * arbitrary number of seconds.
   */
  const [remainingMs, setRemainingMs] =
    useState(() =>
      calculateRemainingMs(
        targetEpochMs,
        serverOffsetMs
      )
    );

  /**
   * Recalculate from the current
   * client time plus server offset.
   *
   * useCallback gives this function
   * a stable identity until either
   * dependency changes.
   */
  const syncClock = useCallback(() => {
    const nextRemainingMs =
      calculateRemainingMs(
        targetEpochMs,
        serverOffsetMs
      );

    setRemainingMs(nextRemainingMs);

    return nextRemainingMs;
  }, [targetEpochMs, serverOffsetMs]);

  /**
   * Manage the interval and browser
   * event listeners.
   *
   * React automatically calls the
   * cleanup function when dependencies
   * change or the component unmounts.
   */
  useEffect(() => {
    let intervalId = null;

    /**
     * Run an immediate calculation.
     *
     * This is especially important when
     * the deadline or server offset changes.
     */
    const initialRemainingMs = syncClock();

    /**
     * Refresh the display based on
     * Date.now(), not on interval count.
     */
    const tick = () => {
      const nextRemainingMs = syncClock();

      /**
       * Stop unnecessary interval work
       * after the deadline expires.
       */
      if (
        nextRemainingMs <= 0 &&
        intervalId !== null
      ) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    };

    /**
     * When a background tab becomes
     * visible, immediately synchronize
     * the countdown.
     */
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible"
      ) {
        tick();
      }
    };

    /**
     * Also synchronize when the window
     * receives focus.
     */
    const handleWindowFocus = () => {
      tick();
    };

    /**
     * Register visibility and focus
     * handlers for valid deadlines.
     */
    if (isValid) {
      document.addEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.addEventListener(
        "focus",
        handleWindowFocus
      );
    }

    /**
     * Start refreshing only while
     * the deadline is in the future.
     */
    if (
      isValid &&
      initialRemainingMs > 0
    ) {
      intervalId = window.setInterval(
        tick,
        REFRESH_INTERVAL_MS
      );
    }

    /**
     * Cleanup:
     *
     * - Clear the active interval.
     * - Remove document event listener.
     * - Remove window event listener.
     *
     * This also works when React 19
     * StrictMode re-runs effects in
     * development.
     */
    return () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId);
        intervalId = null;
      }

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.removeEventListener(
        "focus",
        handleWindowFocus
      );
    };
  }, [syncClock, isValid]);

  /**
   * Derive countdown display values.
   */
  const {
    hours,
    minutes,
    seconds,
  } = getCountdownParts(remainingMs);

  const formattedTime =
    formatCountdown(remainingMs);

  /**
   * A deadline is expired only when
   * its input is valid and the actual
   * remaining time has reached zero.
   */
  const isExpired =
    isValid && remainingMs <= 0;

  return {
    remainingMs,
    hours,
    minutes,
    seconds,
    formattedTime,
    isExpired,
    isValid,
  };
}
