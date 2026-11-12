
import { midiToNoteName } from "./notes.js";

// Physical keyboard mapping from C4 to E5
const KEY_DEFINITIONS = [
  ["KeyA", "A"],
  ["KeyW", "W"],
  ["KeyS", "S"],
  ["KeyE", "E"],
  ["KeyD", "D"],
  ["KeyF", "F"],
  ["KeyT", "T"],
  ["KeyG", "G"],
  ["KeyY", "Y"],
  ["KeyH", "H"],
  ["KeyU", "U"],
  ["KeyJ", "J"],
  ["KeyK", "K"],
  ["KeyO", "O"],
  ["KeyL", "L"],
  ["KeyP", "P"],
  ["Semicolon", ";"],
];

const START_MIDI = 60;

// Generate keyboard mapping information
export const KEYBOARD_KEYS = Object.freeze(
  KEY_DEFINITIONS.map(([code, label], index) => {
    const midi = START_MIDI + index;

    return Object.freeze({
      code,
      label,
      midi,
      noteName: midiToNoteName(midi),
    });
  })
);

// Fast lookup: KeyboardEvent.code -> MIDI
export const CODE_TO_MIDI = Object.freeze(
  Object.fromEntries(
    KEYBOARD_KEYS.map(({ code, midi }) => [code, midi])
  )
);

// Check whether the user is typing into a form field
export function isTypingTarget(target) {
  if (!target || !(target instanceof Element)) {
    return false;
  }

  return Boolean(
    target.closest(
      "input, textarea, select, [contenteditable]"
    )
  );
}
