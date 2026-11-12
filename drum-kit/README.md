
# Production Studio Drum Kit — React 19

Accessible, responsive, browser-synthesized drum kit,
extended through Task 5.

## Requirements

- Node.js 20.19+ or 22.12+
  (or newer compatible release)
- npm
- Browser supporting Web Audio API
  for manual playback tests

## Setup and commands

```bash
npm install
npm run dev
npm run test:run
npm run build
```

For test watch mode: `npm test`.

## Controls

| Physical key | Drum |
| --- | --- |
| W | Kick |
| A | Snare |
| S | Closed Hi-Hat |
| D | Open Hi-Hat |
| J | Tom |
| K | Clap |
| L | Crash |

Click or tap a drum pad to play it.

Native buttons also support Tab, Enter and Space.

The physical shortcuts are ignored for:
- Repeated keydown events.
- Ctrl/Alt/Meta combinations.
- Editable fields.

## Accessible feedback

- Brief pad visual activation.
- Keyboard focus ring.
- Reduced-motion support.
- The 12 latest successful drum hits.
- A separate polite screen-reader announcement.
- A Web Audio AnalyserNode RMS digital level meter.
- Keyboard-accessible Clear history control.

Levels are dBFS, not calibrated acoustic dB SPL.

## Task 5 automated tests

### Keyboard tests

File:
`src/hooks/__tests__/useDrumKeyboard.test.jsx`

Tests:
- Physical keyboard code mapping.
- Repeated-key prevention.
- Keyboard modifiers.
- Editable-field isolation.
- Event listener lifecycle.

### Component tests

File:
`src/components/__tests__/DrumKit.test.jsx`

Tests:
- Pad rendering.
- Click and focused-key activation.
- Hit history cap and order.
- Clearing the history.
- Audio errors.
- Accessible digital meter.

Vitest uses jsdom and mocks the browser audio
implementation.

Passing tests does not establish that real audio
sounds correct or that WCAG 2.2 AA is fully satisfied.

## Manual responsive and accessibility checks

1. View at 320, 375, 768 and 1280 CSS pixels.
2. Check for horizontal page overflow.
3. Test desktop at 200% browser zoom.
4. Verify focus rings on buttons.
5. Check contrast and high-contrast mode.
6. Inspect with NVDA or VoiceOver.
7. Verify all seven sounds with speakers.
8. Check that the sound meter responds.
9. Test prefers-reduced-motion.

## Remaining work

Task 6:
- Lighthouse and WCAG audit.
- Cross-browser smoke tests.
- Final documentation.
- Git commits 11 and 12.

Refer to task_decomposition.md for the project plan.
