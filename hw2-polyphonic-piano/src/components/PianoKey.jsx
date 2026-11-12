
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
  isTabStop,
  onSelect,
  onNoteOn,
  onNoteOff,
  onNavigate,
}) {
  const keyClassName = [
    "piano-key",
    isBlack
      ? "piano-key--black"
      : "piano-key--white",
    isSelected
      ? "piano-key--selected"
      : "",
    isPlaying
      ? "piano-key--playing"
      : "",
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
    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    const sourceId =
      `pointer:${event.pointerId}`;

    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    onSelect(midi);

    onNoteOn(
      midi,
      frequency,
      sourceId
    );
  };

  const handlePointerUp = (event) => {
    const sourceId =
      `pointer:${event.pointerId}`;

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
    onNoteOff(
      midi,
      `pointer:${event.pointerId}`
    );
  };

  const handleLostPointerCapture = (event) => {
    onNoteOff(
      midi,
      `pointer:${event.pointerId}`
    );
  };

  const handleKeyDown = (event) => {
    // Navigate through the entire piano.
    if (event.code === "ArrowRight") {
      event.preventDefault();
      onNavigate(midi, 1);
      return;
    }

    if (event.code === "ArrowLeft") {
      event.preventDefault();
      onNavigate(midi, -1);
      return;
    }

    if (event.code === "Home") {
      event.preventDefault();
      onNavigate(midi, "first");
      return;
    }

    if (event.code === "End") {
      event.preventDefault();
      onNavigate(midi, "last");
      return;
    }

    // Enter and Space activate a focused key.
    if (
      event.code !== "Space" &&
      event.code !== "Enter"
    ) {
      return;
    }

    event.preventDefault();

    // Ignore browser key auto-repeat.
    if (event.repeat) {
      return;
    }

    onSelect(midi);

    onNoteOn(
      midi,
      frequency,
      `button:${midi}`
    );
  };

  const handleKeyUp = (event) => {
    if (
      event.code !== "Space" &&
      event.code !== "Enter"
    ) {
      return;
    }

    event.preventDefault();

    onNoteOff(
      midi,
      `button:${midi}`
    );
  };

  const handleBlur = () => {
    // Prevent stuck notes when focus changes
    // before the Enter/Space key is released.
    onNoteOff(
      midi,
      `button:${midi}`
    );
  };

  return (
    <button
      type="button"
      className={keyClassName}
      style={keyStyle}
      data-piano-midi={midi}
      tabIndex={isTabStop ? 0 : -1}
      aria-label={`${noteName}, MIDI ${midi}, ${frequency.toFixed(2)} hertz`}
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
      <span
        className="piano-key__label"
        aria-hidden="true"
      >
        {noteName}
      </span>
    </button>
  );
});

export default PianoKey;
