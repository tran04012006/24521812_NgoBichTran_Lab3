
# Production Studio Drum Kit

React 19 + Vite homework project (Task 3).

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- Modern browser with Web Audio API support

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Task 3 Controls

### Mouse and Touch
Click or tap a pad to play its sound.

### Keyboard

| Key | Drum |
|-----|------|
| W | Kick |
| A | Snare |
| S | Closed Hi-Hat |
| D | Open Hi-Hat |
| J | Tom |
| K | Clap |
| L | Crash |

Focused buttons also support Enter and Space.

## Keyboard Safety

- Uses event.code instead of keyCode.
- Prevents held-key auto-repeat.
- Ignores input, textarea, select,
  and contenteditable targets.
- Ignores Ctrl, Alt, and Meta shortcuts.
- Removes keyboard listeners during cleanup.

## Audio

Drum sounds are synthesized using the Web Audio API.

No external sound files are required.

Some browsers require user interaction before
audio playback is permitted.

## Project Progress

- Task 1: Project setup
- Task 2: Drum Kit UI
- Task 3: Audio and keyboard integration
- Task 4: Hit history and sound-level visualization
- Task 5: Automated testing
- Task 6: Final Lighthouse verification

See task_decomposition.md for the full plan.
