
import { memo } from "react";

import {
  WHITE_KEY_WIDTH,
  BLACK_KEY_WIDTH,
} from "../utils/notes.js";

const PianoKey = memo(function PianoKey({
  midi,
  noteName,
  frequency,
  isBlack,
  whiteKeyIndex,
  isSelected,
  onSelect,
}) {
  const keyClassName = [
    "piano-key",
    isBlack ? "piano-key--black" : "piano-key--white",
    isSelected ? "piano-key--selected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Black keys are placed between white keys.
  const keyStyle = isBlack
    ? {
        left:
          whiteKeyIndex * WHITE_KEY_WIDTH -
          BLACK_KEY_WIDTH / 2,
      }
    : undefined;

  // Do not create a wrapper around the key.
  // The button itself is the interactive element.
  return (
    <button
      type="button"
      className={keyClassName}
      style={keyStyle}
      aria-label={`${noteName}, ${frequency.toFixed(2)} hertz`}
      aria-pressed={isSelected}
      title={`${noteName} | MIDI ${midi}`}
      onClick={() => onSelect(midi)}
    >
      <span className="piano-key__label">
        {noteName}
      </span>
    </button>
  );
});

export default PianoKey;
