
import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

import {
  claimPubgReward,
} from "../services/pubgClaimApi";

/**
 * Optimistic PUBG reward claim hook.
 *
 * Responsibilities:
 *
 * 1. Deduct visible inventory immediately.
 * 2. Prevent duplicate in-flight claims.
 * 3. Submit the asynchronous request.
 * 4. Reconcile success with server inventory.
 * 5. Handle HTTP 409 and restore stock.
 * 6. Cancel pending requests on unmount.
 *
 * @param {{
 *   id: string,
 *   remainingStock: number
 * }} drop
 */
export default function useOptimisticClaim(drop) {
  const [remainingStock, setRemainingStock] =
    useState(drop.remainingStock);

  const [isClaiming, setIsClaiming] =
    useState(false);

  const [claimStatus, setClaimStatus] =
    useState("idle");

  const [message, setMessage] =
    useState("");

  /**
   * A ref is required in addition to
   * isClaiming because state updates
   * are asynchronous.
   *
   * This lock becomes active immediately
   * during the click handler.
   */
  const claimLockRef = useRef(false);

  /**
   * Keep track of the active request.
   */
  const abortControllerRef = useRef(null);

  /**
   * Track whether it is safe to update
   * state after an asynchronous request.
   */
  const mountedRef = useRef(false);

  /**
   * Store the latest visible inventory
   * for synchronous claim checks.
   *
   * This avoids depending on a possibly
   * stale closure when a claim starts.
   */
  const stockRef = useRef(drop.remainingStock);

  /**
   * Keep inventory synchronized when
   * the selected reward itself changes.
   *
   * For the current application, each
   * reward card has a stable drop.id.
   */
  useEffect(() => {
    stockRef.current = drop.remainingStock;

    setRemainingStock(
      drop.remainingStock
    );
  }, [drop.id, drop.remainingStock]);

  /**
   * Mount and cleanup lifecycle.
   */
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      abortControllerRef.current?.abort();
    };
  }, []);

  /**
   * Start an optimistic claim.
   *
   * @param {{
   *   simulateConflict?: boolean
   * }} options
   */
  const claim = useCallback(
    async ({ simulateConflict = false } = {}) => {
      /**
       * Prevent duplicate requests.
       *
       * This is checked synchronously,
       * before React re-renders.
       */
      if (claimLockRef.current) {
        return false;
      }

      const previousStock =
        stockRef.current;

      /**
       * Prevent inventory below zero.
       */
      if (previousStock <= 0) {
        setClaimStatus("error");
        setMessage(
          "This reward is sold out."
        );

        return false;
      }

      /**
       * Lock claim submission immediately.
       */
      claimLockRef.current = true;

      const controller =
        new AbortController();

      abortControllerRef.current =
        controller;

      /**
       * OPTIMISTIC UPDATE
       *
       * Immediately subtract one from
       * the visible inventory.
       */
      const optimisticStock =
        previousStock - 1;

      stockRef.current = optimisticStock;

      setRemainingStock(optimisticStock);
      setIsClaiming(true);
      setClaimStatus("pending");
      setMessage(
        "Submitting your reward claim..."
      );

      try {
        /**
         * Await simulated server response.
         *
         * Send the stock value BEFORE
         * optimistic deduction.
         */
        const response =
          await claimPubgReward({
            dropId: drop.id,
            expectedStock: previousStock,
            simulateConflict,
            signal: controller.signal,
          });

        if (!mountedRef.current) {
          return false;
        }

        /**
         * SERVER RECONCILIATION
         *
         * The server response is the
         * authoritative stock value.
         */
        stockRef.current =
          response.remainingStock;

        setRemainingStock(
          response.remainingStock
        );

        setClaimStatus("success");
        setMessage(response.message);

        return true;
      } catch (error) {
        if (!mountedRef.current) {
          return false;
        }

        if (error.name === "AbortError") {
          return false;
        }

        /**
         * ROLLBACK / RECONCILIATION
         *
         * If the server supplies a valid
         * authoritative stock count, use it.
         *
         * Otherwise, restore the stock
         * that existed before this claim.
         */
        const authoritativeStock =
          Number.isInteger(error.remainingStock) &&
          error.remainingStock >= 0
            ? error.remainingStock
            : previousStock;

        stockRef.current =
          authoritativeStock;

        setRemainingStock(
          authoritativeStock
        );

        if (error.status === 409) {
          setClaimStatus("conflict");

          setMessage(
            error.message ||
              "HTTP 409: Claim conflict."
          );
        } else {
          setClaimStatus("error");

          setMessage(
            error.message ||
              "Claim failed. Please try again."
          );
        }

        return false;
      } finally {
        /**
         * Release the claim lock only
         * after the request has finished.
         */
        if (
          abortControllerRef.current ===
          controller
        ) {
          abortControllerRef.current = null;
        }

        claimLockRef.current = false;

        if (mountedRef.current) {
          setIsClaiming(false);
        }
      }
    },
    [drop.id]
  );

  /**
   * Clear feedback without changing
   * inventory.
   */
  const clearFeedback = useCallback(() => {
    if (claimLockRef.current) {
      return;
    }

    setClaimStatus("idle");
    setMessage("");
  }, []);

  return {
    remainingStock,
    isClaiming,
    claimStatus,
    message,
    claim,
    clearFeedback,
  };
}
