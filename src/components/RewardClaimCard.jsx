
import React from "react";

import {
  formatVnd,
} from "../data/mockPubgData";

export default function RewardClaimCard({
  drop,
}) {
  const {
    id,
    title,
    description,
    priceVnd,
    remainingStock,
    reward,
    category,
  } = drop;

  const isOutOfStock = remainingStock <= 0;

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
          <strong>{reward}</strong>
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
            disabled
            title="Claim functionality arrives in Task 3"
          >
            CLAIM SOON
          </button>
        </div>
      </div>
    </article>
  );
}
