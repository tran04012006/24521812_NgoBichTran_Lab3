
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
    // Only the primary mouse button should start notes.
    // All touch pointers are allowed.
    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    const sourceId = `pointer:${event.pointerId}`;

    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    onSelect(midi);
    onNoteOn(midi, frequency, sourceId);
  };

  const handlePointerUp = (event) => {
    const sourceId = `pointer:${event.pointerId}`;

    onNoteOff(midi, sourceId);

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }
  };

  const handlePointerCancel = (event) => {
    const sourceId = `pointer:${event.pointerId}`;

    onNoteOff(midi, sourceId);
  };

  const handleLostPointerCapture = (event) => {
    const sourceId = `pointer:${event.pointerId}`;

    // Safe even when pointerup already released it.
    onNoteOff(midi, sourceId);
  };

  const handleKeyDown = (event) => {
    if (
      event.code !== "Space" &&
      event.code !== "Enter"
    ) {
      return;
    }

    if (event.repeat) {
      event.preventDefault();
      return;
    }

    event.preventDefault();

    const sourceId = `button:${midi}`;

    onSelect(midi);
    onNoteOn(midi, frequency, sourceId);
  };

  const handleKeyUp = (event) => {
    if (
      event.code !== "Space" &&
      event.code !== "Enter"
    ) {
      return;
    }

    event.preventDefault();

    onNoteOff(midi, `button:${midi}`);
  };

  const handleBlur = () => {
    // Avoid stuck notes if focus moves away
    // before keyup occurs.
    onNoteOff(midi, `button:${midi}`);
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
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
      onClick={() => onSelect(midi)}
    >
      <span className="piano-key__label">
        {noteName}
      </span>
    </button>
  );
});

export default PianoKey;
