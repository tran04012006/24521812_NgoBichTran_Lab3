
export const MIN_MIDI = 21;
export const MAX_MIDI = 108;

export const WHITE_KEY_WIDTH = 44;
export const BLACK_KEY_WIDTH = 28;

const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

const BLACK_NOTE_INDICES = new Set([
  1, 3, 6, 8, 10,
]);

// Convert MIDI number to frequency in Hz.
export function midiToFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Convert MIDI number to a note name.
// Example: MIDI 60 -> C4.
export function midiToNoteName(midi) {
  const noteIndex = midi % 12;
  const octave = Math.floor(midi / 12) - 1;

  return `${NOTE_NAMES[noteIndex]}${octave}`;
}

// Determine whether a MIDI note is a black key.
export function isBlackKey(midi) {
  return BLACK_NOTE_INDICES.has(midi % 12);
}

// Generate all piano keys algorithmically.
export function generatePianoKeys() {
  const keys = [];
  let whiteKeyIndex = 0;

  for (let midi = MIN_MIDI; midi <= MAX_MIDI; midi++) {
    const black = isBlackKey(midi);

    const key = {
      midi,
      noteName: midiToNoteName(midi),
      frequency: midiToFrequency(midi),
      isBlack: black,

      // Position of each white key.
      // Black keys use this index to determine
      // their position between white keys.
      whiteKeyIndex,
    };

    keys.push(key);

    if (!black) {
      whiteKeyIndex++;
    }
  }

  return keys;
}

// Generate once, not on every React render.
export const PIANO_KEYS = generatePianoKeys();

export const WHITE_KEY_COUNT =
  PIANO_KEYS.filter((key) => !key.isBlack).length;

export const BLACK_KEY_COUNT =
  PIANO_KEYS.filter((key) => key.isBlack).length;

export const TOTAL_PIANO_WIDTH =
  WHITE_KEY_COUNT * WHITE_KEY_WIDTH;
