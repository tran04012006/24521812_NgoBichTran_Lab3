
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
  isPlaying,
  onSelect,
  onNoteOn,
  onNoteOff,
}) {
  const keyClassName = [
    "piano-key",
    isBlack ? "piano-key--black" : "piano-key--white",
    isSelected ? "piano-key--selected" : "",
    isPlaying ? "piano-key--playing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const keyStyle = isBlack
    ? {
        left:
          whiteKeyIndex * WHITE_KEY_WIDTH -
          BLACK_KEY_WIDTH / 2,
      }
    : undefined;

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    // Keep receiving pointer events while the key is held.
    event.currentTarget.setPointerCapture(event.pointerId);

    onSelect(midi);
    onNoteOn(midi, frequency);
  };

  const handlePointerUp = (event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    onNoteOff(midi);
  };

  const handlePointerCancel = () => {
    onNoteOff(midi);
  };

  const handleLostPointerCapture = () => {
    onNoteOff(midi);
  };

  return (
    <button
      type="button"
      className={keyClassName}
      style={keyStyle}
      aria-label={`${noteName}, ${frequency.toFixed(2)} hertz`}
      aria-pressed={isPlaying}
      title={`${noteName} | MIDI ${midi}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handleLostPointerCapture}
      onClick={() => onSelect(midi)}
    >
      <span className="piano-key__label">
        {noteName}
      </span>
    </button>
  );
});

export default PianoKey;
