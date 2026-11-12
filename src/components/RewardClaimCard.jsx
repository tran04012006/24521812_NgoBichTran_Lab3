
import React, {
  useState,
} from "react";

import {
  formatVnd,
} from "../data/mockPubgData";

import useOptimisticClaim from
  "../hooks/useOptimisticClaim";

/**
 * Accessible optimistic claim card.
 *
 * Task 5:
 * - Clear button names
 * - Pending request feedback
 * - Error and success announcements
 * - Keyboard-accessible testing controls
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

  const [
    simulateConflict,
    setSimulateConflict,
  ] = useState(false);

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

  const titleId =
    `reward-title-${id}`;

  const descriptionId =
    `reward-description-${id}`;

  const feedbackId =
    `claim-feedback-${id}`;

  const helpId =
    `claim-help-${id}`;

  let buttonText = "CLAIM NOW";

  if (isClaiming) {
    buttonText = "CLAIMING...";
  } else if (isOutOfStock) {
    buttonText = "SOLD OUT";
  }

  const handleClaim = () => {
    void claim({
      simulateConflict,
    });
  };

  const feedbackClassName = [
    "claim-feedback",
    `claim-feedback-${claimStatus}`,
  ].join(" ");

  const buttonAccessibleLabel =
    isClaiming
      ? `Claiming ${title}`
      : isOutOfStock
        ? `${title} is sold out`
        : `Claim ${title}`;

  const hasFeedback =
    claimStatus !== "idle";

  return (
    <article
      className="reward-card"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
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
        <h3 id={titleId}>
          {title}
        </h3>

        <p
          id={descriptionId}
          className="reward-description"
        >
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
            aria-label={buttonAccessibleLabel}
            aria-describedby={
              hasFeedback
                ? feedbackId
                : helpId
            }
            aria-busy={isClaiming}
          >
            {buttonText}
          </button>
        </div>

        <p
          id={helpId}
          className="sr-only"
        >
          The displayed stock will decrease
          immediately. The server will
          confirm or reject the claim.
        </p>

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
            Testing mode: reject the claim
            and restore inventory.
          </small>
        </div>

        {hasFeedback && (
          <div
            id={feedbackId}
            className={feedbackClassName}
            role={
              claimStatus === "error" ||
              claimStatus === "conflict"
                ? "alert"
                : "status"
            }
            aria-atomic="true"
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
