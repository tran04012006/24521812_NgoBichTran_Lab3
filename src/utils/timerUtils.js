
/**
 * PUBG Vietnam Arena
 * Anti-drift countdown utilities.
 *
 * All timestamps are expressed in milliseconds.
 *
 * serverOffsetMs = serverTime - clientTime
 */

/**
 * Check whether a timestamp or offset
 * is a valid finite number.
 *
 * @param {number} value
 * @returns {boolean}
 */
export function isValidTimeValue(value) {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

/**
 * Calculate the remaining time using
 * an absolute server-adjusted timestamp.
 *
 * Unlike decrementing a counter, this
 * calculation is not affected by delayed
 * setInterval callbacks.
 *
 * @param {number} targetEpochMs
 * @param {number} serverOffsetMs
 * @param {number} nowMs
 * @returns {number}
 */
export function calculateRemainingMs(
  targetEpochMs,
  serverOffsetMs = 0,
  nowMs = Date.now()
) {
  if (
    !isValidTimeValue(targetEpochMs) ||
    !isValidTimeValue(serverOffsetMs) ||
    !isValidTimeValue(nowMs)
  ) {
    return 0;
  }

  const adjustedNow = nowMs + serverOffsetMs;

  const remainingMs =
    targetEpochMs - adjustedNow;

  return Math.max(0, remainingMs);
}

/**
 * Convert milliseconds into countdown
 * hours, minutes, and seconds.
 *
 * We use Math.ceil so the UI does not
 * display 00:00:00 before the actual
 * deadline has been reached.
 *
 * Hours may exceed 24.
 *
 * @param {number} remainingMs
 * @returns {{
 *   hours: number,
 *   minutes: number,
 *   seconds: number
 * }}
 */
export function getCountdownParts(remainingMs) {
  const safeMs =
    isValidTimeValue(remainingMs)
      ? Math.max(0, remainingMs)
      : 0;

  const totalSeconds = Math.ceil(
    safeMs / 1000
  );

  const hours = Math.floor(
    totalSeconds / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds = totalSeconds % 60;

  return {
    hours,
    minutes,
    seconds,
  };
}

/**
 * Convert a number to at least
 * two display digits.
 *
 * @param {number} value
 * @returns {string}
 */
export function padTime(value) {
  return String(value).padStart(2, "0");
}

/**
 * Convert remaining milliseconds
 * to a HH:MM:SS display string.
 *
 * @param {number} remainingMs
 * @returns {string}
 */
export function formatCountdown(remainingMs) {
  const {
    hours,
    minutes,
    seconds,
  } = getCountdownParts(remainingMs);

  return [
    padTime(hours),
    padTime(minutes),
    padTime(seconds),
  ].join(":");
}
