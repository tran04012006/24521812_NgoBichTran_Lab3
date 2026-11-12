
import React from "react";

import usePubgAirdropTimer from
  "../hooks/usePubgAirdropTimer";

import {
  padTime,
} from "../utils/timerUtils";

/**
 * PUBG Airdrop Countdown
 *
 * Task 2:
 * - Live anti-drift countdown
 * - Server offset support
 * - Expiration status
 * - Accessible timer display
 */
export default function AirdropCountdown({
  targetEpochMs,
  serverOffsetMs = 0,
}) {
  const {
    remainingMs,
    hours,
    minutes,
    seconds,
    formattedTime,
    isExpired,
    isValid,
  } = usePubgAirdropTimer(
    targetEpochMs,
    serverOffsetMs
  );

  /**
   * Format the server-provided
   * expiration deadline for display.
   */
  const targetDate = new Date(targetEpochMs);

  const hasValidDeadline =
    isValid &&
    !Number.isNaN(targetDate.getTime());

  const formattedDeadline = hasValidDeadline
    ? targetDate.toLocaleString("en-VN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Ho_Chi_Minh",
      })
    : "Unavailable";

  /**
   * Screen reader description.
   *
   * The timer itself does not announce
   * every second because that would
   * be distracting to users.
   */
  const accessibleTime = isValid
    ? `${hours} hours, ${minutes} minutes, ${seconds} seconds remaining`
    : "Countdown unavailable";

  /**
   * Determine the UI status.
   */
  let statusText = "LIVE";
  let statusDescription =
    "Countdown synchronized with the current time.";

  if (!isValid) {
    statusText = "UNAVAILABLE";
    statusDescription =
      "The countdown deadline is invalid.";
  } else if (isExpired) {
    statusText = "EXPIRED";
    statusDescription =
      "This airdrop has expired.";
  }

  return (
    <section
      className="countdown-panel"
      aria-label="PUBG airdrop countdown"
    >
      <div className="countdown-header">
        <span className="section-eyebrow">
          AIRDROP COUNTDOWN
        </span>

        <span
          className="live-indicator"
          aria-label={`Airdrop status: ${statusText}`}
        >
          <span
            className="status-dot"
            aria-hidden="true"
          ></span>

          {statusText}
        </span>
      </div>

      <h2 className="countdown-title">
        {isExpired
          ? "This airdrop has ended"
          : "The next drop is coming"}
      </h2>

      <p className="countdown-description">
        {isExpired
          ? "Stay tuned for the next PUBG Vietnam reward drop."
          : "Get ready for exclusive PUBG Vietnam Championship rewards."}
      </p>

      <div
        className="countdown-display"
        role="timer"
        aria-live="off"
        aria-label={accessibleTime}
      >
        <div className="time-unit">
          <strong>
            {isValid
              ? padTime(hours)
              : "--"}
          </strong>

          <span>HOURS</span>
        </div>

        <span
          className="time-separator"
          aria-hidden="true"
        >
          :
        </span>

        <div className="time-unit">
          <strong>
            {isValid
              ? padTime(minutes)
              : "--"}
          </strong>

          <span>MINUTES</span>
        </div>

        <span
          className="time-separator"
          aria-hidden="true"
        >
          :
        </span>

        <div className="time-unit">
          <strong>
            {isValid
              ? padTime(seconds)
              : "--"}
          </strong>

          <span>SECONDS</span>
        </div>
      </div>

      <p className="deadline-text">
        Scheduled deadline:{" "}
        <strong>
          {formattedDeadline}
        </strong>
        {" "}ICT
      </p>

      <p className="feature-note">
        {statusDescription}
      </p>

      {isValid && !isExpired && (
        <p className="deadline-text">
          Remaining duration:{" "}
          <strong>
            {formattedTime}
          </strong>
        </p>
      )}

      {isExpired && (
        <p
          className="feature-note"
          role="status"
        >
          The countdown has reached zero.
        </p>
      )}

      {!isValid && (
        <p
          className="feature-note"
          role="status"
        >
          Unable to load a valid deadline.
        </p>
      )}

      {isValid &&
        !isExpired &&
        remainingMs > 0 && (
          <p className="feature-note">
            Timer automatically resynchronizes
            when you return to this tab.
          </p>
        )}
    </section>
  );
}
