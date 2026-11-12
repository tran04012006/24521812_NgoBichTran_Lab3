
import "@testing-library/jest-dom/vitest";

import {
  afterEach,
  vi,
} from "vitest";

import {
  cleanup,
} from "@testing-library/react";

/**
 * Mock ResizeObserver for jsdom.
 *
 * jsdom does not perform full browser layout,
 * so tests will supply explicit dimensions
 * when needed.
 */
class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
  }

  observe(element) {
    this.elements.add(element);
  }

  unobserve(element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }
}

vi.stubGlobal(
  "ResizeObserver",
  MockResizeObserver
);

/**
 * Mock scrollTo where necessary.
 */
if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = function (
    options
  ) {
    if (typeof options === "number") {
      this.scrollTop = options;
    } else {
      this.scrollTop =
        options?.top ?? 0;
    }
  };
}

/**
 * Clean up React roots after each test.
 */
afterEach(() => {
  cleanup();
});
