
# Production Studio Drum Kit

React 19 + Vite homework project.
Task 4 builds on the playable Task 3 drum kit.

## Run

Requires Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Controls

| Key | Drum |
|---|---|
| W | Kick |
| A | Snare |
| S | Hi-Hat |
| D | Open Hat |
| J | Tom |
| K | Clap |
| L | Crash |

Use mouse or touch to activate pads.
Use Tab and Enter/Space on focused buttons.

Global shortcuts ignore:
- Held-key repeats.
- Ctrl/Alt/Meta combinations.
- Typing fields.

## Task 4 Accessibility Features

- Accessible buttons and visible keyboard focus.
- Temporary activation feedback.
- Screen-reader hit announcements.
- Recent-hit history (maximum 12).
- Clear-history button.
- Live Web Audio AnalyserNode meter.
- Digital RMS sound-level readings in dBFS.
- Responsive layout.

The digital audio meter is not a calibrated
acoustic sound-pressure meter.

## Verification

Manual testing with NVDA/VoiceOver is required.

WCAG 2.2 AA and Lighthouse Accessibility 100
are targets, not yet verified.

## Project Roadmap

Task 1: Project setup
Task 2: Drum kit UI
Task 3: Audio and keyboard integration
Task 4: Accessibility and visual feedback
Task 5: Automated testing
Task 6: Final verification

See task_decomposition.md for detailed subtasks.
