
import { useCallback, useState } from "react";

import PianoKey from "./PianoKey.jsx";

import {
  PIANO_KEYS,
  WHITE_KEY_COUNT,
  BLACK_KEY_COUNT,
  TOTAL_PIANO_WIDTH,
} from "../utils/notes.js";

const WHITE_KEYS = PIANO_KEYS.filter(
  (key) => !key.isBlack
);

const BLACK_KEYS = PIANO_KEYS.filter(
  (key) => key.isBlack
);

function Piano() {
  const [selectedMidi, setSelectedMidi] = useState(null);

  const handleSelectNote = useCallback((midi) => {
    setSelectedMidi(midi);
  }, []);

  const selectedNote =
    PIANO_KEYS.find((key) => key.midi === selectedMidi) ??
    null;

  return (
    <section className="piano-panel">
      <div className="piano-panel__header">
        <div>
          <h2>88-Key Piano</h2>

          <p>
            Select a piano key to inspect its note
            information.
          </p>
        </div>

        <span className="piano-panel__status">
          UI Preview
        </span>
      </div>

      <div className="piano-info">
        <div className="piano-info__item">
          <span>Total Keys</span>
          <strong>{PIANO_KEYS.length}</strong>
        </div>

        <div className="piano-info__item">
          <span>White Keys</span>
          <strong>{WHITE_KEY_COUNT}</strong>
        </div>

        <div className="piano-info__item">
          <span>Black Keys</span>
          <strong>{BLACK_KEY_COUNT}</strong>
        </div>

        <div className="piano-info__item">
          <span>Range</span>
          <strong>A0 – C8</strong>
        </div>
      </div>

      <div
        className="piano-scroll"
        role="region"
        aria-label="Scrollable 88-key piano"
        tabIndex={0}
      >
        <div
          className="piano-keyboard"
          style={{
            width: TOTAL_PIANO_WIDTH,
          }}
        >
          <div className="white-keys">
            {WHITE_KEYS.map((key) => (
              <PianoKey
                key={key.midi}
                {...key}
                isSelected={selectedMidi === key.midi}
                onSelect={handleSelectNote}
              />
            ))}
          </div>

          <div className="black-keys">
            {BLACK_KEYS.map((key) => (
              <PianoKey
                key={key.midi}
                {...key}
                isSelected={selectedMidi === key.midi}
                onSelect={handleSelectNote}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="piano-scroll-hint">
        Scroll horizontally to explore all 88 keys.
      </p>

      <div className="selected-note-panel">
        <h3>Selected Note</h3>

        {selectedNote ? (
          <div className="selected-note-details">
            <div>
              <span>Note</span>
              <strong>{selectedNote.noteName}</strong>
            </div>

            <div>
              <span>MIDI Number</span>
              <strong>{selectedNote.midi}</strong>
            </div>

            <div>
              <span>Frequency</span>
              <strong>
                {selectedNote.frequency.toFixed(2)} Hz
              </strong>
            </div>

            <div>
              <span>Key Type</span>
              <strong>
                {selectedNote.isBlack ? "Black" : "White"}
              </strong>
            </div>
          </div>
        ) : (
          <p className="selected-note-empty">
            No key selected. Click any piano key to begin.
          </p>
        )}
      </div>
    </section>
  );
}

export default Piano;
