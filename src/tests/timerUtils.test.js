
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateRemainingMs,
  getCountdownParts,
  formatCountdown,
  padTime,
  isValidTimeValue,
} from "../src/utils/timerUtils";

describe("timerUtils", () => {
  describe("calculateRemainingMs", () => {
    it("calculates remaining time", () => {
      const remaining =
        calculateRemainingMs(
          100000,
          0,
          90000
        );

      expect(remaining).toBe(10000);
    });

    it("applies a positive server offset", () => {
      const remaining =
        calculateRemainingMs(
          100000,
          2000,
          90000
        );

      expect(remaining).toBe(8000);
    });

    it("applies a negative server offset", () => {
      const remaining =
        calculateRemainingMs(
          100000,
          -2000,
          90000
        );

      expect(remaining).toBe(12000);
    });

    it("returns zero at expiration", () => {
      expect(
        calculateRemainingMs(
          100000,
          0,
          100000
        )
      ).toBe(0);
    });

    it("never returns negative time", () => {
      expect(
        calculateRemainingMs(
          100000,
          0,
          120000
        )
      ).toBe(0);
    });

    it("handles invalid deadlines", () => {
      expect(
        calculateRemainingMs(
          NaN,
          0,
          90000
        )
      ).toBe(0);

      expect(
        calculateRemainingMs(
          Infinity,
          0,
          90000
        )
      ).toBe(0);
    });

    it("handles invalid offsets", () => {
      expect(
        calculateRemainingMs(
          100000,
          NaN,
          90000
        )
      ).toBe(0);
    });
  });

  describe("getCountdownParts", () => {
    it("converts milliseconds to time parts", () => {
      const parts =
        getCountdownParts(
          3661000
        );

      expect(parts).toEqual({
        hours: 1,
        minutes: 1,
        seconds: 1,
      });
    });

    it("rounds up partial seconds", () => {
      const parts =
        getCountdownParts(1500);

      expect(parts).toEqual({
        hours: 0,
        minutes: 0,
        seconds: 2,
      });
    });

    it("supports more than 24 hours", () => {
      const parts =
        getCountdownParts(
          25 * 60 * 60 * 1000
        );

      expect(parts.hours).toBe(25);
    });

    it("handles negative durations", () => {
      expect(
        getCountdownParts(-5000)
      ).toEqual({
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    });
  });

  describe("formatCountdown", () => {
    it("formats HH:MM:SS", () => {
      expect(
        formatCountdown(3661000)
      ).toBe("01:01:01");
    });

    it("formats expired time", () => {
      expect(
        formatCountdown(0)
      ).toBe("00:00:00");
    });
  });

  describe("padTime", () => {
    it("pads single digits", () => {
      expect(padTime(5)).toBe("05");
    });

    it("keeps larger numbers", () => {
      expect(padTime(125)).toBe("125");
    });
  });

  describe("isValidTimeValue", () => {
    it("accepts finite numbers", () => {
      expect(
        isValidTimeValue(1000)
      ).toBe(true);
    });

    it("rejects invalid values", () => {
      expect(
        isValidTimeValue(NaN)
      ).toBe(false);

      expect(
        isValidTimeValue(Infinity)
      ).toBe(false);

      expect(
        isValidTimeValue("1000")
      ).toBe(false);
    });
  });
});
