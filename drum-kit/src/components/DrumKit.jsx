
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import DrumPad from "./DrumPad.jsx";

import {
  DRUMS,
  PAD_BY_CODE,
} from "../data/drums.js";

import {
  closeDrumAudio,
  playDrum,
} from "../audio/drumAudio.js";

import { useDrumKeyboard } from "../hooks/useDrumKeyboard.js";

export default function DrumKit() {
  const [selectedPadId, setSelectedPadId] =
    useState(null);

  const [audioError, setAudioError] =
    useState("");

  const triggerPad = useCallback(async (padId) => {
    try {
      await playDrum(padId);

      setSelectedPadId(padId);
      setAudioError("");
    } catch (error) {
      setAudioError(
        error instanceof Error
          ? error.message
          : "Unable to play sound."
      );
    }
  }, []);

  useDrumKeyboard(
    PAD_BY_CODE,
    triggerPad,
    true
  );

  useEffect(() => {
    return () => {
      void closeDrumAudio();
    };
  }, []);

  const selectedDrum = DRUMS.find(
    (drum) => drum.id === selectedPadId
  );

  return (
    <section
      className="studio"
      aria-labelledby="studio-title"
    >
      <div className="studio__header">
        <div>
          <p className="eyebrow">
            Production studio
          </p>

          <h2 id="studio-title">
            Drum pads
          </h2>
        </div>

        <span className="studio__tag">
          Playable · Task 3
        </span>
      </div>

      <p
        className="studio__instructions"
        id="drum-instructions"
      >
        Click a pad, focus it and press Enter/Space,
        or use the physical W, A, S, D, J, K, L
        keys. Shortcuts are ignored while typing.
      </p>

      <div
        className="drum-grid"
        role="group"
        aria-label="Drum pads"
        aria-describedby="drum-instructions"
      >
        {DRUMS.map((drum) => (
          <DrumPad
            key={drum.id}
            drum={drum}
            isSelected={
              selectedPadId === drum.id
            }
            onSelect={triggerPad}
          />
        ))}
      </div>

      <div
        className="studio__selection"
        role="status"
        aria-live="polite"
      >
        {selectedDrum
          ? `Last played: ${selectedDrum.name} (${selectedDrum.key})`
          : "Ready. Play a drum to begin."}
      </div>

      {audioError && (
        <p
          className="studio__error"
          role="alert"
        >
          {audioError}
        </p>
      )}
    </section>
  );
}
