
import React, {
  useState,
} from "react";

import {
  formatVnd,
} from "../data/mockPubgData";

import useOptimisticClaim from
  "../hooks/useOptimisticClaim";

/**
 * PUBG Reward Claim Card
 *
 * Task 3:
 * - Optimistic inventory
 * - Async API requests
 * - Duplicate-click protection
 * - HTTP 409 rollback
 * - Accessible feedback
 */
export default function RewardClaimCard({
  drop,
}) {
  const {
    id,
    title,
    description,
    priceVnd,
    reward,
    category,
  } = drop;

  /**
   * Development-only simulation control.
   *
   * This allows the user to deliberately
   * trigger HTTP 409 conflicts.
   */
  const [
    simulateConflict,
    setSimulateConflict,
  ] = useState(false);

  /**
   * The hook owns the displayed inventory
   * and the complete claim lifecycle.
   */
  const {
    remainingStock,
    isClaiming,
    claimStatus,
    message,
    claim,
    clearFeedback,
  } = useOptimisticClaim(drop);

  const isOutOfStock =
    remainingStock <= 0;

  const isDisabled =
    isClaiming || isOutOfStock;

  /**
   * Determine button text.
   */
  let buttonText = "CLAIM NOW";

  if (isClaiming) {
    buttonText = "CLAIMING...";
  } else if (isOutOfStock) {
    buttonText = "SOLD OUT";
  }

  /**
   * Submit a reward claim.
   */
  const handleClaim = async () => {
    await claim({
      simulateConflict,
    });
  };

  /**
   * Determine accessible feedback styling.
   */
  const feedbackClassName = [
    "claim-feedback",
    `claim-feedback-${claimStatus}`,
  ].join(" ");

  return (
    <article
      className="reward-card"
      aria-labelledby={`reward-title-${id}`}
    >
      <div className="reward-card-top">
        <span className="reward-category">
          {category}
        </span>

        <span
          className={
            isOutOfStock
              ? "stock-badge out-of-stock"
              : "stock-badge"
          }
          aria-label={
            `${remainingStock} rewards remaining`
          }
        >
          {isOutOfStock
            ? "SOLD OUT"
            : `${remainingStock} LEFT`}
        </span>
      </div>

      <div
        className="reward-visual"
        aria-hidden="true"
      >
        <span className="reward-symbol">
          {category === "TICKET"
            ? "🎟️"
            : category === "CRATE"
              ? "📦"
              : "🏆"}
        </span>
      </div>

      <div className="reward-content">
        <h3 id={`reward-title-${id}`}>
          {title}
        </h3>

        <p className="reward-description">
          {description}
        </p>

        <div className="reward-info">
          <span>REWARD</span>

          <strong>
            {reward}
          </strong>
        </div>

        <div className="reward-footer">
          <div className="reward-price">
            <small>PRICE</small>

            <strong>
              {formatVnd(priceVnd)}
            </strong>
          </div>

          <button
            type="button"
            className="claim-button"
            onClick={handleClaim}
            disabled={isDisabled}
            aria-busy={isClaiming}
          >
            {buttonText}
          </button>
        </div>

        <div className="claim-simulation">
          <label
            htmlFor={`simulate-conflict-${id}`}
            className="simulation-label"
          >
            <input
              id={`simulate-conflict-${id}`}
              type="checkbox"
              checked={simulateConflict}
              onChange={(event) => {
                setSimulateConflict(
                  event.target.checked
                );

                clearFeedback();
              }}
              disabled={isClaiming}
            />

            <span>
              Simulate HTTP 409 Conflict
            </span>
          </label>

          <small className="simulation-description">
            Testing mode: reject the
            claim and restore inventory.
          </small>
        </div>

        {claimStatus !== "idle" && (
          <div
            className={feedbackClassName}
            role={
              claimStatus === "error" ||
              claimStatus === "conflict"
                ? "alert"
                : "status"
            }
            aria-live={
              claimStatus === "error" ||
              claimStatus === "conflict"
                ? "assertive"
                : "polite"
            }
          >
            <span
              className="claim-feedback-icon"
              aria-hidden="true"
            >
              {claimStatus === "pending"
                ? "◷"
                : claimStatus === "success"
                  ? "✓"
                  : "!"}
            </span>

            <span>
              {message}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
