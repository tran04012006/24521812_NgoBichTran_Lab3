
import React from "react";

export default function AirdropCountdown({
  targetEpochMs,
}) {
  const targetDate = new Date(targetEpochMs);

  const hasValidDeadline = !Number.isNaN(
    targetDate.getTime()
  );

  const formattedDeadline = hasValidDeadline
    ? targetDate.toLocaleString("en-VN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Unavailable";

  return (
    <section
      className="countdown-panel"
      aria-label="Airdrop countdown"
    >
      <div className="countdown-header">
        <span className="section-eyebrow">
          UPCOMING AIRDROP
        </span>

        <span className="live-indicator">
          <span className="status-dot"></span>
          PREVIEW
        </span>
      </div>

      <h2 className="countdown-title">
        The next drop is coming
      </h2>

      <p className="countdown-description">
        Get ready for exclusive PUBG Vietnam
        Championship rewards.
      </p>

      <div className="countdown-display">
        <div className="time-unit">
          <strong>--</strong>
          <span>HOURS</span>
        </div>

        <span className="time-separator">
          :
        </span>

        <div className="time-unit">
          <strong>--</strong>
          <span>MINUTES</span>
        </div>

        <span className="time-separator">
          :
        </span>

        <div className="time-unit">
          <strong>--</strong>
          <span>SECONDS</span>
        </div>
      </div>

      <p className="deadline-text">
        Scheduled deadline:{" "}
        <strong>{formattedDeadline}</strong>
      </p>

      <p className="feature-note">
        Accurate live countdown will be
        implemented in Task 2.
      </p>
    </section>
  );
}
