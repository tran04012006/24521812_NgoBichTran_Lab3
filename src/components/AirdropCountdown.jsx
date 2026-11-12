
import React, {
  useEffect,
  useState,
} from "react";

import usePubgAirdropTimer from
  "../hooks/usePubgAirdropTimer";

import {
  padTime,
} from "../utils/timerUtils";

/**
 * Accessible PUBG airdrop countdown.
 *
 * Task 5 improvements:
 * - No announcements every second
 * - Expiration announcement
 * - Meaningful status descriptions
 * - Accessible fallback for invalid dates
 */
export default function AirdropCountdown({
  targetEpochMs,
  serverOffsetMs = 0,
}) {
  const {
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

  const [announcement, setAnnouncement] =
    useState("");

  /**
   * Announce expiration only when the
   * active deadline transitions to
   * the expired state.
   *
   * A deadline that is already expired
   * when the component first mounts is
   * displayed normally, without forcing
   * an immediate announcement.
   */
  const [previousTimerState, setPreviousTimerState] =
    useState(() => ({
      targetEpochMs,
      isExpired,
    }));

  if (
    previousTimerState.targetEpochMs !==
    targetEpochMs
  ) {
    setPreviousTimerState({
      targetEpochMs,
      isExpired,
    });

    setAnnouncement("");
  } else if (
    !previousTimerState.isExpired &&
    isExpired
  ) {
    setPreviousTimerState({
      targetEpochMs,
      isExpired: true,
    });

    setAnnouncement(
      "The PUBG airdrop has expired."
    );
  }

  /**
   * Clear transient announcements
   * if the component becomes invalid.
   */
  useEffect(() => {
    if (!isValid) {
      setAnnouncement("");
    }
  }, [isValid]);

  const targetDate =
    new Date(targetEpochMs);

  const hasValidDeadline =
    isValid &&
    !Number.isNaN(
      targetDate.getTime()
    );

  const formattedDeadline =
    hasValidDeadline
      ? targetDate.toLocaleString(
          "en-VN",
          {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Asia/Ho_Chi_Minh",
          }
        )
      : "Unavailable";

  let statusText = "LIVE";

  if (!isValid) {
    statusText = "UNAVAILABLE";
  } else if (isExpired) {
    statusText = "EXPIRED";
  }

  const countdownLabel =
    !isValid
      ? "Countdown unavailable"
      : isExpired
        ? "Airdrop expired"
        : `${hours} hours, ${minutes} minutes and ${seconds} seconds remaining`;

  return (
    <section
      className="countdown-panel"
      aria-labelledby="airdrop-timer-heading"
    >
      <div className="countdown-header">
        <span className="section-eyebrow">
          AIRDROP COUNTDOWN
        </span>

        <span className="live-indicator">
          <span
            className="status-dot"
            aria-hidden="true"
          />

          {statusText}
        </span>
      </div>

      <h2
        id="airdrop-timer-heading"
        className="countdown-title"
      >
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
        aria-label={countdownLabel}
      >
        <div className="time-unit">
          <strong aria-hidden="true">
            {isValid
              ? padTime(hours)
              : "--"}
          </strong>

          <span aria-hidden="true">
            HOURS
          </span>
        </div>

        <span
          className="time-separator"
          aria-hidden="true"
        >
          :
        </span>

        <div className="time-unit">
          <strong aria-hidden="true">
            {isValid
              ? padTime(minutes)
              : "--"}
          </strong>

          <span aria-hidden="true">
            MINUTES
          </span>
        </div>

        <span
          className="time-separator"
          aria-hidden="true"
        >
          :
        </span>

        <div className="time-unit">
          <strong aria-hidden="true">
            {isValid
              ? padTime(seconds)
              : "--"}
          </strong>

          <span aria-hidden="true">
            SECONDS
          </span>
        </div>
      </div>

      <p className="deadline-text">
        Scheduled deadline:{" "}
        <strong>
          {formattedDeadline}
        </strong>
        {hasValidDeadline ? " ICT" : ""}
      </p>

      {isValid && !isExpired && (
        <p className="feature-note">
          Remaining duration:{" "}
          <strong>
            {formattedTime}
          </strong>
        </p>
      )}

      {isExpired && (
        <p className="feature-note">
          The countdown has reached zero.
        </p>
      )}

      {!isValid && (
        <p className="feature-note">
          Unable to load a valid deadline.
        </p>
      )}

      <p className="feature-note">
        The timer uses the current clock
        and synchronizes when you return
        to this tab.
      </p>

      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
    </section>
  );
}
