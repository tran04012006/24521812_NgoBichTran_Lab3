
import test from "node:test";
import assert from "node:assert/strict";

import {
  getSecureImageUrl,
  getInitials,
} from "../src/utils/avatarUtils.js";

test("accepts valid HTTPS image URL", () => {
  const result = getSecureImageUrl(
    "https://example.com/avatar.jpg"
  );

  assert.equal(
    result,
    "https://example.com/avatar.jpg"
  );
});

test("rejects HTTP image URL", () => {
  const result = getSecureImageUrl(
    "http://example.com/avatar.jpg"
  );

  assert.equal(result, null);
});

test("rejects JavaScript URL", () => {
  const result = getSecureImageUrl(
    "javascript:alert(1)"
  );

  assert.equal(result, null);
});

test("rejects invalid URLs", () => {
  assert.equal(getSecureImageUrl("invalid-url"), null);
  assert.equal(getSecureImageUrl(""), null);
  assert.equal(getSecureImageUrl(null), null);
});

test("rejects URLs containing credentials", () => {
  const result = getSecureImageUrl(
    "https://user:pass@example.com/avatar.jpg"
  );

  assert.equal(result, null);
});

test("generates initials from full name", () => {
  assert.equal(getInitials("Alex Morgan"), "AM");
});

test("generates initials from multiple words", () => {
  assert.equal(getInitials("Bich Tran Ngo"), "BN");
});

test("handles a single name", () => {
  assert.equal(getInitials("Alex"), "A");
});

test("handles invalid or empty names", () => {
  assert.equal(getInitials(""), "?");
  assert.equal(getInitials(null), "?");
});

test("ignores extra whitespace", () => {
  assert.equal(
    getInitials("  Alex   Morgan  "),
    "AM"
  );
});
