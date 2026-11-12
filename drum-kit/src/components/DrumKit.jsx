
import { useState } from "react";
import DrumPad from "./DrumPad.jsx";
import { DRUMS } from "../data/drums.js";

export default function DrumKit() {
  const [selectedPadId, setSelectedPadId] = useState(null);

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
          UI preview · Task 2
        </span>
      </div>

      <p className="studio__instructions">
        Click or focus a pad and press Enter or
        Space to select it. Audio and global
        W/A/S/D/J/K/L shortcuts arrive in Task 3.
      </p>

      <div
        className="drum-grid"
        aria-label="Drum pads"
      >
        {DRUMS.map((drum) => (
          <DrumPad
            key={drum.id}
            drum={drum}
            isSelected={selectedPadId === drum.id}
            onSelect={setSelectedPadId}
          />
        ))}
      </div>

      <div
        className="studio__selection"
        role="status"
      >
        {selectedDrum
          ? `Selected pad: ${selectedDrum.name} (${selectedDrum.key})`
          : "No pad selected yet."}
      </div>
    </section>
  );
}
