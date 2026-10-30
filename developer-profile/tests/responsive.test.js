
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const globalCss = readFileSync(
  new URL("../src/index.css", import.meta.url),
  "utf8"
);

const cardCss = readFileSync(
  new URL(
    "../src/components/DeveloperCard.module.css",
    import.meta.url
  ),
  "utf8"
);

const avatarCss = readFileSync(
  new URL(
    "../src/components/ProfileAvatar.module.css",
    import.meta.url
  ),
  "utf8"
);

const badgeCss = readFileSync(
  new URL(
    "../src/components/SkillBadge.module.css",
    import.meta.url
  ),
  "utf8"
);

const developerJsx = readFileSync(
  new URL(
    "../src/components/DeveloperCard.jsx",
    import.meta.url
  ),
  "utf8"
);

test("global CSS includes mobile breakpoint", () => {
  assert.match(
    globalCss,
    /@media\s*\(max-width:\s*480px\)/
  );
});

test("global CSS includes small mobile breakpoint", () => {
  assert.match(
    globalCss,
    /@media\s*\(max-width:\s*359px\)/
  );
});

test("card includes tablet breakpoint", () => {
  assert.match(
    cardCss,
    /@media\s*\(max-width:\s*768px\)/
  );
});

test("card includes mobile breakpoint", () => {
  assert.match(
    cardCss,
    /@media\s*\(max-width:\s*480px\)/
  );
});

test("mobile header stacks vertically", () => {
  assert.match(
    cardCss,
    /flex-direction:\s*column\s*;/
  );
});

test("card has a fluid width", () => {
  assert.match(
    cardCss,
    /width:\s*100%\s*;/
  );
});

test("skill list allows wrapping", () => {
  assert.match(
    cardCss,
    /flex-wrap:\s*wrap\s*;/
  );
});

test("text supports overflow wrapping", () => {
  assert.match(
    cardCss,
    /overflow-wrap:\s*anywhere\s*;/
  );
});

test("avatar has responsive breakpoints", () => {
  assert.match(
    avatarCss,
    /@media\s*\(max-width:\s*480px\)/
  );
});

test("avatar uses a CSS size variable", () => {
  assert.match(
    avatarCss,
    /--avatar-size:\s*96px\s*;/
  );
});

test("badges have a responsive breakpoint", () => {
  assert.match(
    badgeCss,
    /@media\s*\(max-width:\s*480px\)/
  );
});

test("badges have a maximum width", () => {
  assert.match(
    badgeCss,
    /max-width:\s*100%\s*;/
  );
});

test("DeveloperCard has no div elements", () => {
  assert.doesNotMatch(
    developerJsx,
    /<\s*\/?\s*div\b/i
  );
});
