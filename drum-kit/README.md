
# Production Studio Drum Kit — React 19

Accessible browser-based drum kit. Includes seven synthesized
sounds, physical keyboard shortcuts, recent-hit history,
screen-reader announcements and a digital dBFS sound-level meter.

## Prerequisites

- Node.js 20.19+ or 22.12+ (or a newer compatible version)
- npm
- Modern browser with Web Audio API

## Quick Start

```bash
npm install
npm run dev
```

Open the URL shown by Vite, normally http://localhost:5173.

## Final Quality Gate

```bash
npm run verify
```

The verify command runs all Vitest tests using npm run test:run,
then builds the production application using npm run build.

Both commands require installed dependencies.

Manual audio and accessibility checks are separate.

For interactive test watching:

```bash
npm test
```

## Lighthouse Accessibility Audit

```bash
npm run build
npm run preview
```

Open the preview site in Chrome:

1. Open DevTools.
2. Select Lighthouse.
3. Select Accessibility.
4. Generate a report.
5. Record the score and any findings in docs/ACCESSIBILITY_AUDIT.md.

The goal is Lighthouse Accessibility 100 plus relevant WCAG 2.2 AA
manual checks. Neither is claimed without testing evidence.

## Controls

| Physical keyboard key | Drum |
| --- | --- |
| W | Kick |
| A | Snare |
| S | Closed Hi-Hat |
| D | Open Hi-Hat |
| J | Tom |
| K | Clap |
| L | Crash |

Click or tap a pad to play it.

Alternatively, focus a drum pad using Tab and activate it with
Enter or Space.

Shortcut handling uses event.code and:

- Ignores repeated keydown events.
- Ignores Ctrl, Alt and Meta combinations.
- Ignores editable fields.
- Respects prevented events.
- Ignores keyboard events during IME composition.
- Removes event listeners during cleanup.

## Accessible Feedback

- Temporary visible pad activation.
- Persistent Last played label.
- Screen-reader aria-live announcement.
- Recent-hit history capped at 12 successful hits.
- Clear history button.
- RMS digital audio output meter in dBFS.
- Visible keyboard focus indicators.
- Forced-colors focus cues.
- Reduced-motion support.

The meter is not a calibrated acoustic sound-pressure meter.

## Project Structure

- src/audio/drumAudio.js:
  Synthesized sounds and audio analyser.

- src/hooks/useDrumKeyboard.js:
  Guarded physical keyboard shortcuts.

- src/components/:
  Reusable drum pads and visual feedback.

- src/**/__tests__/:
  Vitest component and hook tests.

- docs/ACCESSIBILITY_AUDIT.md:
  Accessibility verification template.

- docs/SUBMISSION_CHECKLIST.md:
  Submission materials and final checks.

- task_decomposition.md:
  Planning and Git commit roadmap.

## Project Workflow

Six tasks with two planned commits per task, 12 in total.

The downloaded project includes source files, not your local
Git history.

### Commit 11

```bash
git add src/components/DrumKit.jsx src/hooks/useDrumKeyboard.js src/index.css src/components/__tests__/DrumKit.test.jsx src/hooks/__tests__/useDrumKeyboard.test.jsx

git commit -m "fix: strengthen keyboard accessibility and visible hit feedback"
```

### Commit 12

After local verification and recording audit evidence:

```bash
git add package.json README.md task_decomposition.md docs/

git commit -m "docs: finalize accessibility audit and submission workflow"
```

Review staged changes before committing:

```bash
git diff --cached
```

If verification reveals defects, fix them and create additional
meaningful commits.

## Final Submission

Run:

```bash
npm install
npm ls react react-dom
npm run verify
npm run preview
```

Perform the manual accessibility checks and complete the audit
and submission checklist documents.

A Lighthouse Accessibility score of 100 does not by itself
establish full WCAG 2.2 AA conformance.
