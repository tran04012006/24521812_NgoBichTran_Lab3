import { useCallback, useEffect, useRef, useState } from "react";

import PianoKey from "./PianoKey.jsx";
import PolyphonicSynth from "../audio/PolyphonicSynth.js";

import {
  PIANO_KEYS,
  WHITE_KEY_COUNT,
  BLACK_KEY_COUNT,
  TOTAL_PIANO_WIDTH,
} from "../utils/notes.js";

const WHITE_KEYS = PIANO_KEYS.filter((key) => !key.isBlack);

const BLACK_KEYS = PIANO_KEYS.filter((key) => key.isBlack);

const MAX_VOICES = 8;

function Piano() {
  const synthRef = useRef(null);

  const [selectedMidi, setSelectedMidi] = useState(null);

  const [activeNotes, setActiveNotes] = useState(() => new Set());

  const [lastStolenMidi, setLastStolenMidi] = useState(null);

  useEffect(() => {
    // Create a fresh synthesizer for this effect lifecycle.
    const synth = new PolyphonicSynth(MAX_VOICES);

    synthRef.current = synth;

    return () => {
      synth.dispose();

      if (synthRef.current === synth) {
        synthRef.current = null;
      }
    };
  }, []);

  const handleSelectNote = useCallback((midi) => {
    setSelectedMidi(midi);
  }, []);

  const handleNoteOn = useCallback((midi, frequency) => {
    const synth = synthRef.current;

    if (!synth) {
      return;
    }

    const result = synth.noteOn(midi, frequency);

    if (!result.success) {
      return;
    }

    setActiveNotes(new Set(synth.getActiveMidiNotes()));

    if (result.stolenMidi !== null) {
      setLastStolenMidi(result.stolenMidi);
    }
  }, []);

  const handleNoteOff = useCallback((midi) => {
    const synth = synthRef.current;

    if (!synth) {
      return;
    }

    synth.noteOff(midi);

    setActiveNotes(new Set(synth.getActiveMidiNotes()));
  }, []);

  const handleStopAll = useCallback(() => {
    const synth = synthRef.current;

    if (!synth) {
      return;
    }

    synth.stopAll();
    setActiveNotes(new Set());
  }, []);

  const selectedNote =
    PIANO_KEYS.find((key) => key.midi === selectedMidi) ?? null;

  const stolenNote =
    PIANO_KEYS.find((key) => key.midi === lastStolenMidi) ?? null;

  const activeVoiceCount = activeNotes.size;

  return (
    <section className="piano-panel">
      <div className="piano-panel__header">
        <div>
          <h2>88-Key Polyphonic Piano</h2>

          <p>
            Press and hold piano keys to play notes. Up to {MAX_VOICES} voices
            can sound simultaneously.
          </p>
        </div>

        <span className="piano-panel__status">Audio Enabled</span>
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

      <div className="voice-panel">
        <div className="voice-panel__header">
          <div>
            <h3>Polyphonic Voice Engine</h3>

            <p>
              FIFO voice stealing with an
              {` ${MAX_VOICES}`}-voice limit
            </p>
          </div>

          <button
            type="button"
            className="stop-all-button"
            onClick={handleStopAll}
            disabled={activeVoiceCount === 0}
          >
            Stop All Notes
          </button>
        </div>

        <div className="voice-panel__stats">
          <div className="voice-stat">
            <span>Active Voices</span>

            <strong>
              {activeVoiceCount} / {MAX_VOICES}
            </strong>
          </div>

          <div className="voice-stat">
            <span>Available Voices</span>

            <strong>{MAX_VOICES - activeVoiceCount}</strong>
          </div>

          <div className="voice-stat">
            <span>Voice Stealing</span>

            <strong>
              {stolenNote ? `Last: ${stolenNote.noteName}` : "None"}
            </strong>
          </div>
        </div>

        <div
          className="voice-indicators"
          aria-label={`${activeVoiceCount} of ${MAX_VOICES} voices active`}
        >
          {Array.from({ length: MAX_VOICES }, (_, index) => (
            <div
              key={index}
              className={
                index < activeVoiceCount
                  ? "voice-indicator voice-indicator--active"
                  : "voice-indicator"
              }
              title={`Voice ${index + 1}`}
            />
          ))}
        </div>

        <div className="active-notes">
          <span>Currently Playing:</span>

          <div className="active-notes__list">
            {activeNotes.size > 0 ? (
              Array.from(activeNotes).map((midi) => {
                const note = PIANO_KEYS.find((key) => key.midi === midi);

                return (
                  <span className="active-note-badge" key={midi}>
                    {note?.noteName ?? midi}
                  </span>
                );
              })
            ) : (
              <span className="active-notes__empty">No active notes</span>
            )}
          </div>
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
                isPlaying={activeNotes.has(key.midi)}
                onSelect={handleSelectNote}
                onNoteOn={handleNoteOn}
                onNoteOff={handleNoteOff}
              />
            ))}
          </div>

          <div className="black-keys">
            {BLACK_KEYS.map((key) => (
              <PianoKey
                key={key.midi}
                {...key}
                isSelected={selectedMidi === key.midi}
                isPlaying={activeNotes.has(key.midi)}
                onSelect={handleSelectNote}
                onNoteOn={handleNoteOn}
                onNoteOff={handleNoteOff}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="piano-scroll-hint">
        Press and hold a key to play it. Scroll horizontally to explore all 88
        notes.
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
              <strong>{selectedNote.frequency.toFixed(2)} Hz</strong>
            </div>

            <div>
              <span>Key Type</span>
              <strong>{selectedNote.isBlack ? "Black" : "White"}</strong>
            </div>
          </div>
        ) : (
          <p className="selected-note-empty">
            No key selected. Press a piano key to begin.
          </p>
        )}
      </div>
    </section>
  );
}

export default Piano;
